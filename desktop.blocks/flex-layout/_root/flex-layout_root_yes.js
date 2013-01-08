BEM.DOM.decl({ block : 'flex-layout', modName : 'root', modVal : 'yes' }, {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this.__base.apply(this, arguments);

                this._recalcScheduled = true;
                this.afterCurrentEvent(function() {
                    this.domElem && this
                        .bindToWin('resize', this.recalc)
                        .recalc();

                    this._recalcScheduled = false;
                });
            }
        }
    },

    recalc : function() {
        var winSize = this.__self.getWindowSize(),
            minSize = this._getMinSize(),
            elemsData = this._recalcPanels({
                width  : Math.max(winSize.width, minSize.width),
                height : Math.max(winSize.height, minSize.height)
            });

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