/**
 * Manager of unique objects.
 * @ctor
 * @system
 */
function UniqueManager(pEngine) {
	this._pEngine = pEngine;
	this._pHashMap = {};

	for (var i = 0; i < a._pUniqObjects.length; ++ i) {
		this._pHashMap[a._pUniqObjects[i]] = {};
	};
}


/**
 * Create uniq object.
 * @param  {Function} pObjectType Type of object(object constructor).
 * @param  {Object} pHashData   Data for hash computing.
 * @return {Object}             Object with type pObjectType
 */
UniqueManager.prototype.create = function(pObjectType, pHashData) {
	var sType = pObjectType._sUniqType;
	var sHash = pObjectType.uHash(pHashData);
	var pObjectPool = this._pHashMap[sType];
	var pObject = pObjectPool[sHash];
	
	
	if (!pObject) {
		pObject = pObjectType.uCreate(this._pEngine, pHashData);
		pObject._sUniqHash = sHash;
		pObjectPool[sHash] = pObject;
	}

	return pObject;
};

/**
 * Update object hash
 * @param  {Object} pObject   Uniq object.
 * @param  {Object} pHashData Hash data.
 * @return {Boolean}          Result.
 */
UniqueManager.prototype.update = function (pObject, pHashData) {
	var pObjectType = pObject.constructor;
	var sType = pObjectType._sUniqType;
	var pObjectPool = this._pHashMap[sType];

	var sHashNext = pObjectType.uHash(pHashData);
	var pObjectNext = pObjectPool[sHashNext];

	var sHashPrev = pObject._sUniqHash;
	var pObjectPrev = pObject;

Ifdef(__DEBUG);
	debug_assert(!pObjectNext, 
		'you cannot use given hash, because it already in use.');
Elseif();	
	if (pObjectNext) {
		return false;
	}
Endif();

	pObject._sUniqHash = sHashNext;
	pObjectPool[sHashNext] = pObject;

	if (sHashPrev) {
		delete pObjectPool[sHashPrev];
	}

	return true;
};

/**
 * Create unique object in any place.
 * @def
 */
Define(A_UNIQ(pObject, pEngine, pHashData), function () {
	pEngine.pUniqManager.getUniq(pObject, pHashData);
});

/**
 * Create unique object in engine.
 * @def
 */
Define(A_UNIQ(pObject, pHashData), function () {
	this.pUniqManager.create(pObject, pHashData);
});

/**
 * Declare object as unique.
 * @def
 */
Define(A_UNIQ(pHashData), function () {
	this._pUniqManager.update(this, pHashData);
});


/**
 * @private
 * @type {Array}
 * List of unique object types.
 */
a._pUniqObjects = [];

/**
 * Register object type as unique.	
 * @system
 * @param  {Function} pObjectType Object constructor.
 * @param  {Function} fnHash  Specify hash function.
 * @param  {Function} fnCreate Specify creation function.
 */
a.registerUniqObject = function (pObjectType, fnHash, fnCreate) {
	pObjectType._sUniqType = GET_FUNC_NAME(pObjectType);
	
	if (!pObjectType.uCreate) {
		pObjectType.uCreate = fnCreate || function (pEngine, pHashData) {
			return new pObjectType(pEngine, pHashData);
		};
	}

	if (!pObjectType.uHash) {
		pObjectType.uHash = fnHash || pObjectType.prototype.uHash;
	}

	debug_assert(pObjectType.uHash, 
		'you must specify hash function for uniq object');

	a._pUniqObjects.push(pObjectType._sUniqType);
};

/**
 * Register unique object.
 * @def
 */
Define(A_REGISTER_UNIQ_OBJECT(__ARGS__), function () {
	a.registerUniqObject(__ARGS__);
});

/**
 * Unique object base class.
 * @ctor
 * @param {Engine} pEngine Engine instance.
 */
function Unique (pEngine) {
	this._sUniqHash = null;
	this._pUniqManager = pEngine.pUniqManager;
}

a.UniqueManager = UniqueManager;
a.Unique = Unique;