Ext.namespace("Ext.ux.form");
Ext.ux.form.CheckboxCombo = Ext.extend(Ext.form.TriggerField, {
    defaultAutoCreate: {
        tag: "input",
        type: "text",
        size: "24",
        autocomplete: "off"
    },
    listClass: "",
    listEmptyText: "",
    triggerClass: "x-form-arrow-trigger",
    shadow: "sides",
    listAlign: "tl-bl?",
    maxHeight: 300,
    minHeight: 90,
    selectOnFocus: false,
    editable: false,
    loadingText: "Loading...",
    mode: "remote",
    minListWidth: 70,
    lazyInit: true,
    submitValue: undefined,
    initComponent: function () {
        Ext.ux.form.CheckboxCombo.superclass.initComponent.call(this);
        this.addEvents("expand", "collapse", "change");
        if (this.store) {
            this.store = Ext.StoreMgr.lookup(this.store);
            if (this.store.autoCreated) {
                this.displayField = this.valueField = "field1";
                if (!this.store.expandData) {
                    this.displayField = "field2"
                }
                this.mode = "local"
            }
        }
        if (!this.tpl) {
            this.tpl = this.tpl = "{" + this.displayField + "}"
        }
        this.selectedIndex = -1
    },
    onRender: function (b, a) {
        if (this.hiddenName && !Ext.isDefined(this.submitValue)) {
            this.submitValue = false
        }
        Ext.ux.form.CheckboxCombo.superclass.onRender.call(this, b, a);
        if (this.hiddenName) {
            this.hiddenField = this.el.insertSibling({
                tag: "input",
                type: "hidden",
                name: this.hiddenName,
                id: (this.hiddenId || this.hiddenName)
            }, "before", true)
        }
        if (Ext.isGecko) {
            this.el.dom.setAttribute("autocomplete", "off")
        }
        if (!this.lazyInit) {
            this.initList()
        } else {
            this.on("focus", this.initList, this, {single: true})
        }
    },
    initValue: function () {
        Ext.ux.form.CheckboxCombo.superclass.initValue.call(this);
        if (this.hiddenField) {
            this.hiddenField.value = Ext.value(Ext.isDefined(this.hiddenValue) ? this.hiddenValue : this.value, "")
        }
    },
    initList: function () {
        if (!this.list) {
            var a = "x-checkboxcombo-list", d = Ext.getDom(this.getListParent() || Ext.getBody()),
                    b = parseInt(Ext.fly(d).getStyle("z-index"), 10);
            if (this.ownerCt && !b) {
                this.findParentBy(function (e) {
                    b = parseInt(e.getPositionEl().getStyle("z-index"), 10);
                    return !!b
                })
            }
            this.list = new Ext.Layer({
                parentEl: d,
                shadow: this.shadow,
                cls: [a, this.listClass].join(" "),
                constrain: false,
                zindex: (b || 12000) + 5
            });
            var c = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
            this.list.setWidth(c);
            this.list.swallowEvent("mousewheel");
            this.assetHeight = 0;
            if (this.syncFont !== false) {
                this.list.setStyle("font-size", this.el.getStyle("font-size"))
            }
            this.innerList = this.list.createChild({cls: a + "-inner"});
            this.innerList.setWidth(c - this.list.getFrameWidth("lr"));
            this.mon(this.innerList, "mouseover", this.onListOver, this, {delegate: ".x-form-item"});
            this.mon(this.innerList, "mousemove", this.onListMove, this, {delegate: ".x-form-item"});
            this.mon(this.innerList, "click", this.onListClick, this, {delegate: ".x-form-item"});
            this.bindStore(this.store, true);
            this.restrictHeight()
        }
    },
    getListParent: function () {
        return document.body
    },
    getStore: function () {
        return this.store
    },
    bindStore: function (a, b) {
        if (this.store && !b) {
            if (this.store !== a && this.store.autoDestroy) {
                this.store.destroy()
            } else {
                this.store.un("beforeload", this.onBeforeLoad, this);
                this.store.un("load", this.onLoad, this);
                this.store.un("exception", this.collapse, this)
            }
            if (!a) {
                this.store = null
            }
        }
        if (a) {
            if (!b) {
                this.lastQuery = null
            }
            this.store = Ext.StoreMgr.lookup(a);
            this.store.on({scope: this, beforeload: this.onBeforeLoad, load: this.onLoad, exception: this.collapse});
            this.removeCheckboxes();
            this.addCheckboxes()
        }
    },
    initEvents: function () {
        Ext.ux.form.CheckboxCombo.superclass.initEvents.call(this);
        this.keyNav = new Ext.KeyNav(this.el, {
            up: function (a) {
                this.inKeyMode = true;
                this.selectPrev()
            }, down: function (a) {
                if (!this.isExpanded()) {
                    this.onTriggerClick()
                } else {
                    this.inKeyMode = true;
                    this.selectNext()
                }
            }, enter: function (a) {
                this.onListEnter()
            }, esc: function (a) {
                this.collapse()
            }, tab: function (a) {
                this.collapse();
                return true
            }, scope: this, doRelay: function (c, b, a) {
                if (a == "down" || this.scope.isExpanded()) {
                    var d = Ext.KeyNav.prototype.doRelay.apply(this, arguments);
                    if (!Ext.isIE && Ext.EventManager.useKeydown) {
                        this.scope.fireKey(c)
                    }
                    return d
                }
                return true
            }, forceKeyDown: true, defaultEventAction: "stopEvent"
        });
        if (!this.enableKeyEvents) {
            this.mon(this.el, "keyup", this.onKeyUp, this)
        }
    },
    onDestroy: function () {
        this.bindStore(null);
        Ext.destroy(this.resizer, this.cbgroup, this.list);
        Ext.destroyMembers(this, "hiddenField");
        Ext.ux.form.CheckboxCombo.superclass.onDestroy.call(this)
    },
    fireKey: function (a) {
        if (!this.isExpanded()) {
            Ext.ux.form.CheckboxCombo.superclass.fireKey.call(this, a)
        }
    },
    onResize: function (a, b) {
        Ext.ux.form.CheckboxCombo.superclass.onResize.apply(this, arguments);
        if (this.isVisible() && this.list) {
            this.doResize(a)
        } else {
            this.bufferSize = a
        }
    },
    doResize: function (a) {
        if (!Ext.isDefined(this.listWidth)) {
            var b = Math.max(a, this.minListWidth);
            this.list.setWidth(b);
            this.innerList.setWidth(b - this.list.getFrameWidth("lr"))
        }
    },
    onEnable: function () {
        Ext.ux.form.CheckboxCombo.superclass.onEnable.apply(this, arguments);
        if (this.hiddenField) {
            this.hiddenField.disabled = false
        }
    },
    onDisable: function () {
        Ext.ux.form.CheckboxCombo.superclass.onDisable.apply(this, arguments);
        if (this.hiddenField) {
            this.hiddenField.disabled = true
        }
    },
    onBeforeLoad: function () {
        if (!this.hasFocus) {
            return
        }
        this.checkboxValues = this.cbgroup.getValue();
        this.removeCheckboxes()
    },
    onLoad: function () {
        if (!this.hasFocus) {
            return
        }
        if (this.checkboxValues) {
            Ext.each(this.checkboxValues, function (a) {
                if (this.valueField) {
                    var b = this.findRecord(this.valueField, a.inputValue);
                    if (b) {
                        b.checked = true
                    }
                }
            }, this)
        }
        if (this.store.getCount() > 0 || this.listEmptyText) {
            this.addCheckboxes();
            this.expand();
            this.restrictHeight()
        } else {
            this.collapse()
        }
    },
    getName: function () {
        var a = this.hiddenField;
        return a && a.name ? a.name : this.hiddenName || Ext.ux.form.CheckboxCombo.superclass.getName.call(this)
    },
    assertValue: function () {
        var a = this.cbgroup.getValue();
        if (a) {
            var b = [];
            Ext.each(a, function (c) {
                b.push(c.inputValue)
            });
            this.setValue(b)
        } else {
            this.clearValue()
        }
    },
    setValue: function (a) {
        a = a || [];
        if (typeof a === "string") {
            a = a.split(",")
        }
        var b = [];
        Ext.each(this.store.data.items, function (c) {
            c.checked = false
        }, this);
        Ext.each(a, function (c) {
            if (this.valueField) {
                var d = this.findRecord(this.valueField, c);
                if (d) {
                    b.push(d.data[this.displayField]);
                    d.checked = true
                }
            }
        }, this);
        if (typeof a === "array" || typeof a === "object") {
            a = a.join(",")
        }
        if (this.cbgroup) {
            this.cbgroup.setValue(Ext.pluck(this.store.data.items, "checked"))
        }
        if (this.hiddenField) {
            this.hiddenField.value = Ext.value(a, "")
        }
        this.lastSelectionText = b.join(", ");
        Ext.ux.form.CheckboxCombo.superclass.setValue.call(this, b.join(", "));
        this.value = a;
        return this
    },
    getValue: function () {
        if (this.valueField) {
            return Ext.isDefined(this.value) ? this.value : ""
        } else {
            return Ext.ux.form.CheckboxCombo.superclass.getValue.call(this)
        }
    },
    clearValue: function () {
        if (this.hiddenField) {
            this.hiddenField.value = ""
        }
        this.setRawValue("");
        this.lastSelectionText = "";
        this.applyEmptyText();
        this.value = ""
    },
    findRecord: function (c, b) {
        var a;
        if (this.store.getCount() > 0) {
            a = this.store.getAt(this.store.findExact(c, b));
            return (a ? a : false)
        }
    },
    onListMove: function (b, a) {
        this.inKeyMode = false
    },
    onListOver: function (c, a) {
        var b = c.getTarget("div.x-form-item");
        if (b) {
            b = Ext.get(b);
            b.radioClass("x-checkboxcombo-item-over")
        }
    },
    onListClick: function (d, b) {
        if (Ext.get(d.getTarget()).dom.tagName == "INPUT" || Ext.get(d.getTarget()).dom.tagName == "LABEL") {
            return
        }
        var c = d.getTarget("div.x-form-item");
        if (c) {
            c = Ext.get(c);
            var a = c.child("input");
            a = Ext.getCmp(a.id);
            a.setValue(a.getValue() ? false : true)
        }
    },
    onListEnter: function (d, b) {
        var c = Ext.DomQuery.selectNode(".x-checkboxcombo-item-over", this.list.dom);
        if (c) {
            c = Ext.get(c);
            var a = c.child("input");
            a = Ext.getCmp(a.id);
            a.setValue(a.getValue() ? false : true)
        }
    },
    restrictHeight: function () {
        this.innerList.dom.style.height = "";
        var b = this.innerList.dom, e = this.list.getFrameWidth("tb") + this.assetHeight,
                c = Math.max(b.clientHeight, b.offsetHeight, b.scrollHeight),
                a = this.getPosition()[1] - Ext.getBody().getScroll().top,
                f = Ext.lib.Dom.getViewHeight() - a - this.getSize().height,
                d = Math.max(a, f, this.minHeight || 0) - this.list.shadowOffset - e - 5;
        c = Math.min(c, d, this.maxHeight);
        this.innerList.setHeight(c);
        this.list.beginUpdate();
        this.list.setHeight(c + e);
        this.list.alignTo.apply(this.list, [this.el].concat(this.listAlign));
        this.list.endUpdate()
    },
    isExpanded: function () {
        return this.list && this.list.isVisible()
    },
    selectNext: function () {
        var a = this.store.getCount();
        if (a > 0) {
            var b = Ext.DomQuery.selectNode(".x-checkboxcombo-item-over", this.list.dom);
            if (!b) {
                this.innerList.child(".x-form-item").radioClass("x-checkboxcombo-item-over")
            } else {
                Ext.get(b).next().radioClass("x-checkboxcombo-item-over")
            }
        }
    },
    selectPrev: function () {
        var a = this.store.getCount();
        if (a > 0) {
            var b = Ext.DomQuery.selectNode(".x-checkboxcombo-item-over", this.list.dom);
            if (!b) {
                this.innerList.child(".x-form-item").radioClass("x-checkboxcombo-item-over")
            } else {
                Ext.get(b).prev().radioClass("x-checkboxcombo-item-over")
            }
        }
    },
    validateBlur: function () {
        return !this.list || !this.list.isVisible()
    },
    beforeBlur: function () {
        this.assertValue()
    },
    postBlur: function () {
        Ext.ux.form.CheckboxCombo.superclass.postBlur.call(this);
        this.collapse();
        this.inKeyMode = false
    },
    collapse: function () {
        if (!this.isExpanded()) {
            return
        }
        this.list.hide();
        Ext.getDoc().un("mousewheel", this.collapseIf, this);
        Ext.getDoc().un("mousedown", this.collapseIf, this);
        this.beforeBlur();
        this.fireEvent("collapse", this)
    },
    collapseIf: function (a) {
        if (!a.within(this.wrap) && !a.within(this.list)) {
            this.collapse()
        }
    },
    expand: function () {
        if (this.isExpanded() || !this.hasFocus) {
            return
        }
        if (this.bufferSize) {
            this.doResize(this.bufferSize);
            delete this.bufferSize
        }
        this.list.alignTo.apply(this.list, [this.el].concat(this.listAlign));
        this.list.show();
        if (Ext.isGecko2) {
            this.innerList.setOverflow("auto")
        }
        this.mon(Ext.getDoc(), {scope: this, mousewheel: this.collapseIf, mousedown: this.collapseIf});
        this.fireEvent("expand", this)
    },
    removeCheckboxes: function () {
        if (this.cbgroup) {
            this.cbgroup.destroy()
        }
    },
    addCheckboxes: function () {
        var a = [];
        Ext.each(this.store.data.items, function (b) {
            a.push({
                name: b.id,
                boxLabel: this.tpl.apply(b.data),
                inputValue: b.data[this.valueField],
                checked: (b.checked ? b.checked : false)
            })
        }, this);
        this.cbgroup = new Ext.form.CheckboxGroup({
            renderTo: this.innerList,
            columns: 1,
            autoHeight: true,
            border: false,
            items: a
        });
        this.cbgroup.mon(this.cbgroup, "change", function (c, b) {
            this.fireEvent("change", this, b)
        }, this, {buffer: 50})
    },
    onTriggerClick: function () {
        if (this.readOnly || this.disabled) {
            return
        }
        if (this.isExpanded()) {
            this.collapse();
            this.el.focus()
        } else {
            this.onFocus({});
            if (this.triggerAction == "all") {
                this.store.reload()
            }
            this.expand();
            this.el.focus()
        }
    },
    gridRenderer: function (a) {
        if (typeof a == "string") {
            a = a.split(",")
        }
        var b = [];
        Ext.each(a, function (c) {
            if (this.valueField) {
                var d = this.findRecord(this.valueField, c);
                if (d) {
                    b.push(d.data[this.displayField])
                }
            }
        }, this);
        return b.join(", ")
    }
});
Ext.reg("checkboxcombo", Ext.ux.form.CheckboxCombo);