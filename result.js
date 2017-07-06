//逻辑选择
Ext.define('app.platform.estate.view.register.regiconfig.businesslogicconfig.RegiBusinessLogicValidResult', {
    extend: 'Ext.window.Window',
    id: 'windowInfo',
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
        treeNode: null
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
        var me = this;
        Ext.create('Ext.data.Store', {
            storeId: 'simpsonsStore',
            fields: ['name', 'email', 'phone'],
            groupField: 'name',
            data: [
                {
                    name: '房屋是否存在不动产单元号',
                    email: 'lisa@simpsons.com',
                    phone: '1',
                    message: '0109862331908、不动产单元号未办理国有产权首次登记'
                },
                {
                    name: '房屋是否存在不动产单元号',
                    email: 'lisa@simpsons.com',
                    phone: '1',
                    message: '0109862331908、不动产单元号未办理国有产权首次登记'
                },
                {
                    name: '房屋是否存在不动产单元号',
                    email: 'lisa@simpsons.com',
                    phone: '1',
                    message: '0109862331908、不动产单元号未办理国有产权首次登记'
                },
                {
                    name: '房屋是否关联宗地信息',
                    email: 'bart@simpsons.com',
                    phone: '2',
                    message: '19876611kh1121k1、不动产单元号未办理国有产权首次登记'
                },
                {
                    name: '房屋是否存在有效抵押权信息',
                    email: 'homer@simpsons.com',
                    phone: '3',
                    message: '210k2382101001不动产单元号未办理国有产权首次登记'
                },
                {
                    name: '房屋是否存在有效抵押权信息',
                    email: 'homer@simpsons.com',
                    phone: '3',
                    message: '210k2382101001不动产单元号未办理国有产权首次登记'
                },
                {
                    name: '房屋是否存在正在办理抵押权信息',
                    email: 'marge@simpsons.com',
                    phone: '-1',
                    message: '310k238210100不动产单元号未办理国有产权首次登记'
                }
            ]
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
                                disabled: true,
                                handler: function () {

                                }

                            }, {
                                text: '取消',
                                handler: function () {
                                    Ext.getCmp('windowInfo').close();
                                }
                            }
                        ]
                    }],
                    items: [
                        {
                            xtype: 'label',
                            margin: '0 0 0 0',
                            html: '<div><img style="vertical-align: middle; width: 32px; height: 32px" src="resources/css/logic/smile-sad.png"><span style="color:black;font-size:14px;height:100px;vertical-align: middle"><b>&nbsp;&nbsp;共15项检查,以下2项有问题,需查看</b></span></div>',
                        }, {
                            xtype: 'gridpanel',
                            enableLocking: true,
                            id: 'fail-view',
                            border: false,
                            margin: '8 0 0 0',
                            style: {
                                background: 'white'
                            },
                            width: 680

                        },
                        {
                            xtype: 'label',
                            html: '<div><img style="vertical-align: middle; width: 32px; height: 32px" src="resources/css/logic/smile.png"><span style="color:black;font-size:14px;height:100px;vertical-align: middle"><b>&nbsp;&nbsp;以下13项没有问题</b></span></div>',
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
                                        node.children[0].children[0].src = "resources/css/logic/bottom.png";
                                    },
                                    groupcollapse: function (view, node, group, e, eOpts) {
                                        node.children[0].className = "";
                                        node.children[0].children[0].src = "resources/css/logic/top.png";
                                    }
                                }
                            },
                            features: [Ext.create('Ext.grid.feature.Grouping', {
                                    itemId: 'validGroup',
                                    collapsible: false,
                                    groupHeaderTpl: [
                                        '界面约束类型检查共',
                                        '{children.length}项',
                                        '<img style="vertical-align: middle; margin-right: 6px; float: right;width: 16px; height: 16px" src="resources/css/logic/bottom.png" />'
                                    ],
                                }
                            )],
                            style: {
                                background: 'white'
                            }
                            ,
                            store: Ext.data.StoreManager.lookup('simpsonsStore'),
                            columns: [
                                {
                                    header: '序号', xtype: 'rownumberer', flex: 0.2, align: 'center', sortable: false,
                                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                                        return '<div style="width: 16px; height: 16px;border-radius: 50%;font-size: 10px;color: #fff; margin-right: 0px;line-height: 16px;text-align: center;background: #000">' + (rowIndex + 1) + '</div>'

                                    }
                                },
                                {
                                    text: 'Name',
                                    dataIndex: 'name',
                                    flex: 7,
                                    align: 'left',
                                    renderer: function (value) {
                                        return '<span style="color:black;font-size:14px;height:22px;vertical-align: middle">' + value + '</span>'
                                    }
                                }
                                ,
                                {
                                    text: 'Phone',
                                    dataIndex: 'phone',
                                    flex: 0.2,
                                    cls: 'tipCls',
                                    tdCls: 'toolTipCls',
                                    renderer: function (value) {
                                        if (value == -1) {
                                            return '<img style="width: 22px; height: 22px" src="resources/css/logic/right.png" />'
                                        }
                                        if (value % 2 == 1) {
                                            return '<img  style="width: 22px; height: 22px" src="resources/css/logic/warn.png" />'

                                        } else {
                                            return '<img  style="width: 22px; height: 22px" src="resources/css/logic/error.png" />'
                                        }
                                    }
                                }
                            ],
                            width: 680,
                            hideHeaders: true,
                            listeners: {
                                viewready: function (grid) {
                                    var view = grid.view;
                                    grid.mon(view, {
                                        uievent: function (type, view, cell, recordIndex, cellIndex, e) {
                                            grid.cellIndex = cellIndex;
                                            grid.recordIndex = recordIndex;
                                        }
                                    });

                                    grid.tip = Ext.create('Ext.tip.ToolTip', {
                                        title: '<div><img style="vertical-align: middle; width: 16px; height: 16px" src="resources/css/logic/error.png"/><span style="color:black;font-size:14px;height:100px;vertical-align: middle"><b>&nbsp;&nbsp;提示信息</b></span></div>',
                                        target: view.getId(),
                                        anchor: 'left',
                                        delegate: '.toolTipCls',
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