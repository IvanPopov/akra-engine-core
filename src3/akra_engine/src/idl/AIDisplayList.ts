// AIDisplayList interface
// [write description here...]


/// <reference path="AIObjectArray.ts" />
/// <reference path="AISceneObject.ts" />

interface AIDisplayList extends AIEventProvider {
	/** readonly */ name: string;
	//если используется <quick search>, то в случае если узлы сцены не были изменены, выдается null.
    _findObjects(pCamera: AICamera, pResultArray?: AIObjectArray<AISceneObject>, bQuickSearch?: boolean): AIObjectArray<AISceneObject>;
	_setup(pScene: AIScene3d): void;
}
