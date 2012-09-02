function AnimationController (pEngine, eOptions) {
    'use strict';
	
	this._pEngine = pEngine;
    this._pAnimations = [];
    this._pAnimationMap
    this._eOptions = 0;
    this._pActiveAnimation = null;

	if (eOptions) {
		this.setOptions(eOptions);
	}
}

PROPERTY(AnimationController, 'totalAnimations',
	function () {
		return this._pAnimations.length;
	});

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

	this._pAnimations.push(pAnimation);
};

AnimationController.prototype.play = function(iAnimation) {
	this._pActiveAnimation = this.findAnimation(iAnimation);
};

A_NAMESPACE(AnimationController);