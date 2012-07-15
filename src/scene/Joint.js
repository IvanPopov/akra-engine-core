function Joint (pSkeleton) {
	A_CLASS;

    debug_assert(pSkeleton, 'joint must managed by any skeleton');

	this._sBone = null;
    this._pSkeleton = pSkeleton;
}

EXTENDS(Joint, a.Node);



PROPERTY(Joint, 'boneName',
	function () {
		return this._sBone;
	},
	function (sBone) {
		this._sBone = sBone;
	});


Joint.prototype.skeleton = function() {
    return this._pSkeleton;
};

/**
 * Create joint.
 * Предпологается, что joint может быть как самостоятельным нодом со
 * своими матрицами, так и пересчитывать матрицы поданные извне.
 */
Joint.prototype.create = function (ppWorldMatrix, ppLocalMatrix, ppInverseWorldMatrix) {
    'use strict';

    ppWorldMatrix = ppWorldMatrix || Mat4.identity(new Matrix4);
    ppLocalMatrix = ppLocalMatrix || Mat4.identity(new Matrix4);
    ppInverseWorldMatrix = ppInverseWorldMatrix || Mat4.identity(new Matrix4);

    this._m4fWorldMatrix = ppWorldMatrix;
    this._m4fLocalMatrix = ppLocalMatrix;
    this._m4fInverseWorldMatrix = ppInverseWorldMatrix;

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