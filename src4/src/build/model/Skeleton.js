/// <reference path="../idl/ISkeleton.ts" />
/// <reference path="../idl/ISceneNode.ts" />
var akra;
(function (akra) {
    /// <reference path="../scene/Joint.ts" />
    (function (model) {
        var Skeleton = (function () {
            function Skeleton(sName) {
                if (typeof sName === "undefined") { sName = null; }
                this._pRootJoints = [];
                this._pJointMap = null;
                this._pNodeList = null;
                this._pMeshNode = null;
                this._sName = sName;
            }
            // private _iFlags: boolean = false;
            Skeleton.prototype.getTotalBones = function () {
                return Object.keys(this._pJointMap).length;
            };

            Skeleton.prototype.getTotalNodes = function () {
                return this._pNodeList.length;
            };

            Skeleton.prototype.getName = function () {
                return this._sName;
            };

            Skeleton.prototype.getRoot = function () {
                return this._pRootJoints[0] || null;
            };

            Skeleton.prototype.getRootJoint = function () {
                return this.getRootJoints()[0];
            };

            Skeleton.prototype.getRootJoints = function () {
                return this._pRootJoints;
            };

            Skeleton.prototype.getJointMap = function () {
                return this._pJointMap;
            };

            Skeleton.prototype.getNodeList = function () {
                return this._pNodeList;
            };

            Skeleton.prototype.addRootJoint = function (pJoint) {
                akra.debug.assert(pJoint instanceof akra.scene.Joint, 'node must be joint');

                var pRootJoints = this._pRootJoints;

                for (var i = 0; i < pRootJoints.length; i++) {
                    if (pJoint.childOf(pRootJoints[i])) {
                        return false;
                    } else if (pRootJoints[i].childOf(pJoint)) {
                        pRootJoints.splice(i, 1);
                    }
                }
                ;

                this._pRootJoints.push(pJoint);

                return this.update();
            };

            Skeleton.prototype.update = function () {
                var pRootJoints = this.getRootJoints();
                var pJointMap = this._pJointMap = {};
                var pNodeList = this._pNodeList = [];

                //var pNotificationJoints = this._pNotificationJoints = [];
                function findNodes(pNode) {
                    var sJoint = null;

                    if (!akra.isNull(pNode)) {
                        if (akra.scene.Joint.isJoint(pNode)) {
                            sJoint = pNode.getBoneName();
                        }

                        if (!akra.isNull(sJoint)) {
                            akra.debug.assert(!pJointMap[sJoint], 'joint with name<' + sJoint + '> already exists in skeleton <' + this._sName + '>');

                            pJointMap[sJoint] = pNode;
                        }

                        pNodeList.push(pNode);

                        findNodes(pNode.getSibling());
                        findNodes(pNode.getChild());
                    }
                }

                for (var i = 0; i < pRootJoints.length; i++) {
                    findNodes(pRootJoints[i]);
                }
                ;

                // for (var sJoint in pJointMap) {
                // 	var pJoint = pJointMap[sJoint];
                //    	if (pJoint.sibling() == null && pJoint.child() == null) {
                //    		pNotificationJoints.push(pJoint);
                //    	}
                //    };
                return true;
            };

            Skeleton.prototype.findJoint = function (sName) {
                return this._pJointMap[sName];
            };

            Skeleton.prototype.findJointByName = function (sName) {
                for (var s in this._pJointMap) {
                    if (this._pJointMap[s].getName() === sName) {
                        return this._pJointMap[s];
                    }
                }

                return null;
            };

            Skeleton.prototype.attachMesh = function (pMesh) {
                if (akra.isNull(this.getRoot())) {
                    return false;
                }

                if (this._pMeshNode == null) {
                    this._pMeshNode = this.getRoot().getScene().createModel();
                    this._pMeshNode.setInheritance(4 /* ALL */);
                    this._pMeshNode.attachToParent(this.getRoot());
                }

                this._pMeshNode.setName(this.getName() + "[mesh-container]");
                this._pMeshNode.setMesh(pMesh);

                return true;
            };

            Skeleton.prototype.detachMesh = function () {
                //TODO: write detach method.
            };
            return Skeleton;
        })();

        function createSkeleton(sName) {
            if (typeof sName === "undefined") { sName = null; }
            return new Skeleton(sName);
        }
        model.createSkeleton = createSkeleton;
    })(akra.model || (akra.model = {}));
    var model = akra.model;
})(akra || (akra = {}));
//# sourceMappingURL=Skeleton.js.map
