#ifndef SCENE3D_TS
#define SCENE3D_TS

#include "IScene3d.ts"
#include "ISceneManager.ts"
#include "SceneNode.ts"
#include "events/events.ts"
#include "objects/Camera.ts"
#include "IDisplayList.ts"
// #include "OcTree.ts"
// #include "LightGraph.ts"

#include "SceneModel.ts"
#include "Joint.ts"

#define DEFAULT_DLIST DEFAULT_NAME

module akra.scene {

	export class Scene3d implements IScene3d {
		protected _pRootNode: ISceneNode;
		protected _pSceneManager: ISceneManager;
		// protected _pNodeList: ISceneNode[];
		// protected _pObjectList: ISceneObject[];

		protected _pDisplayLists: IDisplayList[] = [];
		protected _pDisplayListsCount: uint = 0;
		protected _isUpdated: bool = false;

		type: ESceneTypes = ESceneTypes.TYPE_3D;

		inline get totalDL(): uint {
			return this._pDisplayListsCount;
		}

		constructor (pSceneManager: ISceneManager) {
			this._pSceneManager = pSceneManager;
			this._pRootNode = this.createNode("root-node");
			this._pRootNode.create();

			var i: int;

			// this._pNodeList = [];
			// this._pObjectList = [];

			//TODO передача пользовательских параметров в OcTree

			// i = this.addDisplayList(new OcTree);
			// debug_assert(i == DL_DEFAULT, "invalid default list index");

			//TODO передача пользовательских параметров в LightGraph

			// i = this.addDisplayList(new LightGraph);
			// debug_assert(i == DL_LIGHTING, "invalid lighting list index");

		}

		inline isUpdated(): bool {
			return this._isUpdated;
		}

		inline getRootNode(): ISceneNode {
			return this._pRootNode;
		}

		recursivePreUpdate(): void {
			this._isUpdated = false;
			this._pRootNode.recursivePreUpdate();
		}

		recursiveUpdate(): void {
			this._isUpdated = this._pRootNode.recursiveUpdate();
		}

		updateCamera(): bool {
			return false;
		}

		updateScene(): bool {
			return false;
		}


		createNode(sName: string = null): ISceneNode {
			var pNode: ISceneNode = new SceneNode(this);
			
			if (!pNode.create()) {
				ERROR("cannot create scene node..");
				return null;
			}

			return this.setupNode(pNode, sName);
		}

		createModel(sName: string = null): ISceneModel {
			var pNode: ISceneModel = new SceneModel(this);
			
			if (!pNode.create()) {
				ERROR("cannot create model..");
				return null;
			}

			return <ISceneModel>this.setupNode(pNode, sName);
		}

		createCamera(sName: string = null): ICamera {
			var pCamera: ICamera = new objects.Camera(this);
			
			if (!pCamera.create()) {
				ERROR("cannot create camera..");
				return null;
			}
			
			return <ICamera>this.setupNode(pCamera, sName);
		}

		createLightPoint(sName: string = null): ILightPoint {
			return null;
		}

		createSprite(sName: string = null): ISprite {
			return null;
		}

		createJoint(sName: string = null): IJoint {
			return <IJoint>this.setupNode(new Joint(this), sName);
		}

		createText3d(sName: string = null): IText3d {
			return null;
		}

		// inline getAllNodes(): ISceneNode[] {
		// 	return this._pNodeList;
		// }

		// inline getAllObjects(): ISceneObject[] {
		// 	return this._pObjectList;
		// }

		inline getDisplayList(i: uint): IDisplayList {
			debug_assert(isDefAndNotNull(this._pDisplayLists[i]), "display list not defined");
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


		// _findObjects(pCamera: ICamera, csList: string = null): ISceneObject[] {
		// 	var pList: IDisplayList = this._pDisplayListMap[csList || DEFAULT_DLIST];

		// 	debug_assert(!isNull(pList), "display list not founded.");

		// 	return pList.findObjects(pCamera);
		// }

		_render(pCamera: ICamera, pViewport: IViewport): void {
			
		}

		private setupNode(pNode: ISceneNode, sName: string = null): ISceneNode {
			pNode.name = sName;

			// this.connect(pNode, SIGNAL(attached), SLOT(nodeAttachment), EEventTypes.UNICAST);
			// this.connect(pNode, SIGNAL(detached), SLOT(nodeDetachment), EEventTypes.UNICAST);

			return pNode;
		}

		delDisplayList(index: uint): bool {
			var pLists: IDisplayList[] = this._pDisplayLists;

			for (var i: int = 0; i < pLists.length; ++ i) {
				if (i === index && isDefAndNotNull(pLists[i])) {
					pLists[i] = null;
					this._pDisplayListsCount --;
					
					this.displayListRemoved(pLists[i], i);

					return true;
				}
			};

			return false;
		}

		inline addDisplayList(pList: IDisplayList): int {
			debug_assert(isDefAndNotNull(this.getDisplayListByName(pList.name)), 
				"DL with name <" + pList.name + "> already exists");


			var pLists: IDisplayList[] = this._pDisplayLists;
			var iIndex: uint = this._pDisplayLists.length;

			for (var i: int = 0; i < pLists.length; ++ i) {
				if (pLists[i] === null) {
					pLists[i] = pList;
					iIndex = i;
					break;
				}
			};

			if (iIndex == this._pDisplayLists.length) {
				this._pDisplayLists.push(pList);
			}

			pList._setup(this);

			this.displayListAdded(pList, iIndex);

			this._pDisplayListsCount ++;

			return iIndex;
		}

		BEGIN_EVENT_TABLE(Scene3d);

		nodeAttachment (pNode: ISceneNode): void {
			// this._pNodeList.push(pNode);

			// if (SceneObject.isSceneObject(pNode)) {
			// 	this._pObjectList.push(<ISceneObject>pNode);
			// }
			console.warn("------>here");
			EMIT_BROADCAST(nodeAttachment, _CALL(pNode));
		}

		nodeDetachment (pNode: ISceneNode): void {

			// for (var i: int = 0; i < this._pNodeList.length; ++ i) {
			// 	if (pNode == this._pNodeList[i]) {
			// 		this._pNodeList.splice(i, 1);
			// 		break;
			// 	}
			// };

			// if (SceneObject.isSceneObject(pNode)) {
			// 	for (var i: int = 0; i < this._pObjectList.length; ++ i) {
			// 		if (<ISceneObject>pNode == this._pObjectList[i]) {
			// 			this._pObjectList.splice(i, 1);
			// 			break;
			// 		}
			// 	};
			// }
			

			EMIT_BROADCAST(nodeDetachment, _CALL(pNode));
		}

	
		BROADCAST(displayListAdded, CALL(list, index));
		BROADCAST(displayListRemoved, CALL(list, index));

		// BROADCAST(nodeAttachment, CALL(pNode));
		// BROADCAST(nodeDetachment, CALL(pNode));
		END_EVENT_TABLE();
	}
}

#endif
