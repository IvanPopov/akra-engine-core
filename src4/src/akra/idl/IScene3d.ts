
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
	interface IText3d extends ISceneNode {
	
	}
	
	
	interface IScene3d extends IScene {
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
	
		getDisplayList(index: uint): IDisplayList;
		getDisplayListByName(csName: string): int;
		addDisplayList(pList: IDisplayList): int;
		delDisplayList(index: uint): boolean;
		
		signal nodeAttachment(pNode: ISceneNode): void;
		signal nodeDetachment(pNode: ISceneNode): void;
	
		signal displayListAdded(pList: IDisplayList, index: uint): void;
		signal displayListRemoved(pList: IDisplayList, index: uint): void;
	
		signal beforeUpdate(): void;
		signal postUpdate(): void;
		signal preUpdate(): void;
	
		_render(pCamera: ICamera, pViewport: IViewport): void;
	}
	
}
