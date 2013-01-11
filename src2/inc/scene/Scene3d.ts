#ifndef SCENE3D_TS
#define SCENE3D_TS

#include "IScene3d.ts"
#include "ISceneManager.ts"
#include "SceneNode.ts"
#include "events/events.ts"
#include "objects/Camera.ts"
#include "IDisplayList.ts"

#define DEFAULT_DLIST DEFAULT_NAME

module akra.scene {
	export interface IDisplayListMap {
		[key: string]: IDisplayList;
	}

	export class Scene3d implements IScene3d {
		protected _pRootNode: ISceneNode;
		protected _pSceneManager: ISceneManager;
		protected _pNodeList: ISceneNode[];

		protected _pDisplayListMap: IDisplayListMap = {};

		type: ESceneTypes = ESceneTypes.TYPE_3D;

		constructor (pSceneManager: ISceneManager) {
			this._pSceneManager = pSceneManager;
			this._pRootNode = this.createSceneNode("root-node");
			this._pRootNode.create();

			this._pNodeList = [];
		}

		inline getRootNode(): ISceneNode {
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

		createCamera(sName: string = null): ICamera {
			var pCamera: ICamera = new objects.Camera(this);
			
			if (!pCamera.create()) {
				ERROR("cannot create camera..");
				return null;
			}
			
			return <ICamera>this.setupNode(pCamera, sName);
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

		inline getAllNodes(): ISceneNode[] {
			return this._pNodeList;
		}

		inline getDisplayList(csName: string = DEFAULT_DLIST): IDisplayList {
			return this._pDisplayListMap[csName] || null;
		}

		inline addDisplayList(pList: IDisplayList, csName: string = DEFAULT_DLIST): void {
			this._pDisplayListMap[csName] = pList;
		}

		inline delDisplayList(csName: string): bool {
			if (this._pDisplayListMap[csName]) {
				delete this._pDisplayListMap[csName];
				return true;
			}

			return false;
		}

		_findObjects(pCamera: ICamera, csList: string = null): ISceneObject[] {
			var pList: IDisplayList = this.getDisplayList(csList || DEFAULT_DLIST);

			if (pList) {
				return pList.findObjects(pCamera);
			}

			return null;
		}

		_render(pCamera: ICamera, pViewport: IViewport): void {
			
		}

		private setupNode(pNode: ISceneNode, sName: string = null): ISceneNode {
			pNode.name = sName;

			this.connect(pNode, SIGNAL(attached), SLOT(nodeAttachment), EEventTypes.UNICAST);
			this.connect(pNode, SIGNAL(detached), SLOT(nodeDetachment), EEventTypes.UNICAST);

			return pNode;
		}

		BEGIN_EVENT_TABLE(Scene3d);

		nodeAttachment (pNode: ISceneNode): void {
			this._pNodeList.push(pNode);
			
			EMIT_BROADCAST(nodeAttachment, _CALL(pNode));
		}

		nodeDetachment (pNode: ISceneNode): void {

			for (var i: int = 0; i < this._pNodeList.length; ++ i) {
				if (pNode == this._pNodeList[i]) {
					this._pNodeList.splice(i, 1);
					break;
				}
			};

			EMIT_BROADCAST(nodeDetachment, _CALL(pNode));
		}

			// BROADCAST(nodeAttachment, CALL(pNode));
			// BROADCAST(nodeDetachment, CALL(pNode));
		END_EVENT_TABLE();
	}
}

#endif
