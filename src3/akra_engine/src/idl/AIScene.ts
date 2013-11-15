// AIScene interface
// [write description here...]

/// <reference path="AIEventProvider.ts" />
/// <reference path="AISceneManager.ts" />

enum AESceneTypes {
	TYPE_3D,
	TYPE_2D
}

interface AIScene extends AIEventProvider {
	type: AESceneTypes;
	name: string;

	getManager(): AISceneManager;
}

