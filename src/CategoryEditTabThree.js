/**
 * Created by 李骄 on 2017/5/16.
 */
Ext.define('CategoryEditTabThree', {
    extend: 'Ext.panel.Panel',
    xtype: 'fileCategoryManage-categoryEditTabThree',
    autoScroll: true,
    bodyBorder: true,
    requires: [],
    layout: 'fit',
    border: false,
    title: '定义扩展内容',
    config: {
        lbbh: ''
    },
    initComponent: function (config) {
        var me = this;
        var store = new Ext.data.JsonStore({
            data: [
                {'code': 1, 'name': '建校', content: '建校'},
                {'code': 2, 'name': '建厂', content: '建厂'}
            ],
            autoSync: true,
            fields: ['code', 'name', 'content']
        });
        Ext.apply(me, {
            xtype: 'fieldset',
            title: '定义扩展内容',
            height: '100%',
            margin: '5 10 5 10',
            layout: 'hbox',
            items: [
                {
                    xtyp: 'panel',
                    flex: 1,
                    border: true,
                    height: '100%',

                    items: [
                        {
                            xtype: 'gridpanel',
                            layout: 'fit',
                            width: '100%',
                            itemId: 'menuIds',
                            hideHeaders: true,
                            store: store,
                            viewConfig: {
                                enableTextSelection: true
                            },
                            columns: [
                                {text: '', dataIndex: 'name'},
                                {
                                    text: '',
                                    renderer: function (data, metadata, record, rowIndex, columnIndex, store) {
                                        return '<span class="xs">显示</span>'
                                    }
                                }
                            ],
                            listeners: {
                                cellclick: function (table, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                                    var node = td.querySelector('.xs');
                                    if (node) {
                                        var text = node.innerHTML;
                                        if ('显示' == text) {
                                            node.innerHTML = '隐藏'
                                        } else {
                                            node.innerHTML = '显示'
                                        }
                                    }
                                    //console.log(td);
                                    //console.log(td.childNodes);
                                    //Ext.Msg.alert("眼睛被选中");
                                    //var eyeStr =td.childNodes[0].innerText;
                                    //console.log(eyeStr);
                                    //if(eyeStr=="显示"){
                                    //    td.childNodes[0].innerText="隐藏";
                                    //}else{
                                    //    td.childNodes[0].innerText="显示";
                                    //}

                                },
                                'itemclick': function (view, record, item, index, e) {
                                    //me.addItemsForMenuContent(record.data);
                                }
                            }
                        }
                    ]
                },
                {
                    xtyp: 'panel',
                    flex: 5,
                    itemId: 'menuContent',
                    border: true,
                    height: '100%',
                    items: []
                }
            ]


        });
        this.callParent(arguments);
    },
    listeners: {
        //加载完毕后启动初始化方法
        afterrender: function (_this, ops) {
            //动态生成页面
            this._initView();
        }
    },
    _initView: function () {
    },
    addItemsForMenuContent: function (_data) {
        var me = this;
        var menuContent = me.down('#menuContent');
        menuContent.removeAll();
        var _page = Ext.create(_data.page, {mlmc: _data.mlmc});
        menuContent.add(_page);//核心
    }
});