function Joint () {
	A_CLASS;

	this._sBone = null;
    this._iUpdated = 0;
}

EXTENDS(Joint, a.Node);

PROPERTY(Joint, 'boneName',
	function () {
		return this._sBone;
	},
	function (sBone) {
		this._sBone = sBone;
	});


Joint.prototype.create = function () {
    'use strict';

    this._m4fWorldMatrix = Mat4.identity(new Matrix4);
    this._m4fLocalMatrix = Mat4.identity(new Matrix4);
    this._m4fInverseWorldMatrix = Mat4.identity(new Matrix4);
    
    this._v3fWorldPosition  = Vec3.create();
    this._v3fWorldRight     = Vec3.create();
    this._v3fWorldUp        = Vec3.create();
    this._v3fWorldForward   = Vec3.create();

    //maybe custom
    this.setInheritance(a.Scene.k_inheritAll);

    return true;
};

Joint.prototype.recalcWorldMatrix = function () {
    'use strict';
    
    return Node.prototype.recalcWorldMatrix.call(this) && (this._iUpdated ++);
};

Ifdef (__DEBUG);

Joint.prototype.toString = function (isRecursive, iDepth) {
    'use strict';
    
    isRecursive = isRecursive || false;

    if (!isRecursive) {
        return '<joint' + (this._sName? ' ' + this._sName: '') + '>';
    }

    return Node.prototype.toString.call(this, isRecursive, iDepth);
}

Endif ();

A_NAMESPACE(Joint);