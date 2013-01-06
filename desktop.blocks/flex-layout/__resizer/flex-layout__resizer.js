BEM.DOM.decl('flex-layout', {
    _onResizerMouseDown : function(e) {
        e.preventDefault();

        var props = this._getCalcProps(),
            secondaryPanel = this._panels.secondary;

        this._resizer = e.data.domElem;
        this._mouseDownOffset = e[props.mouseOffset];
        this._mouseDownSecondarySize = secondaryPanel.lastSize;
        this._mouseDownSecondarySizeFactor = secondaryPanel.type === 'fixed'?
            1 :
            secondaryPanel.size / secondaryPanel.lastSize;
        this._mouseDownInvertFactor = Object.keys(this._panels)[0] === 'secondary'? 1 : -1;

        this
            .bindToDoc({
                mousemove : this._onResizerMouseMove,
                mouseup   : this._onResizerMouseUp
            })
            .setMod(e.data.domElem, 'active', 'yes');
    },

    _onResizerMouseMove : function(e) {
        var props = this._getCalcProps(),
            secondaryPanel = this._panels.secondary,
            primaryPanel = this._panels.primary,
            fullSize = secondaryPanel.lastSize + primaryPanel.lastSize,
            secondaryMinSize = this._getPanelMinSize(secondaryPanel)[props.size],
            secondaryMaxSize = this._getPanelMaxSize(secondaryPanel)[props.size],
            primaryMinSize = this._getPanelMinSize(primaryPanel)[props.size],
            newSecondarySize = Math.min(
                Math.max(
                    this._mouseDownSecondarySize +
                        (e[props.mouseOffset] - this._mouseDownOffset) * this._mouseDownInvertFactor,
                    secondaryMinSize),
                secondaryMaxSize,
                fullSize - primaryMinSize);

        secondaryPanel.size = newSecondarySize * this._mouseDownSecondarySizeFactor;

        this._invalidate();
    },

    _onResizerMouseUp : function() {
        this
            .unbindFromDoc('mousemove mouseup')
            .delMod(this._resizer, 'active');
    }
}, {
    live : function() {
        this.__base();

        this.liveBindTo('resizer', 'mousedown', function(e) {
            this._onResizerMouseDown(e);
        });

        return false;
    }
});