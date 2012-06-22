BEM.DOM.decl('b-flex-layout', {
    onSetMod : {
        'js' : {
            'inited' : function() {

                this._panels = this.domElem.children();
                this._panelsParams = this._buildPanelsParams();
                this._parent = this._addToParent();

            }
        }
    },

    _buildPanelsParams : function() {

        var _this = this,
            props = _this._getCalcProps(),
            res = [];

        _this._panels.each(function(i, node) {
            var elem = $(node),
                elemParams = _this.elemParams(elem),
                params = {
                    elem      : elem,
                    type      : elemParams[props.size]?
                        elemParams[props.size].toString().indexOf('%') > -1? 'percent' : 'fixed' :
                        'flexible',
                    minWidth  : elemParams.minWidth || 20,
                    minHeight : elemParams.minHeight || 20
                };

            elemParams[props.size] && (params[props.size] = parseInt(elemParams[props.size], 10));

            res.push(params);
        });

        return res;

    },

    _addToParent : function() {

        var parentElem = this.domElem.parent(),
            parentBlock = this.findBlockOutside(parentElem, 'b-flex-layout');

        return parentBlock._addChildLayout(parentElem, this);

    },

    _removeFromParent : function() {

        return this._parent._removeChildLayout(this.domElem.parent(), this);

    },

    _findPanelParams : function(panel) {

        var i = 0, params;
        while(params = this._panelsParams[i++]) {
            if(params.elem[0] === panel[0]) {
                return params;
            }
        }

    },

    _addChildLayout : function(panel, block) {

        this._findPanelParams(panel).childLayout = block;
        return this;

    },

    _removeChildLayout : function(panel, block) {

        var params = this._findPanelParams(panel);

        delete params.childLayout;
        delete params.lastSize;
        delete params.lastOffset;
        delete this._minSize;

        return this;

    },

    _recalcPanels : function(parentSize) {

        var props = this._getCalcProps(),
            fullSize = parentSize[props.size],
            flexibleSize = fullSize,
            countFlexiblePanel = 0;

        this._panelsParams.forEach(function(params) {
            switch(params.type) {
                case 'fixed':
                    flexibleSize -= (params.size = params[props.size]);
                break;
                case 'percent':
                    flexibleSize -= (params.size = Math.max(
                        params[props.minSize],
                        Math.ceil(params[props.size] * fullSize / 100)));
                break;
                default:
                    delete params.size;
                    ++countFlexiblePanel;
            }
        });

        var flexiblePanelSize = countFlexiblePanel > 1? Math.floor(flexibleSize / countFlexiblePanel) : flexibleSize,
            flexibleReserve = countFlexiblePanel? flexibleSize % countFlexiblePanel : 0;

        this._panelsParams.forEach(function(params) {
            params.minSize = params.childLayout &&
                params.childLayout._getMinSize()[props.size] || params[props.minSize];

            if(params.type === 'flexible') {
                flexibleReserve += flexiblePanelSize - params.minSize;
            }
        });

        var flexibleAdding = countFlexiblePanel? Math.floor(flexibleReserve / countFlexiblePanel) : 0,
            offset = 0,
            panelsData = [];

        this._panelsParams.forEach(function(params) {
            var size = params.size; // it may be be calculated on previous steps

            if(!size) {
                size = params.minSize;
                if(flexibleReserve > 0) {
                    size += countFlexiblePanel-- > 1? flexibleAdding : flexibleReserve;
                    flexibleReserve -= flexibleAdding;
                }
            }

            if(params.childLayout) {
                panelsData = panelsData.concat(params.childLayout._recalcPanels(
                    props.size === 'height'?
                    { width : parentSize.width, height : size } :
                    { width : size, height : parentSize.height }));
            }

            if(size !== params.lastSize || offset !== params.lastOffset) { // optimizing
                var css = {};

                size !== params.lastSize && (css[props.size] = params.lastSize = size);
                offset !== params.lastOffset && (css[props.offset] = params.lastOffset = offset);

                panelsData.push({ elem : params.elem, css : css });
            }

            offset += size;
        });

        return panelsData;

    },

    _getCalcProps : function() {

        return this.hasMod('orient', 'vert')?
            { size : 'height', minSize : 'minHeight', offset : 'top' } :
            { size : 'width', minSize : 'minWidth', offset : 'left' };

    },

    _getMinSize : function() {

        if(typeof this._minSize !== 'undefined') {
            return this._minSize;
        }

        var props = this._getCalcProps(),
            res = { width : 0, height : 0 };

        this._panelsParams.forEach(function(params) {
            if(params.childLayout) {
                var childMinSize = params.childLayout._getMinSize();
                res.width += childMinSize.width;
                res.height += childMinSize.height;
            }
            else if(props.size === 'height') {
                res.height += params.type === 'fixed'? params.height : params.minHeight;
            }
            else {
                res.width += params.type === 'fixed'? params.width : params.minWidth;
            }
        });

        return this._minSize = res;

    },

    destruct : function() {

        this._removeFromParent();
        this.__base.apply(this, arguments);

    }
});