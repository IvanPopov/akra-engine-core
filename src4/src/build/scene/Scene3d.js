/// <reference path="../idl/IModel.ts" />
/// <reference path="../idl/IScene3d.ts" />
/// <reference path="../idl/ISceneManager.ts" />
/// <reference path="../idl/IDisplayList.ts" />
/// <reference path="../idl/ILightGraph.ts" />
/// <reference path="../idl/ILightPoint.ts" />
/// <reference path="../idl/IOcTree.ts" />
var akra;
(function (akra) {
    /// <reference path="../events.ts" />
    /// <reference path="../debug.ts" />
    /// <reference path="Joint.ts" />
    /// <reference path="SceneNode.ts" />
    /// <reference path="SceneObject.ts" />
    /// <reference path="SceneModel.ts" />
    /// <reference path="OcTree.ts" />
    /// <reference path="LightGraph.ts" />
    /// <reference path="Sprite.ts" />
    /// <reference path="objects/ModelEntry.ts" />
    /// <reference path="objects/Camera.ts" />
    /// <reference path="../terrain/Terrain.ts" />
    /// <reference path="../terrain/TerrainROAM.ts" />
    /// <reference path="../terrain/TerrainSection.ts" />
    /// <reference path="../terrain/TerrainSectionROAM.ts" />
    /// <reference path="light/ProjectLight.ts" />
    /// <reference path="light/OmniLight.ts" />
    /// <reference path="light/SunLight.ts" />
    /// <reference path="light/ShadowCaster.ts" />
    (function (scene) {
        var Scene3d = (function () {
            function Scene3d(pSceneManager, sName) {
                if (typeof sName === "undefined") { sName = null; }
                this.guid = akra.guid();
                // protected _pNodeList: ISceneNode[];
                // protected _pObjectList: ISceneObject[];
                this._pDisplayLists = [];
                this._pDisplayListsCount = 0;
                this._isUpdated = false;
                this.setupSignals();

                this._pSceneManager = pSceneManager;
                this._sName = sName;
                this._pRootNode = this.createNode("root-node");
                this._pRootNode.create();

                var i;

                //TODO: fix this method, do right!!
                var pOctree = new akra.scene.OcTree();
                pOctree.create(new akra.geometry.Rect3d(1024, 1024, 1024), 5, 100);

                var i = this.addDisplayList(pOctree);
                akra.debug.assert(i == Scene3d.DL_DEFAULT, "invalid default list index");

                var pLightGraph = new akra.scene.LightGraph();

                i = this.addDisplayList(pLightGraph);
                akra.debug.assert(i == Scene3d.DL_LIGHTING, "invalid default list index");
                // this._pNodeList = [];
                // this._pObjectList = [];
                //TODO передача пользовательских параметров в OcTree
                // i = this.addDisplayList(new OcTree);
                // debug.assert(i == DL_DEFAULT, "invalid default list index");
                //TODO передача пользовательских параметров в LightGraph
                // i = this.addDisplayList(new LightGraph);
                // debug.assert(i == DL_LIGHTING, "invalid lighting list index");
            }
            Scene3d.prototype.getType = function () {
                return 0 /* TYPE_3D */;
            };

            Scene3d.prototype.getTotalDL = function () {
                return this._pDisplayListsCount;
            };

            Scene3d.prototype.getName = function () {
                return this._sName;
            };

            Scene3d.prototype.setupSignals = function () {
                this.displayListAdded = this.displayListAdded || new akra.Signal(this);
                this.displayListRemoved = this.displayListRemoved || new akra.Signal(this);

                this.beforeUpdate = this.beforeUpdate || new akra.Signal(this);
                this.postUpdate = this.postUpdate || new akra.Signal(this);
                this.preUpdate = this.preUpdate || new akra.Signal(this);

                this.nodeAttachment = this.nodeAttachment || new akra.Signal(this);
                this.nodeDetachment = this.nodeDetachment || new akra.Signal(this);
            };

            Scene3d.prototype.getManager = function () {
                return this._pSceneManager;
            };

            Scene3d.prototype.isUpdated = function () {
                return this._isUpdated;
            };

            Scene3d.prototype.getRootNode = function () {
                return this._pRootNode;
            };

            Scene3d.prototype.recursivePreUpdate = function () {
                this._isUpdated = false;
                this.preUpdate.emit();
                this._pRootNode.recursivePreUpdate();
            };

            Scene3d.prototype.recursiveUpdate = function () {
                this.beforeUpdate.emit();
                this._isUpdated = this._pRootNode.recursiveUpdate();
                this.postUpdate.emit();
            };

            Scene3d.prototype.updateCamera = function () {
                return false;
            };

            Scene3d.prototype.updateScene = function () {
                return false;
            };

            Scene3d.prototype.createObject = function (sName) {
                if (typeof sName === "undefined") { sName = null; }
                var pNode = new akra.scene.SceneObject(this);

                if (!pNode.create()) {
                    akra.logger.error("cannot create scene node..");
                    return null;
                }

                return this.setupNode(pNode, sName);
            };

            Scene3d.prototype.createNode = function (sName) {
                if (typeof sName === "undefined") { sName = null; }
                var pNode = new akra.scene.SceneNode(this);

                if (!pNode.create()) {
                    akra.logger.error("cannot create scene node..");
                    return null;
                }

                return this.setupNode(pNode, sName);
            };

            Scene3d.prototype.createModel = function (sName) {
                if (typeof sName === "undefined") { sName = null; }
                var pNode = new akra.scene.SceneModel(this);

                if (!pNode.create()) {
                    akra.logger.error("cannot create model..");
                    return null;
                }

                return this.setupNode(pNode, sName);
            };

            Scene3d.prototype.createCamera = function (sName) {
                if (typeof sName === "undefined") { sName = null; }
                var pCamera = new akra.scene.objects.Camera(this);

                if (!pCamera.create()) {
                    akra.logger.error("cannot create camera..");
                    return null;
                }

                return this.setupNode(pCamera, sName);
            };

            Scene3d.prototype.createLightPoint = function (eType, isShadowCaster, iMaxShadowResolution, sName) {
                if (typeof eType === "undefined") { eType = 0 /* UNKNOWN */; }
                if (typeof isShadowCaster === "undefined") { isShadowCaster = true; }
                if (typeof iMaxShadowResolution === "undefined") { iMaxShadowResolution = 256; }
                if (typeof sName === "undefined") { sName = null; }
                var pLight;

                switch (eType) {
                    case 1 /* PROJECT */:
                        pLight = (new akra.scene.light.ProjectLight(this));
                        break;
                    case 2 /* OMNI */:
                        pLight = (new akra.scene.light.OmniLight(this));
                        break;
                    case 3 /* SUN */:
                        pLight = (new akra.scene.light.SunLight(this));
                        break;
                    default:
                        return null;
                }

                if (!pLight.create(isShadowCaster, iMaxShadowResolution)) {
                    akra.logger.error("cannot create light");
                    return null;
                }

                return this.setupNode(pLight, sName);
            };

            Scene3d.prototype.createSprite = function (sName) {
                if (typeof sName === "undefined") { sName = null; }
                var pSprite = new akra.scene.Sprite(this);

                if (!pSprite.create()) {
                    akra.logger.error("cannot create sprite..");
                    return null;
                }

                return this.setupNode(pSprite, sName);
            };

            Scene3d.prototype.createJoint = function (sName) {
                if (typeof sName === "undefined") { sName = null; }
                return this.setupNode(new akra.scene.Joint(this), sName);
            };

            Scene3d.prototype._createModelEntry = function (pModel) {
                return this.setupNode(new akra.scene.objects.ModelEntry(this, pModel));
            };

            Scene3d.prototype.createText3d = function (sName) {
                if (typeof sName === "undefined") { sName = null; }
                return null;
            };

            Scene3d.prototype.createTerrain = function (sName) {
                var pTerrain = new akra.terrain.Terrain(this);

                if (!pTerrain.create()) {
                    akra.logger.error("cannot create terrain..");
                    return null;
                }

                return this.setupNode(pTerrain, sName);
            };

            Scene3d.prototype.createTerrainROAM = function (sName) {
                var pTerrainROAM = new akra.terrain.TerrainROAM(this);

                if (!pTerrainROAM.create()) {
                    akra.logger.error("cannot create terrain..");
                    return null;
                }

                return this.setupNode(pTerrainROAM, sName);
            };

            Scene3d.prototype.createTerrainSection = function (sName) {
                var pNode = new akra.terrain.TerrainSection(this);

                if (!pNode.create()) {
                    akra.logger.error("cannot create terrain section..");
                    return null;
                }

                return this.setupNode(pNode, sName);
            };

            Scene3d.prototype.createTerrainSectionROAM = function (sName) {
                var pNode = new akra.terrain.TerrainSectionROAM(this);

                if (!pNode.create()) {
                    akra.logger.error("cannot create terrain section roam..");
                    return null;
                }

                return this.setupNode(pNode, sName);
            };

            Scene3d.prototype._createShadowCaster = function (pLightPoint, iFace, sName) {
                if (typeof iFace === "undefined") { iFace = 0 /* POSITIVE_X */; }
                if (typeof sName === "undefined") { sName = null; }
                var pShadowCaster = new akra.scene.light.ShadowCaster(pLightPoint, iFace);

                if (!pShadowCaster.create()) {
                    akra.logger.error("cannot create shadow caster..");
                    return null;
                }

                return this.setupNode(pShadowCaster, sName);
            };

            Scene3d.prototype.getDisplayList = function (i) {
                akra.debug.assert(akra.isDefAndNotNull(this._pDisplayLists[i]), "display list not defined");
                return this._pDisplayLists[i];
            };

            Scene3d.prototype.getDisplayListByName = function (csName) {
                for (var i = 0; i < this._pDisplayLists.length; ++i) {
                    if (this._pDisplayLists[i].getName() === csName) {
                        return i;
                    }
                }

                return -1;
            };

            Scene3d.prototype._render = function (pCamera, pViewport) {
            };

            Scene3d.prototype.setupNode = function (pNode, sName) {
                if (typeof sName === "undefined") { sName = null; }
                pNode.setName(sName);

                pNode.attached.connect(this.nodeAttachment);
                pNode.detached.connect(this.nodeDetachment);

                return pNode;
            };

            Scene3d.prototype.delDisplayList = function (index) {
                var pLists = this._pDisplayLists;

                for (var i = 0; i < pLists.length; ++i) {
                    if (i === index && akra.isDefAndNotNull(pLists[i])) {
                        pLists[i] = null;
                        this._pDisplayListsCount--;

                        this.displayListRemoved.emit(pLists[i], i);

                        return true;
                    }
                }

                return false;
            };

            Scene3d.prototype.addDisplayList = function (pList) {
                akra.debug.assert(akra.isDefAndNotNull(this.getDisplayListByName(pList.getName())), "DL with name <" + pList.getName() + "> already exists");

                var pLists = this._pDisplayLists;
                var iIndex = this._pDisplayLists.length;

                for (var i = 0; i < pLists.length; ++i) {
                    if (pLists[i] === null) {
                        pLists[i] = pList;
                        iIndex = i;
                        break;
                    }
                }

                if (iIndex == this._pDisplayLists.length) {
                    this._pDisplayLists.push(pList);
                }

                pList._setup(this);

                this.displayListAdded.emit(pList, iIndex);

                this._pDisplayListsCount++;

                return iIndex;
            };

            Scene3d.DL_DEFAULT = 0;
            Scene3d.DL_LIGHTING = 1;
            return Scene3d;
        })();
        scene.Scene3d = Scene3d;
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
//# sourceMappingURL=Scene3d.js.map
