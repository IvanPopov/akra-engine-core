function AnimationBlend () {
    A_CLASS;

	this._pAnimationList = [];	
	this.duration = 0;
}

EXTENDS(AnimationBlend, a.AnimationBase);

PROPERTY(AnimationBlend, 'totalAnimations',
	function () {
		return this._pAnimationList.length;
	});

AnimationBlend.prototype.play = function (fRealTime) {
    'use strict';
    
	var pAnimationList = this._pAnimationList;
	var n = pAnimationList.length;
	//trace('AnimationBlend::play(', this.name, fRealTime, ')');
	for (var i = 0; i < n; ++ i) {

		pAnimationList[i].realTime = fRealTime;
		pAnimationList[i].time = fRealTime * pAnimationList[i].acceleration;
		//trace(pAnimationList[i]);
	}

	this.fire('play');
};

AnimationBlend.prototype.stop = function () {
    'use strict';
    
	this.fire('stop', this._fTime);
};


AnimationBlend.prototype.bind = function(pTarget) {
	var pAnimationList = this._pAnimationList;

	for (var i = 0; i < pAnimationList.length; ++ i) {
		var pAnim = pAnimationList[i].animation;
		pAnim.bind(pTarget);	
		this.grab(pAnim, true);
	}
};

AnimationBlend.prototype.addAnimation = function (pAnimation, fWeight, pMask) {
    'use strict';
    debug_assert(pAnimation, 'animation must be setted.');

	this._pAnimationList.push(null);
	return this.setAnimation(this._pAnimationList.length - 1, pAnimation, fWeight, pMask);
};

AnimationBlend.prototype.setAnimation = function (iAnimation, pAnimation, fWeight, pMask) {
    'use strict';
    
    debug_assert(iAnimation <= this._pAnimationList.length, 'invalid animation slot: ' + iAnimation + '/' + this._pAnimationList.length);

    var pPointer = this._pAnimationList[iAnimation];
    var me = this;

    if (!pAnimation) {
    	this._pAnimationList[iAnimation] = null;
    	return iAnimation;
    }

    if (!pPointer) {
    	pPointer = {
			animation: pAnimation,
			weight: fWeight || 1.0,
			mask: pMask || null,
			acceleration: 1.0,
			time: 0.0,
			realTime: 0.0
		};

		pAnimation.on('updateDuration', function () {
			me.updateDuration();
			//trace('duration of inner animation updated.');
		})

		if (iAnimation == this._pAnimationList.length) {
			this._pAnimationList.push(pPointer);
		}
		else {
			this._pAnimationList[iAnimation] = pPointer;
		}
	}

	///this.duration = Math.min(this.duration, pAnimation.duration);
	trace('animation added to blend >> ', this._pAnimationList);
	this.grab(pAnimation);
	this.updateDuration();
	return iAnimation;
};

AnimationBlend.prototype.updateDuration = function () {
    'use strict';
    
	var fWeight = 0;
	var fSumm = 0;
	var pAnimationList = this._pAnimationList;
	var n = pAnimationList.length;

	for (var i = 0; i < n; ++ i) {
		if (pAnimationList[i] === null) {
			continue;
		}

		fSumm += pAnimationList[i].weight * pAnimationList[i].animation._fDuration;
		fWeight += pAnimationList[i].weight;
	}

	this._fDuration = fSumm / fWeight;

	for (var i = 0; i < n; ++ i) {
		if (pAnimationList[i] === null) {
			continue;
		}

		pAnimationList[i].acceleration = pAnimationList[i].animation._fDuration / this._fDuration;
		//trace(pAnimationList[i].animation.name, '> acceleration > ', pAnimationList[i].acceleration);
	}

	this.fire('updateDuration');
};

AnimationBlend.prototype.getAnimationIndex = function (sName) {
    'use strict';
    
   	var pAnimationList = this._pAnimationList;

	for (var i = 0; i < pAnimationList.length; i++) {
		if (pAnimationList[i].animation.name === sName) {
			return i;
		}
	};

	return -1;
};

AnimationBlend.prototype.getAnimation = function (iAnimation) {
    'use strict';
    
	if (typeof arguments[0] === 'string') {
    	iAnimation = this.getAnimationIndex(arguments[0]);
    }

	return this._pAnimationList[iAnimation].animation;
};

