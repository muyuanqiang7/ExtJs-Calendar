/**
 * 连接按钮
 */
Ext.define('ux.LinkButton', {
    extend: 'Ext.Component',
    xtype: 'view-ux-linkbutton',
    requires: [ ],

    // ====入口参数定义===================================================================
    /**
     * 入口参数
     */
    config: {
        /**
         * {String} 按钮文本
         */
        text: '',
        /**
         * {String} 链接样式
         */
        linkStyle: '',
        /**
         * {String} 链接CSS类
         */
        linkCls: '',
        /**
         * {function(source,opts)} 链接事件方法
         */
        handler: null,
        /**
         * {function(text,source)} 对呈现前的值进行处理
         */
        renderer:null
    },

    // ====事件定义========================================================================
    /**
     * 链接按钮单击事件
     */
    onHandlerEvent: function () {
        var me = this;
        me.fireEvent('handler', me);
    },

    // ====基类属性重写、属性定义==========================================================
    defaultBindProperty: 'text',
    autoEl: 'span',
    maskOnDisable: false,

    // ====构造方法========================================================================
    constructor: function (config) {
        var me = this;
        config = config || {};
        Ext.applyIf(config, me.config);
        me.callParent(arguments);
    },

    // ====视图构建========================================================================
    initComponent: function () {
        var me = this;

        if (typeof me.handler === 'function') {
            me.on('handler', me.handler, me.scope || me);
        }

        if (!me.linkStyle) {
            me.linkStyle = '';
        }

        me.callParent(arguments);
    },


    //====方法定义=======================================================================
    getElConfig: function () {
        var me = this;
        me.displayText = me.text;
        if (typeof me.renderer === 'function') {
            me.displayText = me.renderer.call(me.scope || me, me.text, me);
        }
        me.html = '<a href="javascript:;" style="' + me.linkStyle
            + '" onclick="javascript:Ext.getCmp(\'' + me.getId()
            + '\').onHandlerEvent();">' + me.displayText + '</a>';
        return Ext.apply(me.callParent(), {
            htmlFor: me.forId || ''
        });
    },
    setText: function (text, encode) {
        var me = this;
        me.text = text;
        me.displayText = me.text;
        if (typeof me.renderer === 'function') {
            me.displayText = me.renderer.call(me.scope || me, me.text, me);
        }
        if (me.rendered) {
            me.el.dom.innerHTML = '<a href="javascript:;" style="' + me.linkStyle
                + '" onclick="javascript:Ext.getCmp(\'' + me.getId()
                + '\').onHandlerEvent();">' + me.displayText + '</a>';
            me.updateLayout();
        }
        return me;
    }


});