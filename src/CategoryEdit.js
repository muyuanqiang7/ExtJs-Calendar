/**
 * Created by 李骄 on 2017/5/15.
 */
Ext.define('app.platform.archives.view.lijiao.systemaintenance.fileCategoryManage.CategoryEdit', {
    extend: 'Ext.window.Window',
    xtype: 'fileCategoryManage-categoryEdit',
    width: 900,
    height: 600,
    maximizable: true,
    layout: 'fit',
    /**
     * 入口参数
     */
    config: {
        showNum: 0
    },
    requires: [
        'CategoryEditTabThree'
    ],

    // ====构造方法========================================================================
    constructor: function (config) {
        var me = this;
        config = config || {};
        Ext.applyIf(config, me.config);
        this.callParent(arguments);
    },
    // ====视图构建========================================================================
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            xtype: 'panel',
            items: [{
                xtype: 'tabpanel',
                id: 'tabpanel',
                buttonAlign: 'center',
                tabPosition: 'left',
                tabRotation: 0,
                tabBar: {
                    style: {writingMode: 'tb-rl'}
                },
                margins: '3 3 3 0',
                border: false,
                //activeTab: 0,
                defaults: {autoScroll: true},
                listeners: {
                    //tabchange: function (tabPanel, newCard, oldCard, eOpts) {
                    //    oldCard.setDisabled(true);
                    //    document.querySelector('#' + oldCard.tab.id).style.backgroundColor = '#f5f5f5';
                    //    document.querySelector('#' + oldCard.tab.id).querySelector('.x-tab-inner-default').style.color = '#000';
                    //    newCard.setDisabled(false);
                    //    document.querySelector('#' + newCard.tab.id).querySelector('.x-tab-inner-default').style.color = '#fff';
                    //    document.querySelector('#' + newCard.tab.id).style.backgroundColor = "#3892d3";
                    //},
                    //afterrender: function () {
                    //    this.getActiveTab().setDisabled(false);
                    //    document.querySelector('#' + this.getActiveTab().tab.id).querySelector('.x-tab-inner-default').style.color = '#fff';
                    //    document.querySelector('#' + this.getActiveTab().tab.id).style.backgroundColor = "#3892d3";
                    //
                    //}
                },
                items: [
                    {
                        index: 0,
                        xtype: 'fileCategoryManage-categoryEditTabThree',
                        id: 'categoryEditTabOne',
                        title: '基础信息',
                        //disabled: true
                    },
                    {
                        index: 1,
                        id: 'categoryEditTabTwo',
                        //disabled: true,
                        title: '档案基本录入',
                    }
                    ,
                    {
                        index: 2,
                        id: 'categoryEditTabThree',
                        //disabled: true,
                        title: '测试档案标签',
                    },
                    {
                        index: 3,
                        id: 'categoryEditTabFour',
                        title: '测试标签',
                        //disabled: true
                    }, {

                        index: 4,
                        title: '测试标签',
                        //disabled: true
                    }
                ],
                buttons: [
                    {
                        text: '上一步',
                        glyph: 0xf00c,
                        itemId: 'syb',
                        //disabled: true,
                        handler: function () {
                            me.showNum--;
                            me.items.items[0].setActiveTab(me.showNum);
                        }
                    },
                    {
                        text: '下一步',
                        glyph: 0xf00c,
                        itemId: 'xyb',
                        handler: function () {
                            me.showNum++;
                            me.items.items[0].setActiveTab(me.showNum);
                        }
                    },
                    {
                        text: '完成',
                        glyph: 0xf00c,
                        handler: function () {

                        }
                    }]
            }]
        });
        this.callParent(arguments);
    }
});