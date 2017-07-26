//逻辑选择
Ext.define('app.platform.estate.view.register.regiconfig.businesslogicconfig.RegiBusinessLogicValidResult', {
    extend: 'Ext.window.Window',
    xtype: 'regiconfig-businesslogicconfig-regibusinesslogicvalidresult',
    title: '<span style="color:black;font-size:14px;height:100px;"><b>逻辑验证</b></span>',
    width: 700,
    height: 500,
    bodyPadding: 10,
    autoScroll: true,
    border: false,
    bodyBorder: false,
    floating: true,
    modal: true,
    layout: {
        type: 'hbox',
        pack: 'start',
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
        yslx: null,
        lxdm: null,
        treeNode: null,
        amount: 0,
        success: 0,
        fail: 0,
        isContinue: false
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
        Ext.tip.QuickTipManager.init();
        //var context = Ext.create("app.Context");
        var me = this;
        var yslxStore = context.getBusinessLogicConstraintTypeStore();
        var result = Ext.appContext.invokeService(Funi.core.Context.path("estate", "/test/info"),
                {
                    lxdm: '1010101001',
                    yslx: 'jmys',
                    fwbh: 'dbc1ba56-74c0-4357-a91a-39b61b54bfe7,dbc1ba56-74c0-4357-a91a,dbc1ba56-74c0-4357-a91a-adh67d'
                });
        var successStore = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: ['ljmc', 'status', 'tskg', 'yslx', 'message'],
            groupField: 'yslx',
            data: result.success
        });
        var failStore = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: ['ljmc', 'status', 'tskg', 'yslx', 'message'],
            data: result.fail
        });
        //store callback event listeners does not work
        //修改默认显示信息
        successStore.load({
            callback: function (records, options, success) {
                me.amount = result.success.length + result.fail.length;
                me.success = result.success.length;
                me.isContinue = result.result;
                me.fail = result.fail.length;
            }
        });
        Ext.apply(me, {
            items: [
                {
                    xtype: 'panel',
                    id: 'validPanel',
                    width: 690,
                    height: 200,
                    border: false,
                    scrollable: true,
                    dockedItems: [{
                        xtype: 'toolbar',
                        style: {
                            background: 'white'
                        },
                        dock: 'bottom',
                        ui: 'footer',
                        layout: {
                            //设置button 居中
                            pack: 'center'
                        },
                        items: [
                            {
                                text: '继续',
                                disabled: me.isContinue,
                                handler: function () {

                                }

                            }, {
                                text: '取消',
                                handler: function () {
                                    var me = this;
                                    me.up('window').close();
                                }
                            }
                        ]
                    }],
                    items: [
                        {
                            xtype: 'label',
                            margin: '0 0 0 0',
                            html: '<div>' +
                            '<img style="vertical-align: middle; width: 32px; height: 32px" src=' + context.getLogicValidIcons("sad") + '>' +
                            '<span style="color:black;font-size:14px;height:100px;vertical-align: middle">' +
                            '<b>&nbsp;&nbsp;共' + me.amount + '项检查,以下' + me.fail + '项有问题,需查看</b></span></div>',
                        }, {
                            xtype: 'gridpanel',
                            id: 'fail-view',
                            margin: '8 0 0 0',
                            border: false,
                            cellWrap: true,
                            rowLines: false,
                            layout: 'anchor',
                            disableSelection: true,
                            style: {
                                background: 'white'
                            },
                            viewConfig: {
                                getRowClass: function (record) {
                                    return 'style=""';
                                }
                            },
                            store: failStore,
                            columns: [
                                {
                                    header: '序号',
                                    xtype: 'rownumberer',
                                    flex: 0.2,
                                    align: 'center',
                                    sortable: false,
                                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                                        metaData.tdStyle = 'vertical-align: middle';
                                        return '<div style="width: 18px; height: 18px;border-radius: 50%;font-size: 10px;padding-right:0px;color: #000;line-height: 18px;text-align: center;background: #fff;border: 1px solid black;">' + (rowIndex + 1) + '</div>'

                                    }
                                },
                                {
                                    text: '逻辑名称',
                                    dataIndex: 'ljmc',
                                    flex: 7,
                                    renderer: function (value, metaData) {
                                        metaData.tdStyle = 'vertical-align: middle';
                                        return '<span style="color:black;font-size:14px;height:22px;vertical-align: middle">' + value + '</span>'
                                    }
                                }
                                ,
                                {
                                    text: '结果',
                                    dataIndex: 'status',
                                    flex: 0.2,
                                    renderer: function (value, metaData, record) {
                                        //根据记录提示开关以及提示信息显示toolLip信息
                                        if (record.data.tskg && record.data.message != '') {
                                            metaData.tdCls = metaData.tdCls + 'errorToolTipCls'
                                        }
                                        metaData.tdStyle = 'vertical-align: middle';
                                        if (record.data.tskg) {
                                            return '<img  style="width: 22px; height: 22px" src=' + context.getLogicValidIcons('error') + ' />'

                                        } else {
                                            return '<img  style="width: 22px; height: 22px" src=' + context.getLogicValidIcons('warn') + ' />'
                                        }
                                    }
                                }
                            ],
                            width: 680,
                            hideHeaders: true,
                            listeners: {
                                //鼠标悬浮提示信息
                                viewready: function (grid) {
                                    var view = grid.view;
                                    grid.mon(view, {
                                        uievent: function (type, view, cell, recordIndex, cellIndex, e) {
                                            grid.cellIndex = cellIndex;
                                            grid.recordIndex = recordIndex;
                                        }
                                    });

                                    grid.tip = Ext.create('Ext.tip.ToolTip', {
                                        title: '<div><img style="vertical-align: middle; width: 16px; height: 16px" src=' + context.getLogicValidIcons("error") + ' /><span style="color:black;font-size:14px;height:100px;vertical-align: middle"><b>&nbsp;&nbsp;提示信息</b></span></div>',
                                        target: view.getId(),
                                        anchor: 'left',
                                        delegate: '.errorToolTipCls',
                                        trackMouse: true,
                                        renderTo: Ext.getBody(),
                                        listeners: {
                                            beforeshow: function updateTipBody(tip) {
                                                tip.update(grid.getStore().getAt(grid.recordIndex).data.message);
                                            }
                                        }
                                    });

                                }
                            }

                        },
                        {
                            xtype: 'label',
                            html: '<div>' +
                            '<img style="vertical-align: middle; width: 32px; height: 32px" src=' + context.getLogicValidIcons("smile") + '>' +
                            '<span style="color:black;font-size:14px;height:100px;vertical-align: middle">' +
                            '<b>&nbsp;&nbsp;以下' + me.success + '项没有问题</b></span></div>',
                        }, {
                            xtype: 'gridpanel',
                            id: 'success-view',
                            margin: '8 0 0 0',
                            border: false,
                            cellWrap: true,
                            rowLines: false,
                            layout: 'anchor',
                            disableSelection: true,
                            viewConfig: {
                                getRowClass: function (record) {
                                    return 'style=""';
                                },
                                listeners: {
                                    //gridpanel group事件
                                    groupclick: function (view, node, group, e, eOpts) {
                                        var groupFeature = view.features[0];
                                        if (groupFeature.isExpanded(group)) {
                                            groupFeature.collapse(group, true);
                                        } else {
                                            groupFeature.expand(group, true);
                                        }
                                    },
                                    groupexpand: function (view, node, group, e, eOpts) {
                                        node.children[0].className = "";
                                        node.children[0].children[0].src = context.getLogicValidIcons('bottom');
                                    },
                                    groupcollapse: function (view, node, group, e, eOpts) {
                                        node.children[0].className = "";
                                        node.children[0].children[0].src = context.getLogicValidIcons('top');
                                    }
                                }
                            },
                            features: [Ext.create('Ext.grid.feature.Grouping', {
                                        itemId: 'validGroup',
                                        collapsible: false,
                                        groupHeaderTpl: [
                                            '{name:this.formatName}检查共',
                                            '{children.length}项',
                                            '<img style="vertical-align: middle; margin-right: 8px; float: right;width: 16px; height: 16px" src=' + context.getLogicValidIcons('bottom') + ' />',
                                            {
                                                formatName: function (name) {
                                                    for (var i = 0; i < yslxStore.data.length; i++) {
                                                        var yslxObject = yslxStore.data.items[i].data;
                                                        if (yslxObject.yslx == name) {
                                                            return yslxObject.yslxmc;
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                            )],
                            style: {
                                background: 'white'
                            }
                            ,
                            store: successStore,
                            columns: [
                                {
                                    header: '序号',
                                    xtype: 'rownumberer',
                                    flex: 0.2,
                                    align: 'center',
                                    sortable: false,
                                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                                        metaData.tdStyle = 'vertical-align: middle';
                                        return '<div style="width: 18px; height: 18px;border-radius: 50%;font-size: 10px;padding-right:0px;color: #000;line-height: 18px;text-align: center;background: #fff;border: 1px solid black;">' + (rowIndex + 1) + '</div>'

                                    }
                                },
                                {
                                    text: '逻辑名称',
                                    dataIndex: 'ljmc',
                                    flex: 7,
                                    renderer: function (value, metaData) {
                                        metaData.tdStyle = 'vertical-align: middle';
                                        return '<span style="color:black;font-size:14px;height:22px;vertical-align: middle">' + value + '</span>'
                                    }
                                }
                                ,
                                {
                                    text: '结果',
                                    dataIndex: 'status',
                                    flex: 0.2,
                                    renderer: function (value, metaData, record) {
                                        if (record.data.tskg && record.data.message != '') {
                                            metaData.tdCls = metaData.tdCls + 'successToolTipCls'
                                        }
                                        metaData.tdStyle = 'vertical-align: middle';
                                        if (value) {
                                            return '<img style="width: 22px; height: 22px" src=' + context.getLogicValidIcons('right') + ' />'
                                        } else {
                                            return '<img  style="width: 22px; height: 22px" src=' + context.getLogicValidIcons('error') + ' />'
                                        }
                                    }
                                }
                            ],
                            width: 680,
                            hideHeaders: true,
                            listeners: {
                                //鼠标悬浮提示信息
                                viewready: function (grid) {
                                    var view = grid.view;
                                    grid.mon(view, {
                                        uievent: function (type, view, cell, recordIndex, cellIndex, e) {
                                            grid.cellIndex = cellIndex;
                                            grid.recordIndex = recordIndex;
                                        }
                                    });

                                    grid.tip = Ext.create('Ext.tip.ToolTip', {
                                        title: '<div><img style="vertical-align: middle; width: 16px; height: 16px" src=' + context.getLogicValidIcons("error") + ' /><span style="color:black;font-size:14px;height:100px;vertical-align: middle"><b>&nbsp;&nbsp;提示信息</b></span></div>',
                                        target: view.getId(),
                                        anchor: 'left',
                                        delegate: '.successToolTipCls',
                                        trackMouse: true,
                                        renderTo: Ext.getBody(),
                                        listeners: {
                                            beforeshow: function updateTipBody(tip) {
                                                tip.update(grid.getStore().getAt(grid.recordIndex).data.message);
                                            }
                                        }
                                    });

                                }
                            }
                        }
                    ]
                }
            ]
        })
        ;

        this.callParent(arguments);
    },

    _initComp: function () {
    }
});