// AIModel interface
// [write description here...]

/// <reference path="AICollada.ts" />


/// <reference path="AIAnimationBase.ts" />
/// <reference path="AISceneNode.ts" />
/// <reference path="AIScene3d.ts" />
/// <reference path="AISkeleton.ts" />
/// <reference path="AIMesh.ts" />

enum AEModelFormats {
	UNKNOWN,
	COLLADA = 0x1000,
	OBJ = 0x2000
}

interface AIModelLoadOptions {

}

interface AIModel extends AIResourcePoolItem {
	byteLength: uint;

	modelFormat: AEModelFormats;

	loadResource(sFilename?: string, pOptions?: AIModelLoadOptions): boolean;
	attachToScene(pNode: AISceneNode): AIModelEntry;
	attachToScene(pScene: AIScene3d): AIModelEntry;
}