/**
 * 不带边框输出框
 */
Ext.define('ux.NoBorderTextField', {
    extend : 'Ext.form.field.Text',
    xtype:'nobordertextfield',
    triggerWrapCls:'kb-textfield-not-border-trigger-wrap',
    inputWrapCls:'kb-textfield-not-border-wrap',
    fieldStyle:'background:none',
    // 类初始化时执行
    initComponent : function() {
        this.callParent(arguments); // 调用你模块的initComponent函数
    }
});
