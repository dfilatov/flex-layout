BEM.DOM.decl({ block : 'b-flex-layout', modName : 'root', modVal : 'yes' }, {
    onSetMod : {
        'js' : {
            'inited' : function() {

                this.__base.apply(this, arguments);
                this.afterCurrentEvent(function() {
                    this
                        .bindToWin('resize', this.recalc)
                        .recalc();
                });

            }
        }
    },

    recalc : function() {

        var elemsData = this._recalcPanels(this.__self.getWindowSize());
        elemsData.forEach(function(elemData) {
            elemData.elem.css(elemData.css);
        });

    },

    _addToParent : function() {},
    _removeFromParent : function() {}
});