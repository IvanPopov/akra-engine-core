
/// <reference path="IScene.ts" />
/// <reference path="ILightPoint.ts" />

// #define DL_DEFAULT 0
// #define DL_LIGHTING 1

/// <reference path="ISceneNode.ts" />
/// <reference path="ISceneModel.ts" />
/// <reference path="ISceneObject.ts" />
/// <reference path="ICamera.ts" />
/// <reference path="ISprite.ts" />
/// <reference path="IJoint.ts" />
/// <reference path="IDisplayList.ts" />
/// <reference path="IViewport.ts" />
/// <reference path="IShadowCaster.ts" />
/// <reference path="ITerrainSection.ts" />
/// <reference path="ITerrainSectionROAM.ts" />
/// <reference path="IModel.ts" />
/// <reference path="ITerrain.ts" />
/// <reference path="ITerrainROAM.ts" />
/// <reference path="IModelEntry.ts" />

module akra {
	export interface IText3d extends ISceneNode {
	
	}
	
	
	export interface IScene3d extends IScene {
		totalDL: uint;
	
		getRootNode(): ISceneNode;
	
		recursivePreUpdate(): void;
		updateCamera(): boolean;
		updateScene(): boolean;
		recursiveUpdate(): void;
	
		isUpdated(): boolean;
	
		/** @note for DEBUG usage only */
		createObject(sName?: string): ISceneObject;
	
		createNode(sName?: string): ISceneNode;
		createModel(sName?: string): ISceneModel;
		createCamera(sName?: string): ICamera;
		createLightPoint(eType?: ELightTypes, isShadowCaster?: boolean,
						 iMaxShadowResolution?: uint, sName?: string): ILightPoint;
		createSprite(sName?: string): ISprite;
		createJoint(sName?: string): IJoint;
		createText3d(sName?: string): IText3d;
		
		createTerrain(sName?: string): ITerrain;
		createTerrainROAM(sName?: string): ITerrainROAM;
		createTerrainSection(sName?: string): ITerrainSection;
		createTerrainSectionROAM(sName?: string): ITerrainSectionROAM;
	
		_createModelEntry(pModel: IModel): IModelEntry;
	
		_createShadowCaster(pLightPoint: ILightPoint, iFace?: uint, sName?: string): IShadowCaster;
	
		getDisplayList(index: uint): IDisplayList<ISceneNode>;
		getDisplayListByName(csName: string): int;
		addDisplayList(pList: IDisplayList<ISceneNode>): int;
		delDisplayList(index: uint): boolean;
		
		displayListAdded: ISignal<{ (pScene: IScene3d, pList: IDisplayList<ISceneNode>, iIndex: int): void; }>;
		displayListRemoved: ISignal<{ (pScene: IScene3d, pList: IDisplayList<ISceneNode>, iIndex: int): void ; }>;

		beforeUpdate: ISignal <{ (pScene: IScene3d): void; }>;
		postUpdate: ISignal <{ (pScene: IScene3d): void; }>;
		preUpdate: ISignal <{ (pScene: IScene3d): void; }>;

		nodeAttachment: ISignal <{ (pScene: IScene3d, pNode: ISceneNode): void; }>;
		nodeDetachment: ISignal <{ (pScene: IScene3d, pNode: ISceneNode): void; }>;
	
		_render(pCamera: ICamera, pViewport: IViewport): void;
	}
	
}
