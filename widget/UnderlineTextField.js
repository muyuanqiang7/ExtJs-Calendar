/**
 * 不带边框输出框
 */
Ext.define('ux.UnderlineTextField', {
    extend: 'Ext.form.field.Text',
    xtype: 'underlinetextfield',
    triggerWrapCls: 'kb-textfield-not-border-trigger-wrap',
    inputWrapCls: 'kb-textfield-not-border-wrap',
    fieldStyle: 'background:none;border-top:0px solid;border-left:0px solid;border-right:0px solid;border-bottom: 1px solid;',
    // 类初始化时执行
    initComponent: function () {
        this.callParent(arguments); // 调用你模块的initComponent函数
    }
});
