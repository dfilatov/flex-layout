BEM.DOM.decl('flex-layout', {
    onSetMod : {
        'js' : {
            'inited' : function() {
                var children = this.domElem.children(),
                    panelElems = children.filter(this.__self.buildSelector('panel')),
                    splitterElem = children.filter(this.__self.buildSelector('splitter'));

                this._panels = this._buildPanels(panelElems);
                this._splitter = splitterElem.length? splitterElem : null;
                this._parent = this._addToParent();
            }
        }
    },

    _buildPanels : function(panelElems) {
        var _this = this,
            res = {};

        panelElems.each(function(i, node) {
            var elem = $(node),
                elemParams = _this.elemParams(elem),
                params = {
                    elem      : elem,
                    minWidth  : elemParams.minWidth,
                    maxWidth  : elemParams.maxWidth,
                    minHeight : elemParams.minHeight,
                    maxHeight : elemParams.maxHeight
                };

            if(elemParams.size) {
                params.type = elemParams.size.toString().indexOf('%') > -1? 'percent' : 'fixed';
                params.size = parseInt(elemParams.size, 10);
                params.type === 'percent' && (params.size /= 100);
            }

            var kind = elemParams.size? 'primary' : 'secondary';

            if(res[kind]) {
                throw kind + ' panel should be the only one';
            }

            res[kind] = params;
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
        return this;
    },

    _removeChildLayout : function(panelElem, block) {
        var panel = this._findPanelByElem(panelElem);

        delete panel.childLayout;
        delete panel.lastSize;
        delete panel.lastOffset;
        delete panel.minSize;
        delete this._minSize;

        return this;
    },

    _recalcPanels : function(parentSizes) {
        var props = this._getCalcProps(),
            fullSize = parentSizes[props.size],
            primaryPanel = this._panels.primary,
            secondaryPanel = this._panels.secondary,
            secondaryMinSize = this._getPanelMinSize(secondaryPanel)[props.size],
            sizes = {};

        sizes.primary = primaryPanel.type === 'fixed'?
            primaryPanel.size :
            Math.min(
                this._getPanelMaxSize(primaryPanel)[props.size],
                Math.max(
                    this._getPanelMinSize(primaryPanel)[props.size],
                    Math.ceil(primaryPanel.size * fullSize)),
                fullSize - secondaryMinSize);

        sizes.secondary = fullSize - sizes.primary;

        var offset = 0,
            res = [],
            _this = this;

        Object.keys(_this._panels).forEach(function(kind, i) {
            var panel = _this._panels[kind],
                size = sizes[kind];

            if(panel.childLayout) {
                res = res.concat(panel.childLayout._recalcPanels(
                    props.size === 'height'?
                        { width : parentSizes.width, height : size } :
                        { width : size, height : parentSizes.height }));
            }

            if(size !== panel.lastSize || offset !== panel.lastOffset) { // optimizing
                var css = {};

                css[props.size] = panel.lastSize = size;
                css[props.offset] = panel.lastOffset = offset;

                res.push({ elem : panel.elem, css : css });

                if(i && _this._splitter) {
                    var splitterCss = {};
                    splitterCss[props.offset] = offset;
                    res.push({ elem : _this._splitter, css : splitterCss });
                }
            }

            offset += size;
        });

        return res;
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
            res.width += panelMinSize.width;
            res.height += panelMinSize.height;
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

    _onSplitterMouseDown : function(e) {
        e.preventDefault();

        var props = this._getCalcProps(),
            primaryPanel = this._panels.primary;

        this._mouseOffset = e[props.mouseOffset];
        this._mouseDownPrimarySize = primaryPanel.lastSize;
        this._mouseDownPrimarySizeFactor = primaryPanel.type === 'fixed'? 1 : primaryPanel.size / primaryPanel.lastSize;
        this._mouseDownInvertFactor = Object.keys(this._panels)[0] === 'primary'? 1 : -1;

        this.bindToDoc({
            mousemove : this._onSplitterMouseMove,
            mouseup   : this._onSplitterMouseUp
        });

        this.setMod(this._splitter, 'active', 'yes');
    },

    _onSplitterMouseMove : function(e) {
        var props = this._getCalcProps(),
            newMouseOffset = e[props.mouseOffset],
            primaryPanel = this._panels.primary,
            secondaryPanel = this._panels.secondary,
            fullSize = primaryPanel.lastSize + secondaryPanel.lastSize,
            primaryMinSize = this._getPanelMinSize(primaryPanel)[props.size],
            primaryMaxSize = this._getPanelMaxSize(primaryPanel)[props.size],
            secondaryMinSize = this._getPanelMinSize(secondaryPanel)[props.size],
            newPrimarySize = Math.min(
                Math.max(
                    this._mouseDownPrimarySize +
                        (newMouseOffset - this._mouseOffset) * this._mouseDownInvertFactor,
                    primaryMinSize),
                primaryMaxSize,
                fullSize - secondaryMinSize);

        primaryPanel.size = newPrimarySize * this._mouseDownPrimarySizeFactor;

        this._invalidate();
    },

    _onSplitterMouseUp : function() {
        this
            .unbindFromDoc('mousemove mouseup')
            .delMod(this._splitter, 'active');
    },

    destruct : function() {
        this._removeFromParent();
        this.__base.apply(this, arguments);
    }
}, {
    live : function() {
        this.liveBindTo('splitter', 'mousedown', function(e) {
            this._onSplitterMouseDown(e);
        });

        return false;
    }
});