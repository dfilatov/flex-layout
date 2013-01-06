BEM.DOM.decl('flex-layout', {
    _onCollapserClick : function() {
        this.toggleMod('primary', 'full', '');
    }
}, {
    live : function() {
        this.__base();

        this.liveBindTo('collapser', 'click', function(e) {
            this._onCollapserClick(e);
        });

        return false;
    }
});