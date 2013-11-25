

/// <reference path="ISceneObject.ts" />
/// <reference path="IRect2d.ts" />
/// <reference path="IRenderableObject.ts" />
/// <reference path="IVertexDeclaration.ts" />

module akra {
	interface ITerrainSection extends ISceneObject {
		/** readonly */ sectorX: uint;
		/** readonly */ sectorY: uint;
		/** readonly */ terrainSystem: ITerrain;
		/** readonly */ sectionIndex: uint;
		/** readonly */ heightY: float;
		/** readonly */ heightX: float;
		/** readonly */ vertexDescription: IVertexElementInterface[];
	
		_internalCreate(pParentSystem: ITerrain, 
						iSectorX: uint, iSectorY: uint, 
						iHeightMapX: uint, iHeightMapY: uint, 
						iXVerts: uint, iYVerts: uint, 
						pWorldRect: IRect2d): boolean;
		_createRenderable(): void;
	}
	
}
