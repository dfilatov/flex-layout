BEM.DOM.decl('flex-layout', {
    _onCollapserClick : function() {
        this.toggleMod('mode', 'primary', '');
    }
}, {
    live : function() {
        this.__base();

        this.liveBindTo('collapser', 'leftclick', function(e) {
            this._onCollapserClick(e);
        });

        return false;
    }
});