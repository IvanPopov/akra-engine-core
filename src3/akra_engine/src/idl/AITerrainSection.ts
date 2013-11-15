// AITerrainSection interface
// [write description here...]


/// <reference path="AISceneObject.ts" />
/// <reference path="AIRect2d.ts" />
/// <reference path="AIRenderableObject.ts" />
/// <reference path="AIVertexDeclaration.ts" />

interface AITerrainSection extends AISceneObject {
	/** readonly */ sectorX: uint;
	/** readonly */ sectorY: uint;
	/** readonly */ terrainSystem: AITerrain;
	/** readonly */ sectionIndex: uint;
	/** readonly */ heightY: float;
	/** readonly */ heightX: float;
	/** readonly */ vertexDescription: AIVertexElementInterface[];

	_internalCreate(pParentSystem: AITerrain, 
					iSectorX: uint, iSectorY: uint, 
					iHeightMapX: uint, iHeightMapY: uint, 
					iXVerts: uint, iYVerts: uint, 
					pWorldRect: AIRect2d): boolean;
	_createRenderable(): void;
}
