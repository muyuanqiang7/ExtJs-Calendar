Ext.define('CheckboxGroupingFeature', {
    extend: 'Ext.grid.feature.Grouping',
    alias: 'feature.checkboxGrouping',

    /** @property */
    targetCls: 'group-checkbox',
    /** @property */
    checkDataIndex: 'isChecked',
    jzfw: "jzfw",
    kdx: 'kdx',
    jcy: 'jcy',
    qxyl: 'qxyl',
    startCollapsed: true,
    updatingRecords: false,

    constructor: function (config) {
        config.groupHeaderTpl = ['<table style="width: 100%;height: 100%;margin: auto 0"><tr style="width: 100%;height: 100%"><td style="float: left; width: 18.41%;height: 100%;vertical-align: middle;text-align: center">{name}</td><td style="float: left; width: 20.21%;text-align: center">{[values.record.get("' + this.qxyl + '") ? values.record.get("' + this.qxyl + '") : ""]}</td><td style="float: left;width: 20.51%;text-align: center"><input style="margin-left: 5px" class="jzfw" type="checkbox" {[values.record.get("' + this.jzfw + '") ? "checked" : ""]}></td><td style="float: left;width: 20.53%;text-align: center"><input style="margin-left: 5px" class="kdx" type="checkbox" {[values.record.get("' + this.kdx + '") ? "checked" : ""]} ></td><td style="float: left;width: 19.04%;text-align: center"> <input style="margin-left: 22px" class="jcy" type="checkbox" {[values.record.get("' + this.jcy + '") ? "checked" : ""]}></td></tr></table>'
        ];
        this.callParent(arguments);
    },

    init: function (grid) {
        var store = grid.getStore();
        if (store) {
            store.on('update', this.onStoreUpdate, this);
            store.on('load', this.onStoreLoad, this);
        }
        this.callParent(arguments);
    },

    setupRowData: function (record, idx, rowValues) {
        this.callParent(arguments);
        // Ext JS 6 vs Ext JS 5.1.1 vs Ext JS 5.1.0-
        var groupInfo = this.groupRenderInfo || this.metaGroupCache || this.groupInfo;
        groupInfo.record = this.getParentRecord(record.get(this.getGroupField()));
    },

    /**
     * This method will only run once... on the initial load of the view... this
     * is so we can check the store for the grouped item's children... if they're
     * all checked, then we need to set the private variable to checked
     */
    checkAllGroups: function (groupName, modifiedFieldNames) {
        var index = modifiedFieldNames.indexOf('qxyl');
        if (index > -1) {
            modifiedFieldNames.splice(index, 1);
        }
        var store = this.view.getStore();
        var groupField = this.getGroupField();
        if (store) {
            var groups = store.getGroups();
            if (groups) {
                groups.each(function (groupRec) {
                    var allChecked = true;
                    var groupKey = groupRec.getGroupKey();
                    var checkGroup = true;
                    if (groupName) {
                        if (groupKey !== groupName) {
                            checkGroup = false;
                        }
                    }
                    if (checkGroup) {
                        for (var i = 0; i < modifiedFieldNames.length; i++) {
                            var updateField = modifiedFieldNames[i];
                            groupRec.each(function (rec) {
                                allChecked = rec.get(updateField);
                                groupName = rec.get(groupField);
                                if (allChecked === false) {
                                    return false;
                                }
                            }, this);
                            this.updateParentRecord(groupName, allChecked, updateField);
                        }
                    }
                }, this);
            }
        }
    },

    updateParentRecord: function (groupName, checked, property) {
        var parentRecord = this.getParentRecord(groupName);
        if (parentRecord) {
            var differenceClassNames = this._getDifferentClassName(property);
            if (checked) {
                for (var i = 0; i < differenceClassNames.length; i++) {
                    parentRecord.set(differenceClassNames[i], !checked);
                }
            }
            parentRecord.set(property, checked);
            this.refreshView();
        }
    },

    getParentRecord: function (groupName) {
        var parentRecord;
        var metaGroup;
        // For Ext JS 6 and 5.1.1
        if (this.getMetaGroup) {
            metaGroup = this.getMetaGroup(groupName);
        }
        // For Ext JS 5.1-
        else {
            metaGroup = this.groupCache[groupName];
        }
        if (metaGroup) {
            parentRecord = metaGroup.placeholder;
        }
        return parentRecord;
    },

    /**
     * TODO: This might break... we're using a private variable here... but this
     * is the only way we can refresh the view without breaking any sort of
     * scrolling... I'm not sure how to only refresh the group header itself, so
     * I'm keeping the groupName as a param passing in... might be able to figure
     * this out later
     * @param {String} groupName
     */
    refreshView: function (groupName) {
        var view = this.view;
        if (view) {
            view.refreshView();
        }
    },
    getPermissionPreview: function (permissionName) {
        var permission = {'jzfw': '禁止访问', 'kdx': '可读写', 'jcy': '仅查阅'}
        return permission[permissionName];
    },
    onStoreUpdate: function (store, record, operation, modifiedFieldNames, details, eOpts) {
        var grid = this.grid;
        if (!this.updatingRecords && grid && record) {
            var groupName = record.get(this.getGroupField());
            this.checkAllGroups(groupName, modifiedFieldNames);
            grid.setSelection(record);
            this.refreshView(groupName);
        }
    },
    onStoreLoad: function (store, records, successful, eOpts) {
        console.log("store load");
    },
    _getDifferentClassName: function (className) {
        var classArray = ['jzfw', 'kdx', 'jcy'];
        var index = classArray.indexOf(className);
        if (index > -1) {
            classArray.splice(index, 1);
        }
        return classArray;
    },

    onGroupClick: function (grid, node, group, event, eOpts) {
        if (event && grid) {
            var className = event.target.className;
            if (className) {
                var target = node.querySelector('input.' + className);
                //var target = event.getTarget('.' + className);
                var store = grid.getStore();
                var groupRecord = this.getRecordGroup(event.record);
                if (target && store && groupRecord) {
                    var checked = target.checked;
                    this.updatingRecords = true;
                    groupRecord.each(function (rec, index) {
                        rec.beginEdit();
                        //获取其他列className 数组改变record值做互斥
                        var differenceClassNames = this._getDifferentClassName(className);
                        if (checked) {
                            for (var i = 0; i < differenceClassNames.length; i++) {
                                rec.set(differenceClassNames[i], !checked);
                            }
                            rec.set('qxyl', this.getPermissionPreview(className));
                        } else {
                            rec.set('qxyl', '');
                        }
                        rec.set(className, checked);
                        rec.endEdit(true);
                    }, this);
                    this.updatingRecords = false;
                    this.updateParentRecord(group, checked, className);
                } else {
                    this.callParent(arguments);
                }
            }

        }
    }
});