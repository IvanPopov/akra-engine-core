function AnimationFrame (fTime, pValue) {
	this.fTime = fTime;
	this.pValue = pValue;
}

A_NAMESPACE(AnimationFrame);

function AnimationTrack (sTarget) {
	this._sTarget = sTarget || null;
	this._pTarget = null;

	this._pKeyFrames = [];

	//public
	this.fStartTime = 0;
	this.fEndTime = 0;
	this.fDuration = 0;

	//last used time
	this.fTime = 0;
	this.iCurrentFrame = 0;
}

AnimationTrack.prototype.addKeyFrame = function (fTime, pValue) {
    'use strict';
    
    var pFrame;
    var pKeyFrames	= this._pKeyFrames;
  	var iFrame;
  	var nTotalFrames = pKeyFrames.length;

    switch (arguments.length) {
    	case 2:
    		pFrame = new a.AnimationFrame(fTime, pValue);
    		break;
    	default:
    		pFrame = arguments[0];
    }

   if (nTotalFrames && (iFrame = this.findKeyFrameByTime(pFrame.fTime)) >= 0) {
		pKeyFrames.splice(iFrame, 0, pFrame);
	}
	else {
		pKeyFrames.push(pFrame);
	}

	return this.update();
};

AnimationTrack.prototype.update = function () {
    'use strict';
    
	this.fStartTime = this._pKeyFrames.first.fTime;
	this.fEndTime = this._pKeyFrames.last.fTime;

	this.fDuration = this.fEndTime - this.fStartTime;

	return true;
};

AnimationTrack.prototype.getKeyFrame = function (iFrame) {
    'use strict';
    
    debug_assert(iFrame < this._pKeyFrames.length, 'iFrame must be less then number of total jey frames.');

	return this._pKeyFrames[iFrame];
};

AnimationTrack.prototype.findKeyFrameByTime = function (fTime) {
    'use strict';
    
    var pKeyFrames	= this._pKeyFrames;
    var nTotalFrames = pKeyFrames.length;
	
	if (pKeyFrames[nTotalFrames - 1].fTime == fTime) {
		return nTotalFrames - 1;
	}
	else {
		for (var i = nTotalFrames - 1; i >= 0; i--) {
			if (pKeyFrames[i].fTime > fTime && pKeyFrames[i - 1].fTime <= fTime) {
				return i - 1;
			}
		}
	}

	return -1;
};

AnimationTrack.prototype.bind = function (sJoint, pSkeleton) {
    'use strict';
    
	var pJoint = null;

	switch (arguments.length) {
		case 2:
			this._sTarget = sJoint;
			pJoint = pSkeleton.findJoint(sJoint);
			break;
		case 1:
		default:
			if (arguments[0] instanceof a.Skeleton) {
				pSkeleton = arguments[0];
				pJoint = pSkeleton.findJoint(this._sTarget);
			}
			else {
				pJoint = arguments[0];
			}
	}

	debug_assert(pJoint, 'cannot bind track, because joint<' + this._sTarget + 
		'> not exists in given skeleton');


	this._pTarget = pJoint;
	return true;
};

AnimationTrack.prototype.play = function (fTime) {
    'use strict';

	var iFrame;
	var fBlend;

	for (iFrame = 0; this._pKeyFrames[iFrame + 1].fTime < fTime; ++ iFrame);
	//trace(this._pKeyFrames[iFrame].fTime, '<', fTime, '<', this._pKeyFrames[iFrame + 1].fTime);

	fBlend = (fTime - this._pKeyFrames[iFrame].fTime) / (this._pKeyFrames[iFrame + 1].fTime - this._pKeyFrames[iFrame].fTime);
	debug_assert(fBlend >= 0. && fBlend <= 1., 'incorrect blende weight: ' + fBlend);
	//trace(fBlend);
	this.fTime = fTime;
	this.apply(iFrame, fBlend);
};

AnimationTrack.prototype.apply = function (iKeyFrame, fBlend) {
    'use strict';
    
	debug_error('you must overwrite ::apply() method before used...');
};

AnimationTrack.prototype.rewind = function (fTime) {
    'use strict';
    
};

AnimationTrack.prototype.reset = function () {
    'use strict';
	this.fTime = 0;
	this.iCurrentFrame = 0;
};
    

A_NAMESPACE(AnimationTrack);


function AnimationRotation (sTarget, v3fAxis) {
    A_CLASS;

    this._v3fAxis = v3fAxis;
}

EXTENDS(AnimationRotation, a.AnimationTrack);

AnimationRotation.prototype.apply = function (iKeyFrame, fBlend) {
    'use strict';
    
	var pStartFrame = this._pKeyFrames[iKeyFrame];
	var pEndFrame = this._pKeyFrames[iKeyFrame + 1];
	var fValue = ((pEndFrame.pValue * fBlend) + ((1. - fBlend) * pStartFrame.pValue));

	//trace('add rel rotation to ', this._pTarget, fValue);
	this._pTarget.setRotation(this._v3fAxis, fValue);
};

A_NAMESPACE(AnimationRotation);

function AnimationTranslation (sTarget) {
    A_CLASS;

}

EXTENDS(AnimationTranslation, a.AnimationTrack);

AnimationTranslation.prototype.apply = function (iKeyFrame, fBlend) {
    'use strict';
    
	var pStartFrame = this._pKeyFrames[iKeyFrame];
	var pEndFrame = this._pKeyFrames[iKeyFrame + 1];
	var fX = ((pEndFrame.pValue.X * fBlend) + ((1. - fBlend) * pStartFrame.pValue.X));
	var fY = ((pEndFrame.pValue.Y * fBlend) + ((1. - fBlend) * pStartFrame.pValue.Y));
	var fZ = ((pEndFrame.pValue.Z * fBlend) + ((1. - fBlend) * pStartFrame.pValue.Z));
	
	//this._pTarget.setPosition(fX, fY, fZ);
};

A_NAMESPACE(AnimationTranslation);