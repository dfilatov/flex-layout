BEM.DOM.decl({ block : 'flex-layout', modName : 'root', modVal : 'yes' }, {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this.__base.apply(this, arguments);

                this._curSize = { width : 0, height : 0 };
                this._recalcScheduled = true;

                this.afterCurrentEvent(function() {
                    this.domElem && this
                        .bindToWin('resize', this.recalc)
                        .recalc();

                    this.setMod('ready', 'yes');

                    this._recalcScheduled = false;
                });
            }
        }
    },

    recalc : function() {
        var winSize = this.__self.getWindowSize(),
            minSize = this._getMinSize(),
            newSize = {
                width  : Math.max(winSize.width, minSize.width),
                height : Math.max(winSize.height, minSize.height)
            },
            elemsData = this._recalcPanels(newSize);

        if(this._curSize.width !== newSize.width || this._curSize.height !== newSize.height) {
            this._curSize = newSize;
            elemsData.unshift({ elem : this.domElem, css : { width : newSize.width, height : newSize.height }});
        }

        elemsData.forEach(function(elemData) {
            elemData.elem.css(elemData.css);
        });
    },

    _addToParent : function() {},
    _removeFromParent : function() {},

    _invalidate : function() {
        this._recalcScheduled || this.recalc();
    }
});