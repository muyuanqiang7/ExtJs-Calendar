//字头下拉框
Ext.define('ux.CodeFixComboBox', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'view-ux-codefixcombobox',
    config:{fixstore:'',codefixstore:''},
    width: 180,
    queryMode: 'local',
    displayField: 'name',
    valueField: 'abbr',
    typeAhead: false,
    hideTrigger: true,
    triggerAction:"all",
    selectOnFocus : true,
    enableKeyEvents:true,
    maxLength:50,
    listeners:{
        specialkey : function(cmbo, e) {
            if (e.getKey() == Ext.EventObject.ENTER) {
                if(!cmbo.isValid())return false;
                var fixStore = cmbo.config.fixstore;
                if(!fixStore) cmbo.fireEvent('onSelected',this);//激发自定义事件
                if(fixStore && fixStore.getCount()>0){
                    cmbo.blur();
                    var filedValue = cmbo.getValue();
                    if(filedValue == null || !cmbo.isValid())return false;
                    filedValue = filedValue.replace(/\s+/g, "");
                    //去掉汉字
                    var regx=/[\u4E00-\u9FA5]/g;
                    filedValue = filedValue.replace(regx,'');
                    for (var i = 0; i < fixStore.getCount(); i++) {
                        var numLen = parseInt(fixStore.getAt(i).get('CODEFIXLEN'));
                        if (filedValue.length >= numLen) {
                            filedValue = filedValue.substr(0, numLen);
                        } else {
                            var subLen = numLen - filedValue.length;
                            var subStrZero = '';
                            for (var j = 0; j < subLen; j++) {
                                subStrZero += '0';
                            }
                            filedValue = subStrZero + filedValue;
                        }
                        var value = fixStore.getAt(i).get('HEADFILL') + filedValue;
                        cmbo.store.insert(i, [{'abbr':value,'name':value}]);
                    }
                    cmbo.onTriggerClick();
                }else{
                    cmbo.fireEvent('onSelected',this);//激发自定义事件
                }
                return false;
            }
        },
        select:function(combo,record,eOpts){
            combo.store.removeAll();
            combo.fireEvent('onSelected',this);//激发自定义事件
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
        me.store =  me._codeFixStore();
        me.callParent(arguments);
    },
    //获取字头伪数据
    _codeFixStore:function(){
       return Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : []
        });
    },
    //填充字头数据源
    _fillStore:function(ruleType,regex){
        var me = this;
        if(ruleType){
            me.config.fixstore = Ext.create('Funi.data.Store', {
                //autoLoad:true,
                fields: ['HEADFILL','CODEFIXLEN'],
                //url:Funi.core.Context.path("hr",'/regi/getCodeFixList'),
                params:{ruleType:ruleType}
            });
        }else{
            if(me.store) me.store.removeAll();
            if(me.config.fixstore)me.config.fixstore.removeAll();
        }
        if(regex!=''){
            me.regex = regex;
        }else{
            me.regex = '';
        }
    }
});