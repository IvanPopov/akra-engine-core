/// <reference path="../idl/IModel.ts" />
/// <reference path="../idl/IScene3d.ts" />
/// <reference path="../idl/ISceneManager.ts" />
/// <reference path="../idl/IDisplayList.ts" />
/// <reference path="../idl/ILightGraph.ts" />
/// <reference path="../idl/ILightPoint.ts" />
/// <reference path="../idl/IOcTree.ts" />

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


module akra.scene {

	export class Scene3d implements IScene3d {
		displayListAdded: ISignal<{ (pScene: IScene3d, pList: IDisplayList<ISceneNode>, iIndex: int): void; }> = new Signal(<any>this);
		displayListRemoved: ISignal<{ (pScene: IScene3d, pList: IDisplayList<ISceneNode>, iIndex: int): void; }> = new Signal(<any>this);

		beforeUpdate: ISignal<{ (pScene: IScene3d): void; }> = new Signal(<any>this);
		postUpdate: ISignal<{ (pScene: IScene3d): void; }> = new Signal(<any>this);
		preUpdate: ISignal<{ (pScene: IScene3d): void; }> = new Signal(<any>this);

		nodeAttachment: ISignal<{ (pScene: IScene3d, pNode: ISceneNode): void; }> = new Signal(<any>this);
		nodeDetachment: ISignal<{ (pScene: IScene3d, pNode: ISceneNode): void; }> = new Signal(<any>this);

		protected _sName: string;
		protected _pRootNode: ISceneNode;
		protected _pSceneManager: ISceneManager;
		// protected _pNodeList: ISceneNode[];
		// protected _pObjectList: ISceneObject[];

		protected _pDisplayLists: IDisplayList<ISceneNode>[] = [];
		protected _pDisplayListsCount: uint = 0;
		protected _isUpdated: boolean = false;

		 get type(): ESceneTypes {
			return ESceneTypes.TYPE_3D;
		}

		 get totalDL(): uint {
			return this._pDisplayListsCount;
		}

		 get name(): string {
			return this._sName;
		}

		constructor (pSceneManager: ISceneManager, sName: string = null) {
			this._pSceneManager = pSceneManager;
			this._sName = sName;
			this._pRootNode = this.createNode("root-node");
			this._pRootNode.create();

			var i: int;

			//TODO: fix this method, do right!!
			var pOctree: IOcTree = new scene.OcTree();
			pOctree.create(new geometry.Rect3d(1024, 1024, 1024), 5, 100);

			var i: int = this.addDisplayList(pOctree);
			debug.assert(i == Scene3d.DL_DEFAULT, "invalid default list index");

			var pLightGraph: ILightGraph = new scene.LightGraph();

			i = this.addDisplayList(pLightGraph);
			debug.assert(i == Scene3d.DL_LIGHTING, "invalid default list index");


			// this._pNodeList = [];
			// this._pObjectList = [];

			//TODO передача пользовательских параметров в OcTree

			// i = this.addDisplayList(new OcTree);
			// debug.assert(i == DL_DEFAULT, "invalid default list index");

			//TODO передача пользовательских параметров в LightGraph

			// i = this.addDisplayList(new LightGraph);
			// debug.assert(i == DL_LIGHTING, "invalid lighting list index");

		}

		 getManager(): ISceneManager{
			return this._pSceneManager;
		}

		 isUpdated(): boolean {
			return this._isUpdated;
		}

		 getRootNode(): ISceneNode {
			return this._pRootNode;
		}

		recursivePreUpdate(): void {
			this._isUpdated = false;
			this.preUpdate.emit();
			this._pRootNode.recursivePreUpdate();
		}

		recursiveUpdate(): void {
			this.beforeUpdate.emit();
			this._isUpdated = this._pRootNode.recursiveUpdate();
			this.postUpdate.emit();
		}

		updateCamera(): boolean {
			return false;
		}

		updateScene(): boolean {
			return false;
		}


		createObject(sName: string = null): ISceneObject {
			var pNode: ISceneNode = new SceneObject(this);
			
			if (!pNode.create()) {
				logger.error("cannot create scene node..");
				return null;
			}

			return <ISceneObject>this.setupNode(pNode, sName);
		}
		

		createNode(sName: string = null): ISceneNode {
			var pNode: ISceneNode = new SceneNode(this);
			
			if (!pNode.create()) {
				logger.error("cannot create scene node..");
				return null;
			}

			return this.setupNode(pNode, sName);
		}

		createModel(sName: string = null): ISceneModel {
			var pNode: ISceneModel = new SceneModel(this);
			
			if (!pNode.create()) {
				logger.error("cannot create model..");
				return null;
			}

			return <ISceneModel>this.setupNode(pNode, sName);
		}

		createCamera(sName: string = null): ICamera {
			var pCamera: ICamera = new objects.Camera(this);
			
			if (!pCamera.create()) {
				logger.error("cannot create camera..");
				return null;
			}
			
			return <ICamera>this.setupNode(pCamera, sName);
		}

