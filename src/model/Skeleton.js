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

	//корневые joint'ы
	this._pRootJoints = [];
	
	//перечень joint'ов по именам
	this._pJointList = null;

	//все joint'ы у которых нет потомков и братьев
	//нужны чтобы отслеживать изменения в скелете
	this._pNotificationJoints = null

	//если положения joint'ов были изменены, то переменная выставляется в true.
	this._iFlags = false;
}

PROPERTY(Skeleton, 'totalBones',
	function () {
		return Object.keys(this._pJointList).length;
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
    
	return this._pRootJoints;
};

Skeleton.prototype.isUpdated = function () {
    'use strict';
    
	return true;
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
    var pNotificationJoints = this._pNotificationJoints = [];

    function findJoints (pNode) {
    	var sJoint;

    	if (pNode) {
	    	sJoint = pNode.boneName;

	    	if (sJoint) {
	    		debug_assert(!pJointList[sJoint], 
	    			'joint with name<' + sJoint + '> already exists in skeleton <' + this._sName + '>');
	    		pJointList[sJoint] = pNode;
	    	}

	    	findJoints(pNode.sibling());
	    	findJoints(pNode.child());
    	}
    }

    for (var i = 0; i < pRootJoints.length; i++) {
    	findJoints(pRootJoints[i]);
    };

	for (var sJoint in pJointList) {
		var pJoint = pJointList[sJoint];

    	if (pJoint.sibling() == null && pJoint.child() == null) {
    		pNotificationJoints.push(pJoint);
    	}
    };    

	return true;
};

Skeleton.prototype.findJoint = function (sName) {
    'use strict';

    return this._pJointList[sName];
};

A_NAMESPACE(Skeleton);