#ifndef ISCENE3D_TS
#define ISCENE3D_TS

#include "IScene.ts"

module akra {
	IFACE(ISceneNode);
	IFACE(IModel);
	IFACE(ILightPoint);
	IFACE(ISprite);
	IFACE(IJoint);
	IFACE(IText3d);
	IFACE(IDisplayList);
	


	export interface IScene3d extends IScene {
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

		getDisplayList(csName?: string): IDisplayList;
		addDisplayList(pList: IDisplayList, csName?: string): void;
		delDisplayList(csName: string): bool;

		_findObjects(pCamera: ICamera, csList?: string): ISceneObject[];

		signal nodeAttachment(pNode: ISceneNode);
		signal nodeDetachment(pNode: ISceneNode);

		_render(pCamera: ICamera, pViewport: IViewport): void;
	}
}

#endif