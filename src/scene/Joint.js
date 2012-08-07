function Joint (pEngine, pSkeleton) {
	A_CLASS;
	debug_assert(pEngine, 'engine must be');
    debug_assert(pSkeleton, 'joint must managed by any skeleton');
	this._pEngine = pEngine;
	this._sBone = null;
    this._pSkeleton = pSkeleton;
    this._m4fBoneMatrix = null;
    this._m4fBoneOffsetMatrix = null;
}

EXTENDS(Joint, a.Node);



PROPERTY(Joint, 'boneName',
	function () {
		return this._sBone;
	},
	function (sBone) {
		this._sBone = sBone;
	});

Joint.prototype.getBoneOffsetMatrix = function () {
    'use strict';
    
    return this._m4fBoneOffsetMatrix;
};

Joint.prototype.setBoneOffsetMatrix = function (m4fBoneOffsetMatrix) {
    'use strict';
    //Mat4.transpose(m4fBoneOffsetMatrix);
    //debug_assert(m4fBoneOffsetMatrix, 'you must specify bone offset matrix');
    //trace(Mat4.str(m4fBoneOffsetMatrix), 'bone >> ', this.boneName);
    Mat4.set(m4fBoneOffsetMatrix, this._m4fBoneOffsetMatrix);
};

Joint.prototype.boneMatrix = function () {
    'use strict';
    
    return this._m4fBoneMatrix;
};

Joint.prototype.skeleton = function() {
    return this._pSkeleton;
};

/**
 * Create joint.
 * Предпологается, что joint может быть как самостоятельным нодом со
 * своими матрицами, так и пересчитывать матрицы поданные извне.
 */
Joint.prototype.create = function (ppBoneMatrix, pBoneOffsetMatrix) {
    'use strict';

    pBoneOffsetMatrix = pBoneOffsetMatrix || Mat4.identity(new Matrix4);
    ppBoneMatrix = ppBoneMatrix || Mat4.identity(new Matrix4);



    this._m4fWorldMatrix = Mat4.identity(new Matrix4);
    this._m4fLocalMatrix = Mat4.identity(new Matrix4);
    this._m4fInverseWorldMatrix = Mat4.identity(new Matrix4);
    
    this._m4fBoneOffsetMatrix = pBoneOffsetMatrix;
    this._m4fBoneMatrix = ppBoneMatrix;

    this._v3fWorldPosition = Vec3.create();
    this._v3fWorldRight = Vec3.create();
    this._v3fWorldUp = Vec3.create();
    this._v3fWorldForward = Vec3.create();


    //maybe custom
    this.setInheritance(a.Scene.k_inheritAll);

    return true;
};


Joint.prototype.recalcWorldMatrix = function() {
    if (Node.prototype.recalcWorldMatrix.call(this)) {
        Mat4.mult(this._m4fWorldMatrix, this._m4fBoneOffsetMatrix, this._m4fBoneMatrix);
        this._pSkeleton._iFlags |= a.Skeleton.JOINTS_MOVED;
    }
};


Ifdef (__DEBUG);

Joint.prototype.toString = function (isRecursive, iDepth) {
    'use strict';
    
    isRecursive = isRecursive || false;

    if (!isRecursive) {
        return '<joint' + (this._sName? ' ' + this._sName: '') + '> [bone: ' + this._sBone + ']';
    }

    return Node.prototype.toString.call(this, isRecursive, iDepth);
}

Endif ();

A_NAMESPACE(Joint);