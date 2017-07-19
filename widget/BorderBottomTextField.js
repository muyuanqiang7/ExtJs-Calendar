/**
 * 下边框输出框
 */
Ext.define('ux.BorderBottomTextField', {
    extend : 'Ext.form.field.Text',
    xtype:'borderbottomtextfield',
    triggerWrapCls:'border-bottom-textfield',
    inputWrapCls:'border-bottom-textfield',
    fieldStyle:'background:none',
    // 类初始化时执行
    initComponent : function() {
        this.callParent(arguments); // 调用你模块的initComponent函数
    }
});
