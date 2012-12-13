#ifndef SCENE3D_TS
#define SCENE3D_TS

#include "IScene3d.ts"
#include "IDisplay3d.ts"
#include "SceneNode.ts"
#include "events/events.ts"

module akra.scene {
	export class Scene3d implements IScene3d {
		protected _pRootNode: ISceneNode;

		constructor (pDisplay: IDisplay3d) {
			this._pRootNode = this.createSceneNode("root-node");
			this._pRootNode.create();
		}

		getRootNode(): ISceneNode {
			return this._pRootNode;
		}

		recursivePreUpdate(): void {

		}

		recursiveUpdate(): void {

		}

		updateCamera(): bool {
			return false;
		}

		updateScene(): bool {
			return false;
		}


		createSceneNode(sName: string = null): ISceneNode {
			var pNode: ISceneNode = new SceneNode(this);
			pNode.create();
			return this.setupNode(pNode, sName);
		}

		createSceneModel(): IModel {
			return null;
		}

		createCamera(): ICamera {
			return null;
		}

		createLightPoint(): ILightPoint {
			return null;
		}

		createSprite(): ISprite {
			return null;
		}

		createJoint(): IJoint {
			return null;
		}

		createText3d(): IText3d {
			return null;
		}

		private setupNode(pNode: ISceneNode, sName: string = null): ISceneNode {
			pNode.name = sName;

			this.connect(pNode, SIGNAL(attached), SLOT(nodeAttachment), EEventTypes.UNICAST);
			this.connect(pNode, SIGNAL(detached), SLOT(nodeDetachment), EEventTypes.UNICAST);

			return pNode;
		}

		BEGIN_EVENT_TABLE(Scene3d);
			BROADCAST(nodeAttachment, CALL(pNode));
			BROADCAST(nodeDetachment, CALL(pNode));
		END_EVENT_TABLE();
	}
}

#endif
