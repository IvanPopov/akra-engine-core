/// <reference path="../idl/IScene3d.ts" />
/// <reference path="../idl/ISceneObject.ts" />
/// <reference path="../idl/IDisplayList.ts" />
/// <reference path="../idl/ICamera.ts" />

/// <reference path="../util/ObjectArray.ts" />
/// <reference path="../debug.ts" />
/// <reference path="../events.ts" />
/// <reference path="../guid.ts" />

/// <reference path="SceneObject.ts" />

module akra.scene {
	export class DisplayList<T extends ISceneNode> implements IDisplayList<T> {
		guid: uint = guid();

		protected _pScene: IScene3d = null;
		protected _sName: string = "";

		getName(): string {
			return this._sName;
		}

		//setName(sName: string): void { this._sName = sName; }

		constructor(sName: string) {
			this.setupSignals();

			this._sName = sName;
		}

		protected setupSignals(): void {

		}

		_onNodeAttachment(pScene: IScene3d, pNode: T): void {
			this.attachObject(pNode);
		}

		_onNodeDetachment(pScene: IScene3d, pNode: T): void {
			this.detachObject(pNode);
		}

		protected attachObject(pNode: T): void {
			debug.error("pure virtual method DisplayList::attachObject()");
		}

		protected detachObject(pNode: T): void {
			debug.error("pure virtual method DisplayList::detachObject()");
		}

		_setup(pScene: IScene3d): void {
			if (isDefAndNotNull(this._pScene)) {
				logger.critical("list movement from scene to another scene temprary unsupported!");
			}

			this._pScene = pScene;

			pScene.nodeAttachment.connect(this, this._onNodeAttachment);
			pScene.nodeDetachment.connect(this, this._onNodeDetachment);

			//register all exists nodes
			pScene.getRootNode().explore((pEntity: IEntity): boolean => {
				this._onNodeAttachment(pScene, <T>pEntity);
				return true;
			});
		}

		_findObjects(pCamera: ICamera, pResultArray?: IObjectArray<T>, bQuickSearch: boolean = false): IObjectArray<T> {
			debug.error("pure virtual method");
			return null;
		}
	}
}

