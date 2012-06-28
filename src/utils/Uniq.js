// /**
//  * Manager of unique objects.
//  * @ctor
//  * @system
//  */


/**
 * Base hash class.
 * @constructor
 */
function HashBase () {
	'use strict';
	
	Enum([
		CHANGEABLE = 0 //<! determines if the hash be updated
		], HASH_OPTIONS, a.HashBase);
	this._eOptions = 0;
	this._isHashObject = true;
}

/**
 * Get hash options.
 * @return {Int} Options.
 */
HashBase.prototype.getOptions = function () {
    'use strict';
    
	return this._eOptions;
};

HashBase.prototype.getOption = function (eOption) {
    'use strict';

	return TEST_BIT(this._eOptions, eOption);
};

/**
 * Set hash option.
 * @param {HASH_OPTIONS} eOption Option.
 * @param {Boolean} bValue Is set?
 */
HashBase.prototype.setOption = function (eOption, bValue) {
    'use strict';
    
	SET_BIT(this._eOptions, eOption, bValue);
};

/**
 * Allow for hash to be changeable.
 * @param  {Boolean} bValue Allow/Disallow
 */
HashBase.prototype.changeable = function (bValue) {
	'use strict';

	SET_BIT(this._eOptions, a.HashBase.CHANGEABLE, bValue);
};
HashBase.prototype.isChangeable = function () {
	'use strict';
	
	return TEST_BIT(this._eOptions, a.HashBase.CHANGEABLE);
};
HashBase.prototype.setup = function (pData) {
	'use strict';
	
	return false;
};

A_NAMESPACE(HashBase);


/**
 * @constructor
 */
function StringHash () {
	'use strict';
	
	A_CLASS;

	Enum([
		CHANGEABLE = 0, //<! determines if the hash be updated
		ALGORITHM_MD5 = 0x10
	], STRINGHASH_OPTIONS, a.StringHash);

	this._sHash = null;
}

EXTENDS(StringHash, a.HashBase);

/**
 * @property setOption(STRINGHASH_OPTIONS eOption, bValue)
 * @memberof StringHash
 */

StringHash.prototype.toString = function() {
	'use strict';
	
	return this._sHash;
};


StringHash.prototype.setup = function(sHash) {
	'use strict';
	
	if (this._sHash === null || this.isChangeable()) {
		if (this.getOption(a.StringHash.ALGORITHM_MD5)) {
			sHash = sHash.md5();
		}

		this._sHash = sHash;	
		return true;
	}

	return false;
};
 
A_NAMESPACE(StringHash);


function Unique () {
	'use strict';

	var sHash = this.computeHash(arguments);
	var pHashMap = statics._pHashMap;
	
	if (!pHashMap) {
		pHashMap = statics._pHashMap = {};
	}
	else if (pHashMap[sHash]) {
		return pHashMap[sHash];
	}

	this._sHash = sHash;
	pHashMap[sHash] = this;
}


A_NAMESPACE(Unique);