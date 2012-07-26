/**
 * @file
 * @author Ivan Popov.
 * @brief Skeleton class.
 */




function Skeleton (pEngine, sName) {
	Enum ([
		JOINTS_MOVED = 0x01
		], SKELETON_FLAGS, a.Skeleton);

	this._nBones = 0;
	this._pBoneTransforms = null;
	this._pBoneTransformsData = null;
	this._pJoints = null;
	this._pRootJoints = null;
	this._pJointsByName = null;
	this._sName = sName || null;

	//если положения joint'ов были изменены, то переменная выставляется в true.
	this._iFlags = false;
}

PROPERTY(Skeleton, 'totalBones',
	function () {
		return this._nBones;
	});

PROPERTY(Skeleton, 'name',
	function () {
		return this._sName;
	});

/**
 * The maximum number of bones that can be placed in the current skeleton.
 * @return {Uint}
 */
Skeleton.prototype.getMaxBoneCount = function() {
	return this._pBoneTransforms? this._pBoneTransforms.length: 0;
};

Skeleton.prototype.getRootBone = function() {
	if (!this._pRootJoints) {
		this._deriveRootJoints();
	}

	return this._pRootJoints[0];
};

Skeleton.prototype.getTransformationMatricesData = function() {
	return this._pBoneTransformsData;
};

Skeleton.prototype.getTransformationMatrices = function() {
	return this._pBoneTransforms;
};

Skeleton.prototype.isUpdated = function() {
	//TODO: учесть все возможные обновления.
	return this._iFlags & a.Skeleton.JOINTS_MOVED;
};

//метод нужен, чтобы указать, что меши уже синхронизировались с данным скелетом
Skeleton.prototype.synced = function() {
	this._iFlags &= ~ a.Skeleton.JOINTS_MOVED;
};

Skeleton.prototype._jointsMoved = function() {
	this._iFlags |= a.Skeleton.JOINTS_MOVED;
};

Skeleton.prototype._deriveRootJoints = function() {
	if (this._pRootJoints === null) {
		this._pRootJoints = [];
	}

	var pRootJoints = this._pRootJoints;

	pRootJoints.clear();	

	var pExpectedRootJoint = this._pJoints[0];
    var iCount = 1;

    for (var i = 1, pJoint; i < this._nBones; ++ i) {
        pJoint = this._pJoints[i];

        if (pJoint.depth < pExpectedRootJoint.depth) {
            iCount = 1;
            pExpectedRootJoint = pJoint;
        }
        else if (pJoint.depth == pExpectedRootJoint.depth) {
            iCount ++;
        }
    };

    debug_assert(pExpectedRootJoint, 'invalid skeleton hierarhy, root node not found');
    debug_assert(iCount === 1, 'invalid skeleton hierarhy, root is not singleton(' + iCount + ')');

    pRootJoints.push(pExpectedRootJoint);
};

Skeleton.prototype.setup = function(nBones) {
	debug_assert(this._pBoneTransforms === null, 'skeleton already setuped');

	var pBoneBuffer = new ArrayBuffer(nBones * 16 * a.DTYPE.BYTES_PER_FLOAT);
	var pBoneTransforms = new Array(nBones);

	for (var i = 0; i < nBones; ++ i) {
		pBoneTransforms[i] = 
			Mat4.identity(new Float32Array(pBoneBuffer, i * 16 * a.DTYPE.BYTES_PER_FLOAT, 16));
	};

	this._pBoneTransforms = pBoneTransforms;
	this._pJoints = new Array(nBones);
	this._pJointsByName = {};
	this._pBoneTransformsData = new Float32Array(pBoneBuffer);
};



Skeleton.prototype.createBone = function(sName, iBoneIndex) {
	debug_assert(this._nBones < this.getMaxBoneCount(), 'limit of bones reached for given skeleton');

	var pJoint = new a.Joint(this);
	var iBoneSlot = ifndef(iBoneIndex, this._nBones);
	var m4fBoneTransform = this._pBoneTransforms[iBoneSlot];
	var sBoneName = sName || ('bone' + iBoneSlot);

	debug_assert(!this._pJointsByName[sBoneName], 'bone with this name already exists in this skeleton');

	pJoint.create(m4fBoneTransform);
    pJoint.boneName = sBoneName;

    this._pJoints[iBoneSlot] = pJoint;
    this._pJointsByName[sBoneName] = pJoint;
    this._pRootJoints = null;
    this._nBones ++

    return pJoint;
};

Skeleton.prototype.findJoint = function (sName) {
    'use strict';
    
    var pJoints = this._pJoints;

	for (var i = 0; i < pJoints.length; ++ i) {
		if (!pJoints[i]) {
			continue;
		}

		if (pJoints[i].boneName === sName) {
			return pJoints[i];
		}
	}

	return null;
};

A_NAMESPACE(Skeleton);