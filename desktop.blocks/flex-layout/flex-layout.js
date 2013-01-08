BEM.DOM.decl('flex-layout', {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this._panels = this._buildPanels();
                this._parent = this._addToParent();

                this._isModePrimary = this.hasMod('mode', 'primary');
                this._isAnimated = false;
            }
        },

        'mode' : function(_, modVal) {
            this._isModePrimary = modVal === 'primary';
            this._isAnimated = true;

            this._invalidate();
        }
    },

    _buildPanels : function() {
        var _this = this,
            res = {};

        _this.domElem.children().each(function(i, node) {
            var elem = $(node),
                kind = _this.hasMod(elem, 'primary')? 'primary' : 'secondary',
                elemParams = _this.elemParams(elem),
                panel = {
                    elem      : elem,
                    minWidth  : elemParams.minWidth,
                    maxWidth  : elemParams.maxWidth,
                    minHeight : elemParams.minHeight,
                    maxHeight : elemParams.maxHeight
                };

            if(elemParams.size) {
                panel.type = elemParams.size.toString().indexOf('%') > -1? 'percent' : 'fixed';
                panel.size = parseInt(elemParams.size, 10);
                panel.type === 'percent' && (panel.size /= 100);
            }

            if(res[kind]) {
                throw kind + ' panel should be the only one';
            }

            res[kind] = panel;
        });

        if(!res.primary) {
            throw 'can\'t find primary panel';
        }

        if(!res.secondary) {
            throw 'can\'t find secondary panel';
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

    _findPanelByElem : function(panelElem) {
        return this._panels[this._panels.primary.elem[0] === panelElem[0]? 'primary' : 'secondary'];
    },

    _addChildLayout : function(panel, block) {
        this._findPanelByElem(panel).childLayout = block;
        this._invalidate();
        return this;
    },

    _removeChildLayout : function(panelElem, block) {
        var panel = this._findPanelByElem(panelElem);

        delete panel.childLayout;
        delete panel.lastSize;
        delete panel.lastOffset;
        delete panel.minSize;
        delete panel.hidden;
        delete this._minSize;

        this._invalidate();

        return this;
    },

    _recalcPanels : function(parentSizes) {
        var _this = this,
            props = _this._getCalcProps(),
            fullSize = parentSizes[props.size],
            secondaryPanel = _this._panels.secondary,
            sizes = {};

        sizes.secondary = _this._calcSecondarySize(
            secondaryPanel.type === 'fixed'? secondaryPanel.size : secondaryPanel.size * fullSize,
            fullSize);

        sizes.primary = _this._isModePrimary? fullSize : fullSize - sizes.secondary;

        var offset = 0,
            res = [];

        Object.keys(_this._panels).forEach(function(kind, i) {
            var panel = _this._panels[kind],
                size = sizes[kind],
                hidden = _this._isModePrimary && kind === 'secondary';

            if(panel.childLayout && !hidden) {
                res = res.concat(panel.childLayout._recalcPanels(
                    props.size === 'height'?
                        { width : parentSizes.width, height : size } :
                        { width : size, height : parentSizes.height }));
            }

            if(size !== panel.lastSize || offset !== panel.lastOffset || panel.hidden !== hidden) { // optimizing
                panel.hidden = hidden;

                var css = {};

                css[props.size] = panel.lastSize = size;
                css[props.offset] = panel.lastOffset = hidden? i? fullSize : -size : offset;

                res.push({ elem : panel.elem, css : css });
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
            primaryPanel = this._panels.primary,
            secondaryPanel = this._panels.secondary;

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

        Object.keys(_this._panels).forEach(function(kind) {
            var panelMinSize = _this._getPanelMinSize(_this._panels[kind]);

            if(_this.hasMod('orient', 'vert')) {
                res.width = Math.max(res.width, panelMinSize.width);
                res.height += panelMinSize.height;
            }
            else {
                res.width += panelMinSize.width;
                res.height = Math.max(res.height, panelMinSize.height);
            }
        });

        return this._minSize = res;
    },

    _getPanelMinSize : function(panel) {
        if(typeof panel.minSize !== 'undefined') {
            return panel.minSize;
        }

        var res = { width : 0, height : 0 },
            selfMinWidth = panel.minWidth? panel.minWidth : panel.type === 'fixed' && panel.size || 50,
            selfMinHeight = panel.minHeight? panel.minHeight : panel.type === 'fixed' && panel.size || 50;

        if(panel.childLayout) {
            var childMinSize = panel.childLayout._getMinSize();
            res.width = Math.max(childMinSize.width, selfMinWidth);
            res.height = Math.max(childMinSize.height, selfMinHeight);
        }
        else {
            res.width = selfMinWidth;
            res.height = selfMinHeight;
        }

        return panel.minSize = res;
    },

    _getPanelMaxSize : function(panel) {
        if(typeof panel.maxSize !== 'undefined') {
            return panel.maxSize;
        }

        return panel.maxSize = {
            width  : panel.maxWidth || Number.POSITIVE_INFINITY,
            height : panel.maxHeight || Number.POSITIVE_INFINITY
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