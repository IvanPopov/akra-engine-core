// /**
//  * Manager of unique objects.
//  * @ctor
//  * @system
//  */
// function UniqueManager(pEngine) {
// 	this._pEngine = pEngine;
// 	this._pHashMap = {};

// 	for (var i = 0; i < a._pUniqObjects.length; ++ i) {
// 		this._pHashMap[a._pUniqObjects[i]] = {};
// 	};
// }


// /**
//  * Create uniq object.
//  * @param  {Function} pObjectType Type of object(object constructor).
//  * @param  {Object} pHashData   Data for hash computing.
//  * @return {Object}             Object with type pObjectType
//  */
// UniqueManager.prototype.create = function(pObjectType, pHashData) {
// 	var sType = pObjectType._sUniqType;
// 	var sHash = pObjectType.uHash(pHashData);
// 	var pObjectPool = this._pHashMap[sType];
// 	var pObject = pObjectPool[sHash];
	
	
// 	if (!pObject) {
// 		pObject = pObjectType.uCreate(this._pEngine, pHashData);
// 		pObject._sUniqHash = sHash;
// 		pObjectPool[sHash] = pObject;
// 	}

// 	return pObject;
// };

// /**
//  * Update object hash
//  * @param  {Object} pObject   Uniq object.
//  * @param  {Object} pHashData Hash data.
//  * @return {Boolean}          Result.
//  */
// UniqueManager.prototype.update = function (pObject, pHashData) {
// 	var pObjectType = pObject.constructor;
// 	var sType = pObjectType._sUniqType;
// 	var pObjectPool = this._pHashMap[sType];

// 	var sHashNext = pObjectType.uHash(pHashData);
// 	var pObjectNext = pObjectPool[sHashNext];

// 	var sHashPrev = pObject._sUniqHash;
// 	var pObjectPrev = pObject;

// Ifdef(__DEBUG);
// 	debug_assert(!pObjectNext, 
// 		'you cannot use given hash, because it already in use.');
// Elseif();	
// 	if (pObjectNext) {
// 		return false;
// 	}
// Endif();

// 	pObject._sUniqHash = sHashNext;
// 	pObjectPool[sHashNext] = pObject;

// 	if (sHashPrev) {
// 		delete pObjectPool[sHashPrev];
// 	}

// 	return true;
// };

// /**
//  * Create unique object in any place.
//  * @def
//  */
// Define(A_UNIQ(pObject, pEngine, pHashData), function () {
// 	pEngine.pUniqManager.getUniq(pObject, pHashData);
// });

// /**
//  * Create unique object in engine.
//  * @def
//  */
// Define(A_UNIQ(pObject, pHashData), function () {
// 	this.pUniqManager.create(pObject, pHashData);
// });

// /**
//  * Declare object as unique.
//  * @def
//  */
// Define(A_UNIQ(pHashData), function () {
// 	this._pUniqManager.update(this, pHashData);
// });


// /**
//  * @private
//  * @type {Array}
//  * List of unique object types.
//  */
// a._pUniqObjects = [];

// /**
//  * Register object type as unique.	
//  * @system
//  * @param  {Function} pObjectType Object constructor.
//  * @param  {Function} fnHash  Specify hash function.
//  * @param  {Function} fnCreate Specify creation function.
//  */
// a.registerUniqObject = function (pObjectType, fnHash, fnCreate) {
// 	pObjectType._sUniqType = GET_FUNC_NAME(pObjectType);
	
// 	if (!pObjectType.uCreate) {
// 		pObjectType.uCreate = fnCreate || function (pEngine, pHashData) {
// 			return new pObjectType(pEngine, pHashData);
// 		};
// 	}

// 	if (!pObjectType.uHash) {
// 		pObjectType.uHash = fnHash || pObjectType.prototype.uHash;
// 	}

// 	debug_assert(pObjectType.uHash, 
// 		'you must specify hash function for uniq object');

// 	a._pUniqObjects.push(pObjectType._sUniqType);
// };

// /**
//  * Register unique object.
//  * @def
//  */
// Define(A_REGISTER_UNIQ_OBJECT(__ARGS__), function () {
// 	a.registerUniqObject(__ARGS__);
// });

// /**
//  * Unique object base class.
//  * @ctor
//  * @param {Engine} pEngine Engine instance.
//  */
// function Unique (pEngine) {
// 	this._sUniqHash = null;
// 	this._pUniqManager = pEngine.pUniqManager;
// }

// a.UniqueManager = UniqueManager;
// a.Unique = Unique;


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
	
	this._pHash = null;

	var pLast = arguments[arguments.length - 1];

	if (pLast._isHashObject) {
		return this._initUnique(pLast);
	}	
}

Define(a.Unique.BUSY, 1);


Unique.prototype._initUnique = function (pHash) {
    //'use strict';

    debug_assert(this._pHash === null, 'unique object already initialized.');

	STATIC(_pHashMap, {});

	var pHashMap = statics._pHashMap;
	var pUniqCopy = pHashMap[pHash];

	if (pUniqCopy !== a.Unique.BUSY && pUniqCopy !== undefined) {
		return pUniqCopy;
	}

	if (statics.createUnique) {
		if (pHashMap[pHash] === a.Unique.BUSY) {
			return;
		}

		pHashMap[pHash] = a.Unique.BUSY;
		//FIXME: Chrome Bitch!!! APPLY!
		pUniqCopy = statics.createUnique.apply(window, arguments);
		pHashMap[pHash] = pUniqCopy;
		pUniqCopy._pHash = pHash;
		return pUniqCopy;
	}

	this._pHash = pHash;
	pHashMap[pHash] = this;

	return null;
};

A_NAMESPACE(Unique);