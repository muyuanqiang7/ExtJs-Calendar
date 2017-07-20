//地役权登记信息
Ext.define('app.platform.archives.view.itemPages.LandContractUseRegisterForm', {
    extend: 'Ext.panel.Panel',
    xtype: 'easementregisterform',
    alias: 'easementregisterform',
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
        isReadOnly: false,//是否只读，用于新增、修改、查看的界面控制
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
                itemId: 'landOwnershipForm',
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
                    value: '<span style="color:black;font-size:16px;height:100px;"><b>地役权登记信息</b></span>'
                }, {
                    xtype: 'panel',
                    colspan: 5,
                    margin: '0 0 0 0',
                    border: false,
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'displayfield',
                            value: '不动产单元号<span style="color:red">*</span>:',
                        },
                        {
                            xtype: 'nobordertextfield',
                            name: 'zddm',
                            allowBlank: me.isReadOnly,
                            disabled: me.isReadOnly,
                            readOnly: me.isReadOnly,
                            width: 340,
                        }, {
                            xtype: 'displayfield',
                            value: '需役地坐落<span style="color:red">*</span>:',
                        },
                        {
                            xtype: 'nobordertextfield',
                            name: 'zddm',
                            allowBlank: me.isReadOnly,
                            disabled: me.isReadOnly,
                            readOnly: me.isReadOnly,
                            width: 300

                        }]
                }, {
                    xtype: 'displayfield',
                    width: 120,
                    value: '业务号<span style="color:red">*</span>',
                    colspan: 2,
                }, {
                    xtype: 'nobordertextfield',
                    name: 'ywh',
                    colspan: 3,
                    allowBlank: me.isReadOnly,
                    disabled: me.isReadOnly,
                    readOnly: me.isReadOnly,
                }, {
                    xtype: 'displayfield',
                    value: '地役权人<br>（需役地权利人）',
                    colspan: 2,
                    width: 120,
                }, {
                    xtype: 'nobordertextfield',
                    name: 'ywh',
                    colspan: 3,
                    disabled: me.isReadOnly,
                    readOnly: me.isReadOnly,
                }, {
                    xtype: 'displayfield',
                    value: '证件种类',
                    colspan: 2,
                    width: 120,
                }, {
                    xtype: 'nobordertextfield',
                    name: 'ywh',
                    colspan: 3,
                    disabled: me.isReadOnly,
                    readOnly: me.isReadOnly,
                }, {
                    xtype: 'displayfield',
                    value: '证件号',
                    width: 120,
                    colspan: 2,
                }, {
                    xtype: 'nobordertextfield',
                    readOnly: me.isReadOnly,
                    name: 'zjh',
                    width: '100%',
                    colspan: 3
                }, {
                    xtype: 'displayfield',
                    value: '供役地权利人',
                    width: 120,
                    colspan: 2,
                }, {
                    xtype: 'nobordertextfield',
                    readOnly: me.isReadOnly,
                    name: 'zjh',
                    width: '100%',
                    colspan: 3
                }, {
                    xtype: 'displayfield',
                    value: '证件种类',
                    colspan: 2,
                    width: 120,
                }, {
                    xtype: 'nobordertextfield',
                    name: 'ywh',
                    colspan: 3,
                    disabled: me.isReadOnly,
                    readOnly: me.isReadOnly,
                }, {
                    xtype: 'displayfield',
                    value: '证件号',
                    width: 120,
                    colspan: 2,
                }, {
                    xtype: 'nobordertextfield',
                    readOnly: me.isReadOnly,
                    name: 'zjh',
                    width: '100%',
                    colspan: 3
                }, {
                    xtype: 'displayfield',
                    value: '登记类型',
                    width: 120,
                    colspan: 2,
                }, {
                    xtype: 'nobordertextfield',
                    readOnly: me.isReadOnly,
                    name: 'zjh',
                    width: '100%',
                    colspan: 3
                }, {
                    xtype: 'displayfield',
                    value: '登记原因',
                    width: 120,
                    colspan: 2,
                }, {
                    xtype: 'nobordertextfield',
                    readOnly: me.isReadOnly,
                    name: 'zjh',
                    width: '100%',
                    colspan: 3
                }, {
                    xtype: 'displayfield',
                    value: '地役权内容',
                    width: 120,
                    colspan: 2,
                }, {
                    xtype: 'nobordertextfield',
                    readOnly: me.isReadOnly,
                    name: 'zjh',
                    width: '100%',
                    colspan: 3
                }, {
                    xtype: 'displayfield',
                    value: '地役权利用期限',
                    width: 120,
                    colspan: 2,
                }, {
                    xtype: 'panel',
                    colspan: 3,
                    margin: '0 0 0 0',
                    border: false,
                    layout: {
                        type: 'hbox',
                        pack: 'end',
                        align: 'stretch'
                    },
                    items: [{
                        xtype: 'nobordertextfield',
                        readOnly: me.isReadOnly,
                        name: 'zjh',
                        width: '40%',
                    }, {
                        xtype: 'displayfield',
                        readOnly: true,
                        border: false,
                        value: '起',
                        width: 40,
                    }, {
                        xtype: 'nobordertextfield',
                        readOnly: me.isReadOnly,
                        name: 'zjh',
                        width: '40%',
                    }, {
                        xtype: 'displayfield',
                        readOnly: true,
                        border: false,
                        value: '止',
                        width: 40,
                    }]
                }, {
                    xtype: 'displayfield',
                    value: '不动产权证书号<span style="color:red">*</span>',
                    width: 120,
                    colspan: 2,
                }, {
                    xtype: 'nobordertextfield',
                    name: 'ywh',
                    colspan: 3,
                    allowBlank: me.isReadOnly,
                    disabled: me.isReadOnly,
                    readOnly: me.isReadOnly,
                }, {
                    xtype: 'displayfield',
                    value: '登记时间<span style="color:red">*</span>',
                    width: 120,
                    colspan: 2,
                }, {
                    xtype: 'nobordertextfield',
                    name: 'ywh',
                    colspan: 3,
                    allowBlank: me.isReadOnly,
                    disabled: me.isReadOnly,
                    readOnly: me.isReadOnly,
                }, {
                    xtype: 'displayfield',
                    value: '登簿人<span style="color:red">*</span>',
                    width: 120,
                    colspan: 2,
                }, {
                    xtype: 'nobordertextfield',
                    name: 'ywh',
                    colspan: 3,
                    allowBlank: me.isReadOnly,
                    disabled: me.isReadOnly,
                    readOnly: me.isReadOnly,
                }, {
                    xtype: 'displayfield',

                    value: '附记',
                    width: 120,
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
                    colspan: 4,
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