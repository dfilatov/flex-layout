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
            params.minSize = params.childLayout &&
                params.childLayout._getMinSize()[props.size] || params[props.minSize];

            switch(params.type) {
                case 'fixed':
                    flexibleSize -= (params.size = params[props.size]);
                break;
                case 'percent':
                    flexibleSize -= (params.size = Math.max(
                        params.minSize,
                        Math.ceil(params[props.size] * fullSize / 100)));
                break;
                default:
                    delete params.size;
                    ++countFlexiblePanel;
            }
        });

        var flexiblePanelSize = countFlexiblePanel > 1? Math.floor(flexibleSize / countFlexiblePanel) : flexibleSize,
            flexiblePanelsParams = [];

        this._panelsParams.forEach(function(params) {
            if(params.type === 'flexible') {
                flexiblePanelsParams.push(params);
            }
        });

        if(countFlexiblePanel) {
            if(countFlexiblePanel > 1) {
                flexiblePanelsParams
                    .sort(function(params1, params2) {
                        return params2.minSize - params1.minSize;
                    })
                    .forEach(function(params, i) {
                        if((params.size = params.minSize) > flexiblePanelSize) {
                            flexibleSize -= params.size;
                            flexiblePanelSize = Math.floor(flexibleSize / (countFlexiblePanel - i - 1));
                        }
                        else {
                            i === countFlexiblePanel - 1?
                                params.size = flexibleSize :
                                flexibleSize -= (params.size = flexiblePanelSize);
                        }
                    });
            }
            else {
                flexiblePanelsParams[0].size = flexibleSize;
            }
        }

        var offset = 0,
            res = [];
        this._panelsParams.forEach(function(params) {
            var size = params.size;

            if(params.childLayout) {
                res = res.concat(params.childLayout._recalcPanels(
                    props.size === 'height'?
                        { width : parentSize.width, height : size } :
                        { width : size, height : parentSize.height }));
            }

            if(size !== params.lastSize || offset !== params.lastOffset) { // optimizing
                var css = {};

                size !== params.lastSize && (css[props.size] = params.lastSize = size);
                offset !== params.lastOffset && (css[props.offset] = params.lastOffset = offset);

                res.push({ elem : params.elem, css : css });
            }

            offset += size;
        });

        return res;

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
            var selfMinWidth = params.type === 'fixed'? params.width : params.minWidth,
                selfMinHeight = params.type === 'fixed'? params.height : params.minHeight;

            if(params.childLayout) {
                var childMinSize = params.childLayout._getMinSize();
                res.width += Math.max(childMinSize.width, selfMinWidth);
                res.height += Math.max(childMinSize.height, selfMinHeight);
            }
            else if(props.size === 'height') {
                res.height += selfMinHeight;
            }
            else {
                res.width += selfMinWidth;
            }
        });

        return this._minSize = res;

    },

    destruct : function() {

        this._removeFromParent();
        this.__base.apply(this, arguments);

    }
});