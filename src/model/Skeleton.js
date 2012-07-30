/**
 * @file
 * @author Ivan Popov.
 * @brief Skeleton class.
 */




function Skeleton (pEngine, sName) {
	Enum ([
		//JOINTS_MOVED = 0x01
		], SKELETON_FLAGS, a.Skeleton);

	this._pRootJoints = [];
	this._sName = sName || null;

	//если положения joint'ов были изменены, то переменная выставляется в true.
	this._iFlags = false;
}

PROPERTY(Skeleton, 'totalBones',
	function () {
		//FIXME: real calc total bones
		return MAX_UINT32;
	});

PROPERTY(Skeleton, 'name',
	function () {
		return this._sName;
	});



Skeleton.prototype.getRootJoint = function() {
	'use strict';
	
	return this.getRootJoints()[0];
};

Skeleton.prototype.getRootJoints = function () {
    'use strict';
    
 //    if (!this._pRootJoints) {
	// 	this._deriveRootJoints();
	// }

	return this._pRootJoints;
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

	return true;
};

// Skeleton.prototype._deriveRootJoints = function() {
// 	TODO('_deriveRootJoints()');
// 	if (this._pRootJoints === null) {
// 		this._pRootJoints = [];
// 	}

// 	var pRootJoints = this._pRootJoints;

// 	pRootJoints.clear();	

// 	var pExpectedRootJoint = this._pJoints[0];
//     var iCount = 1;

//     for (var i = 1, pJoint; i < this._nBones; ++ i) {
//         pJoint = this._pJoints[i];

//         if (pJoint.depth < pExpectedRootJoint.depth) {
//             iCount = 1;
//             pExpectedRootJoint = pJoint;
//         }
//         else if (pJoint.depth == pExpectedRootJoint.depth) {
//             iCount ++;
//         }
//     };

//     debug_assert(pExpectedRootJoint, 'invalid skeleton hierarhy, root node not found');
//     debug_assert(iCount === 1, 'invalid skeleton hierarhy, root is not singleton(' + iCount + ')');

//     pRootJoints.push(pExpectedRootJoint);
// };

Skeleton.prototype.findJoint = function (sName) {
    'use strict';

    var pRootJoints = this._pRootJoints;
    
    function checkNode (pNode, sName) {
    	var pTarget = null;

    	if (!pNode) {
    		return null;
    	}

    	if (pNode.boneName === sName) {
    		return pNode;
    	}

    	pTarget = checkNode(pNode.sibling(), sName);

    	if (pTarget) {
    		return pTarget;
    	}

    	pTarget = checkNode(pNode.child(), sName);

    	return pTarget;
    }

    for (var i = 0; i < pRootJoints.length; i++) {
    	var pNode = pRootJoints[i];
    	var pTarget = checkNode(pNode, sName);
    	
    	if (pTarget) {
    		return pTarget;
    	}
    };

    return null;
};

A_NAMESPACE(Skeleton);