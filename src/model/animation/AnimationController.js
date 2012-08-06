function AnimationContainer (pAnimation) {
	debug_assert(pAnimation, 'you must specify animation');

	Enum([
		PRIORITY_LOW = 0,
		PRIORITY_HIGH = 1
		], ANIMATION_PRIORITY, a.Animation);


	this.bEnable = true;
	this.fStartTime = 0;
	this.ePriority = a.Animation.PRIORITY_HIGH;
	this.fSpeed = 1.0;
	this.fWeight = 1.0;
	this.pAnimation = pAnimation;

	this._fTotalWeight = 0;
}

PROPERTY(AnimationContainer, 'animationName',
	function () {
		return this.pAnimation.name;
	});


A_NAMESPACE(AnimationContainer);

function AnimationController (eOptions) {
    'use strict';
	
    Enum([
		MODE_REPEAT = FLAG(0)
	], ANIMATION_OPTIONS, a.Animation);

	this._pAnimations = [];
	this._fPriorityBlend = 1.0;

	this._eOptions = 0;
	this._fDuration = 0;

	if (eOptions) {
		this.setOptions(eOptions);
	}
}

PROPERTY(AnimationController, 'totalAnimations',
	function () {
		return this._pAnimations.length;
	});

AnimationController.prototype.setPriorityBlend = function (fPriorityBlend) {
    'use strict';
    
	this._fPriorityBlend = fPriorityBlend;
};

AnimationController.prototype.setAnimationPriority = function (iAnimation, ePriority) {
    'use strict';
    
	this._pAnimations[iAnimation].ePriority = ePriority;
};

AnimationController.prototype.setOptions = function (eOptions) {
    'use strict';
    
	this._eOptions |= eOptions;
};

AnimationController.prototype.getOptions = function () {
    'use strict';
    
	return this._eOptions;
};

AnimationController.prototype.getAnimation = function () {
    'use strict';
    
	if (typeof arguments[0] === 'number') {
		return this._pAnimations[arguments[0]] || null;
	}

	var sName = arguments[0];
	var pAnimations = this._pAnimations;

	for (var i = 0, n = pAnimations.length; i < n; ++ i) {
		var pAnimationContainer = pAnimations[i];

		if (pAnimationContainer.animationName === sName) {
			return pAnimationContainer.pAnimation;
		}
	}

	return null;
};

AnimationController.prototype.addAnimation = function (pAnimation) {
    'use strict';
    
    if (arguments[0] instanceof Array) {
    	for (var i = 0, n = arguments[0].length; i < n; ++ i) {
			if (!this.addAnimation(arguments[0][i])) {
				return false;
			}
		}

		return true;
    }

    if (this.getAnimation(pAnimation.name)) {
    	warning('animation with name <' + pAnimation.name + '> already exists in this controller.');
    }

    var pAnimationContainer = new a.AnimationContainer(pAnimation);

	this._pAnimations.push(pAnimationContainer);
	this._fDuration = Math.max(this._fDuration, pAnimation.duration);

	return this.update();
};

AnimationController.prototype.update = function () {
    'use strict';
    
    var pAnimations = this._pAnimations;
    var fTotalWeight = 0;

	for (var i = 0, n = pAnimations.length; i < n; ++ i) {
		fTotalWeight += this._pAnimations[i].fWeight;
	}

	for (var i = 0, n = pAnimations.length; i < n; ++ i) {
		var pAnimationContainer = this._pAnimations[i];

		pAnimationContainer._fTotalWeight = pAnimationContainer.fWeight / fTotalWeight;
	}

	return true;
};

AnimationController.prototype.time = function (fTime) {
    'use strict';
 
    if (this._eOptions & a.Animation.MODE_REPEAT) {
    	fTime = fTime - Math.floor(fTime / this._fDuration) * this._fDuration;
    }

    var pAnimations = this._pAnimations;
    var pAnimationContainer;
   
    var fHPR = this._fPriorityBlend;
    var fLPR = 1.0 - this._fPriorityBlend;
    var fWeight, fPriorityBlend;
    var fAnimationTime;

	for (var i = 0, n = pAnimations.length; i < n; ++ i) {
		pAnimationContainer = this._pAnimations[i];

		if (!pAnimationContainer.bEnable) {
			continue;
		}

		fAnimationTime = fTime - pAnimationContainer.fStartTime;

		if (fAnimationTime < 0.0) {
			continue;
		}

		fAnimationTime *= pAnimationContainer.fSpeed;
		fPriorityBlend = pAnimationContainer.ePriority === a.Animation.PRIORITY_HIGH? fHPR: fLPR;
		fWeight = pAnimationContainer._fTotalWeight * fPriorityBlend;
		pAnimationContainer.pAnimation.time(fAnimationTime, fWeight);	
	}
};

AnimationController.prototype.bind = function (pTarget) {
    'use strict';
    
	var pAnimations = this._pAnimations;

	for (var i = 0, n = pAnimations.length; i < n; ++ i) {
		this._pAnimations[i].pAnimation.bind(pTarget);
	}
};

A_NAMESPACE(AnimationController);