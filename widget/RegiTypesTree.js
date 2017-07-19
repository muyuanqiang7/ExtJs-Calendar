//登记类型树
Ext.define('ux.RegiTypesTree', {
    extend: 'Ext.window.Window',
    xtype: 'ux-regitypestree',
    closable: true,
    autoScroll: true,
    border: true,
    width: 300,
    height: 200,
    floating: true,
    modal: true,
    layout: {
        type: 'fit'
    },
    listeners: {
        //加载完毕后启动初始化方法
        afterrender: function (_this, ops) {
            this._initComp();
        }
    },
    config: {
        url: '',
        extraParams: {},
        title: '',
        nodeRightClickDisabled: false
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
        var treeStore = Ext.create('Ext.data.TreeStore', {
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: me.url,
                reader: {
                    type: 'json'
                },
                extraParams: me.extraParams

            },
            root: {
                id: '0',
                text: '档案类别',
                expanded: true
            }
        });
        Ext.apply(me, {
            items: [
                {
                    xtype: 'treepanel',
                    itemId: 'regiTypesTree',
                    store: treeStore,
                    border: true,
                    rootVisible: true,
                    expanded: true,
                    listeners: {
                        scope: this,
                        itemclick: function (view, rec, el, index, e) {
                            //传参  treenodeId
                            //包含子节点不能点击
                            if (rec.childNodes.length == 0) {
                                var obejct = {
                                    id: rec.id,
                                    text: rec.data.text
                                };
                                me.fireEvent("throwRegiCode", obejct);

                            }
                        },
                        itemcontextmenu: function (view, record, item, index, e, eOpts) {
                            e.preventDefault();
                            e.stopEvent();
                            var object = {
                                id: record.id,
                                text: record.data.text
                            };
                            if (me.nodeRightClickDisabled) {
                                var contextMenu = new Ext.menu.Menu({
                                    //控制右键菜单位置
                                    single: true,
                                    float: true,
                                    items: [{
                                        text: '修改',
                                        scope: this,
                                        glyph: 0xf0ad,
                                        handler: function () {
                                            me.fireEvent("updateNode", record);
                                        }
                                    }, {
                                        text: '添加',
                                        glyph: 0xf067,
                                        scope: this,
                                        handler: function () {
                                            me.fireEvent("addNode", record);
                                        }
                                    }, {
                                        text: "删除",
                                        glyph: 0xf00d,
                                        scope: this,
                                        handler: function () {
                                            me.fireEvent("deleteNode", record);
                                        }
                                    }
                                    ]
                                });
                                if (record.id == 0) {
                                    contextMenu.items.items.splice(0, 1);
                                    contextMenu.items.items.splice(1, 1);
                                }
                                contextMenu.showAt(e.getPoint());
                                contextMenu.focus();
                            }
                        }
                    }
                }]
        });
        this.callParent(arguments);
    },
    _initComp: function () {
    }
});