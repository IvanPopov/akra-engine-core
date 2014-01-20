var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../idl/IEntity.ts" />
    /// <reference path="../idl/IExplorerFunc.ts" />
    /// <reference path="../logger.ts" />
    /// <reference path="../debug.ts" />
    /// <reference path="../bf/bf.ts" />
    /// <reference path="../events.ts" />
    /// <reference path="../config/config.ts" />
    /// <reference path="../guid.ts" />
    /// <reference path="ReferenceCounter.ts" />
    (function (util) {
        var AEEntityStates;
        (function (AEEntityStates) {
            //обновился ли сам узел?
            AEEntityStates[AEEntityStates["k_Updated"] = 0x01] = "k_Updated";

            //есть ли среди потомков обновленные узлы
            AEEntityStates[AEEntityStates["k_DescendantsUpdtated"] = 0x02] = "k_DescendantsUpdtated";

            //если ли обновленные узлы среди братьев или их потомках
            AEEntityStates[AEEntityStates["k_SiblingsUpdated"] = 0x04] = "k_SiblingsUpdated";
        })(AEEntityStates || (AEEntityStates = {}));

        var Entity = (function (_super) {
            __extends(Entity, _super);
            function Entity(eType) {
                _super.call(this);
                this.guid = guid();
                this.attached = new akra.Signal(this);
                this.detached = new akra.Signal(this);
                this.childAdded = new akra.Signal(this);
                this.childRemoved = new akra.Signal(this);
                this._sName = null;
                this._pParent = null;
                this._pSibling = null;
                this._pChild = null;
                this._eType = akra.EEntityTypes.UNKNOWN;
                this._iStateFlags = 0;
                this._eType = eType;
            }
            Object.defineProperty(Entity.prototype, "name", {
                get: function () {
                    return this._sName;
                },
                set: function (sName) {
                    this._sName = sName;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Entity.prototype, "parent", {
                get: function () {
                    return this._pParent;
                },
                set: function (pParent) {
                    this.attachToParent(pParent);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Entity.prototype, "sibling", {
                get: function () {
                    return this._pSibling;
                },
                set: function (pSibling) {
                    this._pSibling = pSibling;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Entity.prototype, "child", {
                get: function () {
                    return this._pChild;
                },
                set: function (pChild) {
                    this._pChild = pChild;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Entity.prototype, "type", {
                get: function () {
                    return this._eType;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Entity.prototype, "rightSibling", {
                get: function () {
                    var pSibling = this.sibling;

                    if (pSibling) {
                        while (pSibling.sibling) {
                            pSibling = pSibling.sibling;
                        }

                        return pSibling;
                    }

                    return this;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Entity.prototype, "depth", {
                get: function () {
                    var iDepth = -1;
                    for (var pEntity = this; pEntity; pEntity = pEntity.parent, ++iDepth) {
                    }
                    ;
                    return iDepth;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Entity.prototype, "root", {
                get: function () {
                    for (var pEntity = this, iDepth = -1; pEntity.parent; pEntity = pEntity.parent, ++iDepth) {
                    }
                    ;
                    return pEntity;
                },
                enumerable: true,
                configurable: true
            });

            Entity.prototype.destroy = function (bRecursive, bPromoteChildren) {
                if (typeof bRecursive === "undefined") { bRecursive = false; }
                if (typeof bPromoteChildren === "undefined") { bPromoteChildren = true; }
                if (bRecursive) {
                    if (this._pSibling) {
                        this._pSibling.destroy(true);
                    }

                    if (this._pChild) {
                        this._pChild.destroy(true);
                    }
                }

                if (bPromoteChildren && !bRecursive) {
                    this.promoteChildren();
                }

                // now remove ourselves from our parent
                this.detachFromParent();

                // we should now be removed from the tree, and have no dependants
                akra.debug.assert(this.referenceCount() == 0, "Attempting to delete a scene node which is still in use");
                akra.debug.assert(this._pSibling == null, "Failure Destroying Node");
                akra.debug.assert(this._pChild == null, "Failure Destroying Node");
            };

            Entity.prototype.findEntity = function (sName) {
                var pEntity = null;

                if (this._sName === sName) {
                    return this;
                }

                if (this._pSibling) {
                    pEntity = this._pSibling.findEntity(sName);
                }

                if (pEntity == null && this._pChild) {
                    pEntity = this._pChild.findEntity(sName);
                }

                return pEntity;
            };

            Entity.prototype.explore = function (fn) {
                if (fn(this) === false) {
                    return;
                }

                if (this._pSibling) {
                    this._pSibling.explore(fn);
                }

                if (this._pChild) {
                    this._pChild.explore(fn);
                }
            };

            Entity.prototype.childOf = function (pParent) {
                for (var pEntity = this; pEntity; pEntity = pEntity.parent) {
                    if (pEntity.parent === pParent) {
                        return true;
                    }
                }

                return false;
            };

            Entity.prototype.children = function () {
                var pChildren = [];
                var pChild = this.child;

                while (!akra.isNull(pChild)) {
                    pChildren.push(pChild);
                    pChild = pChild.sibling;
                }

                return pChildren;
            };

            Entity.prototype.childAt = function (i) {
                var pChild = this.child;
                var n = 0;

                while (!akra.isNull(pChild)) {
                    if (n == i) {
                        return pChild;
                    }
                    n++;
                    pChild = pChild.sibling;
                }

                return pChild;
            };

            /**
            * Returns the current number of siblings of this object.
            */
            Entity.prototype.siblingCount = function () {
                var iCount = 0;

                if (this._pParent) {
                    var pNextSibling = this._pParent.child;
                    if (pNextSibling) {
                        while (pNextSibling) {
                            pNextSibling = pNextSibling.sibling;
                            ++iCount;
                        }
                    }
                }

                return iCount;
            };

            Entity.prototype.descCount = function () {
                var n = this.childCount();
                var pChild = this.child;

                while (!akra.isNull(pChild)) {
                    n += pChild.descCount();
                    pChild = pChild.sibling;
                }

                return n;
            };

            /**
            * Returns the current number of children of this object
            */
            Entity.prototype.childCount = function () {
                var iCount = 0;
                var pChild = this.child;

                while (!akra.isNull(pChild)) {
                    iCount++;
                    pChild = pChild.sibling;
                }

                // var pNextChild: IEntity = this.child;
                // if (pNextChild) {
                //	 ++ iCount;
                //	 while (pNextChild) {
                //		 pNextChild = pNextChild.sibling;
                //		 ++ iCount;
                //	 }
                // }
                return iCount;
            };

            Entity.prototype.isUpdated = function () {
                return akra.bf.testAll(this._iStateFlags, AEEntityStates.k_Updated);
            };

            Entity.prototype.hasUpdatedSubNodes = function () {
                return akra.bf.testAll(this._iStateFlags, AEEntityStates.k_DescendantsUpdtated);
            };

            Entity.prototype.recursiveUpdate = function () {
                if (this.update()) {
                    akra.bf.setAll(this._iStateFlags, AEEntityStates.k_Updated);
                    // bUpdated = true;
                }

                if (this._pSibling && this._pSibling.recursiveUpdate()) {
                    akra.bf.setAll(this._iStateFlags, AEEntityStates.k_SiblingsUpdated);
                    // bUpdated = true;
                }

                if (this._pChild && this._pChild.recursiveUpdate()) {
                    akra.bf.setAll(this._iStateFlags, AEEntityStates.k_DescendantsUpdtated);
                    // bUpdated = true;
                }

                return (this._iStateFlags != 0);
            };

            Entity.prototype.recursivePreUpdate = function () {
                // clear the flags from the previous update
                this.prepareForUpdate();

                if (this._pSibling) {
                    this._pSibling.recursivePreUpdate();
                }

                if (this._pChild) {
                    this._pChild.recursivePreUpdate();
                }
            };

            Entity.prototype.prepareForUpdate = function () {
                this._iStateFlags = 0;
            };

            /** Parent is not undef */
            Entity.prototype.hasParent = function () {
                return akra.isDefAndNotNull(this._pParent);
            };

            /** Child is not undef*/
            Entity.prototype.hasChild = function () {
                return akra.isDefAndNotNull(this._pChild);
            };

            /** Sibling is not undef */
            Entity.prototype.hasSibling = function () {
                return akra.isDefAndNotNull(this._pSibling);
            };

            /**
            * Checks to see if the provided item is a sibling of this object
            */
            Entity.prototype.isASibling = function (pSibling) {
                if (!pSibling) {
                    return false;
                }

                if (this == pSibling || this._pSibling == pSibling) {
                    return true;
                }

                if (this._pSibling) {
                    return this._pSibling.isASibling(pSibling);
                }

                // it's not us, and we have no sibling to check. This is not a sibling of ours.
                return false;
            };

            /** Checks to see if the provided item is a child of this object. (one branch depth only) */
            Entity.prototype.isAChild = function (pChild) {
                if (!pChild) {
                    return (false);
                }

                if (this._pChild == pChild) {
                    return (true);
                }

                if (this._pChild) {
                    return (this._pChild.isASibling(pChild));
                }

                // it's not us, and we have no child to check. This is not a sibling of ours.
                return (false);
            };

            /**
            * Checks to see if the provided item is a child or sibling of this object. If SearchEntireTree
            * is TRUE, the check is done recursivly through all siblings and children. SearchEntireTree
            * is FALSE by default.
            */
            Entity.prototype.isInFamily = function (pEntity, bSearchEntireTree) {
                if (!pEntity) {
                    return (false);
                }

                if (this == pEntity || this._pChild == pEntity || this._pSibling == pEntity) {
                    return (true);
                }

                if (!bSearchEntireTree) {
                    if (this.isASibling(pEntity)) {
                        return (true);
                    }
                    if (this._pChild && this._pChild.isASibling(pEntity)) {
                        return (true);
                    }
                } else {
                    if (this._pSibling && this._pSibling.isInFamily(pEntity, bSearchEntireTree)) {
                        return (true);
                    }

                    if (this._pChild && this._pChild.isInFamily(pEntity, bSearchEntireTree)) {
                        return (true);
                    }
                }

                return (false);
            };

            /**
            * Adds the provided ModelSpace object to the descendant list of this object. The provided
            * ModelSpace object is removed from any parent it may already belong to.
            */
            Entity.prototype.addSibling = function (pSibling) {
                if (pSibling) {
                    // replace objects current sibling pointer with this new one
                    pSibling.sibling = this._pSibling;
                    this.sibling = pSibling;
                }

                return pSibling;
            };

            /**
            * Adds the provided ModelSpace object to the descendant list of this object. The provided
            * ModelSpace object is removed from any parent it may already belong to.
            */
            Entity.prototype.addChild = function (pChild) {
                if (pChild) {
                    // Replace the new child's sibling pointer with our old first child.
                    pChild.sibling = this._pChild;

                    // the new child becomes our first child pointer.
                    this._pChild = pChild;
                    this.childAdded.emit(pChild);
                }

                return pChild;
            };

            /**
            * Removes a specified child object from this parent object. If the child is not the
            * FirstChild of this object, all of the Children are searched to find the object to remove.
            */
            Entity.prototype.removeChild = function (pChild) {
                if (this._pChild && pChild) {
                    if (this._pChild == pChild) {
                        this._pChild = pChild.sibling;
                        pChild.sibling = null;
                    } else {
                        var pTempNode = this._pChild;

                        while (pTempNode && (pTempNode.sibling != pChild)) {
                            pTempNode = pTempNode.sibling;
                        }

                        if (pTempNode) {
                            pTempNode.sibling = pChild.sibling;
                            pChild.sibling = null;
                        }
                    }

                    this.childRemoved.emit(pChild);
                }

                return pChild;
            };

            /** Removes all Children from this parent object */
            Entity.prototype.removeAllChildren = function () {
                while (!akra.isNull(this._pChild)) {
                    var pNextSibling = this._pChild.sibling;
                    this._pChild.detachFromParent();
                    this._pChild = pNextSibling;
                }
            };

            /** Attaches this object ot a new parent. Same as calling the parent's addChild() routine. */
            Entity.prototype.attachToParent = function (pParent) {
                var pParentPrev = this.parent;

                if (pParent != this._pParent) {
                    this.detachFromParent();

                    if (pParent) {
                        if (pParent.addChild(this)) {
                            this._pParent = pParent;
                            this._pParent.addRef();
                            this.attached.emit();
                            return true;
                        }

                        return this.attachToParent(pParentPrev);
                    }
                }

                return false;
            };

            Entity.prototype.detachFromParent = function () {
                if (this._pParent) {
                    this._pParent.removeChild(this);

                    if (this._pParent) {
                        this._pParent.release();
                    }

                    this._pParent = null;

                    // my world matrix is now my local matrix
                    this.detached.emit();
                    return true;
                }

                return false;
            };

            /**
            * Attaches this object's children to it's parent, promoting them up the tree
            */
            Entity.prototype.promoteChildren = function () {
                while (!akra.isNull(this._pChild)) {
                    var pNextSibling = this._pChild.sibling;
                    this._pChild.attachToParent(this._pParent);
                    this._pChild = pNextSibling;
                }
            };

            Entity.prototype.relocateChildren = function (pParent) {
                if (pParent != this) {
                    while (!akra.isNull(this._pChild)) {
                        var pNextSibling = this._pChild.sibling;
                        this._pChild.attachToParent(pParent);
                        this._pChild = pNextSibling;
                    }
                }
            };

            Entity.prototype.update = function () {
                return false;
            };

            Entity.prototype.toString = function (isRecursive, iDepth) {
                if (typeof isRecursive === "undefined") { isRecursive = false; }
                if (typeof iDepth === "undefined") { iDepth = 0; }
                if (akra.config.DEBUG) {
                    if (!isRecursive) {
                        return '<entity' + (this._sName ? ' ' + this._sName : "") + '>';
                    }

                    var pChild = this.child;
                    var s = "";

                    for (var i = 0; i < iDepth; ++i) {
                        s += ':  ';
                    }

                    s += '+----[depth: ' + this.depth + ']' + this.toString() + '\n';

                    if (pChild) {
                        s += pChild.toString(true, iDepth + 1);
                    }

                    return s;
                }

                return null;
            };
            return Entity;
        })(util.ReferenceCounter);
        util.Entity = Entity;
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
