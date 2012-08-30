function AnimationBlend () {
    A_CLASS;

	this._pAnimationList = [];	
	this.duration = MAX_UINT32;
}

EXTENDS(AnimationBlend, a.AnimationBase);

AnimationBlend.prototype.addAnimation = function (pAnimation, fWeight, pMask) {
    'use strict';
    debug_assert(pAnimation, 'animation must be setted.');

	this._pAnimationList.push(null);
	return this.setAnimation(this._pAnimationList.length - 1, pAnimation, fWeight, pMask);
};

AnimationBlend.prototype.setAnimation = function (iAnimation, pAnimation, fWeight, pMask) {
    'use strict';
    
    var pPointer = this._pAnimationList[iAnimation];

    if (!pAnimation) {
    	this._pAnimationList[iAnimation] = null;
    	return iAnimation;
    }

    if (!pPointer) {
    	pPointer = {
			animation: pAnimation,
			weight: fWeight || 1.0,
			mask: pMask || null
		};

		this._pAnimationList[iAnimation] = pPointer;
	}

	
	this.grab(pAnimation);
	return iAnimation;
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

AnimationBlend.prototype.frame = function (sName, fTime) {
    'use strict';

	var pAnimationList = this._pAnimationList;
	var pResultFrame = a.AnimationFrame().reset();
	var pFrame;
	var pMask;
	var pPointer;

	var fBoneWeight;
	var fWeight;

	for (var i = 0; i < pAnimationList.length; i++) {
		pPointer = pAnimationList[i];

		if (!pPointer) {
			continue;
		}

		pMask = pPointer.mask;
		pFrame = pPointer.animation.frame(sName, fTime);
		fBoneWeight = 1.0;

		if (pMask) {
			fBoneWeight = ifndef(pMask[sName], 1.0);
		}

		fWeight = fBoneWeight * pPointer.weight;

		if (pFrame && fWeight > 0.0) {
			pResultFrame.add(pFrame.mult(fWeight));
		}
	};

	if (pResultFrame.fWeight === 0.0) {
		return null;
	}

	return pResultFrame.normilize();
};

A_NAMESPACE(AnimationBlend);

function AnimationSwitch () {
	A_CLASS;
}

EXTENDS(AnimationSwitch, a.AnimationBlend);

DISMETHOD(AnimationSwitch, addAnimation);

AnimationSwitch.prototype.setAnimationIn = function (pAnimation, pMask) {
    'use strict';
    return this.setAnimation(0, pAnimation, 1.0, pMask);
};

AnimationSwitch.prototype.setAnimationOut = function (pAnimation, pMask) {
    'use strict';
	return this.setAnimation(1, pAnimation, 1.0, pMask);
};

AnimationSwitch.prototype.setStartTime = function (fTime) {

}

AnimationSwitch.prototype.setDuration = function (fTime) {
    'use strict';
    
	
};

A_NAMESPACE(AnimationSwitch);