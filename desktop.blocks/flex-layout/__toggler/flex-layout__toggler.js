BEM.DOM.decl('flex-layout', {
    _onTogglerClick : function() {
        this.toggleSecondaryPane();
    }
}, {
    live : function() {
        this.__base();

        this.liveBindTo('toggler', 'leftclick', function(e) {
            this._onTogglerClick(e);
        });

        return false;
    }
});