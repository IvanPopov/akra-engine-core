/// <reference path="../idl/IOcTreeNode.ts" />
/// <reference path="../idl/IRect3d.ts" />
/// <reference path="../idl/IVec3.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../debug.ts" />
    /// <reference path="../guid.ts" />
    /// <reference path="../geometry/Rect3d.ts" />
    /// <reference path="../util/ObjectList.ts" />
    (function (scene) {
        /** OcTreeNode class represent node of OcTree */
        var OcTreeNode = (function () {
            //index - is xyz where x-left = 0, x-right = 1 etc.
            function OcTreeNode(pTree) {
                this.guid = akra.guid();
                /** Level of node */
                this.level = 0;
                /** Byte x-coord of node */
                //x: int = 0;
                /** Byte y-coord of node */
                //y: int = 0;
                /** Byte z-coord of node */
                //z: int = 0;
                /** Index in array of nodes in tree */
                this.index = 0;
                /** Link to previous node in tree */
                this.rearNodeLink = null;
                this.membersList = new akra.util.ObjectList();
                this.worldBounds = new akra.geometry.Rect3d();

                this.childrenList = new Array(8);
                for (var i = 0; i < 8; i++) {
                    this.childrenList[i] = new akra.util.ObjectList();
                }

                this.tree = pTree;
            }
            /**
            * Add object in this node
            */
            OcTreeNode.prototype.addMember = function (pObject) {
                this.membersList.push(pObject);
                pObject.worldBoundsUpdated.connect(this, this.OcTreeObjectMoved, 0 /* UNICAST */);
                //this.connect(pObject, SIGNAL(worldBoundsUpdated), SLOT(OcTreeObjectMoved), EEventTypes.UNICAST);
            };

            /**
            * Remove member object from node and release node if there are not members in it
            */
            OcTreeNode.prototype.removeMember = function (pObject) {
                var i = this.membersList.indexOf(pObject);

                // console.log('position in list ------------>',i);
                // make sure this is one of ours
                akra.debug.assert(i >= 0, "error removing member cannot find member");

                if (i >= 0) {
                    this.membersList.takeAt(i);
                    pObject.worldBoundsUpdated.disconnect(this, this.OcTreeObjectMoved, 0 /* UNICAST */);
                    //this.disconnect(pObject, SIGNAL(worldBoundsUpdated), SLOT(OcTreeObjectMoved), EEventTypes.UNICAST);
                }

                if (this.membersList.getLength() === 0) {
                    this.tree.deleteNodeFromTree(this);
                }
            };

            OcTreeNode.prototype.toString = function () {
                var sStr = "guid: " + this.guid.toString() + "\n";
                sStr += "level: " + this.level.toString() + "\n";
                sStr += "index: " + this.index.toString() + "\n";
                sStr += "world bounds: " + this.worldBounds.toString() + "\n";
                return sStr;
            };

            OcTreeNode.prototype.OcTreeObjectMoved = function (pObject) {
                // console.warn('object moving');
                var pNode = this.tree.findTreeNode(pObject);
                if (pNode !== this) {
                    this.removeMember(pObject);
                    pNode.addMember(pObject);
                }
            };
            return OcTreeNode;
        })();
        scene.OcTreeNode = OcTreeNode;

        var OcTreeRootNode = (function (_super) {
            __extends(OcTreeRootNode, _super);
            function OcTreeRootNode(pTree) {
                _super.call(this, pTree);

                var iTmp = (1 << this.tree.getDepth());

                this._pBasicWorldBounds = new akra.geometry.Rect3d(0, iTmp, 0, iTmp, 0, iTmp);
                this._pBasicWorldBounds.divSelf(this.tree.getWorldScale());
                this._pBasicWorldBounds.subSelf(this.tree.getWorldOffset());

                this.worldBounds.set(this._pBasicWorldBounds);
            }
            OcTreeRootNode.prototype.addMember = function (pMember) {
                _super.prototype.addMember.call(this, pMember);

                //обновляем границы нода, критично, в том случае если объект выходит за границы нода, так как иначе отсекаться будет неправильно
                this._updateNodeBoundingBox();
            };

            OcTreeRootNode.prototype.removeMember = function (pObject) {
                var i = this.membersList.indexOf(pObject);

                // make sure this is one of ours
                akra.debug.assert(i >= 0, "error removing member cannot find member");

                if (i >= 0) {
                    this.membersList.takeAt(i);
                    pObject.worldBoundsUpdated.disconnect(this, this.OcTreeObjectMoved, 0 /* UNICAST */);
                    //this.disconnect(pObject, SIGNAL(worldBoundsUpdated), SLOT(OcTreeObjectMoved), EEventTypes.UNICAST);
                }

                //обновляем границы нода, критично, в том случае если объект выходит за границы нода, так как иначе отсекаться будет неправильно
                this._updateNodeBoundingBox();
            };

            OcTreeRootNode.prototype._updateNodeBoundingBox = function () {
                var pNodeWorldBounds = this.worldBounds;
                pNodeWorldBounds.set(this._pBasicWorldBounds);

                var pObject = this.membersList.getFirst();
                while (akra.isDefAndNotNull(pObject)) {
                    pNodeWorldBounds.unionRect(pObject.getWorldBounds());

                    pObject = this.membersList.next();
                }
            };
            return OcTreeRootNode;
        })(OcTreeNode);
        scene.OcTreeRootNode = OcTreeRootNode;
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
//# sourceMappingURL=OcTreeNode.js.map
