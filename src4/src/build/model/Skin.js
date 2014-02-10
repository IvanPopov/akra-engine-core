/// <reference path="../idl/ISkeleton.ts" />
/// <reference path="../idl/INode.ts" />
/// <reference path="../idl/IVertexData.ts" />
/// <reference path="../idl/IRenderDataCollection.ts" />
/// <reference path="../idl/IMesh.ts" />
/// <reference path="../idl/IMat4.ts" />
/// <reference path="../idl/ISceneNode.ts" />
var akra;
(function (akra) {
    (function (model) {
        var VE = akra.data.VertexElement;
        var Mat4 = akra.math.Mat4;
        var DeclUsages = akra.data.Usages;

        var Skin = (function () {
            function Skin(pMesh) {
                this._pSkeleton = null;
                // name of bones/nodes
                this._pNodeNames = null;
                //bind matrix from collada
                this._m4fBindMatrix = new Mat4(1);
                //BONE_MATRIX = WORLD_MATRIX x OFFSET_MATRIX
                this._pBoneTransformMatrices = null;
                /**
                * Common buffer for all transform matrices.
                * _pBoneOffsetMatrixBuffer = [_pBoneTransformMatrices[0], ..., _pBoneTransformMatrices[N]]
                */
                this._pBoneOffsetMatrixBuffer = null;
                // bone offset matrices from collada
                this._pBoneOffsetMatrices = null;
                /**
                * Pointers to nodes, that affect to this skin.
                */
                this._pAffectingNodes = null;
                /**
                * Format:
                * BONE_INF_COUNT - number of bones, that influence to the vertex.
                * BONE_INF_LOC - address of influence, pointer to InfData structire list.
                * ..., [BONE_INF_COUNT: float, BONE_INF_LOC: float], ...
                *
                */
                this._pInfMetaData = null;
                /**
                * Format:
                * BONE_INF_DATA - bone matrix address, pointer to BONE_MATRIX list
                * BONE_WEIGHT - bone weight
                * ..., [BONE_INF_DATA: float, BONE_WEIGHT: float], ...
                */
                this._pInfData = null;
                /**
                * Format:
                * ..., [BONE_MATRIX: matrix4], ...
                */
                this._pBoneTransformMatrixData = null;
                this._pWeights = null;
                /**
                * Links to VertexData, that contain meta from this skin.
                */
                this._pTiedData = [];
                akra.debug.assert(akra.isDefAndNotNull(pMesh), "you must specify mesh for skin");

                this._pMesh = pMesh;
            }
            Skin.prototype.getData = function () {
                return this._pMesh.getData();
            };

            Skin.prototype.getTotalBones = function () {
                return this._pNodeNames.length;
            };

            Skin.prototype.getSkeleton = function () {
                return this._pSkeleton;
            };

            Skin.prototype.setBindMatrix = function (m4fMatrix) {
                this._m4fBindMatrix.set(m4fMatrix);
            };

            Skin.prototype.getBindMatrix = function () {
                return this._m4fBindMatrix;
            };

            Skin.prototype.getBoneOffsetMatrices = function () {
                return this._pBoneOffsetMatrices;
            };

            Skin.prototype.getBoneOffsetMatrix = function (sBoneName) {
                var pBoneNames = this._pNodeNames;

                for (var i = 0; i < pBoneNames.length; i++) {
                    if (pBoneNames[i] === sBoneName) {
                        return this._pBoneOffsetMatrices[i];
                    }
                }
                ;

                return null;
            };

            Skin.prototype.setSkeleton = function (pSkeleton) {
                if (akra.isNull(pSkeleton) || pSkeleton.getTotalBones() < this.getTotalBones()) {
                    akra.debug.warn("number of bones in skeleton (" + pSkeleton.getTotalBones() + ") less then number of bones in skin (" + this.getTotalBones() + ").");
                    return false;
                }

                for (var i = 0, nMatrices = this.getTotalBones(); i < nMatrices; i++) {
                    this._pAffectingNodes[i] = pSkeleton.findJoint(this._pNodeNames[i]);
                    akra.debug.assert(!akra.isNull(this._pAffectingNodes[i]), "joint<" + this._pNodeNames[i] + "> must exists...");
                }

                this._pSkeleton = pSkeleton;

                return true;
            };

            Skin.prototype.attachToScene = function (pRootNode) {
                for (var i = 0, nMatrices = this.getTotalBones(); i < nMatrices; i++) {
                    this._pAffectingNodes[i] = pRootNode.findEntity(this._pNodeNames[i]);
                    akra.debug.assert(akra.isDefAndNotNull(this._pAffectingNodes[i]), "node<" + this._pNodeNames[i] + "> must exists...");
                }

                return true;
            };

            Skin.prototype.setBoneNames = function (pNames) {
                if (akra.isNull(pNames)) {
                    return false;
                }

                this._pNodeNames = pNames;
                this._pAffectingNodes = new Array(pNames.length);

                return true;
            };

            Skin.prototype.setBoneOffsetMatrices = function (pMatrices) {
                var pMatrixNames = this._pNodeNames;

                akra.debug.assert(akra.isDefAndNotNull(pMatrices) && akra.isDefAndNotNull(pMatrixNames) && pMatrixNames.length === pMatrices.length, "number of matrix names must equal matrices data length:\n" + pMatrixNames.length + " / " + pMatrices.length);

                var nMatrices = pMatrixNames.length;
                var pData = this.getData();
                var pMatrixData = new Float32Array(nMatrices * 16);

                //FIXME: правильно положить матрицы...
                this._pBoneOffsetMatrices = pMatrices;
                this._pBoneTransformMatrixData = pData._allocateData([VE.float4x4("BONE_MATRIX")], pMatrixData);
                this._pBoneTransformMatrices = new Array(nMatrices);

                for (var i = 0; i < nMatrices; i++) {
                    this._pBoneTransformMatrices[i] = new Mat4(pMatrixData.subarray(i * 16, (i + 1) * 16), true);
                }

                this._pBoneOffsetMatrixBuffer = pMatrixData;
            };

            Skin.prototype.setWeights = function (pWeights) {
                this._pWeights = pWeights;
                return true;
            };

            Skin.prototype.getInfluenceMetaData = function () {
                return this._pInfMetaData;
            };

            Skin.prototype.getInfluences = function () {
                return this._pInfData;
            };

            Skin.prototype.setInfluences = function (pInfluencesCount, pInfluences) {
                akra.debug.assert(this._pInfMetaData == null && this._pInfData == null, "vertex weights already setuped.");
                akra.debug.assert(!akra.isNull(this._pWeights), "you must set weight data before setup influences");

                var pData = this.getData();
                var pInfluencesMeta = new Float32Array(pInfluencesCount.length * 2);
                var pWeights = this._pWeights;

                var iInfLoc = 0;
                var iTransformLoc = 0;

                //получаем копию массива влияний
                pInfluences = new Float32Array(pInfluences);

                //вычисляем адресса матриц транфсормации и весов
                iTransformLoc = this._pBoneTransformMatrixData.getByteOffset() / 4 /* BYTES_PER_FLOAT */;

                for (var i = 0, n = pInfluences.length; i < n; i += 2) {
                    pInfluences[i] = pInfluences[i] * 16 + iTransformLoc;
                    pInfluences[i + 1] = pWeights[pInfluences[i + 1]];
                }

                //запоминаем модифицированную информацию о влияниях
                this._pInfData = pData._allocateData([
                    VE.float('BONE_INF_DATA'),
                    VE.float('BONE_WEIGHT')
                ], pInfluences);

                iInfLoc = this._pInfData.getByteOffset() / 4 /* BYTES_PER_FLOAT */;

                for (var i = 0, j = 0, n = iInfLoc; i < pInfluencesMeta.length; i += 2) {
                    var iCount = pInfluencesCount[j++];
                    pInfluencesMeta[i] = iCount; /*число влияний на вершину*/
                    pInfluencesMeta[i + 1] = n; /*адрес начала информации о влияниях */

                    //(пары индекс коэф. веса и индекс матрицы)
                    n += 2 * iCount;
                }

                //influences meta: разметка влияний
                this._pInfMetaData = pData._allocateData([
                    VE.float('BONE_INF_COUNT'),
                    VE.float('BONE_INF_LOC')
                ], pInfluencesMeta);

                return this._pInfMetaData !== null && this._pInfData !== null;
            };

            Skin.prototype.setVertexWeights = function (pInfluencesCount, pInfluences, pWeights) {
                akra.debug.assert(arguments.length > 1, 'you must specify all parameters');

                //загружаем веса
                if (pWeights) {
                    this.setWeights(pWeights);
                }

                return this.setInfluences(pInfluencesCount, pInfluences);
            };

            Skin.prototype.applyBoneMatrices = function (bForce) {
                if (typeof bForce === "undefined") { bForce = false; }
                var pData;
                var bResult;
                var pNode;
                var isUpdated = false;

                for (var i = 0, nMatrices = this.getTotalBones(); i < nMatrices; ++i) {
                    pNode = this._pAffectingNodes[i];

                    if (pNode.isWorldMatrixNew() || bForce) {
                        pNode.getWorldMatrix().multiply(this._pBoneOffsetMatrices[i], this._pBoneTransformMatrices[i]);
                        isUpdated = true;
                    }
                }

                if (isUpdated) {
                    pData = this._pBoneOffsetMatrixBuffer;
                    return this._pBoneTransformMatrixData.setData(pData, 0, pData.byteLength);
                }

                return false;
            };

            Skin.prototype.isReady = function () {
                return !(akra.isNull(this._pInfMetaData) || akra.isNull(this._pInfData) || akra.isNull(this._pWeights) || akra.isNull(this._pBoneOffsetMatrixBuffer) || akra.isNull(this._pBoneOffsetMatrices) || akra.isNull(this._pNodeNames) || akra.isNull(this._m4fBindMatrix));
            };

            Skin.prototype.getBoneTransforms = function () {
                return this._pBoneTransformMatrixData;
            };

            Skin.prototype.isAffect = function (pData) {
                if (akra.isDefAndNotNull(pData)) {
                    for (var i = 0; i < this._pTiedData.length; i++) {
                        if (this._pTiedData[i] === pData) {
                            return true;
                        }
                    }
                }

                return false;
            };

            Skin.prototype.attach = function (pData) {
                akra.debug.assert(pData.getStride() === 16, "you cannot add skin to mesh with POSITION: {x, y, z}" + "\nyou need POSITION: {x, y, z, w}");

                pData.getVertexDeclaration().append(VE.float(DeclUsages.BLENDMETA, 12));

                this._pTiedData.push(pData);
            };
            return Skin;
        })();
        model.Skin = Skin;

        function createSkin(pMesh) {
            return new Skin(pMesh);
        }
        model.createSkin = createSkin;
    })(akra.model || (akra.model = {}));
    var model = akra.model;
})(akra || (akra = {}));
//# sourceMappingURL=Skin.js.map
