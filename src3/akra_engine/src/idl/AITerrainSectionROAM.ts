// AITerrainSectionROAM interface
// [write description here...]


/// <reference path="AISceneObject.ts" />
/// <reference path="AITriTreeNode.ts" />
/// <reference path="AIRect3d.ts" />
/// <reference path="AITerrainSection.ts" />

interface AITerrainSectionROAM extends AITerrainSection {
    /** readonly */ triangleA: AITriTreeNode;
    /** readonly */ triangleB: AITriTreeNode;
    /** readonly */ queueSortValue: float;
    /** readonly */ terrainSystem: AITerrainROAM;

    _internalCreate(pParentSystem: AITerrainROAM,
        iSectorX: uint, iSectorY: uint,
        iHeightMapX: uint, iHeightMapY: uint,
        iXVerts: uint, iYVerts: uint,
        pWorldRect: AIRect2d, iStartIndex?: uint): boolean;

    _initTessellationData(): void;

    reset(): void;
    tessellate(fScale: float, fLimit: float): void;
    buildTriangleList(): void;
}
