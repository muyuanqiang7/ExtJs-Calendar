//要件编辑页面
Ext.define('app.platform.estate.view.register.sysconfig.printlist.RegiPrintEdit', {
    extend: 'Ext.window.Window',
    xtype: 'sysconfig-printlist-regiprintedit',
    title: '<span style="color:black;font-size:14px;height:100px;"><b>节假日安排</b></span>',
    width: 600,
    height: 240,
    bodyPadding: 10,
    autoScroll: true,
    border: false,
    bodyBorder: false,
    floating: true,
    modal: true,

    layout: {
        type: 'vbox',
        align: 'stretch'
    }, listeners: {
        //加载完毕后启动初始化方法
        afterrender: function (_this, ops) {
            this._initComp();
        }
    },
    /**
     * 入口参数
     */
    config: {
        typesIndex: -1,//****
        regitypes: null,//****
        editor: false,
        regicause: -1
    },

    // ====构造方法========================================================================
    constructor: function (config) {
        var me = this;
        config = config || {};
        Ext.applyIf(config, me.config);
        this.callParent(arguments);
    },
    // ====视图构建========================================================================
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            items: [
                {
                border: true,
                layout: 'vbox',
                items: [{
                    width: '100%',
                    layout: 'hbox',
                    defaults: {
                        margin: '5 10 5 10'
                    },
                    items: [{
                        xtype: 'hidden', bind: '{uuid}', itemId: 'uuidItemId'
                    }, {
                        fieldLabel: '打印报表名称',
                        xtype: 'textfield',
                        allowBlank: false,//不允许为空
                        blankText: "不能为空",
                        width: '50%',
                        itemId: 'dybbmcItemId',
                        bind: '{dybbmc}',
                        readOnly: editor
                    }, {
                        fieldLabel: '报表名称',
                        xtype: 'textfield',
                        allowBlank: false,//不允许为空
                        blankText: "不能为空",
                        width: '50%',
                        itemId: 'bbmcItemId',
                        bind: '{bbmc}',
                        readOnly: editor
                    },
                    ]
                }, {
                    width: '100%',
                    layout: 'hbox',
                    defaults: {
                        margin: '10 10 5 10'
                    },
                    items: [{
                        fieldLabel: '系统名称',
                        xtype: 'combobox',
                        width: '50%',
                        allowBlank: false,//不允许为空
                        blankText: "不能为空",
                        itemId: 'xtmcItemId', bind: '{xtmc}',
                        forceSelection: true, editable: false,
                        displayField: 'mc', valueField: 'dm',
                        triggerAction: 'all', queryMode: 'local',
                        store: {
                            autoLoad: true,
                            fields: ['xtmc', 'mc'],
                            proxy: Ext.create("app.ServiceProxy", {
                                url: Funi.core.Context.path("estate", '/dictionaries/queryDictionaries'),
                                extraParams: {lx: 'A58'},
                                reader: {
                                    type: 'json',
                                    rootProperty: 'result.list',
                                    messageProperty: 'message',
                                    successProperty: 'status'
                                }
                            }),
                            listeners: {
                                load: function (store, records, successful, eOpts) {
                                    if (store.getCount() > 0) {

                                        if (null != me.regitypes) {
                                            var xtmcVal = me.regitypes.xtmc;
                                            for (var i = 0; i < records.length; i++) {
                                                if (records[i].data.mc == xtmcVal) {
                                                    me.down("#xtmcItemId").setValue(records[i].data.dm)
                                                }
                                            }
                                        } else {
                                            me.down("#xtmcItemId").setValue(records[0].data.dm)
                                        }

                                    }
                                }
                            }
                        }
                    },
                        {
                            fieldLabel: '区域',
                            xtype: 'textfield',
                            width: '50%',
                            itemId: 'qyItemId',
                            bind: '{qy}',
                            readOnly: editor
                        },
                    ]
                }, {
                    width: '100%',
                    layout: 'hbox',
                    defaults: {
                        margin: '5 10 5 10'
                    },
                    items: [{
                        fieldLabel: '是否启动:',
                        xtype: 'combobox',
                        width: '50%',
                        allowBlank: false,//不允许为空
                        blankText: "不能为空",
                        itemId: 'ztItemId',
                        forceSelection: true, editable: false,
                        store: [
                            '是',
                            '否'
                        ],
                        value: '是', readOnly: editor,
                        listeners: {
                            afterrender: function (cob, ops) {
                                if (me.config.regitypes) {
                                    if (me.config.regitypes.zt == "是") {
                                        cob.setValue('是');
                                    } else {
                                        cob.setValue('否');
                                    }
                                }
                            }
                        }
                    }, {
                        fieldLabel: '备注',
                        xtype: 'textfield',
                        width: '50%',
                        itemId: 'bzItemId',
                        bind: '{bz}',
                        readOnly: editor
                    }]
                }
                ]
            }]
        });
        this.callParent(arguments);
    },
    _initComp: function () {

    }

});