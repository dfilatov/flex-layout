BEM.DOM.decl('flex-layout', {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this._panes = this._buildPanes();
                this._parent = this._addToParent();

                this._isSecondaryHidden = this.hasMod(this._panes.secondary.elem, 'hidden');
                this._isAnimated = false;
            }
        }
    },

    onElemSetMod : {
        'pane' : {
            'hidden' : function(elem, _, modVal) {
                if(elem[0] !== this._panes.secondary.elem[0]) {
                    return false;
                }

                var isSecondaryHidden = this._isSecondaryHidden = !!modVal;
                this._isAnimated = true;

                this._invalidate();

                this
                    .toggleSecondaryPane()
                    .afterCurrentEvent(function() {
                        this.domElem && this.trigger('secondary-pane-' + isSecondaryHidden? 'hide' : 'show');
                    });
            }
        }
    },

    showSecondaryPane : function() {
        return this.delMod(this._panes.secondary.elem, 'hidden');
    },

    hideSecondaryPane : function() {
        return this.setMod(this._panes.secondary.elem, 'hidden', 'yes');
    },

    toggleSecondaryPane : function() {
        return this.toggleMod(this._panes.secondary.elem, 'hidden', 'yes', '');
    },

    _buildPanes : function() {
        var _this = this,
            res = {};

        _this.domElem.children().each(function(i, node) {
            var elem = $(node),
                kind = _this.hasMod(elem, 'primary')? 'primary' : 'secondary',
                elemParams = _this.elemParams(elem),
                pane = {
                    elem      : elem,
                    minWidth  : elemParams.minWidth,
                    maxWidth  : elemParams.maxWidth,
                    minHeight : elemParams.minHeight,
                    maxHeight : elemParams.maxHeight
                };

            if(elemParams.size) {
                pane.type = elemParams.size.toString().indexOf('%') > -1? 'percent' : 'fixed';
                pane.size = parseInt(elemParams.size, 10);
                pane.type === 'percent' && (pane.size /= 100);
            }

            if(res[kind]) {
                throw kind + ' pane should be the only one';
            }

            res[kind] = pane;
        });

        if(!res.primary) {
            throw 'can\'t find primary pane';
        }

        if(!res.secondary) {
            throw 'can\'t find secondary pane';
        }

        return res;
    },

    _addToParent : function() {
        var parentElem = this.domElem.parent(),
            parentBlock = this.findBlockOutside(parentElem, this.__self.getName());

        return parentBlock._addChildLayout(parentElem, this);
    },

    _removeFromParent : function() {
        return this._parent._removeChildLayout(this.domElem.parent(), this);
    },

    _findPanelByElem : function(paneElem) {
        return this._panes[this._panes.primary.elem[0] === paneElem[0]? 'primary' : 'secondary'];
    },

    _addChildLayout : function(pane, block) {
        this._findPanelByElem(pane).childLayout = block;
        this._invalidate();
        return this;
    },

    _removeChildLayout : function(paneElem, block) {
        var pane = this._findPanelByElem(paneElem);

        delete pane.childLayout;
        delete pane.lastSize;
        delete pane.lastOffset;
        delete pane.minSize;
        delete pane.hidden;
        delete this._minSize;

        this._invalidate();

        return this;
    },

    _recalcPanels : function(parentSizes) {
        var _this = this,
            props = _this._getCalcProps(),
            fullSize = parentSizes[props.size],
            secondaryPanel = _this._panes.secondary,
            sizes = {};

        sizes.secondary = _this._calcSecondarySize(
            secondaryPanel.type === 'fixed'? secondaryPanel.size : Math.ceil(secondaryPanel.size * fullSize),
            fullSize);

        sizes.primary = _this._isSecondaryHidden? fullSize : fullSize - sizes.secondary;

        var offset = 0,
            res = [];

        Object.keys(_this._panes).forEach(function(kind, i) {
            var pane = _this._panes[kind],
                size = sizes[kind],
                hidden = _this._isSecondaryHidden && kind === 'secondary';

            if(pane.childLayout && !hidden) {
                res = res.concat(pane.childLayout._recalcPanels(
                    props.size === 'height'?
                        { width : parentSizes.width, height : size } :
                        { width : size, height : parentSizes.height }));
            }

            if(size !== pane.lastSize || offset !== pane.lastOffset || pane.hidden !== hidden) { // optimizing
                pane.hidden = hidden;

                var css = {};

                css[props.size] = pane.lastSize = size;
                css[props.offset] = pane.lastOffset = hidden? i? fullSize : -size : offset;

                res.push({ elem : pane.elem, css : css });
            }

            hidden || (offset += size);
        });

        if(_this._isAnimated) {
            _this._isAnimated = false;
            _this.setMod('animated', 'yes');
        }
        else {
            _this.delMod('animated');
        }

        return res;
    },

    _calcSecondarySize : function(desiredSize, fullSize) {
        var sizeProp = this._getCalcProps().size,
            primaryPanel = this._panes.primary,
            secondaryPanel = this._panes.secondary;

        return Math.min(
            Math.max(
                desiredSize,
                this._getPanelMinSize(secondaryPanel)[sizeProp]),
            this._getPanelMaxSize(secondaryPanel)[sizeProp],
            fullSize - this._getPanelMinSize(primaryPanel)[sizeProp]);
    },

    _getCalcProps : function() {
        return this._calcProps || (this._calcProps =
            this.hasMod('orient', 'vert')?
                { size : 'height', offset : 'top', mouseOffset : 'clientY' } :
                { size : 'width', offset : 'left', mouseOffset : 'clientX' });
    },

    _getMinSize : function() {
        if(typeof this._minSize !== 'undefined') {
            return this._minSize;
        }

        var _this = this,
            res = { width : 0, height : 0 };

        Object.keys(_this._panes).forEach(function(kind) {
            var paneMinSize = _this._getPanelMinSize(_this._panes[kind]);

            if(_this.hasMod('orient', 'vert')) {
                res.width = Math.max(res.width, paneMinSize.width);
                res.height += paneMinSize.height;
            }
            else {
                res.width += paneMinSize.width;
                res.height = Math.max(res.height, paneMinSize.height);
            }
        });

        return this._minSize = res;
    },

    _getPanelMinSize : function(pane) {
        if(typeof pane.minSize !== 'undefined') {
            return pane.minSize;
        }

        var res = { width : 0, height : 0 },
            selfMinWidth = pane.minWidth? pane.minWidth : pane.type === 'fixed' && pane.size || 50,
            selfMinHeight = pane.minHeight? pane.minHeight : pane.type === 'fixed' && pane.size || 50;

        if(pane.childLayout) {
            var childMinSize = pane.childLayout._getMinSize();
            res.width = Math.max(childMinSize.width, selfMinWidth);
            res.height = Math.max(childMinSize.height, selfMinHeight);
        }
        else {
            res.width = selfMinWidth;
            res.height = selfMinHeight;
        }

        return pane.minSize = res;
    },

    _getPanelMaxSize : function(pane) {
        if(typeof pane.maxSize !== 'undefined') {
            return pane.maxSize;
        }

        return pane.maxSize = {
            width  : pane.maxWidth || Number.POSITIVE_INFINITY,
            height : pane.maxHeight || Number.POSITIVE_INFINITY
        };
    },

    _invalidate : function() {
        this._parent._invalidate();
    },

    destruct : function() {
        this._removeFromParent();
        this.__base.apply(this, arguments);
    }
});