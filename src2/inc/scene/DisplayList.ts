#ifndef DISPLAYLIST_TS
#define DISPLAYLIST_TS

#include "IDisplayList.ts"

module akra.scene {
	export class DisplayList implements IDisplayList {
		protected _pScene: IScene3d;
		protected _sName: string;

		inline get name(): string { return this._sName; }
		inline set name(sName: string) { this._sName = sName; }

		_onNodeAttachment(pScene: IScene3d, pNode: ISceneNode): void {
			if (SceneObject.isSceneObject(pNode)) {
				this.attachObject(<ISceneObject>pNode);
			}
		}

		_onNodeDetachment(pScene: IScene3d, pNode: ISceneNode): void {
			if (SceneObject.isSceneObject(pNode)) {
				this.detachObject(<ISceneObject>pNode);
			}
		}

		protected attachObject(pObject: ISceneObject): void {
			debug_error("pure virtual method DisplayList::attachObject()");
		}

		protected detachObject(pObject: ISceneObject): void {
			debug_error("pure virtual method DisplayList::detachObject()");
		}

		_setup(pScene: IScene3d): void {
			if (this._pScene) {
				CRITICAL("list movement from scene to another scene temprary unsupported!");
			}

			this._pScene = pScene;

			CONNECT(pScene, SIGNAL(nodeAttachment), this, SLOT(_onNodeAttachment));
			CONNECT(pScene, SIGNAL(nodeDetachment), this, SLOT(_onNodeDetachment));

			pScene.getRootNode().explore(function (pEntity: IEntity) {
					this._onNodeAttachment(pScene, <ISceneNode>pEntity);
				});
		}

		_findObjects(pCamera: ICamera, bQuickSearch: bool = true): ISceneObject[] {
			debug_error("pure virtual method");
			return null;
		}

		BEGIN_EVENT_TABLE(DisplayList);
		END_EVENT_TABLE();
	}
}

#endif
