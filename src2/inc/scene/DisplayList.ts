#ifndef DISPLAYLIST_TS
#define DISPLAYLIST_TS

module akra.scene {
	export class DisplayList implements IDisplayList {
		protected _pScene: IScene3d;

		constructor (pScene: IScene3d) {
			this._pScene = pScene;

			CONNECT(pScene, SIGNAL(nodeAttachment), this, SLOT(_onNodeAttachment));
			CONNECT(pScene, SIGNAL(nodeDetachment), this, SLOT(_onNodeDetachment));
		}

		_onNodeAttachment(pScene: IScene3d, pNode: ISceneNode): void {

		}

		_onNodeDetachment(pScene: IScene3d, pNode: ISceneNode): void {

		}

		findObjects(pCamera: ICamera): ISceneObject[] {
			return null;
		}

		BEGIN_EVENT_TABLE();
		END_EVENT_TABLE();
	}
}

#endif
