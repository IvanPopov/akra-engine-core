

/// <reference path="ITerrain.ts" />
/// <reference path="ITerrainSectionROAM.ts" />
/// <reference path="IRect3d.ts" />
/// <reference path="ISceneNode.ts" />
/// <reference path="ITriTreeNode.ts" />
/// <reference path="ICamera.ts" />

module akra {
	interface ITerrainROAM extends ITerrain {
		tessellationScale: float;
		tessellationLimit: float;
	
		useTessellationThread: boolean;
	
		/** readonly */ verts: float[];
		/** readonly */ index: Float32Array;
		/** readonly */ maxTriTreeNodes: uint;
		/** readonly */ vertexId: uint;
		/** readonly */ localCameraCoord: IVec3;
	
		totalIndex: uint;
	
		requestTriNode(): ITriTreeNode;
	
		addToTessellationQueue(pSection: ITerrainSectionROAM): boolean;
	
		resetWithCamera(pCamera: ICamera): void;
	}
	
}
