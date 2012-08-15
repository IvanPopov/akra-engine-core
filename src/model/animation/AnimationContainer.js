function AnimationContainer (pAnimation) {
	debug_assert(pAnimation, 'you must specify animation');

	// Enum([
	// 	PRIORITY_LOW = 0,
	// 	PRIORITY_HIGH = 1
	// 	], ANIMATION_PRIORITY, a.Animation);


	this._bEnable = true;
	this._fStartTime = 0;
	//this._ePriority = a.Animation.PRIORITY_HIGH;
	this._fSpeed = 1.0;
	//this._fWeight = 1.0;
	this._pAnimation = pAnimation;
}

PROPERTY(AnimationContainer, 'animationName',
	function () {
		return this._pAnimation.name;
	});

PROPERTY(AnimationContainer, 'duration',
	function () {
		return this._pAnimation.duration;//(this._pAnimation.duration + this._fStartTime) * fSpeed;
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
    trace('set start time:', fTime);
	this._fStartTime = fTime;
};

AnimationContainer.prototype.setSpeed = function (fSpeed) {
    'use strict';
    trace('set speed:', fSpeed);
	this._fSpeed = fSpeed;
};

AnimationContainer.prototype.update = function (fTime, bLoop) {
    'use strict';
    fTime = (fTime - this._fStartTime) * this._fSpeed;
	return this._bEnable? this._pAnimation.update(fTime < 0? 0: fTime, bLoop): 0;
};

A_NAMESPACE(AnimationContainer);

