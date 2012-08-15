function AnimationContainer (pAnimation) {
	A_CLASS;

	debug_assert(pAnimation, 'you must specify animation');

	// Enum([
	// 	PRIORITY_LOW = 0,
	// 	PRIORITY_HIGH = 1
	// 	], ANIMATION_PRIORITY, a.Animation);

	this._bEnable = true;
	this._fStartTime = 0;
	this._fSpeed = 1.0;
	this._bLoop = false;
	this._pAnimation = pAnimation;
	this._fDuration = pAnimation._fDuration;
	
	this.grab(pAnimation);
}

EXTENDS(AnimationContainer, a.AnimationBase);

PROPERTY(AnimationContainer, 'animationName',
	function () {
		return this._pAnimation.name;
	});

AnimationContainer.prototype.enable = function () {
    'use strict';
    
	this._bEnable = true;
};

AnimationContainer.prototype.disable = function () {
    'use strict';
    
	this._bEnable = false;
};

AnimationContainer.prototype.isEnabled = function () {
    'use strict';
    
	return this._bEnable;
};

AnimationContainer.prototype.setStartTime = function (fTime) {
    'use strict';

	this._fStartTime = fTime;
};

AnimationContainer.prototype.getStartTime = function () {
    'use strict';
    
	return this._fStartTime;
};

AnimationContainer.prototype.setSpeed = function (fSpeed) {
    'use strict';

	this._fSpeed = fSpeed;
	this._fDuration = this._pAnimation._fDuration / fSpeed;
};

AnimationContainer.prototype.useLoop = function (bValue) {
    'use strict';
    
	this._bLoop = bValue;
};

AnimationContainer.prototype.inLoop = function () {
    'use strict';
    
	return this._bLoop;
};

AnimationContainer.prototype.frame = function (sName, fTime) {
    'use strict';

    if (!this._bEnable) {
    	return null;
    }

    fTime = fTime * this._fSpeed - this._fStartTime;
    fTime = fTime < 0? 0: fTime;

    if (this._bLoop) {
    	fTime = fTime % (this._pAnimation._fDuration);
    }

	return this._pAnimation.frame(sName, fTime);
};

A_NAMESPACE(AnimationContainer);

