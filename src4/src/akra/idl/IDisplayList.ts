/// <reference path="IObjectArray.ts" />
/// <reference path="ISceneObject.ts" />

module akra {
	export interface IDisplayList<T extends ISceneNode> extends IEventProvider {
		getName(): string;
		
		//если используется <quick search>, то в случае если узлы сцены не были изменены, выдается null.
		_findObjects(pCamera: ICamera, pResultArray?: IObjectArray<T>,
			bQuickSearch?: boolean): IObjectArray<T>;
		_setup(pScene: IScene3d): void;
	}
}
