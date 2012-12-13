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
	


	export interface IScene3d extends IScene {
		getRootNode(): ISceneNode;

		recursivePreUpdate(): void;
		updateCamera(): bool;
		updateScene(): bool;
		recursiveUpdate(): void;

		createSceneNode(sName?: string): ISceneNode;
		createSceneModel(): IModel;
		createCamera(): ICamera;
		createLightPoint(): ILightPoint;
		createSprite(): ISprite;
		createJoint(): IJoint;
		createText3d(): IText3d;

		signal nodeAttachment(pNode: ISceneNode);
		signal nodeDetachment(pNode: ISceneNode);
	}
}

#endif