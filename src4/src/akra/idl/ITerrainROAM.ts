

/// <reference path="ITerrain.ts" />
/// <reference path="ITerrainSectionROAM.ts" />
/// <reference path="IRect3d.ts" />
/// <reference path="ISceneNode.ts" />
/// <reference path="ITriTreeNode.ts" />
/// <reference path="ICamera.ts" />

module akra {
	export interface ITerrainROAM extends ITerrain {
		getVerts(): float[];
		getIndex(): Float32Array;
		getMaxTriTreeNodes(): uint;
		getVertexId(): uint;
		getLocalCameraCoord(): IVec3;

		getTessellationScale(): float;
		setTessellationScale(fScale: float): void;
		
		getTessellationLimit(): float;
		setTessellationLimit(fLimit: float): void;
		
		getUseTessellationThread(): boolean;
		setUseTessellationThread(bUseThread: boolean): void;
		
		getTotalIndex(): uint;
		setTotalIndex(iTotalIndices: uint): void;	
		
		requestTriNode(): ITriTreeNode;
	
		addToTessellationQueue(pSection: ITerrainSectionROAM): boolean;
	
		resetWithCamera(pCamera: ICamera): void;
	}
	
}
