/// <reference path="../idl/INode.ts" />
/// <reference path="../util/Entity.ts" />
/// <reference path="../math/math.ts" />
/// <reference path="../bf/bf.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (scene) {
        (function (ENodeUpdateFlags) {
            ENodeUpdateFlags[ENodeUpdateFlags["k_SetForDestruction"] = 0] = "k_SetForDestruction";

            //if changed scale, otation or position
            ENodeUpdateFlags[ENodeUpdateFlags["k_NewOrientation"] = 1] = "k_NewOrientation";

            // k_NewTranslation,
            // k_NewScale,
            ENodeUpdateFlags[ENodeUpdateFlags["k_NewWorldMatrix"] = 2] = "k_NewWorldMatrix";
            ENodeUpdateFlags[ENodeUpdateFlags["k_NewLocalMatrix"] = 3] = "k_NewLocalMatrix";
            ENodeUpdateFlags[ENodeUpdateFlags["k_RebuildInverseWorldMatrix"] = 4] = "k_RebuildInverseWorldMatrix";
            ENodeUpdateFlags[ENodeUpdateFlags["k_RebuildNormalMatrix"] = 5] = "k_RebuildNormalMatrix";
        })(scene.ENodeUpdateFlags || (scene.ENodeUpdateFlags = {}));
        var ENodeUpdateFlags = scene.ENodeUpdateFlags;

        var __11 = akra.math.__11;
        var __12 = akra.math.__12;
        var __13 = akra.math.__13;
        var __14 = akra.math.__14;

        var __21 = akra.math.__21;
        var __22 = akra.math.__22;
        var __23 = akra.math.__23;
        var __24 = akra.math.__24;

        var __31 = akra.math.__31;
        var __32 = akra.math.__32;
        var __33 = akra.math.__33;
        var __34 = akra.math.__34;

        var __41 = akra.math.__41;
        var __42 = akra.math.__42;
        var __43 = akra.math.__43;
        var __44 = akra.math.__44;

        var Mat4 = akra.math.Mat4;
        var Vec3 = akra.math.Vec3;
        var Quat4 = akra.math.Quat4;
        var Mat3 = akra.math.Mat3;
        var Vec4 = akra.math.Vec4;

        var Node = (function (_super) {
            __extends(Node, _super);
            function Node() {
                _super.apply(this, arguments);
                this._m4fLocalMatrix = null;
                this._m4fWorldMatrix = null;
                this._m4fInverseWorldMatrix = null;
                this._m3fNormalMatrix = null;
                this._v3fWorldPosition = null;
                this._qRotation = null;
                this._v3fTranslation = null;
                this._v3fScale = null;
                this._iUpdateFlags = 0;
                this._eInheritance = 1 /* POSITION */;
            }
            Node.prototype.create = function () {
                return true;
            };

            Node.prototype.getLocalOrientation = function () {
                return this._qRotation;
            };

            Node.prototype.setLocalOrientation = function (qOrient) {
                this._iUpdateFlags = akra.bf.setBit(this._iUpdateFlags, 1 /* k_NewOrientation */);
                this._qRotation.set(qOrient);
            };

            Node.prototype.getLocalPosition = function () {
                return this._v3fTranslation;
            };

            Node.prototype.setLocalPosition = function (v3fPosition) {
                this._iUpdateFlags = akra.bf.setBit(this._iUpdateFlags, 1 /* k_NewOrientation */);
                this._v3fTranslation.set(v3fPosition);
            };

            Node.prototype.getLocalScale = function () {
                return this._v3fScale;
            };

            Node.prototype.setLocalScale = function (v3fScale) {
                this._iUpdateFlags = akra.bf.setBit(this._iUpdateFlags, 1 /* k_NewOrientation */);
                this._v3fScale.set(v3fScale);
            };

            Node.prototype.getLocalMatrix = function () {
                return this._m4fLocalMatrix;
            };

            Node.prototype.setLocalMatrix = function (m4fLocalMatrix) {
                this._iUpdateFlags = akra.bf.setBit(this._iUpdateFlags, 3 /* k_NewLocalMatrix */);
                this._m4fLocalMatrix.set(m4fLocalMatrix);
            };

            Node.prototype.getWorldMatrix = function () {
                return this._m4fWorldMatrix;
            };

            Node.prototype.getWorldPosition = function () {
                return this._v3fWorldPosition;
            };

            Node.prototype.getWorldOrientation = function () {
                //TODO: calc right world orient.
                return null;
            };

            Node.prototype.getWorldScale = function () {
                //TODO: calc right world scale.
                return this.getLocalScale();
            };

            //  get worldRotation(): IQuat4 {
            // 	logger.assert((<Node>this._pParent).worldMatrix.toMat3(Node._m3fTemp1).decompose(Node._q4fTemp1, Node._v3fTemp1),
            //             		"could not decompose.");
            // 	//FIXME: use correct way to get world rotation
            // 	return Node._q4fTemp1;
            // }
            Node.prototype.getInverseWorldMatrix = function () {
                if (akra.bf.testBit(this._iUpdateFlags, 4 /* k_RebuildInverseWorldMatrix */)) {
                    this._m4fWorldMatrix.inverse(this._m4fInverseWorldMatrix);
                    this._iUpdateFlags = akra.bf.clearBit(this._iUpdateFlags, 4 /* k_RebuildInverseWorldMatrix */);
                }

                return this._m4fInverseWorldMatrix;
            };

            Node.prototype.getNormalMatrix = function () {
                if (akra.bf.testBit(this._iUpdateFlags, 5 /* k_RebuildNormalMatrix */)) {
                    this._m4fWorldMatrix.toMat3(this._m3fNormalMatrix).inverse().transpose();

                    this._iUpdateFlags = akra.bf.clearBit(this._iUpdateFlags, 5 /* k_RebuildNormalMatrix */);
                }

                return this._m3fNormalMatrix;
            };

            Node.prototype.update = function () {
                // derived classes update the local matrix
                // then call this base function to complete
                // the update
                return this.recalcWorldMatrix();
            };

            Node.prototype.prepareForUpdate = function () {
                _super.prototype.prepareForUpdate.call(this);

                // clear the temporary flags
                this._iUpdateFlags = akra.bf.clearAll(this._iUpdateFlags, akra.bf.flag(3 /* k_NewLocalMatrix */) | akra.bf.flag(1 /* k_NewOrientation */) | akra.bf.flag(2 /* k_NewWorldMatrix */));
            };

            Node.prototype.setInheritance = function (eInheritance) {
                this._eInheritance = eInheritance;
            };

            Node.prototype.getInheritance = function () {
                return this._eInheritance;
            };

            Node.prototype.isWorldMatrixNew = function () {
                return akra.bf.testBit(this._iUpdateFlags, 2 /* k_NewWorldMatrix */);
            };

            Node.prototype.isLocalMatrixNew = function () {
                return akra.bf.testBit(this._iUpdateFlags, 3 /* k_NewLocalMatrix */);
            };

            Node.prototype.recalcWorldMatrix = function () {
                var isParentMoved = this._pParent && this._pParent.isWorldMatrixNew();
                var isOrientModified = akra.bf.testBit(this._iUpdateFlags, 1 /* k_NewOrientation */);
                var isLocalModified = akra.bf.testBit(this._iUpdateFlags, 3 /* k_NewLocalMatrix */);

                if (isOrientModified || isParentMoved || isLocalModified) {
                    var m4fLocal = this._m4fLocalMatrix;
                    var m4fWorld = this._m4fWorldMatrix;

                    var m4fOrient = Node._m4fTemp1;
                    var v3fTemp = Node._v3fTemp1;

                    var pWorldData = m4fWorld.data;
                    var pOrientData = m4fOrient.data;

                    this._qRotation.toMat4(m4fOrient);

                    m4fOrient.setTranslation(this._v3fTranslation);
                    m4fOrient.scaleRight(this._v3fScale);
                    m4fOrient.multiply(m4fLocal);

                    //console.log("recalc: " + this.toString() + " : " + this._eInheritance);
                    //console.error(m4fOrient.toString());
                    if (this._pParent && this._eInheritance !== 0 /* NONE */) {
                        var m4fParent = this._pParent.getWorldMatrix();
                        var pParentData = m4fParent.data;

                        if (this._eInheritance === 4 /* ALL */) {
                            m4fParent.multiply(m4fOrient, m4fWorld);
                        } else if (this._eInheritance === 1 /* POSITION */) {
                            m4fWorld.set(m4fOrient);

                            pWorldData[__14] = pParentData[__14] + pOrientData[__14];
                            pWorldData[__24] = pParentData[__24] + pOrientData[__24];
                            pWorldData[__34] = pParentData[__34] + pOrientData[__34];
                        } else if (this._eInheritance === 3 /* ROTPOSITION */) {
                            //FIXME: add faster way to compute this inheritance...
                            akra.logger.assert(m4fParent.toMat3(Node._m3fTemp1).decompose(Node._q4fTemp1, Node._v3fTemp1), "could not decompose.");

                            var m4fParentNoScale = Node._q4fTemp1.toMat4(Node._m4fTemp2);

                            m4fParentNoScale.data[__14] = pParentData[__14];
                            m4fParentNoScale.data[__24] = pParentData[__24];
                            m4fParentNoScale.data[__34] = pParentData[__34];

                            m4fParentNoScale.multiply(m4fOrient, m4fWorld);
                        } else if (this._eInheritance === 2 /* ROTSCALE */) {
                            //3x3 parent world matrix
                            var p11 = pParentData[__11], p12 = pParentData[__12], p13 = pParentData[__13];
                            var p21 = pParentData[__21], p22 = pParentData[__22], p23 = pParentData[__23];
                            var p31 = pParentData[__31], p32 = pParentData[__32], p33 = pParentData[__33];

                            //3x3 local matrix
                            var l11 = pOrientData[__11], l12 = pOrientData[__12], l13 = pOrientData[__13];
                            var l21 = pOrientData[__21], l22 = pOrientData[__22], l23 = pOrientData[__23];
                            var l31 = pOrientData[__31], l32 = pOrientData[__32], l33 = pOrientData[__33];

                            //parent x local with local world pos.
                            pWorldData[__11] = p11 * l11 + p12 * l21 + p13 * l31;
                            pWorldData[__12] = p11 * l12 + p12 * l22 + p13 * l32;
                            pWorldData[__13] = p11 * l13 + p12 * l23 + p13 * l33;
                            pWorldData[__14] = pOrientData[__14];
                            pWorldData[__21] = p21 * l11 + p22 * l21 + p23 * l31;
                            pWorldData[__22] = p21 * l12 + p22 * l22 + p23 * l32;
                            pWorldData[__23] = p21 * l13 + p22 * l23 + p23 * l33;
                            pWorldData[__24] = pOrientData[__24];
                            pWorldData[__31] = p31 * l11 + p32 * l21 + p33 * l31;
                            pWorldData[__32] = p31 * l12 + p32 * l22 + p33 * l32;
                            pWorldData[__33] = p31 * l13 + p32 * l23 + p33 * l33;
                            pWorldData[__34] = pOrientData[__34];

                            pWorldData[__41] = pOrientData[__41];
                            pWorldData[__42] = pOrientData[__42];
                            pWorldData[__43] = pOrientData[__43];
                            pWorldData[__44] = pOrientData[__44];
                        }
                    } else {
                        m4fWorld.set(m4fOrient);
                    }

                    this._v3fWorldPosition.x = pWorldData[__14];
                    this._v3fWorldPosition.y = pWorldData[__24];
                    this._v3fWorldPosition.z = pWorldData[__34];

                    // set the flag that our world matrix has changed
                    this._iUpdateFlags = akra.bf.setBit(this._iUpdateFlags, 2 /* k_NewWorldMatrix */);

                    // and it's inverse & vectors are out of date
                    this._iUpdateFlags = akra.bf.setBit(this._iUpdateFlags, 4 /* k_RebuildInverseWorldMatrix */);
                    this._iUpdateFlags = akra.bf.setBit(this._iUpdateFlags, 5 /* k_RebuildNormalMatrix */);

                    this._iUpdateFlags = akra.bf.clearAll(this._iUpdateFlags, akra.bf.flag(3 /* k_NewLocalMatrix */) | akra.bf.flag(1 /* k_NewOrientation */));

                    return true;
                }

                return false;
            };

            Node.prototype.setWorldPosition = function (fX, fY, fZ) {
                var pPos = arguments.length === 1 ? arguments[0] : Vec3.temp(fX, fY, fZ);

                //target world matrix
                var Au = Mat4.temp(1.);
                Au.setTranslation(pPos);

                //original translation matrices of this node
                var A0 = Mat4.temp(1.);
                A0.setTranslation(this.getWorldPosition());

                //inversed A0
                var A0inv = A0.inverse(Mat4.temp());

                //transformation matrix A0 to Au
                var C = Au.multiply(A0inv, Mat4.temp());

                //parent world matrix
                var Mp = akra.isNull(this.getParent()) ? Mat4.temp(1.) : Mat4.temp(this.getParent().getWorldMatrix());

                //this orientation matrix (orientation + sclae + translation)
                var Mo = Mat4.temp();

                //assemble local orientaion matrix
                this.getLocalOrientation().toMat4(Mo);
                Mo.setTranslation(this.getLocalPosition());
                Mo.scaleRight(this.getLocalScale());

                //this local matrix
                var Ml = Mat4.temp(this.getLocalMatrix());

                //inversed parent world matrix
                var Mpinv = Mp.inverse(Mat4.temp());

                //inversed this orientation matrix
                var Moinv = Mo.inverse(Mat4.temp());

                //transformation matrix Ml to Mlc
                var Cc = Moinv.multiply(Mpinv, Mat4.temp()).multiply(C).multiply(Mp).multiply(Mo);

                //modified local matrix, that translate node to pPos world position
                var Mlc = Cc.multiply(Ml, Mat4.temp());

                this._m4fLocalMatrix.setTranslation(Mlc.getTranslation());

                this._iUpdateFlags = akra.bf.setBit(this._iUpdateFlags, 3 /* k_NewLocalMatrix */);
            };

            Node.prototype.setPosition = function (fX, fY, fZ) {
                var pPos = arguments.length === 1 ? arguments[0] : Vec3.temp(fX, fY, fZ);
                var v3fTranslation = this._v3fTranslation;

                v3fTranslation.set(pPos);

                this._iUpdateFlags = akra.bf.setBit(this._iUpdateFlags, 1 /* k_NewOrientation */);
            };

            Node.prototype.setRelPosition = function (fX, fY, fZ) {
                var pPos = arguments.length === 1 ? arguments[0] : Vec3.temp(fX, fY, fZ);
                var v3fTranslation = this._v3fTranslation;

                this._qRotation.multiplyVec3(pPos);
                v3fTranslation.set(pPos);

                this._iUpdateFlags = akra.bf.setBit(this._iUpdateFlags, 1 /* k_NewOrientation */);
            };

            Node.prototype.addPosition = function (fX, fY, fZ) {
                var pPos = arguments.length === 1 ? arguments[0] : Vec3.temp(fX, fY, fZ);
                var v3fTranslation = this._v3fTranslation;

                v3fTranslation.add(pPos);

                this._iUpdateFlags = akra.bf.setBit(this._iUpdateFlags, 1 /* k_NewOrientation */);
            };

            Node.prototype.addRelPosition = function (fX, fY, fZ) {
                var pPos = arguments.length === 1 ? arguments[0] : Vec3.temp(fX, fY, fZ);
                var v3fTranslation = this._v3fTranslation;

                this._qRotation.multiplyVec3(pPos);
                v3fTranslation.add(pPos);

                this._iUpdateFlags = akra.bf.setBit(this._iUpdateFlags, 1 /* k_NewOrientation */);
            };

            Node.prototype.setRotationByMatrix = function (matrix) {
                matrix.toQuat4(this._qRotation);
                this._iUpdateFlags = akra.bf.setBit(this._iUpdateFlags, 1 /* k_NewOrientation */);
            };

            Node.prototype.setRotationByAxisAngle = function (v3fAxis, fAngle) {
                Quat4.fromAxisAngle(v3fAxis, fAngle, this._qRotation);
                this._iUpdateFlags = akra.bf.setBit(this._iUpdateFlags, 1 /* k_NewOrientation */);
            };

            Node.prototype.setRotationByForwardUp = function (v3fForward, v3fUp) {
                Quat4.fromForwardUp(v3fForward, v3fUp, this._qRotation);
                this._iUpdateFlags = akra.bf.setBit(this._iUpdateFlags, 1 /* k_NewOrientation */);
            };

            Node.prototype.setRotationByEulerAngles = function (fYaw, fPitch, fRoll) {
                Quat4.fromYawPitchRoll(fYaw, fPitch, fRoll, this._qRotation);
                this._iUpdateFlags = akra.bf.setBit(this._iUpdateFlags, 1 /* k_NewOrientation */);
            };

            Node.prototype.setRotationByXYZAxis = function (fX, fY, fZ) {
                Quat4.fromYawPitchRoll(fY, fX, fZ, this._qRotation);
                this._iUpdateFlags = akra.bf.setBit(this._iUpdateFlags, 1 /* k_NewOrientation */);
            };

            Node.prototype.setRotation = function (q4fRotation) {
                this._qRotation.set(q4fRotation);
                this._iUpdateFlags = akra.bf.setBit(this._iUpdateFlags, 1 /* k_NewOrientation */);
            };

            Node.prototype.addRelRotationByMatrix = function (matrix) {
                this.addRelRotation(arguments[0].toQuat4(Node._q4fTemp1));
            };

            Node.prototype.addRelRotationByAxisAngle = function (v3fAxis, fAngle) {
                this.addRelRotation(Quat4.fromAxisAngle(v3fAxis, fAngle, Node._q4fTemp1));
            };

            Node.prototype.addRelRotationByForwardUp = function (v3fForward, v3fUp) {
                this.addRelRotation(Quat4.fromForwardUp(v3fForward, v3fUp, Node._q4fTemp1));
            };

            Node.prototype.addRelRotationByEulerAngles = function (fYaw, fPitch, fRoll) {
                this.addRelRotation(Quat4.fromYawPitchRoll(fYaw, fPitch, fRoll, Node._q4fTemp1));
            };

            Node.prototype.addRelRotationByXYZAxis = function (fX, fY, fZ) {
                this.addRelRotation(Quat4.fromYawPitchRoll(fY, fX, fZ, Node._q4fTemp1));
            };

            Node.prototype.addRelRotation = function (q4fRotation) {
                this._qRotation.multiply(q4fRotation);
                this._iUpdateFlags = akra.bf.setBit(this._iUpdateFlags, 1 /* k_NewOrientation */);
            };

            Node.prototype.addRotationByMatrix = function (matrix) {
                this.addRotation(arguments[0].toQuat4(Node._q4fTemp1));
            };

            Node.prototype.addRotationByAxisAngle = function (v3fAxis, fAngle) {
                this.addRotation(Quat4.fromAxisAngle(v3fAxis, fAngle, Node._q4fTemp1));
            };

            Node.prototype.addRotationByForwardUp = function (v3fForward, v3fUp) {
                this.addRotation(Quat4.fromForwardUp(v3fForward, v3fUp, Node._q4fTemp1));
            };

            Node.prototype.addRotationByEulerAngles = function (fYaw, fPitch, fRoll) {
                this.addRotation(Quat4.fromYawPitchRoll(fYaw, fPitch, fRoll, Node._q4fTemp1));
            };

            Node.prototype.addRotationByXYZAxis = function (fX, fY, fZ) {
                this.addRotation(Quat4.fromYawPitchRoll(fY, fX, fZ, Node._q4fTemp1));
            };

            Node.prototype.addRotation = function (q4fRotation) {
                q4fRotation.multiplyVec3(this._v3fTranslation);
                q4fRotation.multiply(this._qRotation, this._qRotation);
                this._iUpdateFlags = akra.bf.setBit(this._iUpdateFlags, 1 /* k_NewOrientation */);
            };

            Node.prototype.scale = function (fX, fY, fZ) {
                var pScale = arguments.length === 1 ? (akra.isNumber(arguments[0]) ? Vec3.temp(fX) : arguments[0]) : Vec3.temp(fX, fY, fZ);
                var v3fScale = this._v3fScale;

                v3fScale.scale(pScale);

                this._iUpdateFlags = akra.bf.setBit(this._iUpdateFlags, 1 /* k_NewOrientation */);
            };

            Node.prototype.lookAt = function (v3f) {
                var v3fFrom, v3fCenter, v3fUp;

                this.update();

                if (arguments.length < 3) {
                    v3fFrom = this.getWorldPosition();
                    v3fCenter = arguments[0];
                    v3fUp = arguments[1];
                } else {
                    v3fFrom = arguments[0];
                    v3fCenter = arguments[1];
                    v3fUp = arguments[2];
                }

                v3fUp = v3fUp || Vec3.temp(0., 1., 0.);

                var v3fParentPos = this.getParent().getWorldPosition();
                var m4fTemp = Mat4.lookAt(v3fFrom, v3fCenter, v3fUp, Mat4.temp()).inverse();
                var pData = m4fTemp.data;

                switch (this._eInheritance) {
                    case 4 /* ALL */:
                        this._pParent.getInverseWorldMatrix().multiply(m4fTemp, m4fTemp);
                        m4fTemp.toQuat4(this._qRotation);
                        this.setPosition(pData[__14], pData[__24], pData[__34]);
                        break;
                    case 2 /* ROTSCALE */:
                        var m3fTemp = m4fTemp.toMat3();
                        m3fTemp = this._pParent.getInverseWorldMatrix().toMat3().multiply(m3fTemp, Mat3.temp());
                        m3fTemp.toQuat4(this._qRotation);
                        this.setPosition(pData[__14], pData[__24], pData[__34]);
                        break;
                    default:
                        m4fTemp.toQuat4(this._qRotation);
                        this.setPosition(pData[__14] - v3fParentPos.x, pData[__24] - v3fParentPos.y, pData[__34] - v3fParentPos.z);
                }

                this.update();
            };

            Node.prototype.attachToParent = function (pParent) {
                if (_super.prototype.attachToParent.call(this, pParent)) {
                    // adjust my local matrix to be relative to this new parent
                    var m4fInvertedParentMatrix = Mat4.temp();
                    this._pParent._m4fWorldMatrix.inverse(m4fInvertedParentMatrix);
                    this._iUpdateFlags = akra.bf.setBit(this._iUpdateFlags, 2 /* k_NewWorldMatrix */);

                    return true;
                }

                return false;
            };

            Node.prototype.detachFromParent = function () {
                if (_super.prototype.detachFromParent.call(this)) {
                    this._m4fWorldMatrix.identity();
                    return true;
                }

                return false;
            };

            Node.prototype.toString = function (isRecursive, iDepth) {
                if (typeof isRecursive === "undefined") { isRecursive = false; }
                if (typeof iDepth === "undefined") { iDepth = 0; }
                if (akra.config.DEBUG) {
                    if (!isRecursive) {
                        return '<node' + (this.getName() ? " " + this.getName() : "") + '>';
                    }

                    // var pSibling: IEntity = this.sibling;
                    var pChild = this.getChild();
                    var s = "";

                    for (var i = 0; i < iDepth; ++i) {
                        s += ':  ';
                    }

                    s += '+----[depth: ' + this.getDepth() + ']' + this.toString() + '\n';

                    while (pChild) {
                        s += pChild.toString(true, iDepth + 1);
                        pChild = pChild.getSibling();
                    }

                    // if (pSibling) {
                    // s += pSibling.toString(true, iDepth);
                    // }
                    //
                    return s;
                }
                return null;
            };

            Node._v3fTemp1 = new Vec3();
            Node._v4fTemp1 = new Vec4();
            Node._m3fTemp1 = new Mat3();
            Node._m4fTemp1 = new Mat4();
            Node._m4fTemp2 = new Mat4();
            Node._q4fTemp1 = new Quat4();
            return Node;
        })(akra.util.Entity);
        scene.Node = Node;
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
//# sourceMappingURL=Node.js.map
