#ifndef ISCENE3D_TS
#define ISCENE3D_TS

#include "IScene.ts"
#include "ILightPoint.ts"

#define DL_DEFAULT 0
#define DL_LIGHTING 1

module akra {
	IFACE(ISceneNode);
	IFACE(ISceneModel);
	IFACE(ISceneObject);
	IFACE(ICamera);
	IFACE(ISprite);
	IFACE(IJoint);
	IFACE(IText3d);
	IFACE(IDisplayList);
	IFACE(IViewport);
	IFACE(IShadowCaster);
	IFACE(ITerrainSection);
	IFACE(ITerrainSectionROAM);
	IFACE(IModel);
	IFACE(ITerrain);
	IFACE(ITerrainROAM);
	IFACE(IModelEntry);

	export interface IScene3d extends IScene {
		totalDL: uint;

		getRootNode(): ISceneNode;

		recursivePreUpdate(): void;
		updateCamera(): bool;
		updateScene(): bool;
		recursiveUpdate(): void;

		isUpdated(): bool;

#ifdef DEBUG
		createObject(sName?: string): ISceneObject;
#endif

		createNode(sName?: string): ISceneNode;
		createModel(sName?: string): ISceneModel;
		createCamera(sName?: string): ICamera;
		createLightPoint(eType?: ELightTypes, isShadowCaster?: bool,
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
		delDisplayList(index: uint): bool;
		
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

#endif