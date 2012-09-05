function AnimationController (pEngine, eOptions) {
    'use strict';
	
    debug_assert(pEngine, 'engine must be.');

	this._pEngine = pEngine;
    this._pAnimations = [];
    this._eOptions = 0;
    this._pActiveAnimation = null;
    this._fnPlayAnimation = null;

	if (eOptions) {
		this.setOptions(eOptions);
	}
}

PROPERTY(AnimationController, 'totalAnimations',
	function () {
		return this._pAnimations.length;
	});

PROPERTY(AnimationController, 'active',
	function () {
		return this._pActiveAnimation;
	});

AnimationController.prototype.on = function (eEvent, fn) {
    'use strict';
    
	if (eEvent === 'play') {
		this._fnPlayAnimation = fn;
	}
};

AnimationController.prototype.getEngine = function() {
	return this._pEngine;
};

AnimationController.prototype.setOptions = function(eOptions) {
	// body...
};

AnimationController.prototype.addAnimation = function(pAnimation) {
	if (this.findAnimation(pAnimation.name)) {
		warning('Animation with name <' + pAnimation.name + '> already exists in this controller');
		return false;
	}

	//trace('animation controller :: add animation >> ', pAnimation.name);
	
	this._pAnimations.push(pAnimation);
	this._pActiveAnimation = pAnimation;
};


AnimationController.prototype.removeAnimation = function () {
    'use strict';
   
    var pAnimation = this.findAnimation(arguments[0]);
    var pAnimations = this._pAnimations;

	for (var i = 0; i < pAnimations.length; ++ i) { 
		if (pAnimations[i] === pAnimation) {
			pAnimations.splice(i, 1);
			trace('animation controller :: remove animation >> ', pAnimation.name);
			return true;
		}
	}

	return false;
};

AnimationController.prototype.findAnimation = function () {
    'use strict';
    
    var pAnimations = this._pAnimations;
    var iAnimation;
    var sAnimation;

	if (typeof arguments[0] === 'string') {
		sAnimation = arguments[0];

		for (var i = 0; i < pAnimations.length; ++ i) { 
			if (pAnimations[i].name === sAnimation) {
				return pAnimations[i];
			}
		}

		return null;
	}

	if (typeof arguments[0] === 'number') {
		iAnimation = arguments[0];
		return pAnimations[iAnimation] || null;
	}

	return arguments[0];
};

AnimationController.prototype.setAnimation = function (iAnimation, pAnimation) {
    'use strict';
    
    debug_assert(iAnimation < this._pAnimations.length, 'invalid animation slot');

	this._pAnimations[iAnimation] = pAnimation;
};

AnimationController.prototype.bind = function (pTarget) {
    'use strict';
    
	var pAnimations = this._pAnimations;

    for (var i = 0; i < pAnimations.length; ++ i) {
        pAnimations[i].bind(pTarget);
    }
};

AnimationController.prototype.play = function() {
	var pAnimation = this.findAnimation(arguments[0]);

	if (pAnimation && pAnimation !== this._pActiveAnimation) {
		if (this._fnPlayAnimation) {
			this._fnPlayAnimation(pAnimation);
		}

		this._pActiveAnimation = pAnimation;
		
		return true;
	}

	return false;
};

AnimationController.prototype.apply = function (fTime) {
    'use strict';
    if (this._pActiveAnimation) {
		this._pActiveAnimation.apply(fTime);
	}
};

A_NAMESPACE(AnimationController);