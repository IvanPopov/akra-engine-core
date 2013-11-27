// AITerrainROAM interface
// [write description here...]


/// <reference path="AITerrain.ts" />
/// <reference path="AITerrainSectionROAM.ts" />
/// <reference path="AIRect3d.ts" />
/// <reference path="AISceneNode.ts" />
/// <reference path="AITriTreeNode.ts" />
/// <reference path="AICamera.ts" />

interface AITerrainROAM extends AITerrain {
	tessellationScale: float;
	tessellationLimit: float;

	useTessellationThread: boolean;

	/** readonly */ verts: float[];
	/** readonly */ index: Float32Array;
	/** readonly */ maxTriTreeNodes: uint;
	/** readonly */ vertexId: uint;
	/** readonly */ localCameraCoord: AIVec3;

	totalIndex: uint;

	requestTriNode(): AITriTreeNode;

	addToTessellationQueue(pSection: AITerrainSectionROAM): boolean;

	resetWithCamera(pCamera: AICamera): void;
}
