function Joint (pEngine) {
	A_CLASS;

    debug_assert(pEngine, 'engine must be');
	
    this._sBone = null;
    this._iUpdated = 0;

    this._pEngine = pEngine;
}

EXTENDS(Joint, a.Node);

PROPERTY(Joint, 'boneName',
	function () {
		return this._sBone;
	},
	function (sBone) {
		this._sBone = sBone;
	});


Joint.prototype.getEngine = function () {
    'use strict';
    
    return this._pEngine;
};

Joint.prototype.create = function () {
    'use strict';

    this._m4fLocalMatrix = new Matrix4;
    this._m4fWorldMatrix = new Matrix4;
    
    this._v3fWorldPosition  = new Vector3();
    this._v3fTranslation    = new Vector3(0, 0, 0);
    this._v3fScale          = new Vector3(1, 1, 1);
    this._qRotation         = new Quaternion(0, 0, 0, 1);


    //maybe custom
    this.setInheritance(a.Scene.k_inheritAll);

    Mat4.identity(this._m4fLocalMatrix);
    Mat4.identity(this._m4fWorldMatrix);
    
    return true;
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