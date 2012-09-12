/**
 * @file
 * @author Ivan Popov.
 * @brief Skeleton class.
 */




function Skeleton (pEngine, sName) {
	Enum ([
		//JOINTS_MOVED = 0x01
		], SKELETON_FLAGS, a.Skeleton);

	this._sName = sName || null;

	this._pEngine = pEngine;

	//корневые joint'ы
	this._pRootJoints = [];
	
	//перечень joint'ов по именам
	this._pJointList = null;
	this._pNodeList = null;

	//все joint'ы у которых нет потомков и братьев
	//нужны чтобы отслеживать изменения в скелете
	//this._pNotificationJoints = null

	this._pMeshNode = null;

	//если положения joint'ов были изменены, то переменная выставляется в true.
	this._iFlags = false;
}

PROPERTY(Skeleton, 'totalBones',
	function () {
		return Object.keys(this._pJointList).length;
	});

PROPERTY(Skeleton, 'totalNodes',
	function () {
		return this._pNodeList.length;
	});

PROPERTY(Skeleton, 'name',
	function () {
		return this._sName;
	});


PROPERTY(Skeleton, 'root',
	function () {
		return this._pRootJoints[0] || null;
	});


Skeleton.prototype.getEngine = function () {
    'use strict';
    
	return this._pEngine;
};

Skeleton.prototype.getRootJoint = function() {
	'use strict';
	
	return this.getRootJoints()[0];
};

Skeleton.prototype.getRootJoints = function () {
    'use strict';
    
	return this._pRootJoints;
};


Skeleton.prototype.getJointMap = function() {
	return this._pJointList;
};

Skeleton.prototype.getNodeList = function () {
    'use strict';
    
	return this._pNodeList;
};

Skeleton.prototype.addRootJoint = function (pJoint) {
    'use strict';
    
    debug_assert(pJoint instanceof a.Joint, 'node must be joint');

    var pRootJoints = this._pRootJoints;

	for (var i = 0; i < pRootJoints.length; i++) {
		if (pJoint.childOf(pRootJoints[i])) {
			return false;
		}	
		else if (pRootJoints[i].childOf(pJoint)) {
			pRootJoints.splice(i, 1);
		}
	};

	this._pRootJoints.push(pJoint);

	return this.update();
};

Skeleton.prototype.update = function () {
    'use strict';
    
    var pRootJoints = this._pRootJoints;
    var pJointList = this._pJointList = {};
    var pNodeList = this._pNodeList = [];
    //var pNotificationJoints = this._pNotificationJoints = [];

    function findNodes (pNode) {
    	var sJoint;

    	if (pNode) {
	    	sJoint = pNode.boneName;

	    	if (sJoint) {
	    		debug_assert(!pJointList[sJoint], 
	    			'joint with name<' + sJoint + '> already exists in skeleton <' + this._sName + '>');
	    		pJointList[sJoint] = pNode;
	    	}

	    	pNodeList.push(pNode);

	    	findNodes(pNode.sibling());
	    	findNodes(pNode.child());
    	}
    }

    for (var i = 0; i < pRootJoints.length; i++) {
    	findNodes(pRootJoints[i]);
    };

	// for (var sJoint in pJointList) {
	// 	var pJoint = pJointList[sJoint];

 //    	if (pJoint.sibling() == null && pJoint.child() == null) {
 //    		pNotificationJoints.push(pJoint);
 //    	}
 //    };    

	return true;
};

Skeleton.prototype.findJoint = function (sName) {
    'use strict';

    return this._pJointList[sName];
};

Skeleton.prototype.findJointByName = function (sName) {
    'use strict';
    
	for (var s in this._pJointList) {
		if (this._pJointList[s].name === sName) {
			return this._pJointList[s];
		}
	}

	return null;
};


Skeleton.prototype.attachMesh = function (pMesh) {
    'use strict';
	
    debug_assert(this.getEngine() === pMesh.getEngine(), 'mesh must be from same engine instance');

    if (this._pMeshNode == null) {
    	this._pMeshNode = new a.SceneModel(this.getEngine());
    	this._pMeshNode.create();
    	this._pMeshNode.setInheritance(a.Scene.k_inheritAll);
    	this._pMeshNode.attachToParent(this.root);
    }

    this._pMeshNode.name = this.name + "[mesh-container]";
    this._pMeshNode.addMesh(pMesh);
};

Skeleton.prototype.detachMesh = function () {
    'use strict';
    
	//TODO: write detach method.
};

A_NAMESPACE(Skeleton);