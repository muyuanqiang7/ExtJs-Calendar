//要件编辑页面
Ext.define('app.platform.estate.view.register.sysconfig.businesslogic.RegiBusinessLogicEdit', {
    extend: 'Ext.window.Window',
    xtype: 'sysconfig-businesslogic-regibusinesslogicedit',
    title: '<span style="color:black;font-size:14px;height:100px;"><b>业务逻辑编辑</b></span>',
    width: 800,
    height: 440,
    id: 'dynamic',
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
        regicause: -1,
        constraintTypeFlag: false //约束类型不同显示方式
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
        var editor = me.config.editor;
        //是否启动store
        var statusStore = Ext.create('Ext.data.SimpleStore', {
            id: 'statusStoreItemId',
            autoLoad: true,
            fields: ['sfqd', 'status'],
            data: [['1', '是'], ['0', '否']],
        });
        var typeStore = Ext.create('Ext.data.SimpleStore', {
            id: 'typeStoreItemId',
            autoLoad: true,
            fields: ['lx', 'lxmc'],
            data: [['xzfw', '选择房屋'], ['glzd', '关联宗地'], ['fwyw', '房屋业务'],
                ['zdyw', '宗地业务'], ['sqr', '申请人'], ['fwjyxz', '房屋交易限制'],
                ['ryjyxz', '人员交易限制'], ['sfxz', '收费限制'], ['sjcl', '数据处理']
            ]
        });
        var constraintTypeStore = Ext.create('Ext.data.SimpleStore', {
            id: 'constraintTypeStoreItemId',
            autoLoad: true,
            fields: ['yslx', 'yslxmc'],
            data: [['jmys', '界面约束'], ['xzdyys', '选择单元约束'], ['yxsjcys', '运行时检查约束']
                , ['dbjcys', '登簿检查约束'], ['fzys', '发证约束']],
        });
        var style = {
            marginBottom: '4px',
            paddingLeft: '0px'
        };
        var styleForSpan = {
            marginBottom: '4px',
            paddingLeft: '10px',
            paddingTop: '5px'
        };
        var dynamicItems = [
            {
                xtype: 'hidden', bind: '{uuid}', itemId: 'uuidItemId'
            }, {
                fieldLabel: '逻辑名称',
                xtype: 'textfield',
                allowBlank: false,//不允许为空
                emptyText: '字符，最大长度50',
                blankText: "不能为空",
                columnWidth: 0.45,
                itemId: 'ljmcItemId',
                bind: '{ljmc}',
                style: style,
                hidden: true,
                readOnly: editor,
                listeners: {
                    afterrender: function (field) {
                        Ext.defer(function () {
                            field.focus(true, 100);
                        }, 1);
                    }
                }
            }, {
                xtype: 'label',
                columnWidth: 0.05,
                hidden: true,
                style: styleForSpan,
                html: '<span style="color: red;">*</span>'
            }, {
                fieldLabel: '方法名称',
                xtype: 'textfield',
                allowBlank: false,//不允许为空
                blankText: "不能为空",
                columnWidth: 0.45,
                // hidden: true,
                itemId: 'ffmcItemId',
                bind: '{ffmc}',
                style: style,
                readOnly: editor
            }, {
                xtype: 'label',
                columnWidth: 0.05,
                style: styleForSpan,
                html: '<span style="color: red">*</span>'
            }, {
                fieldLabel: '类型',
                style: {
                    marginBottom: '4px',
                    paddingLeft: '10px'
                },
                xtype: 'combobox',
                columnWidth: 0.45,
                allowBlank: false,//不允许为空
                blankText: "不能为空",
                itemId: 'lxItemId', bind: '{lx}',
                forceSelection: true, editable: false,
                displayField: 'lxmc', valueField: 'lx',
                triggerAction: 'all', queryMode: 'local',
                store: typeStore,
                listeners: {
                    afterrender: function (cob, ops) {
                        if (me.config.regitypes) {
                            if (me.config.regitypes.lx) {
                                for (var i = 0; i < typeStore.data.items.length; i++) {
                                    if (me.config.regitypes.lx == typeStore.data.items[i].data.lxmc) {
                                        cob.setValue(typeStore.data.items[i].data.lx)
                                    }
                                }
                            } else {
                                cob.setValue("--请选择--");
                            }
                        } else {
                            cob.setValue(typeStore.data.items[0].data.lx);
                        }
                    }
                }
            }, {
                xtype: 'label',
                columnWidth: 0.05,
                style: styleForSpan,
                html: '&nbsp'
            }, {
                fieldLabel: '约束类型',
                xtype: 'combobox',
                style: style,
                columnWidth: 0.45,
                allowBlank: false,//不允许为空
                blankText: "不能为空",
                itemId: 'yslxItemId', bind: '{yslx}',
                forceSelection: true, editable: false,
                displayField: 'yslxmc', valueField: 'yslx',
                triggerAction: 'all', queryMode: 'local',
                store: constraintTypeStore,
                multiSelect: me.config.constraintTypeFlag,
                listConfig: {
                    itemTpl: me.config.constraintTypeFlag ? Ext.create('Ext.XTemplate', '<input type=checkbox>{[values.yslxmc]}') : Ext.create('Ext.XTemplate', '{[values.yslxmc]}'),
                    onItemSelect: function (record) {
                        var node = this.getNode(record);
                        if (node) {
                            Ext.fly(node).addCls(this.selectedItemCls);
                            if (me.config.constraintTypeFlag) {
                                var checkboxs = node.getElementsByTagName("input");
                                if (checkboxs != null)
                                    var checkbox = checkboxs[0];
                                checkbox.checked = true;
                            }

                        }
                    },
                    listeners: {
                        itemclick: function (view, record, item, index, e, eOpts) {
                            if (me.config.constraintTypeFlag) {
                                var isSelected = view.isSelected(item);
                                var checkboxs = item.getElementsByTagName("input");
                                if (checkboxs != null) {
                                    var checkbox = checkboxs[0];
                                    if (!isSelected) {
                                        checkbox.checked = true;
                                    } else {
                                        checkbox.checked = false;
                                    }
                                }
                            }

                        }
                    }
                },
                listeners: {
                    afterrender: function (cob, ops) {
                        if (me.config.regitypes) {
                            if (me.config.regitypes.yslx) {
                                cob.setValue(me.config.regitypes.yslx);
                            } else {
                                cob.setValue("--请选择--");
                            }
                        } else {
                            cob.setValue(constraintTypeStore.data.items[0].data.yslx);
                        }
                    }
                }
            }, {
                xtype: 'label',
                columnWidth: 0.05,
                style: styleForSpan,
                html: '&nbsp'
            }, {
                fieldLabel: '描述',
                xtype: 'textfield',
                columnWidth: 0.45,
                itemId: 'msItemId',
                bind: '{ms}',
                style: style,
                readOnly: editor
            }, {
                xtype: 'label',
                columnWidth: 0.05,
                style: styleForSpan,
                html: '&nbsp'
            }, {
                fieldLabel: '是否启动',
                style: style,
                xtype: 'combobox',
                columnWidth: 0.45,
                allowBlank: false,//不允许为空
                blankText: "不能为空",
                itemId: 'sfqdItemId', bind: '{sfqd}',
                forceSelection: true, editable: false,
                displayField: 'status', valueField: 'sfqd',
                triggerAction: 'all', queryMode: 'local',
                store: statusStore,
                listeners: {
                    afterrender: function (cob, ops) {
                        if (me.config.regitypes) {
                            if (me.config.regitypes.sfqd) {
                                for (var i = 0; i < statusStore.data.items.length; i++) {
                                    if (me.config.regitypes.sfqd == statusStore.data.items[i].data.status) {
                                        cob.setValue(statusStore.data.items[i].data.sfqd)
                                    }
                                }
                            } else {
                                cob.setValue("--请选择--");
                            }
                        } else {
                            cob.setValue(statusStore.data.items[0].data.sfqd);
                        }
                    }
                }
            }, {
                xtype: 'label',
                columnWidth: 0.05,
                style: styleForSpan,
                html: '&nbsp'
            }, {
                xtype: "textarea",
                style: style,
                allowBlank: false,//不允许为空
                fieldLabel: "备注",
                emptyText: '字符 ，最大长度400',
                blankText: "不能为空",
                columnWidth: 0.95
            }, {
                xtype: 'label',
                columnWidth: 0.05,
                style: styleForSpan,
                html: '<span style="color: red">*</span>'
            }
        ];
        Ext.apply(me, {
            fieldDefaults: {
                labelWidth: 40,
                msgTarget: 'side'
                // labelAlign: "right"
            },

            defaults: {
                viewModel: {data: me.config.regitypes},
                border: false
            },
            buttons: [
                {
                    text: '确定'

                }, {
                    text: '取消',
                    handler: function () {
                        Ext.getCmp('dynamic').close();
                    }
                }],
            items: [{
                border: false,
                layout: 'column',
                items: dynamicItems
            }]
        });
        this.callParent(arguments);
    },
    _initComp: function () {

    }

})
;