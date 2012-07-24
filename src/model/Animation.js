function AnimationFrame (sJoint) {
	//time in ms
	this._iTime = 0;

	//not nessecary
	this._sJointName = sJoint || null; 
	
	/**
	 * Pointer to controlled joint.
	 * @type {Joint}
	 */
	this._pJoint = null;

	/**
	 * Next animation.
	 * @type {[type]}
	 */
	this._pAnimationNext = null;

	/**
	 * @type {Array.<Vector3>}
	 */
	this._pTranslationKeys = [];
	
	/**
	 * @type {Array.<Quaternion>}
	 */
	this._pRotationKeys = [];
	
	/**
	 * @type {Array.<Vector3>}
	 */
	this._pScaleKeys = [];

	/**
	 * @type {Array.<Matrix4>}
	 */
	this._pMatrixKeys = [];
}

A_NAMESPACE(AnimationFrame);

function AnimationsSet () {
	this._sName = sName || null;

	//animation length/time..
	this._fLength = 0;

	/**
	 * Next animations set.
	 * @type {AnimationsSet}
	 */
	this._pAnimationsSetNext = null;

	/**
	 * Animations.
	 * @type {Array.<AnimationFrame>}
	 */
	this._pAnimations = [];
}

A_NAMESPACE(AnimationsSet);