Define(A_FORMAT(format), function () {
    (function (f) {
        a.binaryTemplate.set(f);
    })(format);
});

function BinTemplate (pData) {
	this._pData = {};
	this._nTypes = 0;
	this._pNum2Tpl = {};
	this._pTpl2Num = {};

    if (pData) {
        this.set(pData);
    }
}

BinTemplate.prototype.getType = function (iType) {
    'use strict';
    debug_assert(this._pNum2Tpl[iType] !== undefined, 'unknown type detected: ' + iType);
	return this._pNum2Tpl[iType];
};

BinTemplate.prototype.getTypeId = function (sType) {
    'use strict';
    debug_assert(this._pTpl2Num[sType] !== undefined, 'unknown type detected: ' + sType);
	return this._pTpl2Num[sType];
};

BinTemplate.prototype.set = function(pTemplate) {
	var iType;

    for (var i in pTemplate) {
        this._pData[i] = pTemplate[i];
        
        iType = this._nTypes ++;

        this._pNum2Tpl[iType] = i;
        this._pTpl2Num[i] = iType;
        //trace(i, iType)
    }
};

BinTemplate.prototype.detectType = function (pObject) {
	'use strict';
	
	return a.getClass(pObject);
};

BinTemplate.prototype.properties = function (sType) {
    'use strict';
    
    var pProperties = this._pData[sType];

	if (typeof pProperties === 'string') {
		return this.properties(this.resolveType(sType));
	}

    return pProperties;
};

BinTemplate.prototype.resolveType = function (sType) {
    'use strict';
    
	var pTemplates = this._pData;
	var pProperties = pTemplates[sType];
	
	while (typeof pProperties === 'string') {
        sType = pProperties;
        pProperties = pTemplates[sType];
    }

	debug_assert(typeof pProperties !== 'string', 'cannot resolve type: ' + sType);

    return sType;
};

BinTemplate.prototype.data = function () {
    'use strict';
    
    return this._pData;
};

A_NAMESPACE(BinTemplate);

a.binaryTemplate = new a.BinTemplate();
