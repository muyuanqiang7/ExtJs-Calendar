Ext.define('app.platform.archives.view.lijiao.systemaintenance.fileCategoryManage.CategoryEditTabFive', {
    extend: 'Ext.panel.Panel',
    xtype: 'fileCategoryManage-categoryEditTabFive',
    border: true,
    title: '设置档案权限',
    requires: ['app.platform.archives.view.lijiao.systemaintenance.fileCategoryManage.CheckboxGroupingFeature'],
    config: {
        regi: null
    },
    initComponent: function (config) {
        var me = this;
        if (me.regi == null) {
            me.regi = {
                lbbh: ''
            }
        }

        var authorityStore = Ext.create('Funi.data.ListStore', {
            autoLoad: true,
            fields: [],
            params: {lbbh: me.regi.lbbh},
            url: Funi.core.Context.path("archives", "/fcManage/findArchiAuthoritiesByLbbh"),
            groupField: 'orgStruName',
        });
        authorityStore.addListener("load", function (_this, records, successful, operation, eOpts) {
            me.updateLayout();
        });
        Ext.apply(me, {
            xtype: 'panel',
            border: true,
            items: [
                {
                    xtype: 'gridpanel',
                    store: authorityStore,
                    itemId: 'authorityPanel',
                    margin: '15 15 15 15',
                    border: true,
                    layout: 'fit',
                    enableColumnResize: false,
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
                        {text: '角色用户', dataIndex: 'username', align: 'center', flex: 1},
                        {text: '权限预览', dataIndex: 'qxyl', align: 'center', flex: 1},
                        {
                            text: '禁止访问',
                            align: 'center',
                            //xtype: 'checkcolumn',
                            flex: 1,
                            dataIndex: 'jzfw',
                            renderer: function (data, metadata, record, rowIndex, columnIndex, store) {
                                var str = '<input type="checkbox" class="jzfw" name="jzfw" checked>';
                                if (data == '1') {
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
                                if (data == '1') {
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
                                if (data == '1') {
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
                                    record.data[className] = target.checked ? "1" : "0";
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
            record.data[columns[i]] = checked ? '1' : '0';
        }
    },
    _saveCurrentPage: function () {
        var me = this;
        console.log(me.down('#authorityPanel'));
    }
});