function AnimationBase () {
	this._pTargetMap = {};
	this._pTargetList = [];
	this._pDuration = 0;
}

A_NAMESPACE(AnimationBase);

AnimationBase.prototype.frame = function (sName, fTime) {
    'use strict';
   	
};


AnimationBase.prototype.apply = function (fTime) {
    'use strict';
    
	
};

AnimationBase.prototype.addTarget = function (sName, pTarget) {
    'use strict';
    
    pTarget = pTarget || null;

    debug_assert(this._pTargetMap[sName] === undefined, 'target already exists');

    this._pTargetList.push(pTarget);
	this._pTargetMap[sName] = pTarget;
};

AnimationBase.prototype.setTarget = function (sName, pTarget) {
    'use strict';
    
	this._pTargetMap[sName] = pTarget;
};