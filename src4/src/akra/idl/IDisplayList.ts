

/// <reference path="IObjectArray.ts" />
/// <reference path="ISceneObject.ts" />

module akra {
	export interface IDisplayList extends IEventProvider {
		/** readonly */ name: string;
		//если используется <quick search>, то в случае если узлы сцены не были изменены, выдается null.
	    _findObjects(pCamera: ICamera, pResultArray?: IObjectArray<ISceneObject>, bQuickSearch?: boolean): IObjectArray<ISceneObject>;
		_setup(pScene: IScene3d): void;
	}
	
}