		createLightPoint(eType: ELightTypes = ELightTypes.UNKNOWN, isShadowCaster: boolean = true,
						 iMaxShadowResolution: uint = 256, sName: string = null): ILightPoint {

			var pLight: ILightPoint;

			switch(eType){
				case ELightTypes.PROJECT: 
					pLight = <ILightPoint>(new light.ProjectLight(this));
					break;
				case ELightTypes.OMNI: 
					pLight = <ILightPoint>(new light.OmniLight(this));
					break;
				case ELightTypes.SUN:
					pLight = <ILightPoint>(new light.SunLight(this));
					break;
				default: 
					return null;
			}
			
			if(!pLight.create(isShadowCaster, iMaxShadowResolution)){
				logger.error("cannot create light");
				return null;
			}

			return <ILightPoint>this.setupNode(pLight, sName);
		}


		createSprite(sName: string = null): ISprite {
			var pSprite: ISprite = new Sprite(this);
			
			if (!pSprite.create()) {
				logger.error("cannot create sprite..");
				return null;
			}

			return <ISprite>this.setupNode(pSprite, sName);
		}

		createJoint(sName: string = null): IJoint {
			return <IJoint>this.setupNode(new Joint(this), sName);
		}

		_createModelEntry(pModel: IModel): IModelEntry {
			return <IModelEntry>this.setupNode(new objects.ModelEntry(this, pModel));
		}

		createText3d(sName: string = null): IText3d {
			return null;
		}

		createTerrain(sName?: string): ITerrain {
			var pTerrain: ITerrain = new terrain.Terrain(this);
			
			if (!pTerrain.create()) {
				logger.error("cannot create terrain..");
				return null;
			}
			
			return <ITerrain>this.setupNode(pTerrain, sName);
		}

		createTerrainROAM(sName?: string): ITerrainROAM {
			var pTerrainROAM: ITerrainROAM = new terrain.TerrainROAM(this);
			
			if (!pTerrainROAM.create()) {
				logger.error("cannot create terrain..");
				return null;
			}
			
			return <ITerrainROAM>this.setupNode(pTerrainROAM, sName);
		}

		createTerrainSection(sName?: string): ITerrainSection {
			var pNode: ISceneNode = new terrain.TerrainSection(this);
			
			if (!pNode.create()) {
				logger.error("cannot create terrain section..");
				return null;
			}

			return <ITerrainSection>this.setupNode(pNode, sName);
		}

		createTerrainSectionROAM(sName?: string): ITerrainSectionROAM {
			var pNode: ISceneNode = new terrain.TerrainSectionROAM(this);
			
			if (!pNode.create()) {
				logger.error("cannot create terrain section roam..");
				return null;
			}

			return <ITerrainSectionROAM>this.setupNode(pNode, sName);
		}

		_createShadowCaster(pLightPoint: ILightPoint, iFace: uint = ECubeFace.POSITIVE_X, sName: string = null){
			var pShadowCaster: IShadowCaster = new light.ShadowCaster(pLightPoint, iFace);
			
			if (!pShadowCaster.create()) {
				logger.error("cannot create shadow caster..");
				return null;
			}
			
			return <IShadowCaster>this.setupNode(pShadowCaster, sName);
		}

		 getDisplayList(i: uint): IDisplayList<ISceneNode> {
			debug.assert(isDefAndNotNull(this._pDisplayLists[i]), "display list not defined");
			return this._pDisplayLists[i];
		}

		getDisplayListByName(csName: string): int {
			for (var i: int = 0; i < this._pDisplayLists.length; ++ i) {
				if (this._pDisplayLists[i].name === csName) {
					return i;
				}
			}

			return -1;
		}

		_render(pCamera: ICamera, pViewport: IViewport): void {
			
		}

		private setupNode(pNode: ISceneNode, sName: string = null): ISceneNode {
			pNode.name = sName;

			pNode.attached.connect(this.nodeAttachment);
			pNode.detached.connect(this.nodeDetachment);

			return pNode;
		}

		delDisplayList(index: uint): boolean {
			var pLists: IDisplayList<ISceneNode>[] = this._pDisplayLists;

			for (var i: int = 0; i < pLists.length; ++ i) {
				if (i === index && isDefAndNotNull(pLists[i])) {
					pLists[i] = null;
					this._pDisplayListsCount --;
					
					this.displayListRemoved.emit(pLists[i], i);

					return true;
				}
			}

			return false;
		}

		addDisplayList(pList: IDisplayList<ISceneNode>): int {
			debug.assert(isDefAndNotNull(this.getDisplayListByName(pList.name)), 
				"DL with name <" + pList.name + "> already exists");


			var pLists: IDisplayList<ISceneNode>[] = this._pDisplayLists;
			var iIndex: uint = this._pDisplayLists.length;

			for (var i: int = 0; i < pLists.length; ++ i) {
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

			this._pDisplayListsCount ++;

			return iIndex;
		 }

		static DL_DEFAULT: uint8 = 0;
		static DL_LIGHTING: uint8 = 0;
	}
}
