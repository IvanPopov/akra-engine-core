#ifndef DISPLAYLIST_TS
#define DISPLAYLIST_TS

#include "IDisplayList.ts"
#include "IScene3d.ts"
#include "ISceneObject.ts"
#include "ICamera.ts"
#include "events/events.ts"
#include "scene/SceneObject.ts"
#include "util/ObjectArray.ts"

module akra.scene {
	export class DisplayList implements IDisplayList {
		protected _pScene: IScene3d = null;
		protected _sName: string = "";

		inline get name(): string { return this._sName; }
		inline set name(sName: string) { this._sName = sName; }

		_onNodeAttachment(pScene: IScene3d, pNode: ISceneNode): void {
			this.attachObject(pNode);
		}

		_onNodeDetachment(pScene: IScene3d, pNode: ISceneNode): void {
			this.detachObject(pNode);
		}

		protected attachObject(pNode: ISceneNode): void {
			debug_error("pure virtual method DisplayList::attachObject()");
		}

		protected detachObject(pNode: ISceneNode): void {
			debug_error("pure virtual method DisplayList::detachObject()");
		}

		_setup(pScene: IScene3d): void {
			if (isDefAndNotNull(this._pScene)) {
				CRITICAL("list movement from scene to another scene temprary unsupported!");
			}

			this._pScene = pScene;

			CONNECT(pScene, SIGNAL(nodeAttachment), this, SLOT(_onNodeAttachment));
			CONNECT(pScene, SIGNAL(nodeDetachment), this, SLOT(_onNodeDetachment));

			var me = this;

			pScene.getRootNode().explore(function (pEntity: IEntity) {
					me._onNodeAttachment(pScene, <ISceneNode>pEntity);
				});
		}

		_findObjects(pCamera: ICamera, bQuickSearch: bool = true): IObjectArray {
			debug_error("pure virtual method");
			return null;
		}

		BEGIN_EVENT_TABLE(DisplayList);
		END_EVENT_TABLE();
	}
}

#endif
