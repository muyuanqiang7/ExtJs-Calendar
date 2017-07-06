//GUID
function newGuid() {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
            guid += "-";
    }
    return guid;
}

//Toopitp
Ext.tip.QuickTipManager.init();


//Model
Ext.define('MyTreeModel', {
    extend: 'Ext.data.Model',
    fields: ['text', 'id', 'leaf', 'caitNo']
});

//Store
Ext.define("MyTreeStore", {
    extend: "Ext.data.TreeStore",
    model: 'MyTreeModel',
    proxy: {
        type: 'ajax',
        api: {
            read: '/Tools/106.ashx?method=getCatalogItem',
        },
        writer: {
            type: 'json',
            allowSingle: false,
            encode: true,
            root: 'records'
        }
    },
    root: {
        id: -1,
        expanded: true,
        text: cataId,
    },
    autoLoad: true
});

var MyTreeStore = Ext.create("MyTreeStore");

Ext.define("MyTreePanel", {
    extend: 'Ext.tree.Panel',
    width: 250,
    height: 400,
    store: MyTreeStore,
    hideHeaders: true,
    rootVisible: true,
    viewConfig: {
        plugins: {
            ptype: 'treeviewdragdrop'
        },
        listeners: {
            drop: function (node, data, dropRec, dropPosition) {
                store.sync();
            }
        }
    },

    initComponent: function () {
        var me = this;
        //可编辑
        me.plugins = [me.cellEditingPlugin = Ext.create('Ext.grid.plugin.CellEditing')];
        //定义列
        me.columns = [{
            xtype: 'treecolumn',
            dataIndex: 'text',
            flex: 1,
            editor: {
                xtype: 'textfield',
                selectOnFocus: true,
                validator: function (value) {
                    value = Ext.String.trim(value);
                    return value.length < 1 ? this.blankText : true;
                }
            }
        }, {
            xtype: 'actioncolumn',
            width: 24,
            icon: '/ExtUI/Image/a_delete.gif',
            iconCls: 'x-hidden',
            tooltip: '删除',
            handler: Ext.bind(me.handleDeleteClick, me)
        }];

        //定义菜单
        Ext.define('SimpleTasks.view.lists.ContextMenu', {
            extend: 'Ext.menu.Menu',
            xtype: 'listsContextMenu',
            items: [
                {
                    text: '兄弟节点',
                    iconCls: 'a_add',
                    id: 'new-list-item',
                    handler: me.handleNewListClick,
                    scope: me
                },
                {
                    text: '孩子节点',
                    iconCls: 'a_add',
                    id: 'new-folder-item',
                    handler: me.handleNewFolderClick,
                    scope: me
                },
                {
                    text: '删除',
                    iconCls: 'a_delete',
                    id: 'delete-folder-item',
                },
                {
                    text: '刷新',
                    iconCls: 'a_refresh',
                    id: 'refresh-folder-item',
                    handler: function () {
                        MyTreeStore.load({params: grid.getView().getSelectionModel().getSelection()[0].data});
                    }
                }
            ]

        });

        //定义底部tbar
        me.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: [{
                iconCls: 'a_add',
                tooltip: '兄弟节点',
                handler: me.handleNewListClick,
                scope: me
            }, {
                iconCls: 'a_add',
                tooltip: '孩子节点',
                handler: me.handleNewFolderClick,
                scope: me
            },
                {
                    iconCls: 'a_delete',
                    id: 'delete-folder-btn',
                    tooltip: '删除',
                    scope: me
                },
                {
                    iconCls: 'a_refresh',
                    id: 'refesh-folder-btn',
                    tooltip: '刷新',
                    handler: function () {
                        MyTreeStore.load({params: grid.getView().getSelectionModel().getSelection()[0].data});
                    }
                }
            ]
        }];

        me.contextMenu = Ext.create("SimpleTasks.view.lists.ContextMenu");

        me.callParent();
        me.on("itemmouseenter", me.showActions);
        me.on("itemmouseleave", me.hideActions);
        me.on("edit", me.updateNode);
        me.on("afterrender", me.handleAfterListTreeRender);
        me.on("beforeedit", me.handleBeforeEdit, me);
        me.on("canceledit", me.handleCancelEdit);
        me.on("itemcontextmenu", me.showContextMenu, me);

    },

    //刷新树
    refreshView: function () {
        //refresh the data in the view.
        //This will trigger the column renderers to run,
        this.getView().refresh();
    },

    //显示actioncolumn
    showActions: function (view, list, node, rowIndex, e) {
        var icons = Ext.DomQuery.select('.x-action-col-icon', node);
        if (view.getRecord(node).get('id') != "-1") {
            Ext.each(icons, function (icon) {
                Ext.get(icon).removeCls('x-hidden');
            });
        }
    },

    //隐藏actioncolumn
    hideActions: function (view, list, node, rowIndex, e) {
        var icons = Ext.DomQuery.select('.x-action-col-icon', node);
        Ext.each(icons, function (icon) {
            Ext.get(icon).addCls('x-hidden');
        });
    },

    //Handles a click on a delete icon
    handleDeleteClick: function (gridView, rowIndex, colIndex, column, e, record) {
        var thisNodes = this;
        Ext.Ajax.request({
            url: "/Tools/106.ashx?method=deleteTreeNode&cataId=" + cataId,
            params: record.data,
            callback: function (options, success, response) {
                if (success) {
                    var responseJson = Ext.JSON.decode(response.responseText)[0];
                    if (responseJson.status == "true") {
                        //这个model区别于普通的model
                        //在定义store的时候并没有定义fields或model属性,该model由treeStore自动创建
                        //该model包含树展示所需要的数据结构,具备parentNode,isLeaf,loaded等属性
                        var model = gridView.getRecord(gridView.findTargetByEvent(e));
                        thisNodes.deleteNode(model);
                        Ext.Msg.alert("提示", responseJson.msg);
                    }
                    else {
                        Ext.Msg.alert("提示", responseJson.msg);
                    }
                }
                else {
                    Ext.Msg.alert("提示", "请重新操作！");
                }
            }
        });

    },


    //删除节点
    deleteNode: function (nodel) {
        nodel.parentNode.removeChild(nodel);
        //与服务器端同步
        MyTreeStore.sync();
    },

    //更新节点
    updateNode: function (editor, e, node) {
        var me = this;
//                //与服务器端同步
        //  MyTreeStore.sync();

        if (e.record.data.id.length > 8) {

            //插入
            Ext.Ajax.request({
                url: "/Tools/106.ashx?method=createTreeNode&cataId=" + cataId,
                params: e.record.data,
                callback: function (options, success, response) {
                    if (success) {
                        var responJson = Ext.JSON.decode(response.responseText)[0];
                        if (responJson.status == "false") {
                            Ext.Msg.alert("提示", responJson.msg);
                        }
                        else {
                            MyTreeStore.load({params: grid.getView().getSelectionModel().getSelection()[0].data});
                        }
                    }
                    else {
                        Ext.Msg.alert("提示", "系统繁忙");
                    }
                }
            });
        }
        else {
            //更新
            Ext.Ajax.request({
                url: "/Tools/106.ashx?method=updateTreeNode&cataId=" + cataId,
                params: e.record.data,
                callback: function (options, success, response) {
                    if (success) {
                        var responJson = Ext.JSON.decode(response.responseText)[0];
                        if (responJson.status == "false") {
                            Ext.Msg.alert("提示", responJson.msg);
                        }
                    }
                    else {
                        Ext.Msg.alert("提示", "系统繁忙");
                    }
                }
            });
        }
    },


    //树加载完毕后设置默认选中第一个
    handleAfterListTreeRender: function (tree) {
        tree.getSelectionModel().select(0);
    },

    //编辑前判断跟节点不允许编辑
    handleBeforeEdit: function (editingPlugin, e) {
        return e.record.get('id') !== -1;
    },

    //取消编辑事件
    handleCancelEdit: function (editor, e) {
        var list = e.record,
                parent = list.parentNode;
        parent.removeChild(list);
        this.getListTree().getSelectionModel().select([parent]);
    },

    //添加叶子节点
    handleNewListClick: function (component, e) {
        this.addNode(true);
    },

    //添加跟节点
    handleNewFolderClick: function (component, e) {
        this.addNode();
    },

    //添加节点
    addNode: function (leaf) {
        var me = this;
        var listTree = me;
        cellEditingPlugin = listTree.cellEditingPlugin,
                selectionModel = listTree.getSelectionModel(),
                selectedList = selectionModel.getSelection()[0],

                parentList = leaf ? selectedList.parentNode : selectedList,
                newList = Ext.create('MyTreeModel', {
                    id: newGuid(),
                    text: 'New List',
                    leaf: true,
                    loaded: true
                }),
                expandAndEdit = function () {
                    if (parentList.isExpanded()) {
                        selectionModel.select(newList);
                        cellEditingPlugin.startEdit(newList, 0);
                    } else {
                        listTree.on('afteritemexpand', function startEdit(list) {
                            if (list === parentList) {
                                selectionModel.select(newList);
                                cellEditingPlugin.startEdit(newList, 0);
                                // remove the afterexpand event listener
                                listTree.un('afteritemexpand', startEdit);
                            }
                        });
                        parentList.expand();
                    }
                };
        //判断是否是子节点
        if (selectedList.isLeaf()) {
            if (!leaf) //判断是添加子节点还是兄弟节点
            {
                MyTreeStore.getNodeById(selectedList.data.id).set('leaf', false);
            }
        }
        parentList.appendChild(newList);
        if (listTree.getView().isVisible(true)) {
            expandAndEdit();
        } else {
            listTree.on('expand', function onExpand() {
                expandAndEdit();
                listTree.un('expand', onExpand);
            });
            listTree.expand();
        }
    },

    //添加右键菜单
    showContextMenu: function (view, list, node, rowIndex, e) {
        this.contextMenu.showAt(e.getX(), e.getY());
        e.preventDefault();
    }
});

//编辑树Window
var EditTreeWindow = Ext.create("Ext.window.Window", {
    title: '编辑树',
    iconCls: 'a_edit',
    closeAction: 'hide',        //窗口关闭的方式：hide/close
    resizable: false,
    closable: true,            //是否可以关闭
    modal: true,                //是否为模态窗口
    items: Ext.create("MyTreePanel")
});
/**
 * Created by muyuanqiang on 2017/7/6.
 */
