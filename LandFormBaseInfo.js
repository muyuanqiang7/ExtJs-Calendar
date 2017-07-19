//登记申请表
Ext.define('app.platform.archives.view.itemPages.LandBaseInfoForm', {
    extend: 'Ext.panel.Panel',
    xtype: 'landformbaseinfo',
    alias: 'landformbaseinfo',
    autoScroll: true,
    margin: '0 0 0 0',
    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'center'
    },
    overflowY: 'auto',
    uses: ['ux.NoBorderTextField',
        'ux.UnderlineTextField'],
    // requires: ['app.platform.estate.view.register.regi.applicationform.ApplicationPersonForm',
    //     'app.platform.estate.view.register.regi.applicationform.ApplicationEstateForm'],
    config: {
        isReadOnly: true,//是否只读，用于新增、修改、查看的界面控制
        operation: 'S',//S查询 I新增 U修改
        selectedStore: '',//选中的房源
        regiType: '',//登记类型
        persons: '',//人员列表
        documentsStore: ''//要件列表
    },
    listeners: {
        //加载完毕后启动初始化方法
        afterrender: function (_this, ops) {
            // this.initDatas();
        }
    },
    initComponent: function () {
        var me = this;
        //要件操作项
        var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            pluginId: 'cellEditing',
            clicksToEdit: 2,   //双击进行修改  1-单击   2-双击    0-可取消双击/单击事件
            listeners: {
                beforeedit: function (eOpts, iEventobj) {
                }
            }
        });

        Ext.apply(this, {
            items: [{
                //第二部分 申请登记事由
                xtype: 'form',
                itemId: 'landBaseInfoForm',
                width: '100%',
                margin: '10 60 0 60',
                defaults: {
                    xtype: 'label'
                },
                layout: {
                    type: 'table',
                    columns: 5,
                    tableAttrs: {
                        border: 1,
                        cellpadding: 2,
                        width: '100%',
                        align: 'left',
                        style: "border:1px solid gray;border-collapse:collapse;margin:0 auto;text-align:center;"
                    }
                },
                items: [{
                    xtype: 'displayfield',
                    colspan: 5,
                    style: {
                        margin: 'auto auto'
                    },
                    value: '<span style="color:black;font-size:16px;height:100px;"><b>宗地基本信息</b></span>'
                }, {
                    xtype: 'panel',
                    colspan: 5,
                    margin: '0 0 0 0',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'displayfield',
                            value: '宗地代码<span style="color:red">*</span>:',
                        },
                        {
                            xtype: 'nobordertextfield',
                            allowBlank: me.isReadOnly,
                            disabled: me.isReadOnly,
                            readOnly: me.isReadOnly,
                            width: 340
                        }, {
                            xtype: 'checkboxgroup',
                            defaults: {
                                name: 'chk_group',
                                listeners: {
                                    scope: this,
                                    change: function (chkbox) {
                                        if (chkbox.checked) {
                                            me.resetBoxes(chkbox.ownerCt, chkbox.inputValue);
                                        }
                                    }
                                }
                            },
                            layout: {
                                type: 'hbox',
                                // pack: 'end',
                                // align: 'stretch'
                            },
                            items: [{
                                xtype: 'displayfield',
                                value: '单位:',
                            }, {
                                boxLabel: '平方米',
                                // margin: '0 10 0 0',
                                checked: false,
                                name: 'sqzsbs',
                                inputValue: 1
                            }, {
                                boxLabel: '公顷',
                                // margin: '0 0 0 5',
                                name: 'sqzsbs',
                                inputValue: 2
                            }, {
                                boxLabel: '亩',
                                // margin: '0 0 0 5',
                                name: 'sqzsbs',
                                inputValue: 3
                            }, {
                                xtype: 'displayfield',
                                value: '、万元',
                            }]
                        }]
                }, {
                    xtype: 'displayfield',
                    value: '不动产类型<span style="color:red">*</span>',
                    colspan: 1,
                }, {
                    xtype: 'panel',
                    colspan: 4,
                    layout: {
                        type: 'hbox',
                        pack: 'center',
                        align: 'stretch'
                    },
                    items: [{
                        xtype: 'checkboxgroup',
                        defaults: {
                            name: 'chk_group',
                            listeners: {
                                scope: this,
                                change: function (chkbox) {
                                    if (chkbox.checked) {
                                        me.resetBoxes(chkbox.ownerCt, chkbox.inputValue);
                                    }
                                }
                            }
                        },
                        layout: {
                            type: 'hbox',
                            pack: 'center',
                            align: 'stretch'
                        },
                        items: [{
                            boxLabel: '土地',
                            // margin: '0 10 0 0',
                            labelWidth: 20,
                            name: 'sqzsbs',
                            inputValue: 1
                        }, {
                            boxLabel: '房屋等建筑物',
                            labelWidth: 20,
                            // margin: '0 0 0 5',
                            name: 'sqzsbs',
                            inputValue: 2
                        }, {
                            boxLabel: '构筑物',
                            labelWidth: 20,
                            margin: '0 0 0 5',
                            name: 'sqzsbs',
                            inputValue: 3
                        }, {
                            boxLabel: '森林、林木',
                            labelWidth: 20,
                            margin: '0 0 0 5',
                            name: 'sqzsbs',
                            inputValue: 4
                        }, {
                            boxLabel: '其他',
                            labelWidth: 20,
                            margin: '0 0 0 5',
                            name: 'sqzsbs',
                            inputValue: 5
                        }]
                    }]
                }, {
                    xtype: 'displayfield',
                    value: '坐落',
                    colspan: 1,
                }, {
                    xtype: 'nobordertextfield',
                    readOnly: me.isReadOnly,
                    width: '100%',
                    colspan: 4
                }, {
                    xtype: 'displayfield',
                    value: '土地标况',
                    width: 80,
                    rowspan: 5,
                }, {
                    xtype: 'displayfield',
                    value: '宗地面积',
                    width: 80,
                    colspan: 1,
                }, {
                    xtype: 'nobordertextfield',
                    readOnly: me.isReadOnly,
                    width: '100%',
                    colspan: 1
                }, {
                    xtype: 'displayfield',
                    value: '用途',
                    width: 80,
                    colspan: 1,
                }, {
                    xtype: 'nobordertextfield',
                    readOnly: me.isReadOnly,
                    width: '100%',
                    colspan: 1
                }, {
                    xtype: 'displayfield',
                    value: '等级',
                    width: 80,
                    colspan: 1,
                }, {
                    xtype: 'nobordertextfield',
                    readOnly: me.isReadOnly,
                    width: '100%',
                    colspan: 1
                }, {
                    xtype: 'displayfield',
                    value: '价格',
                    width: 80,
                    colspan: 1,
                }, {
                    xtype: 'nobordertextfield',
                    readOnly: me.isReadOnly,
                    width: '100%',
                    colspan: 1
                }, {
                    xtype: 'displayfield',
                    value: '权利类型',
                    width: 80,
                    colspan: 1,
                }, {
                    xtype: 'nobordertextfield',
                    readOnly: me.isReadOnly,
                    width: '100%',
                    colspan: 1
                }, {
                    xtype: 'displayfield',
                    value: '权利性质',
                    width: 80,
                    colspan: 1,
                }, {
                    xtype: 'nobordertextfield',
                    readOnly: me.isReadOnly,
                    width: '100%',
                    colspan: 1
                }, {
                    xtype: 'displayfield',
                    value: '权利设定方式',
                    width: 80,
                    colspan: 1,
                }, {
                    xtype: 'nobordertextfield',
                    readOnly: me.isReadOnly,
                    width: '100%',
                    colspan: 1
                }, {
                    xtype: 'displayfield',
                    value: '容积率',
                    width: 80,
                    colspan: 1,
                }, {
                    xtype: 'nobordertextfield',
                    readOnly: me.isReadOnly,
                    width: '100%',
                    colspan: 1
                }, {
                    xtype: 'displayfield',
                    value: '建筑密度',
                    width: 80,
                    colspan: 1,
                }, {
                    xtype: 'nobordertextfield',
                    readOnly: me.isReadOnly,
                    width: '100%',
                    colspan: 1
                }, {
                    xtype: 'displayfield',
                    value: '建筑限高',
                    width: 80,
                    colspan: 1,
                }, {
                    xtype: 'nobordertextfield',
                    readOnly: me.isReadOnly,
                    width: '100%',
                    colspan: 1
                }, {
                    xtype: 'displayfield',
                    colspan: 5,
                    style: {
                        margin: 'auto auto'
                    },
                    value: '空间坐标、位置说明或四至描述'
                }, {
                    xtype: 'textareafield',
                    readOnly: me.isReadOnly,
                    name: 'bz',
                    triggerWrapCls: 'kb-textfield-not-border-trigger-wrap',
                    inputWrapCls: 'kb-textfield-not-border-wrap',
                    fieldStyle: 'background:none',
                    labelWidth: 0,
                    width: '100%',
                    colspan: 5,
                }, {
                    xtype: 'displayfield',
                    value: '登记时间<span style="color:red">*</span>',
                    width: 80,
                    colspan: 1,
                }, {
                    xtype: 'nobordertextfield',
                    allowBlank: me.isReadOnly,
                    readOnly: me.isReadOnly,
                    width: '100%',
                    colspan: 2
                }, {
                    xtype: 'displayfield',
                    value: '登簿人<span style="color:red">*</span>',
                    width: 80,
                    colspan: 1,
                }, {
                    xtype: 'nobordertextfield',
                    allowBlank: me.isReadOnly,
                    readOnly: me.isReadOnly,
                    width: '100%',
                    colspan: 1
                }, {
                    xtype: 'displayfield',
                    value: '附记',
                    width: 80,
                    rowspan: 1,
                }, {
                    xtype: 'textareafield',
                    name: 'bz',
                    readOnly: me.isReadOnly,
                    triggerWrapCls: 'kb-textfield-not-border-trigger-wrap',
                    inputWrapCls: 'kb-textfield-not-border-wrap',
                    fieldStyle: 'background:none',
                    labelWidth: 0,
                    width: '100%',
                    colspan: 5,
                }, {
                    xtype: 'displayfield',
                    value: '变化情况',
                    width: 80,
                    rowspan: 2
                }, {
                    xtype: 'displayfield',
                    value: '变化原因<span style="color:red">*</span>',
                    width: 120,
                    // colspan: 1,
                }, {
                    xtype: 'displayfield',
                    value: '变化内容<span style="color:red">*</span>',
                    width: 120,
                    // colspan: 1,
                }, {
                    xtype: 'displayfield',
                    value: '登记时间<span style="color:red">*</span>',
                    width: 80,
                    // colspan: 1,
                }, {
                    xtype: 'displayfield',
                    value: '登簿人<span style="color:red">*</span>',
                    width: 80,
                    // colspan: 1,
                }, {
                    xtype: 'nobordertextfield',
                    allowBlank: me.isReadOnly,
                    readOnly: me.isReadOnly,
                    width: '100%',
                    // colspan: 1
                }, {
                    xtype: 'nobordertextfield',
                    allowBlank: me.isReadOnly,
                    readOnly: me.isReadOnly,
                    width: '100%',
                    // colspan: 1
                }, {
                    xtype: 'nobordertextfield',
                    allowBlank: me.isReadOnly,
                    readOnly: me.isReadOnly,
                    width: '100%',
                    // colspan: 1
                }, {
                    xtype: 'nobordertextfield',
                    allowBlank: me.isReadOnly,
                    readOnly: me.isReadOnly,
                    width: '100%',
                    // colspan: 1
                }
                ]
            }
            ]
        })
        ;
        //创建菜单
        this.callParent(arguments);
    },
    //外部参数调用
    setInitParam: function () {

    },
    //初始化数据
    initDatas: function () {
        var me = this;
        //新建
        if (me.config.operation == "I") {
            //第一部分表单赋值
            var titleForm = me.down("#titleForm");
            var aWeek = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            var nowTime = ''
                    + Ext.Date.format(new Date(), 'Y-m-d') + ' '
                    + aWeek[new Date().getDay()];
            var titleRecord = Ext.create('Ext.data.Record', {
                sjrmc: Ext.appContext.userInfo.name,
                slrq: nowTime
            });
            titleForm.loadRecord(titleRecord);

            //第二部分表单赋值
            //设置登记大类、登记小类
            var regiType = me.config.regiType;
            var regiTypeForm = me.down("#regiTypeForm");
            var regiTypeRecord = Ext.create('Ext.data.Record', {
                djdlmc: regiType.djdlmc, djxlmc: regiType.djxlmc
            });
            regiTypeForm.loadRecord(regiTypeRecord);

            //给要件列表赋值
            var regiFileGrid = me.down("#regiFileGrid");
            var documentsStore = me.config.documentsStore;
            regiFileGrid.setStore(documentsStore);
            documentsStore.load();
            //第五部分
            var otherForm = me.down("#otherForm");
            var otherRecord = Ext.create('Ext.data.Record', {
                djyymc: regiType.djyymc
            });
            otherForm.loadRecord(otherRecord);
        }
        //修改或者查询
        else if (me.config.operation == "U" || me.config.operation == "S") {
            var regi = me.regi;
            //第一部分表单赋值
            var titleForm = me.down("#titleForm");
            var titleRecord = Ext.create('Ext.data.Record', {
                ywh: regi.ywh, sjrmc: regi.sjrmc,
                slrq: regi.sjsj
            });
            titleForm.loadRecord(titleRecord);

            //第二部分表单赋值
            //设置登记大类、登记小类
            var regiType = me.config.regiType;
            var regiTypeForm = me.down("#regiTypeForm");
            var regiTypeRecord = Ext.create('Ext.data.Record', {
                djdlmc: regiType.djdlmc, djxlmc: regiType.djxlmc
            });
            regiTypeForm.loadRecord(regiTypeRecord);


            //给要件列表赋值
            var regiFileGrid = me.down("#regiFileGrid");
            var documentsStore = me.config.documentsStore;
            regiFileGrid.setStore(documentsStore);
            documentsStore.load();

            //第五部分
            var otherForm = me.down("#otherForm");
            var otherRecord = Ext.create('Ext.data.Record', {
                djyymc: regiType.djyymc
            });
            otherForm.loadRecord(otherRecord);
        }

    },
    resetBoxes: function (group, val) {
        var selecter = 'checkbox[inputValue!=' + val + ']';
        var boxes = group.query(selecter);
        Ext.each(boxes, function (box) {
            box.reset();
        });
    }
});