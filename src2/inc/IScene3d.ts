#ifndef ISCENE3D_TS
#define ISCENE3D_TS

#include "IScene.ts"

#define DL_DEFAULT 0
#define DL_LIGHTING 1

module akra {
	IFACE(ISceneNode);
	IFACE(IModel);
	IFACE(ILightPoint);
	IFACE(ISprite);
	IFACE(IJoint);
	IFACE(IText3d);
	IFACE(IDisplayList);
	


	export interface IScene3d extends IScene {
		totalDL: uint;

		getRootNode(): ISceneNode;

		recursivePreUpdate(): void;
		updateCamera(): bool;
		updateScene(): bool;
		recursiveUpdate(): void;

		isUpdated(): bool;

		createSceneNode(sName?: string): ISceneNode;
		createSceneModel(): IModel;
		createCamera(): ICamera;
		createLightPoint(): ILightPoint;
		createSprite(): ISprite;
		createJoint(): IJoint;
		createText3d(): IText3d;

		getDisplayList(index: uint): IDisplayList;
		getDisplayListByName(csName: string): int;
		addDisplayList(pList: IDisplayList): int;
		delDisplayList(index: uint): bool;
		
		signal nodeAttachment(pNode: ISceneNode): void;
		signal nodeDetachment(pNode: ISceneNode): void;

		signal displayListAdded(pList: IDisplayList, index: uint): void;
		signal displayListRemoved(pList: IDisplayList, index: uint): void;

		_render(pCamera: ICamera, pViewport: IViewport): void;
	}
}

#endif