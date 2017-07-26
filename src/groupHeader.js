Ext.define('app.platform.archives.view.lijiao.systemaintenance.fileCategoryManage.CategoryEditTabFive', {
    extend: 'Ext.window.Window',
    xtype: 'fileCategoryManage-categoryEditTabFive',
    border: true,
    width: 900,
    height: 600,
    title: '设置档案权限',
    requires: ['CheckboxGroupingFeature'],
    initComponent: function (config) {
        var me = this;
        var jsonstore = new Ext.data.JsonStore({
            data: [
                {
                    id: 1,
                    funiusername: '张三',
                    qxyl: '禁止访问',
                    jzfw: true,
                    kdx: false,
                    jcy: false,
                    orgName: '档案管理小组'
                },
                {
                    id: 2,
                    funiusername: '李四',
                    qxyl: '可读写',
                    jzfw: false,
                    kdx: true,
                    jcy: false,
                    orgName: '档案管理小组'
                },
                {
                    id: 3,
                    funiusername: '王五',
                    qxyl: '可读写',
                    jzfw: false,
                    kdx: true,
                    jcy: false,
                    orgName: '档案管理小组'
                }, {
                    id: 4,
                    funiusername: '赵四',
                    qxyl: '仅查阅',
                    jzfw: false,
                    kdx: false,
                    jcy: true,
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
                    features: [{
                        ftype: 'checkboxGrouping',
                        enableGroupingMenu: false,
                        collapsible: true,
                        //hideGroupHeader: true,
                        //startCollapsed: true // produces strange bug
                    }],
                    viewConfig: {
                        enableTextSelection: true,
                    },
                    columnLines: true,
                    columns: [
                        {text: '角色用户', dataIndex: 'funiusername', align: 'center', flex: 1},
                        {text: '权限预览', dataIndex: 'qxyl', align: 'center', flex: 1},
                        {
                            text: '禁止访问',
                            align: 'center',
                            //xtype: 'checkcolumn',
                            flex: 1,
                            dataIndex: 'jzfw',
                            renderer: function (data, metadata, record, rowIndex, columnIndex, store) {
                                var str = '<input type="checkbox" class="jzfw" name="jzfw" checked>';
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
                            //xtype: 'checkcolumn',
                            flex: 1,
                            dataIndex: 'kdx',
                            renderer: function (data, metadata, record, rowIndex, columnIndex, store) {
                                var str = '<input type="checkbox" class="kdx" name="kdx" checked>';
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
                            //xtype: 'checkcolumn',
                            flex: 1,
                            dataIndex: 'jcy',
                            renderer: function (data, metadata, record, rowIndex, columnIndex, store) {
                                var str = '<input type="checkbox"  class="jcy" name="jcy" checked>';
                                if (data) {
                                    return str
                                } else {
                                    return me._regxReplace(str, 'checked');
                                }
                            }
                        }
                    ],
                    listeners: {
                        cellclick: function (table, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                            var className = e.target.className;
                            if (className) {
                                var target = td.querySelector('input.' + className);
                                if (target) {
                                    //触发store update事件
                                    record.beginEdit();
                                    record.data[className] = target.checked;
                                    if (target.checked) {
                                        me._updateMutexColumn(record, me._getDifferentClassName(className), !target.checked);
                                        record.data['qxyl'] = me._getPermissionPreview(className);
                                    } else {
                                        record.data['qxyl'] = '';
                                    }

                                    record.endEdit();
                                }
                            }
                        }
                    }
                }
            ]
        });
        this.callParent(arguments);
    },
    //替换字符串regx为 ""
    _regxReplace: function (source, regx) {
        return source.replace(regx, "");
    },
    //获取权限预览显示
    _getPermissionPreview: function (permissionName) {
        var permission = {'jzfw': '禁止访问', 'kdx': '可读写', 'jcy': '仅查阅'}
        return permission[permissionName];
    },
    // 获取不同列class差异
    _getDifferentClassName: function (className) {
        var classArray = ['jzfw', 'kdx', 'jcy'];
        var index = classArray.indexOf(className);
        if (index > -1) {
            classArray.splice(index, 1);
        }
        return classArray;
    },
    //更改互斥列数据
    _updateMutexColumn: function (record, columns, checked) {
        for (var i = 0; i < columns.length; i++) {
            record.data[columns[i]] = checked;
        }
    }
});