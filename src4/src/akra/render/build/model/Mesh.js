var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../idl/IMesh.ts" />
    /// <reference path="../idl/IReferenceCounter.ts" />
    /// <reference path="../idl/ISkeleton.ts" />
    /// <reference path="../idl/IRect3d.ts" />
    /// <reference path="../idl/ISphere.ts" />
    /// <reference path="../idl/IEngine.ts" />
    /// <reference path="../idl/IMaterial.ts" />
    /// <reference path="../idl/IVertexData.ts" />
    /// <reference path="../idl/IMeshSubset.ts" />
    /// <reference path="../idl/ISkin.ts" />
    /// <reference path="../idl/IRenderDataCollection.ts" />
    /// <reference path="../idl/ISceneNode.ts" />
    /// <reference path="../idl/ISceneModel.ts" />
    /// <reference path="Skin.ts" />
    /// <reference "MeshSubset.ts" />
    /// <reference "../material/material.ts" />
    /// <reference "../material/Materials.ts" />
    /// <reference "../util/ReferenceCounter.ts" />
    /// <reference "../events.ts" />
    /// <reference "../guid.ts" />
    (function (model) {
        var VE = data.VertexElement;
        var DeclUsages = data.Usages;
        var Color = color.Color;

        var ShadowedSignal = (function (_super) {
            __extends(ShadowedSignal, _super);
            function ShadowedSignal(pViewport) {
                _super.call(this, pViewport, akra.EEventTypes.UNICAST);
            }
            ShadowedSignal.prototype.emit = function (pSubMesh, bShadow) {
                var pMesh = this.getSender();

                pMesh._setShadow(bShadow);

                if (!bShadow) {
                    for (var i = 0; i < pMesh.length; ++i) {
                        if (pMesh.getSubset(i).shadow) {
                            pMesh._setShadow(true);
                            break;
                        }
                    }
                }

                _super.prototype.emit.call(this, pSubMesh, bShadow);
            };
            return ShadowedSignal;
        })(akra.Signal);

        var Mesh = (function (_super) {
            __extends(Mesh, _super);
            function Mesh(pEngine, eOptions, sName, pDataBuffer) {
                _super.call(this);
                this.guid = akra.guid();
                this.shadowed = new ShadowedSignal(this);
                this._pFlexMaterials = null;
                this._pBuffer = null;
                this._eOptions = 0;
                this._pSkeleton = null;
                this._pBoundingBox = null;
                this._pBoundingSphere = null;
                this._pSubMeshes = [];
                this._bShadow = true;
                this._pSkinList = [];

                this._sName = sName || null;
                this._pEngine = pEngine;
                this.setup(sName, eOptions, pDataBuffer);
            }
            Object.defineProperty(Mesh.prototype, "length", {
                get: function () {
                    return this._pSubMeshes.length;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Mesh.prototype, "flexMaterials", {
                get: function () {
                    return this._pFlexMaterials;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Mesh.prototype, "name", {
                get: function () {
                    return this._sName;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Mesh.prototype, "data", {
                get: function () {
                    return this._pBuffer;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Mesh.prototype, "skeleton", {
                get: function () {
                    return this._pSkeleton;
                },
                set: function (pSkeleton) {
                    this._pSkeleton = pSkeleton;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Mesh.prototype, "boundingBox", {
                get: function () {
                    if (akra.isNull(this._pBoundingBox)) {
                        if (!this.createBoundingBox()) {
                            akra.logger.warn("could not compute bounding box fo mesh");
                        }
                    }

                    return this._pBoundingBox;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Mesh.prototype, "boundingSphere", {
                get: function () {
                    if (akra.isNull(this._pBoundingSphere)) {
                        if (!this.createBoundingSphere()) {
                            akra.logger.warn("could not compute bounding sphere for mesh");
                        }
                    }

                    return this._pBoundingSphere;
                },
                enumerable: true,
                configurable: true
            });

            Mesh.prototype.setSkeleton = function (pSkeleton) {
                this.skeleton = pSkeleton;
            };

            Mesh.prototype.getOptions = function () {
                return this._eOptions;
            };

            Mesh.prototype.getEngine = function () {
                return this._pEngine;
            };

            Mesh.prototype._drawSubset = function (iSubset) {
                this._pBuffer._draw(iSubset);
            };

            Mesh.prototype._draw = function () {
                for (var i = 0; i < this.length; i++) {
                    this._pSubMeshes[i]._draw();
                }
                ;
            };

            Mesh.prototype.isReadyForRender = function () {
                for (var i = 0; i < this._pSubMeshes.length; ++i) {
                    if (this._pSubMeshes[i].isReadyForRender()) {
                        return true;
                    }
                }

                return false;
            };

            Mesh.prototype.setup = function (sName, eOptions, pDataCollection) {
                akra.debug.assert(this._pBuffer === null, "mesh already setuped.");

                if (akra.isNull(pDataCollection)) {
                    this._pBuffer = this._pEngine.createRenderDataCollection(eOptions);
                } else {
                    akra.debug.assert(pDataCollection.getEngine() === this.getEngine(), "you can not use a buffer with a different context");

                    this._pBuffer = pDataCollection;
                    eOptions |= pDataCollection.getOptions();
                }

                this._pBuffer.addRef();
                this._eOptions = eOptions || 0;
                this._sName = sName || akra.config.unknown.name;

                return true;
            };

            Mesh.prototype.createSubset = function (sName, ePrimType, eOptions) {
                if (typeof eOptions === "undefined") { eOptions = 0; }
                var pData;

                //TODO: modify options and create options for data dactory.
                pData = this._pBuffer.getEmptyRenderData(ePrimType, eOptions);
                pData.addRef();

                if (akra.isNull(pData)) {
                    return null;
                }

                return this.appendSubset(sName, pData);
            };

            Mesh.prototype.appendSubset = function (sName, pData) {
                akra.debug.assert(pData.buffer === this._pBuffer, "invalid data used");

                var pSubMesh = new model.MeshSubset(this, pData, sName);
                this._pSubMeshes.push(pSubMesh);

                pSubMesh.skinAdded.connect(this, this._skinAdded);
                pSubMesh.shadowed.connect(this.shadowed);

                //this.connect(pSubMesh, SIGNAL(skinAdded), SLOT(_skinAdded));
                //this.connect(pSubMesh, SIGNAL(shadowed), SLOT(shadowed), EEventTypes.UNICAST);
                return pSubMesh;
            };

            Mesh.prototype._skinAdded = function (pSubMesh, pSkin) {
                if (this._pSkinList.indexOf(pSkin) != -1) {
                    return;
                }

                this._pSkinList.push(pSkin);
            };

            Mesh.prototype.replaceFlexMaterials = function (pFlexMaterials) {
                this._pFlexMaterials = pFlexMaterials;
            };

            Mesh.prototype.freeSubset = function (sName) {
                akra.debug.error("Метод freeSubset не реализован");
                return false;
            };

            Mesh.prototype.getFlexMaterial = function (arg) {
                if (!this._pFlexMaterials) {
                    return null;
                }

                if (typeof arguments[0] === 'number') {
                    return this._pFlexMaterials[arguments[0]] || null;
                } else {
                    for (var i = 0, pMaterials = this._pFlexMaterials; i < pMaterials.length; ++i) {
                        if (pMaterials[i].name === arguments[0]) {
                            return pMaterials[i];
                        }
                    }
                }

                return null;
            };

            Mesh.prototype.addFlexMaterial = function (sName, pMaterialData) {
                if (typeof sName === "undefined") { sName = 'unknown'; }
                if (typeof pMaterialData === "undefined") { pMaterialData = null; }
                var pMaterial;
                var pMaterialId;

                akra.debug.assert(arguments.length < 7, "only base material supported now...");

                //debug.assert(this.getFlexMaterial(sName) === null, 'material with name <' + sName + '> already exists');
                pMaterial = this.getFlexMaterial(sName);

                if (pMaterial) {
                    if (pMaterialData) {
                        pMaterial.set(pMaterialData);
                    }
                    return true;
                }

                if (!this._pFlexMaterials) {
                    this._pFlexMaterials = [];
                }

                pMaterialId = this._pFlexMaterials.length;
                pMaterial = akra.material._createFlex(sName, this._pBuffer._allocateData(akra.material.VERTEX_DECL, null));

                if (!pMaterialData) {
                    pMaterialData = akra.material.create(null, akra.config.material.default);
                }

                pMaterial.set(pMaterialData);

                //pMaterial.id = pMaterialId;
                this._pFlexMaterials.push(pMaterial);

                return true;
            };

            Mesh.prototype.setFlexMaterial = function (iMaterial) {
                var bResult = true;
                for (var i = 0; i < this.length; ++i) {
                    if (!this._pSubMeshes[i].setFlexMaterial(iMaterial)) {
                        akra.logger.warn("cannot set material<" + iMaterial + "> for mesh<" + this.name + "> subset<" + this._pSubMeshes[i].name + ">");
                        bResult = false;
                    }
                }

                return bResult;
            };

            Mesh.prototype.destroy = function () {
                this._pFlexMaterials = null;
                this._pSubMeshes = null;
                this._pBuffer.destroy();
            };

            Mesh.prototype.getSubset = function (n) {
                if (akra.isInt(arguments[0])) {
                    return this._pSubMeshes[arguments[0]] || null;
                } else {
                    for (var i = 0; i < this.length; ++i) {
                        if (this._pSubMeshes[i].name == arguments[0]) {
                            return this._pSubMeshes[i];
                        }
                    }
                }

                return null;
            };

            Mesh.prototype.setSkin = function (pSkin) {
                for (var i = 0; i < this.length; ++i) {
                    this._pSubMeshes[i].setSkin(pSkin);
                }
            };

            Mesh.prototype.createSkin = function () {
                var pSkin = model.createSkin(this);
                return pSkin;
            };

            Mesh.prototype.clone = function (iCloneOptions) {
                var pClone = null;
                var pRenderData;
                var pSubMesh;

                if (iCloneOptions & akra.EMeshCloneOptions.SHARED_GEOMETRY) {
                    pClone = this.getEngine().createMesh(this.name, this.getOptions(), this.data);

                    for (var i = 0; i < this.length; ++i) {
                        pRenderData = this._pSubMeshes[i].data;
                        pRenderData.addRef();
                        pClone.appendSubset(this._pSubMeshes[i].name, pRenderData);
                        pClone.getSubset(i).material.name = this._pSubMeshes[i].material.name;
                    }

                    pClone.replaceFlexMaterials(this.flexMaterials);
                    //trace('created clone', pClone);
                } else {
                    //TODO: clone mesh data.
                }

                if (iCloneOptions & akra.EMeshCloneOptions.GEOMETRY_ONLY) {
                    return pClone;
                } else {
                    //TODO: clone mesh shading
                }

                return pClone;
            };

            Mesh.prototype.createAndShowSubBoundingBox = function () {
                for (var i = 0; i < this.length; i++) {
                    var pSubMesh = this.getSubset(i);
                    if (pSubMesh.createBoundingBox()) {
                        if (!pSubMesh.showBoundingBox()) {
                            akra.logger.error("could not show sub bounding box");
                        }
                    } else {
                        akra.logger.error("could not create sub bounding box.");
                    }
                    //console.log("SubMesh" + i);
                }
            };

            Mesh.prototype.createAndShowSubBoundingSphere = function () {
                for (var i = 0; i < this.length; i++) {
                    var pSubMesh = this.getSubset(i);
                    pSubMesh.createBoundingSphere();
                    pSubMesh.showBoundingSphere();
                    //console.log("SubMesh" + i);
                }
            };

            Mesh.prototype.createBoundingBox = function () {
                var pVertexData;
                var pSubMesh;
                var pNewBoundingBox;
                var pTempBoundingBox;
                var i;

                pNewBoundingBox = new akra.geometry.Rect3d();
                pTempBoundingBox = new akra.geometry.Rect3d();

                pSubMesh = this.getSubset(0);
                pVertexData = pSubMesh.data._getData(DeclUsages.POSITION);

                if (akra.isNull(pVertexData)) {
                    return false;
                }

                if (akra.geometry.computeBoundingBox(pVertexData, pNewBoundingBox) == false)
                    return false;

                if (pSubMesh.isSkinned()) {
                    pNewBoundingBox.transform(pSubMesh.skin.getBindMatrix());
                    pNewBoundingBox.transform(pSubMesh.skin.getBoneOffsetMatrix(pSubMesh.skin.skeleton.root.boneName));
                }

                for (i = 1; i < this.length; i++) {
                    pSubMesh = this.getSubset(i);
                    pVertexData = pSubMesh.data._getData(DeclUsages.POSITION);

                    if (!pVertexData) {
                        return false;
                    }

                    if (akra.geometry.computeBoundingBox(pVertexData, pTempBoundingBox) == false) {
                        return false;
                    }

                    if (pSubMesh.isSkinned()) {
                        //trace('calc skinned box');
                        pTempBoundingBox.transform(pSubMesh.skin.getBindMatrix());
                        pTempBoundingBox.transform(pSubMesh.skin.getBoneOffsetMatrix(pSubMesh.skin.skeleton.root.boneName));
                    }

                    // trace('<<< after box <<');
                    pNewBoundingBox.x0 = Math.min(pNewBoundingBox.x0, pTempBoundingBox.x0);
                    pNewBoundingBox.y0 = Math.min(pNewBoundingBox.y0, pTempBoundingBox.y0);
                    pNewBoundingBox.z0 = Math.min(pNewBoundingBox.z0, pTempBoundingBox.z0);

                    pNewBoundingBox.x1 = Math.max(pNewBoundingBox.x1, pTempBoundingBox.x1);
                    pNewBoundingBox.y1 = Math.max(pNewBoundingBox.y1, pTempBoundingBox.y1);
                    pNewBoundingBox.z1 = Math.max(pNewBoundingBox.z1, pTempBoundingBox.z1);
                }

                this._pBoundingBox = pNewBoundingBox;
                return true;
            };

            Mesh.prototype.deleteBoundingBox = function () {
                this._pBoundingBox = null;
                return true;
            };

            Mesh.prototype.showBoundingBox = function () {
                var pSubMesh;
                var pMaterial;
                var iData;
                var pPoints, pIndexes;

                if (akra.isNull(this._pBoundingBox)) {
                    if (!this.createBoundingBox()) {
                        return false;
                    }
                }

                pPoints = new Array();
                pIndexes = new Array();

                akra.geometry.computeDataForCascadeBoundingBox(this._pBoundingBox, pPoints, pIndexes, 0.1);

                pSubMesh = this.getSubset(".BoundingBox");

                if (!pSubMesh) {
                    pSubMesh = this.createSubset(".BoundingBox", akra.EPrimitiveTypes.LINELIST, akra.EHardwareBufferFlags.STATIC);

                    if (akra.isNull(pSubMesh)) {
                        akra.debug.error("could not create bounding box subset...");
                        return false;
                    }

                    iData = pSubMesh.data.allocateData([VE.float3(DeclUsages.POSITION)], new Float32Array(pPoints));

                    pSubMesh.data.allocateIndex([VE.float(DeclUsages.INDEX0)], new Float32Array(pIndexes));

                    pSubMesh.data.index(iData, DeclUsages.INDEX0);

                    // pSubMesh.applyFlexMaterial(".MaterialBoundingBox");
                    pMaterial = pSubMesh.material;
                    pMaterial.emissive = new Color(1.0, 1.0, 1.0, 1.0);
                    pMaterial.diffuse = new Color(1.0, 1.0, 1.0, 1.0);
                    pMaterial.ambient = new Color(1.0, 1.0, 1.0, 1.0);
                    pMaterial.specular = new Color(1.0, 1.0, 1.0, 1.0);

                    pSubMesh.effect.addComponent("akra.system.mesh_texture");
                    pSubMesh.shadow = false;
                } else {
                    pSubMesh.data._getData(DeclUsages.POSITION).setData(new Float32Array(pPoints), DeclUsages.POSITION);
                }

                pSubMesh.data.setRenderable(pSubMesh.data.getIndexSet(), true);
                return true;
            };

            Mesh.prototype.hideBoundingBox = function () {
                var pSubMesh = this.getSubset(".BoundingBox");

                if (!pSubMesh) {
                    return false;
                }

                //TODO: hide bounding box!!
                pSubMesh.data.setRenderable(pSubMesh.data.getIndexSet(), false);
                return true;
            };

            Mesh.prototype.isBoundingBoxVisible = function () {
                var pSubMesh = this.getSubset(".BoundingBox");

                if (!pSubMesh) {
                    return false;
                }

                return pSubMesh.data.isRenderable(pSubMesh.data.getIndexSet());
            };

            Mesh.prototype.createBoundingSphere = function () {
                var pVertexData;
                var pSubMesh;
                var pNewBoundingSphere, pTempBoundingSphere;
                var i;

                pNewBoundingSphere = new akra.geometry.Sphere();
                pTempBoundingSphere = new akra.geometry.Sphere();

                pSubMesh = this.getSubset(0);
                pVertexData = pSubMesh.data._getData(DeclUsages.POSITION);

                if (!pVertexData) {
                    return false;
                }

                if (akra.geometry.computeBoundingSphere(pVertexData, pNewBoundingSphere) == false) {
                    return false;
                }

                if (pSubMesh.isSkinned()) {
                    pNewBoundingSphere.transform(pSubMesh.skin.getBindMatrix());
                    pNewBoundingSphere.transform(pSubMesh.skin.getBoneOffsetMatrix(pSubMesh.skin.skeleton.root.boneName));
                }

                for (i = 1; i < this.length; i++) {
                    pSubMesh = this.getSubset(i);
                    pVertexData = pSubMesh.data._getData(DeclUsages.POSITION);

                    if (akra.isNull(pVertexData))
                        return false;

                    if (akra.geometry.computeBoundingSphere(pVertexData, pTempBoundingSphere) == false)
                        return false;

                    if (pSubMesh.isSkinned()) {
                        pTempBoundingSphere.transform(pSubMesh.skin.getBindMatrix());
                        pTempBoundingSphere.transform(pSubMesh.skin.getBoneOffsetMatrix(pSubMesh.skin.skeleton.root.boneName));
                        // trace(pTempBoundingSphere.fRadius, '<<<');
                    }

                    akra.geometry.computeGeneralizingSphere(pNewBoundingSphere, pTempBoundingSphere);
                }

                this._pBoundingSphere = pNewBoundingSphere;

                return true;
            };

            Mesh.prototype.deleteBoundingSphere = function () {
                this._pBoundingSphere = null;
                return true;
            };

            Mesh.prototype.showBoundingSphere = function () {
                var pSubMesh, pMaterial;
                var iData;
                var pPoints, pIndexes;

                if (!this._pBoundingSphere) {
                    if (!this.createBoundingSphere()) {
                        return false;
                    }
                }

                pPoints = new Array();
                pIndexes = new Array();

                akra.geometry.computeDataForCascadeBoundingSphere(this._pBoundingSphere, pPoints, pIndexes);

                pSubMesh = this.getSubset(".BoundingSphere");

                if (!pSubMesh) {
                    pSubMesh = this.createSubset(".BoundingSphere", akra.EPrimitiveTypes.LINELIST, akra.EHardwareBufferFlags.STATIC);

                    if (akra.isNull(pSubMesh))
                        return false;

                    iData = pSubMesh.data.allocateData([VE.float3(DeclUsages.POSITION)], new Float32Array(pPoints));

                    pSubMesh.data.allocateIndex([VE.float(DeclUsages.INDEX0)], new Float32Array(pIndexes));
                    pSubMesh.data.index(iData, DeclUsages.INDEX0);

                    // pSubMesh.applyFlexMaterial(".MaterialBoundingSphere");
                    // //pSubMesh.getFlexMaterial(".MaterialBoundingSphere");
                    pMaterial = pSubMesh.material;
                    pMaterial.emissive = new Color(1.0, 1.0, 1.0, 1.0);
                    pMaterial.diffuse = new Color(1.0, 1.0, 1.0, 1.0);
                    pMaterial.ambient = new Color(1.0, 1.0, 1.0, 1.0);
                    pMaterial.specular = new Color(1.0, 1.0, 1.0, 1.0);

                    pSubMesh.effect.addComponent("akra.system.mesh_texture");
                    pSubMesh.shadow = false;
                } else {
                    pSubMesh.data._getData(DeclUsages.POSITION).setData(new Float32Array(pPoints), DeclUsages.POSITION);
                }

                pSubMesh.data.setRenderable(pSubMesh.data.getIndexSet(), true);

                return true;
            };

            Mesh.prototype.hideBoundingSphere = function () {
                var pSubMesh;

                pSubMesh = this.getSubset(".BoundingSphere");

                if (!pSubMesh) {
                    return false;
                }

                pSubMesh.data.setRenderable(pSubMesh.data.getIndexSet(), false);
                return true;
            };

            Mesh.prototype.isBoundingSphereVisible = function () {
                var pSubMesh = this.getSubset(".BoundingSphere");

                if (!pSubMesh) {
                    return false;
                }

                return pSubMesh.data.isRenderable(pSubMesh.data.getIndexSet());
            };

            Object.defineProperty(Mesh.prototype, "shadow", {
                get: function () {
                    return this._bShadow;
                },
                set: function (bValue) {
                    for (var i = 0; i < this._pSubMeshes.length; ++i) {
                        this._pSubMeshes[i].shadow = bValue;
                    }
                },
                enumerable: true,
                configurable: true
            });


            Mesh.prototype.toSceneModel = function (pParent, sName) {
                if (typeof sName === "undefined") { sName = null; }
                if (akra.isNull(pParent)) {
                    return null;
                }

                var pSceneModel = pParent.scene.createModel(sName);

                if (!pSceneModel.create()) {
                    return null;
                }

                pSceneModel.mesh = this;
                pSceneModel.attachToParent(pParent);

                return pSceneModel;
            };

            Mesh.prototype.update = function () {
                var isOk = false;

                for (var i = 0; i < this._pSkinList.length; ++i) {
                    isOk = this._pSkinList[i].applyBoneMatrices() ? true : isOk;
                }

                if (isOk) {
                    for (var i = 0; i < this.length; ++i) {
                        if (this._pSubMeshes[i].isSkinned()) {
                            this._pSubMeshes[i]._calculateSkin();
                        }
                    }
                }

                return isOk;
            };

            Mesh.prototype._setShadow = function (bValue) {
                this._bShadow = bValue;
            };
            return Mesh;
        })(akra.util.ReferenceCounter);

        function createMesh(pEngine, sName, eOptions, pDataBuffer) {
            if (typeof sName === "undefined") { sName = null; }
            if (typeof eOptions === "undefined") { eOptions = 0; }
            if (typeof pDataBuffer === "undefined") { pDataBuffer = null; }
            return new Mesh(pEngine, eOptions, sName, pDataBuffer);
        }
        model.createMesh = createMesh;
    })(akra.model || (akra.model = {}));
    var model = akra.model;
})(akra || (akra = {}));
//# sourceMappingURL=Mesh.js.map
