Ext.define('app.platform.archives.view.lijiao.systemaintenance.fileCategoryManage.CategoryEditTabFive', {
    extend: 'Ext.window.Window',
    xtype: 'fileCategoryManage-categoryEditTabFive',
    border: true,
    width: 1200,
    height: 600,
    title: '设置档案权限',
    requires: [],
    initComponent: function (config) {
        var me = this;
        var jsonstore = new Ext.data.JsonStore({
            data: [
                {
                    id: 1,
                    funiusername: '张三',
                    qxyl: '查询',
                    jzfw: true,
                    kdx: false,
                    jcy: false,
                    zdy: true,
                    orgName: '档案管理小组'
                },
                {
                    id: 2,
                    funiusername: '李四',
                    qxyl: '禁止访问',
                    jzfw: false,
                    kdx: true,
                    jcy: true,
                    zdy: false,
                    orgName: '档案管理小组'
                },
                {
                    id: 3,
                    funiusername: '王五',
                    qxyl: '仅查阅',
                    jzfw: false,
                    kdx: false,
                    jcy: false,
                    zdy: false,
                    orgName: '档案管理小组'
                }, {
                    id: 4,
                    funiusername: '赵四',
                    qxyl: '仅查阅',
                    jzfw: false,
                    kdx: false,
                    jcy: false,
                    zdy: false,
                    orgName: '档案归集小组'
                }
            ],
            fields: [],
            groupField: 'orgName',
        });
        Ext.apply(me, {
            xtype: 'panel',
            border: true,
            items: [
                {
                    xtype: 'gridpanel',
                    store: jsonstore,
                    margin: '15 15 15 15',
                    border: true,
                    layout: 'fit',
                    enableColumnResize: false,
                    //selModel: Ext.create('Ext.selection.CheckboxModel', {
                    //    checkOnly: true // for prevent clicked grid row and canceled all check box checked status
                    //}),
                    multiColumnSort: true,
                    features: [Ext.create('Ext.grid.feature.Grouping', {
                            itemId: 'validGroup',
                            collapsible: false,
                            groupHeaderTpl: [
                                '<div style="display:inline-block;width: 100%;height: 100%"><div style="float: left; width: 16.65%;height: 100%;vertical-align: middle;text-align: center">{name}</div><div style="float: left; width: 16.66%;text-align: center">仅查阅</div><div style="float: left;width: 16.66%;text-align: center"><input class="forbid" type="checkbox" ></div><div style="float: left;width: 16.66%;text-align: center"><input class="readWrite" type="checkbox" ></div><div style="float: left;width: 16.66%;text-align: center"> <input class="readOnly" type="checkbox" ></div><div style="float: left;width: 16.70%;text-align: center"> <input class="custom" type="checkbox" ></div></div>'
                            ]
                        }
                    )],
                    viewConfig: {
                        enableTextSelection: true,
                    },
                    listeners: {
                        //gridPanel 分组被点击事件
                        groupclick: function (view, node, group, e, eOpts) {
                            if (e.target.className) {
                                var elements = node.querySelectorAll('input.' + e.target.className);
                                if (elements) {
                                    Ext.Array.each(elements, function (item) {
                                        if (item.checked) {
                                            console.log("true");
                                            item.setAttribute("checked", "checked");
                                        } else {
                                            console.log("false");
                                            item.removeAttribute("checked");
                                        }
                                    });
                                }
                            }
                        }
                    },
                    columnLines: true,
                    columns: [
                        {text: '角色用户', dataIndex: 'funiusername', align: 'center', flex: 1},
                        {text: '权限预览', dataIndex: 'qxyl', align: 'center', flex: 1},
                        {
                            text: '禁止访问',
                            align: 'center',
                            flex: 1,
                            dataIndex: 'jzfw',
                            renderer: function (data, metadata, record, rowIndex, columnIndex, store) {
                                var str = '<input type="checkbox"  name="jzfw" checked>';
                                if (data) {
                                    return str
                                } else {
                                    return me._regxReplace(str, 'checked');
                                }
                            }
                        },
                        {
                            text: '可读写',
                            align: 'center',
                            flex: 1,
                            dataIndex: 'kdx',
                            renderer: function (data, metadata, record, rowIndex, columnIndex, store) {
                                var str = '<input type="checkbox"  name="kdx" checked>';
                                if (data) {
                                    return str
                                } else {
                                    return me._regxReplace(str, 'checked');
                                }
                            }
                        },
                        {
                            text: '仅查阅',
                            align: 'center',
                            flex: 1,
                            dataIndex: 'jcy',
                            renderer: function (data, metadata, record, rowIndex, columnIndex, store) {
                                var str = '<input type="checkbox"  name="jcy" checked>';
                                if (data) {
                                    return str
                                } else {
                                    return me._regxReplace(str, 'checked');
                                }
                            }
                        },
                        {
                            text: '自定义', align: 'center',
                            flex: 1,
                            dataIndex: 'zdy',
                            renderer: function (data, metadata, record, rowIndex, columnIndex, store) {
                                var str = '<input type="checkbox"  name="zdy" checked>';
                                if (data) {
                                    return str
                                } else {
                                    return me._regxReplace(str, 'checked');
                                }
                            }
                        },
                    ]
                }
            ]
        });
        this.callParent(arguments);
    },
    _regxReplace: function (source, regx) {
        return source.replace(regx, "");
    }
});