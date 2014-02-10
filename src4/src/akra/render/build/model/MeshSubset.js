﻿var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../idl/IMeshSubset.ts" />
    /// <reference path="../idl/IRenderData.ts" />
    /// <reference path="../idl/IMesh.ts" />
    /// <reference path="../idl/ISkin.ts" />
    /// <reference path="../idl/IRect3d.ts" />
    /// <reference path="../idl/ISphere.ts" />
    /// <reference path="../idl/IVertexData.ts" />
    /// <reference path="../data/VertexElement.ts" />
    /// <reference path="../render/RenderableObject.ts" />
    /// <reference path="../geometry/geometry.ts" />
    /// <reference path="../material/Material.ts" />
    /// <reference path="../webgl/CalculateSkin.ts" />
    (function (model) {
        var VE = data.VertexElement;
        var DeclUsages = data.Usages;
        var VertexDeclaration = data.VertexDeclaration;

        var MeshSubset = (function (_super) {
            __extends(MeshSubset, _super);
            function MeshSubset(pMesh, pRenderData, sName) {
                if (typeof sName === "undefined") { sName = null; }
                _super.call(this, akra.ERenderableTypes.MESH_SUBSET);
                this.skinAdded = new akra.Signal(this);
                this._sName = null;
                this._pMesh = null;
                this._pSkin = null;
                this._pBoundingBox = null;
                this._pBoundingSphere = null;
                this._isOptimizedSkinned = false;
                this.setup(pMesh, pRenderData, sName);
            }
            Object.defineProperty(MeshSubset.prototype, "boundingBox", {
                get: function () {
                    return this._pBoundingBox;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MeshSubset.prototype, "boundingSphere", {
                get: function () {
                    return this._pBoundingSphere;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MeshSubset.prototype, "skin", {
                get: function () {
                    return this._pSkin;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MeshSubset.prototype, "name", {
                get: function () {
                    return this._sName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MeshSubset.prototype, "mesh", {
                get: function () {
                    return this._pMesh;
                },
                enumerable: true,
                configurable: true
            });

            MeshSubset.prototype.setup = function (pMesh, pRenderData, sName) {
                akra.debug.assert(this._pMesh === null, "mesh subset already prepared");

                this._pMesh = pMesh;
                this._pRenderData = pRenderData;
                this._sName = sName;

                _super.prototype._setup.call(this, pMesh.getEngine().getRenderer());
            };

            MeshSubset.prototype.createBoundingBox = function () {
                var pVertexData;
                var pNewBoundingBox;

                pNewBoundingBox = new akra.geometry.Rect3d();
                pVertexData = this.data._getData(DeclUsages.POSITION);

                if (akra.isNull(pVertexData))
                    return false;

                if (akra.geometry.computeBoundingBox(pVertexData, pNewBoundingBox) == false)
                    return false;

                this._pBoundingBox = pNewBoundingBox;

                return true;
            };

            MeshSubset.prototype.deleteBoundingBox = function () {
                this._pBoundingBox = null;

                return true;
            };

            MeshSubset.prototype.showBoundingBox = function () {
                var pMaterial;
                var iData;
                var iCurrentIndexSet;
                var pPoints, pIndexes;

                if (akra.isNull(this._pBoundingBox)) {
                    if (!this.createBoundingBox()) {
                        return false;
                    }
                }

                pPoints = new Array();
                pIndexes = new Array();

                akra.geometry.computeDataForCascadeBoundingBox(this._pBoundingBox, pPoints, pIndexes, 10.0);

                iCurrentIndexSet = this.data.getIndexSet();

                if (!this.data.selectIndexSet(".BoundingBox")) {
                    if (this.data.addIndexSet(false, akra.EPrimitiveTypes.LINELIST, ".BoundingBox") == -1) {
                        akra.logger.error("could not add index set '.BoundingBox'");
                        return false;
                    }

                    iData = this.data.allocateData([VE.float3(DeclUsages.POSITION)], new Float32Array(pPoints));

                    this.data.allocateIndex([VE.float(DeclUsages.INDEX0)], new Float32Array(pIndexes));

                    this.data.index(iData, DeclUsages.INDEX0);
                    // this.applyFlexMaterial(".MaterialBoundingBox");
                    //       //TODO: некорректно задавать так boundingBox, т.к. надо рендерится со своим рендер методом, а его никто не выбирает.
                    // pMaterial = this.getFlexMaterial(".MaterialBoundingBox");
                    // pMaterial.emissive = new Color(0.0, 0.0, 1.0, 1.0);
                    // pMaterial.diffuse  = new Color(0.0, 0.0, 1.0, 1.0);
                } else {
                    this.data._getData(DeclUsages.POSITION).setData(new Float32Array(pPoints), DeclUsages.POSITION);
                }

                this.data.setRenderable(this.data.getIndexSet(), true);
                this.data.selectIndexSet(iCurrentIndexSet);

                return true;
            };

            MeshSubset.prototype.isBoundingBoxVisible = function () {
                return this.data.isRenderable(this.data.findIndexSet(".BoundingBox"));
            };

            MeshSubset.prototype.hideBoundingBox = function () {
                var iCurrentIndexSet;
                iCurrentIndexSet = this.data.getIndexSet();

                if (!this.data.selectIndexSet(".BoundingBox")) {
                    return false;
                } else {
                    this.data.setRenderable(this.data.getIndexSet(), false);
                }

                return this.data.selectIndexSet(iCurrentIndexSet);
            };

            MeshSubset.prototype.createBoundingSphere = function () {
                var pVertexData;
                var pNewBoundingSphere;

                pNewBoundingSphere = new akra.geometry.Sphere();
                pVertexData = this.data._getData(DeclUsages.POSITION);

                if (!pVertexData) {
                    return false;
                }

                if (!akra.geometry.computeBoundingSphere(pVertexData, pNewBoundingSphere, false, this._pBoundingBox)) {
                    return false;
                }

                this._pBoundingSphere = pNewBoundingSphere;

                return true;
            };

            MeshSubset.prototype.deleteBoundingSphere = function () {
                this._pBoundingSphere = null;
                return true;
            };

            MeshSubset.prototype.showBoundingSphere = function () {
                var pMaterial;
                var iData;
                var iCurrentIndexSet;
                var pPoints, pIndexes;

                if (akra.isNull(this._pBoundingSphere)) {
                    if (!this.createBoundingSphere()) {
                        return false;
                    }
                }

                pPoints = new Array();
                pIndexes = new Array();
                akra.geometry.computeDataForCascadeBoundingSphere(this._pBoundingSphere, pPoints, pIndexes);

                iCurrentIndexSet = this.data.getIndexSet();
                if (!this.data.selectIndexSet(".BoundingSphere")) {
                    this.data.addIndexSet(false, akra.EPrimitiveTypes.LINELIST, ".BoundingSphere");

                    iData = this.data.allocateData([VE.float3(DeclUsages.POSITION)], new Float32Array(pPoints));

                    this.data.allocateIndex([VE.float(DeclUsages.INDEX0)], new Float32Array(pIndexes));
                    this.data.index(iData, DeclUsages.INDEX0);
                    // this.applyFlexMaterial(".MaterialBoundingSphere");
                    // pMaterial = this.getFlexMaterial(".MaterialBoundingSphere");
                    // pMaterial.emissive = new Color(0.0, 0.0, 1.0, 1.0);
                    // pMaterial.diffuse  = new Color(0.0, 0.0, 1.0, 1.0);
                } else {
                    this.data._getData(DeclUsages.POSITION).setData(new Float32Array(pPoints), DeclUsages.POSITION);
                }

                this.data.setRenderable(this.data.getIndexSet(), true);
                this.data.selectIndexSet(iCurrentIndexSet);

                return true;
            };

            /*wireframe(bEnable: boolean = true): boolean {
            if(this.data.findIndexSet(".wireframe") == -1) {
            var ePrimType: EPrimitiveTypes = this.data.getPrimitiveType();
            
            if (ePrimType !== EPrimitiveTypes.TRIANGLELIST) {
            logger.warn("wireframe supported only for TRIANGLELIST");
            return false;
            }
            
            var pIndices: Float32Array = <Float32Array>this.data.getIndexFor("POSITION");
            
            var pWFindices: int[] = [];
            var pWFCache: BoolMap = <any>{};
            var pPairs: int[][] = [[0, 1], [1, 2], [2, 0]];
            
            for (var n = 0; n < pIndices.length / 3; ++ n) {
            var t: int = n * 3;
            for (var i: int = 0; i < pPairs.length; ++ i) {
            
            var i1: int = pPairs[i][0];
            var i2: int = pPairs[i][1];
            
            var v1: int = pIndices[t + i1];
            var v2: int = pIndices[t + i2];
            
            if (v2 < v1) {
            var y: int = v2; v1 = v2; v2 = y;
            }
            
            var k: string = v1 + "_" + v2;
            
            if (pWFCache[k]) {
            continue;
            }
            
            pWFCache[k] = true;
            pWFindices.push(v1, v2);
            }
            }
            
            var iData: int = this.data.getDataLocation("POSITION");
            var iCurrentIndexSet: int = this.data.getIndexSet();
            var iWireframeSet: int = this.data.addIndexSet(false, EPrimitiveTypes.LINELIST, ".wireframe");
            
            this.data.allocateIndex([VE.float("WF_INDEX")], new Float32Array(pWFindices));
            this.data.index(iData, "WF_INDEX", false, 0, true);
            
            this.data.setRenderable(iWireframeSet, true);
            this.data.setRenderable(iCurrentIndexSet, false);
            
            this.data.selectIndexSet(iCurrentIndexSet);
            }
            
            var iWireframeSet: int = this.data.findIndexSet(".wireframe");
            var iCurrentIndexSet: int = 0;
            
            this.data.setRenderable(iWireframeSet, bEnable);
            this.data.setRenderable(iCurrentIndexSet, !bEnable);
            
            return true;
            }*/
            MeshSubset.prototype.isBoundingSphereVisible = function () {
                return this.data.isRenderable(this.data.findIndexSet(".BoundingSphere"));
            };

            MeshSubset.prototype.hideBoundingSphere = function () {
                var iCurrentIndexSet = this.data.getIndexSet();

                if (!this.data.selectIndexSet(".BoundingSphere")) {
                    return false;
                } else {
                    this.data.setRenderable(this.data.getIndexSet(), false);
                }

                return this.data.selectIndexSet(iCurrentIndexSet);
            };

            MeshSubset.prototype.computeNormals = function () {
                //TODO: calc normals
            };

            MeshSubset.prototype.computeTangents = function () {
                //TODO: compute normals
            };

            MeshSubset.prototype.computeBinormals = function () {
                //TODO: calc binormals
            };

            MeshSubset.prototype.isSkinned = function () {
                return this._pSkin !== null;
            };

            MeshSubset.prototype.isOptimizedSkinned = function () {
                return this.isSkinned() && this._isOptimizedSkinned;
            };

            MeshSubset.prototype.getSkin = function () {
                return this._pSkin;
            };

            MeshSubset.prototype.applyFlexMaterial = function (sMaterial, pMaterialData) {
                if (typeof pMaterialData === "undefined") { pMaterialData = null; }
                if (this._pMesh.addFlexMaterial(sMaterial, pMaterialData)) {
                    return this.setFlexMaterial(sMaterial);
                }

                return false;
            };

            MeshSubset.prototype.getFlexMaterial = function (iMaterial) {
                return this._pMesh.getFlexMaterial(iMaterial);
            };

            MeshSubset.prototype.hasFlexMaterial = function () {
                return this._pRenderData.hasSemantics(DeclUsages.MATERIAL);
            };

            MeshSubset.prototype.setFlexMaterial = function (iMaterial) {
                var pMaterial = this._pMesh.getFlexMaterial(iMaterial);

                if (akra.isNull(pMaterial)) {
                    akra.logger.warn("could not find material <" + iMaterial + "> in sub mesh <" + this.name + ">");
                    return false;
                }

                var pRenderData = this._pRenderData;
                var pIndexData = pRenderData.getIndices();
                var pMatFlow = pRenderData._getFlow(DeclUsages.MATERIAL);
                var eSemantics = DeclUsages.INDEX10;
                var pIndexDecl, pFloatArray;
                var iMatFlow;
                var iMat = (pMaterial).data.byteOffset;

                if (pMatFlow) {
                    iMatFlow = pMatFlow.flow;
                    eSemantics = pMatFlow.mapper.semantics;
                    pIndexData = pMatFlow.mapper.data;

                    pRenderData._addData((pMaterial).data, iMatFlow);

                    return pRenderData.index(iMat, eSemantics, true);
                }

                pIndexDecl = VertexDeclaration.normalize([VE.float(eSemantics)]);
                pFloatArray = new Float32Array((pIndexData).length);
                iMatFlow = pRenderData._addData((pMaterial).data);

                akra.debug.assert(iMatFlow >= 0, "cannot add data flow with material for mesh subsset");

                if (!pRenderData.allocateIndex(pIndexDecl, pFloatArray)) {
                    akra.logger.warn("cannot allocate index for material!!!");
                    return false;
                }

                return pRenderData.index(iMat, eSemantics, true);
            };

            MeshSubset.prototype._draw = function () {
                //		    this._pRenderData._draw();
                akra.logger.critical("Need to do.");
            };

            MeshSubset.prototype.show = function () {
                this.data.setRenderable(true);
            };

            MeshSubset.prototype.hide = function () {
                this.data.setRenderable(false);
            };

            MeshSubset.prototype.isRenderable = function () {
                return this.data.isRenderable();
            };

            //исходим из того, что данные скина 1:1 соотносятся с вершинами.
            MeshSubset.prototype.setSkin = function (pSkin) {
                var pRenderData = this.data;
                var pPosData;
                var pPositionFlow;
                var pNormalFlow;
                var pMetaData;

                //мета данные разметки
                var pInfMetaData;

                //адресс мета данных во флотах
                var iInfMetaDataLoc;

                //шаг мета данных во флотах
                var iInfMetaDataStride;

                /*
                Получаем данные вершин, чтобы проложить в {W} компоненту адерес мета информации,
                о влиянии на данную вершины.
                */
                //получаем поток данных с вершиными
                pPositionFlow = pRenderData._getFlow(DeclUsages.POSITION);
                akra.debug.assert(akra.isDefAndNotNull(pPositionFlow), "skin require position with indices in mesh subset");

                pPosData = pPositionFlow.data;

                if (pPosData.hasSemantics(DeclUsages.BLENDMETA)) {
                    if (pSkin.isAffect(pPosData)) {
                        return true;
                    }

                    akra.debug.error("mesh subset already has another skin");
                    return false;
                }

                //проверяем, что текущий подмеш пренадлежит мешу, на который натягивается skin,
                //или его клону.
                akra.debug.assert(this.data.buffer == pSkin.data, "can not bind to skin mesh subset that does not belong skin's mesh.");

                //подвязывем скин, к данным с вершинами текущего подмеша.
                //т.е. добавляем разметку в конец каждого пикселя
                pSkin.attach(pPosData);

                /*
                //получаем данные разметки
                pMetaData = <Float32Array>pPosData.getTypedData(DeclUsages.BLENDMETA);
                
                //если по каким то причинам нет разметки...
                debug.assert(isDefAndNotNull(pMetaData), "you must specify location for storage blending data");
                
                //выставляем разметку мета данных вершин, так чтобы они адрессовали сразу на данные
                pInfMetaData = pSkin.getInfluenceMetaData();
                iInfMetaDataLoc = pInfMetaData.byteOffset / EDataTypeSizes.BYTES_PER_FLOAT;
                iInfMetaDataStride = pInfMetaData.stride / EDataTypeSizes.BYTES_PER_FLOAT;
                
                for (var i: int = 0; i < pMetaData.length; ++ i) {
                pMetaData[i] = iInfMetaDataLoc + i * iInfMetaDataStride;
                }
                
                //обновляем адреса мета данных вершин
                pPosData.setData(pMetaData, DeclUsages.BLENDMETA);
                
                */
                var pDeclaration = pPosData.getVertexDeclaration();
                var pVEMeta = pDeclaration.findElement(DeclUsages.BLENDMETA);

                //if BLENDMETA not found
                akra.debug.assert(akra.isDefAndNotNull(pVEMeta), "you must specify location for storage blending data");

                //read all data for acceleration
                pMetaData = new Float32Array(pPosData.getData(0, pDeclaration.stride));

                //выставляем разметку мета данных вершин, так чтобы они адрессовали сразу на данные
                pInfMetaData = pSkin.getInfluenceMetaData();
                iInfMetaDataLoc = pInfMetaData.byteOffset / akra.EDataTypeSizes.BYTES_PER_FLOAT;
                iInfMetaDataStride = pInfMetaData.stride / akra.EDataTypeSizes.BYTES_PER_FLOAT;

                var iCount = pMetaData.byteLength / pDeclaration.stride;
                var iOffset = pVEMeta.offset / akra.EDataTypeSizes.BYTES_PER_FLOAT;
                var iStride = pDeclaration.stride / akra.EDataTypeSizes.BYTES_PER_FLOAT;

                for (var i = 0; i < iCount; ++i) {
                    pMetaData[iOffset + i * iStride] = iInfMetaDataLoc + i * iInfMetaDataStride;
                }

                pPosData.setData(pMetaData, 0, pDeclaration.stride);

                var pIndexData = pRenderData.getIndices();

                pNormalFlow = pRenderData._getFlow(DeclUsages.NORMAL);

                var pIndex0 = pIndexData.getTypedData(pPositionFlow.mapper.semantics);
                var pIndex1 = pIndexData.getTypedData(pNormalFlow.mapper.semantics);

                var iAdditionPosition = pPosData.byteOffset;
                var iAdditionNormal = pNormalFlow.data.byteOffset;

                for (var i = 0; i < pIndex0.length; i++) {
                    pIndex0[i] = (pIndex0[i] * akra.EDataTypeSizes.BYTES_PER_FLOAT - iAdditionPosition) / pPositionFlow.data.stride;
                    pIndex1[i] = (pIndex1[i] * akra.EDataTypeSizes.BYTES_PER_FLOAT - iAdditionNormal) / pNormalFlow.data.stride;
                }

                //update position index
                var pUPPositionIndex = new Float32Array(pPosData.length);
                for (var i = 0; i < pPosData.length; i++) {
                    pUPPositionIndex[i] = i;
                }

                //update normal index
                var pTmp = {};

                var pSkinnedNormalIndex = [];
                var pUNPositionIndex = [];
                var pUNNormalIndex = [];
                var pDestinationSkinnedNormalIndex = [];

                var iCounter = 0;

                for (var i = 0; i < pIndex0.length; i++) {
                    var sKey = pIndex0[i].toString() + "_" + pIndex1[i];
                    if (!akra.isDef(pTmp[sKey])) {
                        pTmp[sKey] = iCounter;
                        pUNPositionIndex.push(pIndex0[i]);
                        pUNNormalIndex.push(pIndex1[i]);
                        pSkinnedNormalIndex.push(iCounter);
                        pDestinationSkinnedNormalIndex.push(iCounter);
                        iCounter++;
                    } else {
                        pSkinnedNormalIndex.push(pDestinationSkinnedNormalIndex[pTmp[sKey]]);
                    }
                }

                var iSkinnedPos = pRenderData.allocateData([VE.float3("SKINNED_POSITION"), VE.end(16)], new Float32Array(pPosData.length * 4));

                /*skinned vertices uses same index as vertices*/
                pRenderData.allocateIndex([VE.float("SP_INDEX")], pIndex0);
                pRenderData.index(iSkinnedPos, "SP_INDEX");

                var iSkinnedNorm = pRenderData.allocateData([VE.float3("SKINNED_NORMAL"), VE.end(16)], new Float32Array(pUNNormalIndex.length * 4));

                /*skinned normals uses new index*/
                pRenderData.allocateIndex([VE.float("SN_INDEX")], new Float32Array(pSkinnedNormalIndex));
                pRenderData.index(iSkinnedNorm, "SN_INDEX");

                var iPreviousSet = pRenderData.getIndexSet();

                var iUPIndexSet = pRenderData.addIndexSet(true, akra.EPrimitiveTypes.POINTLIST, ".update_skinned_position");
                pRenderData.allocateIndex([VE.float("UPP_INDEX")], pUPPositionIndex);
                pRenderData.index(pPosData.byteOffset, "UPP_INDEX");
                pRenderData.allocateIndex([VE.float("DESTINATION_SP")], pUPPositionIndex);
                pRenderData.index(iSkinnedPos, "DESTINATION_SP");

                var iUNIndexSet = pRenderData.addIndexSet(true, akra.EPrimitiveTypes.POINTLIST, ".update_skinned_normal");
                pRenderData.allocateIndex([VE.float("UNP_INDEX")], new Float32Array(pUNPositionIndex));
                pRenderData.index(pPosData.byteOffset, "UNP_INDEX");
                pRenderData.allocateIndex([VE.float("UNN_INDEX")], new Float32Array(pUNNormalIndex));
                pRenderData.index(pRenderData._getFlow(DeclUsages.NORMAL, false).data.byteOffset, "UNN_INDEX");
                pRenderData.allocateIndex([VE.float("DESTINATION_SN")], new Float32Array(pDestinationSkinnedNormalIndex));
                pRenderData.index(iSkinnedNorm, "DESTINATION_SN");

                pRenderData.selectIndexSet(iPreviousSet);

                // LOG(pRenderData.toString());
                // pRenderData.selectIndexSet(iUPIndexSet);
                // LOG(pRenderData.toString());
                // pRenderData.selectIndexSet(iUNIndexSet);
                // LOG(pRenderData.toString());
                pRenderData.setRenderable(iUPIndexSet, false);
                pRenderData.setRenderable(iUNIndexSet, false);

                // LOG(iPreviousSet, iUPIndexSet);
                // LOG(pSkinnedNormalIndex);
                // LOG(pUNPositionIndex);
                // LOG(pUNNormalIndex);
                this._pSkin = pSkin;
                this.skinAdded.emit(pSkin);

                return true;
            };

            MeshSubset.prototype._calculateSkin = function () {
                var isOk = akra.config.WEBGL ? akra.webgl.calculateSkin(this) : false;
                this._isOptimizedSkinned = isOk;
                return isOk;
            };
            return MeshSubset;
        })(akra.render.RenderableObject);
        model.MeshSubset = MeshSubset;
    })(akra.model || (akra.model = {}));
    var model = akra.model;
})(akra || (akra = {}));
//# sourceMappingURL=MeshSubset.js.map
