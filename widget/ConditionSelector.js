//条件搜索下拉框
Ext.define('ux.ConditionSelector', {
    extend: 'Ext.form.field.Text',
    xtype: 'view-ux-cscb',
    selectOnFocus : true,
    enableKeyEvents:true,
    emptyText:'回车选择查询类型',
    allowDecimals: false,
    listeners: {
        focus:function(cmbo){

        },
        specialkey: function (cmbo, event) {
            if (event.getKey() == Ext.EventObject.ENTER) {
                var c = this.contextMenu;
                c.focus(false,100);
                c.showAt(this.getX(),this.getY()+30);
            }
            return false;
        }
    },
    //====构造方法========================================================================
    constructor: function (config) {
        var me = this;
        config = config || {};
        Ext.applyIf(config, me.config);
        me.callParent(arguments);
    },
    // ====视图构建========================================================================
    initComponent: function () {
        var me = this;
        me.contextMenu = Ext.create("Ext.menu.Menu", {
            width:400,
            listeners:{
                click:function( menu, item, e, eOpts ){
                    me._menuItemClick(item);
                }
            }
        });
        me.callParent(arguments);
    },
    //查询条件点击事件
    _menuItemClick:function(item){
        var me = this;
        var value = me.getValue();
        var maxLength = item.gzcd;
        me.emptyText = item.text;
        me.blur();
        me.focus();
        if(value!=undefined){
            me.maxLength = maxLength;
            me.maxLengthText = "不能超过"+maxLength+"个字符";
            if(me.isValid()&&value.length>0){
                var param = {sqlId:item.condition,param:value};
                var result = Ext.appContext.invokeService("query/regiQuery", param);
                me.fireEvent('cscbSelect',result);//激发自定义事件
            }
        }
    },
    //根据类型加载查询条件
    _loadCondition:function(dylx){
        var me = this;
        var result = Ext.appContext.invokeService("queryCfg/findQueryCfgByType", {pzlx:'查询登记主体',dylx:dylx});
        me.contextMenu.removeAll();
        Ext.Array.forEach(result.result.list,function(item,index,bts){
            var menu = {};
            menu.text = item.cxmc;
            menu.glyph =  0xf044;
            menu.condition = item.gzys;
            menu.gzcd = item.gzcd;
            me.contextMenu.add(menu);
        });
    }

});