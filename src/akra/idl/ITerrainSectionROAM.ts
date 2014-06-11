

/// <reference path="ISceneObject.ts" />
/// <reference path="ITriTreeNode.ts" />
/// <reference path="IRect3d.ts" />
/// <reference path="ITerrainSection.ts" />

module akra {
	export interface ITerrainSectionROAM extends ITerrainSection {
	    getTriangleA(): ITriTreeNode;
	    getTriangleB(): ITriTreeNode;
	    getQueueSortValue(): float;
	    getTerrainSystem(): ITerrainROAM;
	
	    _internalCreate(pParentSystem: ITerrainROAM,
	        iSectorX: uint, iSectorY: uint,
	        iHeightMapX: uint, iHeightMapY: uint,
	        iXVerts: uint, iYVerts: uint,
	        pWorldRect: IRect2d, iStartIndex?: uint): boolean;
	
	    _initTessellationData(): void;
	
	    reset(): void;
	    tessellate(fScale: float, fLimit: float): void;
	    buildTriangleList(): void;
	}
	
}
