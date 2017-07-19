Ext.define("ux.ComboBoxTree", {
    extend: "Ext.form.field.Picker",
    alias: "widget.comboboxtree",
    xtype: 'myComboboxTree',//自定义类名
    requires: ["Ext.tree.Panel"],
    config: {
        submitValue: ''//用于存放id
    },
    initComponent: function () {
        var self = this;
        Ext.apply(self, {
            fieldLabel: self.fieldLabel,
            labelWidth: self.labelWidth
        });
        self.callParent();
    },
    clearValue: function () {
        var me = this;
        var picker = me.getPicker();
        var root = picker.getRootNode();
        root.cascadeBy(function (node) {
            if (node.get('checked') != null) {
                node.set('checked', false);
            }
        });
        me.setSubmitValue("");
        me.setValue("");
    },
    bindValue: function (value, submitValue) {
        var me = this;
        var picker = me.getPicker();
        var root = picker.getRootNode();
        var ids = submitValue.split(";");

        root.cascadeBy(function (node) {
            if (node.get('checked') != null) {
                node.set('checked', false);
                for (var i = 0; i < ids.length; i++) {
                    if (node.get('id') == ids[i]) {
                        node.set('checked', true);
                    }
                }
            }
        });

        me.setSubmitValue(submitValue);
        me.setValue(value);
    },
    createPicker: function () {  //子类必须实现这个方法  
        var self = this;
        var _clickRecord;
        var menu = Ext.create('Ext.menu.Menu', {
            floating: true,
            items: [{
                text: '新建', handler: function () {
                    self.fireEvent("_add", {'_clickRecord':_clickRecord});

                }
            }, {
                text: '修改', handler: function () {
                    self.fireEvent("_edit",{'_clickRecord':_clickRecord});
                }
            },
                {
                    text: '删除', handler: function () {
                    self.fireEvent("_delete", {'_clickRecord':_clickRecord});
                }
                }
            ],
            renderTo: document.body
        });
        var store = Ext.create('Ext.data.TreeStore', {
            proxy: {
                type: 'ajax',
                url: self.storeUrl,
                extraParams: {//自定义提交参数
                    urlparams: self.urlparams,
                    /* 
                     all:所有结点都可选中；
                     exceptRoot：除根结点，其它结点都可选（默认）；
                     folder:只有目录（非叶子和非根结点）可选；
                     leaf：只有叶子结点可选
                     不设置selectModel或者乱设置：所有节点不带check；只能单选
                     */
                    selectModel: self.selectModel,
                    showDetail: self.showDetail     //true：显示叶子节点；false：不显示叶子节点
                },
                actionMethods: {
                    read: 'POST' //store默认的提交方式为get  
                }
            },
            nodeParam: 'id',
            sorters: [
                {
                    property: 'leaf',
                    direction: 'ASC'
                },
                {
                    property: 'text',
                    direction: 'ASC'
                }
            ],
            root: {
                id: self.rootId || " ",
                text: self.rootText
            }
        });

        self.picker = Ext.create('Ext.tree.Panel', {
            height: 200,
            autoScroll: true,
            floating: true,
            focusOnToFront: false,
            shadow: true,
            ownerCt: this.ownerCt,
            useArrows: true,
            store: store,
            rootVisible: self.rootVisible
        });

        self.picker.on({
            //绑定数据  
            load: function (record, e) {
                var root = self.picker.getRootNode();
                var ids = self.submitValue.split(";");
                root.cascadeBy(function (node) {
                    if (node.get('checked') != null) {
                        node.set('checked', false);
                        for (var i = 0; i < ids.length; i++) {
                            if (node.get('id') == ids[i]) {
                                node.set('checked', true);
                            }
                        }
                    }
                });
            },
            checkchange: function (record, checked) {
                //single 为单选模式，设置multiple为多选（仅限于带复选框的树）  
                var checkModel = self.checkModel;
                if (checkModel == 'single') {
                    var checked = !checked;
                    var root = self.picker.getRootNode();
                    var selectModel = self.selectModel;

                    //去掉带有复选框节点上的勾  
                    root.cascadeBy(function (node) {
                        if (node.get('checked') != null && (node.get('text') != record.get('text')))
                            node.set('checked', false);
                    });

                    if ((selectModel == "leaf" && record.get('leaf') && checked) ||                                 //叶子节点可选
                        (selectModel == "folder" && !record.get('root') && !record.get('leaf') && checked) ||        //节点可选
                        (selectModel == "exceptRoot" && !record.get('root') && checked) ||                           //非root节点可选
                        (selectModel == "all" && checked)) {                                                         //全部可选
                        record.set('checked', true);
                        self.setSubmitValue(record.get('id'));
                        self.setValue(record.get('text'));
                    } else {
                        record.set('checked', false);
                        self.setSubmitValue('');
                        self.setValue('');
                    }
                } else if (checkModel == 'multiple') {
                    //级联方式:1.child子级联;2.parent,父级联,3,both全部级联  
                    var cascade = self.cascade || 'child';
                    if (checked == true) {
                        if (cascade == 'both' || cascade == 'child' || cascade == 'parent') {
                            if (cascade == 'child' || cascade == 'both') {
                                if (!record.get("leaf") && checked) record.cascadeBy(function (record) {
                                    record.set('checked', true);
                                });
                            }
                            if (cascade == 'parent' || cascade == 'both') {
                                pNode = record.parentNode;
                                for (; pNode != null; pNode = pNode.parentNode) {
                                    pNode.set("checked", true);
                                }
                            }
                        }
                    } else if (checked == false) {
                        if (cascade == 'both' || cascade == 'child' || cascade == 'parent') {
                            if (cascade == 'child' || cascade == 'both') {
                                if (!record.get("leaf") && !checked) record.cascadeBy(function (record) {
                                    if (!record.get('root'))
                                        record.set('checked', false);
                                });
                            }
                        }
                    }
                    var records = self.picker.getView().getChecked(),
                        names = [],
                        values = [];
                    Ext.Array.each(records,
                        function (rec) {
                            names.push(rec.get('text'));
                            values.push(rec.get('id'));
                        });
                    self.setSubmitValue(values.join(';'));
                    self.setValue(names.join(';'));
                }
            },
            itemdblclick: function (tree, record, item, index, e, options) {
                var dbevent = self.dbevent;
                if (dbevent == true) {
                    _clickRecord=record;
                    var xy = e.getXY();
                    menu.showAt(xy[0] + 100, xy[1]);
                }
            },
            itemclick: function (tree, record, item, index, e, options) {
                /*
                 all:所有结点都可选中
                 exceptRoot：除根结点，其它结点都可选（默认）
                 folder:只有目录（非叶子和非根结点）可选
                 leaf：只有叶子结点可选
                 */
                var selectNodeModel = self.selectModel || 'exceptRoot';

                //single 为单选模式，设置multiple为多选（仅限于带复选框的树）  
                var checkModel = self.checkModel;

                //获取根节点  
                var root = self.picker.getRootNode();

                if (checkModel == 'single') {
                    //所有节点不带复选框时，点谁选谁  
                    if (selectNodeModel != "folder" && selectNodeModel != "all" && selectNodeModel != "leaf" && selectNodeModel != "exceptRoot") {
                        self.setSubmitValue(record.get('id'));
                        self.setValue(record.get('text'));
                    } else {//带有复选框的节点，根据配置来选择

                        //去掉带有复选框节点上的勾  
                        root.cascadeBy(function (node) {
                            if (node.get('checked') != null && (node.get('text') != record.get('text'))) {
                                node.set('checked', false);
                            }
                        });

                        //单击带复选框的节点时，反选勾选状态  
                        if (record.get('checked') == false) {
                            record.set('checked', true);
                            self.setSubmitValue(record.get('id'));
                            self.setValue(record.get('text'));
                        } else if (record.get('checked') == true) {
                            record.set('checked', false);
                            self.setSubmitValue('');
                            self.setValue('');
                        }

                        //单击不带复选框的节点时，根据配置来选中  
                        if (((selectNodeModel == "folder" && !record.get('root') && !record.get('leaf'))) ||        //只有节点可选  
                            ((selectNodeModel == "exceptRoot" && !record.get('root'))) ||                           //root节点不可选  
                            (selectNodeModel == "all")) {                                                           //全部节点可选
                            self.setSubmitValue(record.get('id'));
                            self.setValue(record.get('text'));
                        }
                    }
                    self.fireEvent("clickData", {dataId:record.get('id')});
                }
            }
        });
        return self.picker;
    },

    alignPicker: function () {
        var me = this,
            picker, isAbove, aboveSfx = '-above';
        if (this.isExpanded) {
            picker = me.getPicker();
            if (me.matchFieldWidth) {
                picker.setWidth(me.bodyEl.getWidth());
            }
            if (picker.isFloating()) {
                picker.alignTo(me.inputEl, "", me.pickerOffset); // ""->tl  
                isAbove = picker.el.getY() < me.inputEl.getY();
                me.bodyEl[isAbove ? 'addCls' : 'removeCls'](me.openCls + aboveSfx);
                picker.el[isAbove ? 'addCls' : 'removeCls'](picker.baseCls + aboveSfx);
            }
        }
    }
});