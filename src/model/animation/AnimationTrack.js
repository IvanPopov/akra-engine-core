function AnimationFrame (fTime, pMatrix, fWeight) {
	A_CHECK_STORAGE();

	this.fTime = fTime || 0;
	this.pMatrix = pMatrix || (new Mat4());
	this.fWeight = fWeight || 1.0;
}

AnimationFrame.prototype.toMatrix = function () {
    'use strict';
    
	return this.pMatrix;
};

AnimationFrame.prototype.reset = function () {
    'use strict';
    
	this.fWeight = 0.0;
	this.fTime = 0.0;

	var pData = this.pMatrix.pData;
	pData._11 = pData._12 = pData._13 = pData._14 = 
	pData._21 = pData._22 = pData._23 = pData._24 = 
	pData._31 = pData._32 = pData._33 = pData._34 = 
	pData._41 = pData._42 = pData._43 = pData._44 = 0;
	return this;
};

/**
 * Добавить данные к фрейму с их весом.
 * После данного метода фрейму потребуется нормализация!!!!
 */
AnimationFrame.prototype.add = function (pFrame) {
    'use strict';
    
	var pMatData = pFrame.pMatrix.pData;
	var fWeight = pFrame.fWeight;
	var pResData = this.pMatrix.pData;

	for (var i = 0; i < 16; ++ i) {
		pResData[i] += pMatData[i] * fWeight;
	}

	this.fWeight += fWeight;
	return this;
};

AnimationFrame.prototype.mult = function (fScalar) {
    'use strict';
    
	this.fWeight *= fScalar;
	return this;
};

AnimationFrame.prototype.normilize = function () {
    'use strict';
    
    var fScalar = 1.0 / this.fWeight;
    var pData = this.pMatrix.pData;

    pData._11 *= fScalar;
    pData._12 *= fScalar; 
    pData._13 *= fScalar;
    pData._14 *= fScalar;
	
	pData._21 *= fScalar;
    pData._22 *= fScalar; 
    pData._23 *= fScalar;
    pData._24 *= fScalar;
	
	pData._31 *= fScalar;
    pData._32 *= fScalar; 
    pData._33 *= fScalar;
    pData._34 *= fScalar;
	
	pData._41 *= fScalar;
    pData._42 *= fScalar; 
    pData._43 *= fScalar;
    pData._44 *= fScalar;
		
	return this;
};

A_ALLOCATE_STORAGE(AnimationFrame, 16384);
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

PROPERTY(AnimationTrack, 'targetName',
	function () {
		return this.nodeName;
	});

PROPERTY(AnimationTrack, 'target',
	function () {
		return this.pTarget;
	});

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
AnimationTrack.prototype.keyFrame = function (fTime, pMatrix) {
    'use strict';
    
    var pFrame;
    var iFrame;

    var pKeyFrames = this._pKeyFrames;
  	var nTotalFrames = pKeyFrames.length;

  	if (arguments.length > 1) {
  		pFrame = new a.AnimationFrame(fTime, pMatrix);
  	}
    else {
    	pFrame = arguments[0];
    }

    if (nTotalFrames && (iFrame = this.findKeyFrame(pFrame.fTime)) >= 0) {
		pKeyFrames.splice(iFrame, 0, pFrame);
	}
	else {
		pKeyFrames.push(pFrame);
	}

	return true;
};

AnimationTrack.prototype.getKeyFrame = function (iFrame) {
    'use strict';
    
    debug_assert(iFrame < this._pKeyFrames.length, 'iFrame must be less then number of total jey frames.');

	return this._pKeyFrames[iFrame];
};

AnimationTrack.prototype.findKeyFrame = function (fTime) {
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

AnimationTrack.prototype.frame = function (fTime) {
    'use strict';

	var iKey1 = 0, iKey2 = 0;
	var fScalar;
	var fTimeDiff;
	
	var pKeys = this._pKeyFrames
	var nKeys = pKeys.length;
	var pFrame = a.AnimationFrame();

	if (nKeys > 1) {
		//TODO: реализовать существенно более эффективный поиск кадра.
		for (var i = 0; i < nKeys; i ++) {
	    	if (fTime >= this._pKeyFrames[i].fTime) {
	            iKey1 = i;
	        }
	    }

	    iKey2 = (iKey1 >= (nKeys - 1))? iKey1 : iKey1 + 1;
	}
    
    fTimeDiff = pKeys[iKey2].fTime - pKeys[iKey1].fTime;
    
    if (!fTimeDiff)
        fTimeDiff = 1;
	
	fScalar = (fTime - pKeys[iKey1].fTime) / fTimeDiff;
	
	AnimationTrack.interpolate(
		this._pKeyFrames[iKey1], 
		this._pKeyFrames[iKey2], 
		pFrame, 
		fScalar);

	pFrame.fTime = fTime;
	pFrame.fWeight = 1.0;

	return pFrame;
};

AnimationTrack.interpolate = function (pStartFrame, pEndFrame, pResultFrame, fBlend) {
    'use strict';

	for (var i = 0; i < 16; i++) {
		pResultFrame.pMatrix.pData[i] = ((pEndFrame.pMatrix.pData[i] * fBlend) + ((1. - fBlend) * pStartFrame.pMatrix.pData[i]));
	};
};

AnimationTransformation = AnimationTrack;

A_NAMESPACE(AnimationTrack);
A_NAMESPACE(AnimationTransformation);