AnimationBlend.prototype.getAnimationWeight = function (iAnimation) {
    'use strict';
    
	if (typeof arguments[0] === 'string') {
		iAnimation = this.getAnimationIndex(arguments[0]);
	}

	return this._pAnimationList[iAnimation].weight;
};

AnimationBlend.prototype.setAnimationWeight = function (iAnimation, fWeight) {
    'use strict';
    
    var pAnimationList = this._pAnimationList;

    if (arguments.length === 1) {
    	fWeight = arguments[0];
    	
    	for (var i = 0; i < pAnimationList.length; i++) {
    		pAnimationList[i].weight = fWeight;
    	};
    }
    else {
	    if (typeof arguments[0] === 'string') {
	    	iAnimation = this.getAnimationIndex(arguments[0]);
	    }

	    //trace('set weight for animation: ', iAnimation, 'to ', fWeight);

		pAnimationList[iAnimation].weight = fWeight;
	}

	this.updateDuration();

	return true;
};

AnimationBlend.prototype.setAnimationMask = function (iAnimation, pMask) {
    'use strict';
    
	if (typeof arguments[0] === 'string') {
    	iAnimation = this.getAnimationIndex(arguments[0]);
    }

	this._pAnimationList[iAnimation].mask = pMask;

	return true;
};

AnimationBlend.prototype.getAnimationMask = function(iAnimation) {
	if (typeof arguments[0] === 'string') {
    	iAnimation = this.getAnimationIndex(arguments[0]);
    }

	return this._pAnimationList[iAnimation].mask;
};

AnimationBlend.prototype.createAnimationMask = function(iAnimation) {
	
	if (arguments.length === 0) {
		return a.AnimationBase.prototype.createAnimationMask.call(this);
	}

	if (typeof arguments[0] === 'string') {
    	iAnimation = this.getAnimationIndex(arguments[0]);
    }

    var pAnimation = this._pAnimationList[iAnimation].animation;
	return pAnimation.createAnimationMask();
};

AnimationBlend.prototype.frame = function (sName, fRealTime) {
    'use strict';

	var pAnimationList = this._pAnimationList;
	var pResultFrame = a.AnimationFrame().reset();
	var pFrame;
	var pMask;
	var pPointer;
	var fAcceleration;

	var fBoneWeight;
	var fWeight;
	var iAnim = 0;


	for (var i = 0; i < pAnimationList.length; i++) {
		pPointer = pAnimationList[i];

		if (!pPointer) {
			continue;
		}

		fAcceleration = pPointer.acceleration;
		pMask = pPointer.mask;
		fBoneWeight = 1.0;

		pPointer.time = pPointer.time + (fRealTime - pPointer.realTime) * fAcceleration;
    	pPointer.realTime = fRealTime;

		pFrame = pPointer.animation.frame(sName, pPointer.time);
		

		if (pMask) {
			fBoneWeight = ifndef(pMask[sName], 1.0);
		}

		fWeight = fBoneWeight * pPointer.weight;

		if (pFrame && fWeight > 0.0) {
			iAnim ++;
			pResultFrame.add(pFrame.mult(fWeight), iAnim === 1);//first, if 1
		}
	}

	if (pResultFrame.fWeight === 0.0) {
		return null;
	}

	return pResultFrame.normilize();
};

//

A_NAMESPACE(AnimationBlend);

/************************************************************************************************
 * Animation switch. 
 ************************************************************************************************/

// function AnimationSwitch () {
// 	A_CLASS;
// }

// EXTENDS(AnimationSwitch, a.AnimationBlend);

// DISMETHOD(AnimationSwitch, addAnimation);

// AnimationSwitch.prototype.setAnimationIn = function (pAnimation, pMask) {
//     'use strict';
//     return this.setAnimation(0, pAnimation, 1.0, pMask);
// };

// AnimationSwitch.prototype.setAnimationOut = function (pAnimation, pMask) {
//     'use strict';
// 	return this.setAnimation(1, pAnimation, 1.0, pMask);
// };

// AnimationSwitch.prototype.setStartTime = function (fTime) {

// }

// AnimationSwitch.prototype.setDuration = function (fTime) {
//     'use strict';
    
	
// };

// A_NAMESPACE(AnimationSwitch);