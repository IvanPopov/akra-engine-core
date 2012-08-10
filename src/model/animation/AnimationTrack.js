function AnimationFrame (fTime, pValue) {
	this.fTime = fTime;
	this.pValue = pValue;
}

A_NAMESPACE(AnimationFrame);

function AnimationTrack (sTarget) {
	/**
	 * Bone name or Node name
	 * @type {String}
	 */
	this._sTarget = sTarget || null;

	/**
	 * Bone or scene hierarchy node.
	 * @type {Node}
	 */
	this.pTarget = null;

	/**
	 * Animation key frames.
	 * @type {AnimationFrame}
	 */
	this._pKeyFrames = [];
}

/**
 * Target name of animation track.
 */
PROPERTY(AnimationTrack, 'nodeName',
	/**
	 * Get target's name.
	 * @return {[type]} [description]
	 */
	function () {
		return this._sTarget;
	},
	/**
	 * Set bone name or node name.
	 * @param  {String} sValue Name.
	 */
	function (sValue) {
		this._sTarget = sValue;
	});

PROPERTY(AnimationTrack, 'duration',
	function () {
		return this._pKeyFrames.last.fTime;
	});

/**
 * Add key frame in {fTime}.
 */
AnimationTrack.prototype.keyFrame = function (fTime, pValue) {
    'use strict';
    
    var pFrame;
    var iFrame;

    var pKeyFrames = this._pKeyFrames;
  	var nTotalFrames = pKeyFrames.length;

  	if (arguments.length > 1) {
  		pFrame = new a.AnimationFrame(fTime, pValue);
  	}
    else {
    	pFrame = arguments[0];
    }

    if (nTotalFrames && (iFrame = this.findFrame(pFrame.fTime)) >= 0) {
		pKeyFrames.splice(iFrame, 0, pFrame);
	}
	else {
		pKeyFrames.push(pFrame);
	}

	return true;
};

AnimationTrack.prototype.getFrame = function (iFrame) {
    'use strict';
    
    debug_assert(iFrame < this._pKeyFrames.length, 'iFrame must be less then number of total jey frames.');

	return this._pKeyFrames[iFrame];
};

AnimationTrack.prototype.findFrame = function (fTime) {
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

/**
 * Bind track to target.
 * @return {Boolean}
 */
AnimationTrack.prototype.bind = function () {
    'use strict';
    
	var pNode = null,
		pRootNode;

	var pSkeleton;
	var sJoint;

	switch (arguments.length) {
		case 2:
			//bind by pair <String joint, Skeleton skeleton>
			sJoint = arguments[0];
			pSkeleton = arguments[1];

			this._sTarget = sJoint;
			pNode = pSkeleton.findJoint(sJoint);
			break;
		default:
			//bind by <Skeleton skeleton>
			if (arguments[0] instanceof a.Skeleton) {
				
				if (this._sTarget == null) {
					return false;
				}

				pSkeleton = arguments[0];
				pNode = pSkeleton.findJoint(this._sTarget);
			}
			//bind by <Node node>
			else if (arguments[0] instanceof a.Node) {
				pRootNode = arguments[0];
				pNode = pRootNode.findNode(this.nodeName);
			}
	}
	
	this.pTarget = pNode;

	return pNode? true: false;
};

AnimationTrack.prototype.update = function (fTime) {
    'use strict';

	var iKey1, iKey2;
	var fScalar;
	var fTimeDiff;
	var pKeys = this._pKeyFrames
	var nKeys = pKeys.length;

	//TODO: реализовать существенно более эффективный поиск кадра.
	for (var i = 0; i < nKeys; i ++) {
    	if (fTime >= this._pKeyFrames[i].fTime) {
            iKey1 = i;
        }
    }

    iKey2 = (iKey1 >= (nKeys - 1))? iKey1 : iKey1 + 1;

    fTimeDiff = pKeys[iKey2].fTime - pKeys[iKey1].fTime;
    
    if (!fTimeDiff)
        fTimeDiff = 1;
	
	fScalar = (fTime - pKeys[iKey1].fTime) / fTimeDiff;
	
	this.interpolate(this._pKeyFrames[iKey1], this._pKeyFrames[iKey2], fScalar);
};

AnimationTrack.prototype.interpolate = null;


A_NAMESPACE(AnimationTrack);


/**
 * Animatin matrix modififcation
 * =========================================================================
 */


function AnimationMatrixModification (sTarget, iElement) {
    A_CLASS;

    this._iElement = iElement;
}

EXTENDS(AnimationMatrixModification, a.AnimationTrack);
A_NAMESPACE(AnimationMatrixModification);

AnimationMatrixModification.prototype.interpolate = function (pStartFrame, pEndFrame, fBlend, fWeight) {
    'use strict';
    TODO('AnimationMatrixModification');
 //    var bAdd = this.pTarget.isLocalMatrixNew();
 //    var pLocalMatrix = this.pTarget.accessLocalMatrix();
	// var fValue = ((pEndFrame.pValue * fBlend) + ((1. - fBlend) * pStartFrame.pValue));

	// fValue = (this._iElement === 15? (fValue || 1) : fValue) * fWeight;

	// if (bAdd) {
	// 	pLocalMatrix[this._iElement] += fValue;
	// }
	// else {
	// 	pLocalMatrix[this._iElement] = fValue;
	// }
};



/**
 * Animatin transformation
 * =========================================================================
 */

function AnimationTransformation (sTarget) {
    A_CLASS;
}

EXTENDS(AnimationTransformation, a.AnimationTrack);
A_NAMESPACE(AnimationTransformation);

AnimationTransformation.prototype.interpolate = function (pStartFrame, pEndFrame, fBlend
	/*, fWeight*/) {
    'use strict';

    //var bAdd = this.pTarget.isLocalMatrixNew();
    var pLocalMatrix = this.pTarget.accessLocalMatrix();
	var fValue;
	
	for (var i = 0; i < 16; i++) {
		fValue = ((pEndFrame.pValue[i] * fBlend) + ((1. - fBlend) * pStartFrame.pValue[i]));
		//fValue = fValue * fWeight;

		//pLocalMatrix[i] = bAdd? pLocalMatrix[i] + fValue: fValue;
		pLocalMatrix[i] = fValue;
	};
};

