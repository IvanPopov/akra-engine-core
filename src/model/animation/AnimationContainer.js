function AnimationContainer (pAnimation) {
	A_CLASS;

	//

	// Enum([
	// 	PRIORITY_LOW = 0,
	// 	PRIORITY_HIGH = 1
	// 	], ANIMATION_PRIORITY, a.Animation);

	this._bEnable = true;
	this._fStartTime = 0;
	this._fSpeed = 1.0;
	this._bLoop = false;
	this._pAnimation = null;
	this._bReverse = false;
	//время, определяющее кадр анимации, в случае, если она находится в паузе.
	this._fTime = 0;
	this._bPause = false;

	//определена ли анимация до первого и после последнего кадров
	this._bLeftInfinity = true;
	this._bRightInfinity = true;

	if (pAnimation) {
		this.setAnimation(pAnimation);
	}
}

EXTENDS(AnimationContainer, a.AnimationBase);

PROPERTY(AnimationContainer, 'animationName',
	function () {
		return this._pAnimation.name;
	});

AnimationContainer.prototype.bind = function(pTarget) {
	this._pAnimation.bind(pTarget);
	this.grab(this._pAnimation, true);
};

AnimationContainer.prototype.setAnimation = function (pAnimation) {
    'use strict';

	debug_assert(!this._pAnimation, 'anim. already exists');

	this._pAnimation = pAnimation;
	this._fDuration = pAnimation._fDuration;
	this.name = 'container-' + pAnimation.name;

	this.grab(pAnimation);
};

AnimationContainer.prototype.getAnimation = function () {
    'use strict';
    
	return this._pAnimation;
};

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

AnimationContainer.prototype.leftInfinity = function(bValue) {
	this._bLeftInfinity = bValue;
};

AnimationContainer.prototype.rightInfinity = function(bValue) {
	this._bRightInfinity = bValue;
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

AnimationContainer.prototype.reverse = function(bValue) {
	this._bReverse = bValue;
};

AnimationContainer.prototype.isReversed = function() {
	return this._bReverse;
};

AnimationContainer.prototype.pause = function (bValue) {
    'use strict';
    
	this._bPause = bValue;
};

AnimationContainer.prototype.rewind = function (fTime) {
    'use strict';
    
	this._fTime = fTime;
};

AnimationContainer.prototype.isPaused = function () {
    'use strict';
    
	return this._bPause;
};

AnimationContainer.prototype.time = function (fTime) {
    'use strict';
   
	if (!this._bEnable) {
    	return null;
    }

    if (this._bPause) {
    	return this._fTime;
    }

    fTime = (fTime - this._fStartTime) * this._fSpeed;

    if (this._bLoop) {
    	fTime = Math.mod(fTime, (this._pAnimation._fDuration));
    	if (this._bReverse) {
    		fTime = (this._pAnimation._fDuration) - fTime; 
    	}
    }

    this._fTime = fTime;
    return fTime;
};

AnimationContainer.prototype.frame = function (sName, fTime) {
    'use strict';

    fTime = this.time(fTime);

    if (!this._bLeftInfinity && fTime < this._fStartTime) {
    	return null;
    }

	if (!this._bRightInfinity && fTime > this._fDuration) {
    	return null;
    }    

	return this._pAnimation.frame(sName, fTime);
};

A_NAMESPACE(AnimationContainer);

