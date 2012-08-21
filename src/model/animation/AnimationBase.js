function AnimationBase () {
	this._pTargetMap = {};
    this._pTargetList = [];
	
	this._fDuration = 0;
	this._sName = ('animation' + a.sid());
}

A_NAMESPACE(AnimationBase);

PROPERTY(AnimationBase, 'duration',
	function () {
		return this._fDuration;
	});

PROPERTY(AnimationBase, 'name',
	function () {
		return this._sName;
	},
	function (sName) {
		this._sName = sName;
	});

AnimationBase.prototype.frame = function (sName, fTime) {
    'use strict';
   		
 	return null;
};


AnimationBase.prototype.apply = function (fTime) {
    'use strict';
    
    var pTargetList = this._pTargetList;
    var pTarget;
    var pFrame;
    var pTransform;

	for (var i = 0; i < pTargetList.length; ++ i) {
		pFrame = this.frame(pTargetList[i].name, fTime);
		pTarget = pTargetList[i].target;

		if (!pFrame || !pTarget) {
			continue;
		}

		pTransform = pFrame.toMatrix();
		pTarget.accessLocalMatrix().set(pTransform);
	};
};

AnimationBase.prototype.addTarget = function (sName, pTarget) {
    'use strict';
    
    pTarget = pTarget || null;

    var pPointer = this._pTargetMap[sName];

    if (pPointer) {
    	pPointer.target = pTarget || pPointer.target || null;
    	return pPointer;
    }

    pPointer = {
		target: pTarget,
		index: this._pTargetList.length,
		name: sName
	};

    this._pTargetList.push(pPointer);
	this._pTargetMap[sName] = pPointer;

	return pPointer;
};

AnimationBase.prototype.setTarget = function (sName, pTarget) {
    'use strict';

    debug_assert(pTarget, 'target with name <' + sName + '> must have a value');

    var pPointer = this._pTargetMap[sName];
	pPointer.target = pTarget;
	return pPointer;
};

AnimationBase.prototype.getTarget = function (sTarget) {
    'use strict';
    
	return this._pTargetMap[sTarget];
};

AnimationBase.prototype.grab = function (pAnimationBase) {
    'use strict';
    
    var pAdoptTargets = pAnimationBase._pTargetList;

	for (var i = 0; i < pAdoptTargets.length; ++ i) {
		
		if (!pAdoptTargets[i].target) {
			warning('cannot grab target <' + pAdoptTargets[i].name + '>, becaus "target" is null');
			continue;
		}

		this.addTarget(pAdoptTargets[i].name, pAdoptTargets[i].target);
	};
};