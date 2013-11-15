// AIScene3d interface
// [write description here...]

/// <reference path="AIScene.ts" />
/// <reference path="AILightPoint.ts" />

// #define DL_DEFAULT 0
// #define DL_LIGHTING 1

/// <reference path="AISceneNode.ts" />
/// <reference path="AISceneModel.ts" />
/// <reference path="AISceneObject.ts" />
/// <reference path="AICamera.ts" />
/// <reference path="AISprite.ts" />
/// <reference path="AIJoint.ts" />
/// <reference path="AIDisplayList.ts" />
/// <reference path="AIViewport.ts" />
/// <reference path="AIShadowCaster.ts" />
/// <reference path="AITerrainSection.ts" />
/// <reference path="AITerrainSectionROAM.ts" />
/// <reference path="AIModel.ts" />
/// <reference path="AITerrain.ts" />
/// <reference path="AITerrainROAM.ts" />
/// <reference path="AIModelEntry.ts" />

interface AIText3d extends AISceneNode {

}


interface AIScene3d extends AIScene {
	totalDL: uint;

	getRootNode(): AISceneNode;

	recursivePreUpdate(): void;
	updateCamera(): boolean;
	updateScene(): boolean;
	recursiveUpdate(): void;

	isUpdated(): boolean;

	/** @note for DEBUG usage only */
	createObject(sName?: string): AISceneObject;

	createNode(sName?: string): AISceneNode;
	createModel(sName?: string): AISceneModel;
	createCamera(sName?: string): AICamera;
	createLightPoint(eType?: AELightTypes, isShadowCaster?: boolean,
					 iMaxShadowResolution?: uint, sName?: string): AILightPoint;
	createSprite(sName?: string): AISprite;
	createJoint(sName?: string): AIJoint;
	createText3d(sName?: string): AIText3d;
	
	createTerrain(sName?: string): AITerrain;
	createTerrainROAM(sName?: string): AITerrainROAM;
	createTerrainSection(sName?: string): AITerrainSection;
	createTerrainSectionROAM(sName?: string): AITerrainSectionROAM;

	_createModelEntry(pModel: AIModel): AIModelEntry;

	_createShadowCaster(pLightPoint: AILightPoint, iFace?: uint, sName?: string): AIShadowCaster;

	getDisplayList(index: uint): AIDisplayList;
	getDisplayListByName(csName: string): int;
	addDisplayList(pList: AIDisplayList): int;
	delDisplayList(index: uint): boolean;
	
	signal nodeAttachment(pNode: AISceneNode): void;
	signal nodeDetachment(pNode: AISceneNode): void;

	signal displayListAdded(pList: AIDisplayList, index: uint): void;
	signal displayListRemoved(pList: AIDisplayList, index: uint): void;

	signal beforeUpdate(): void;
	signal postUpdate(): void;
	signal preUpdate(): void;

	_render(pCamera: AICamera, pViewport: AIViewport): void;
}
