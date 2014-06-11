

/// <reference path="ISceneObject.ts" />
/// <reference path="IRect2d.ts" />
/// <reference path="IRenderableObject.ts" />
/// <reference path="IVertexDeclaration.ts" />

module akra {
	export interface ITerrainSection extends ISceneObject {
		getSectorX(): uint;
		getSectorY(): uint;
		getTerrainSystem(): ITerrain;
		getSectionIndex(): uint;
		getHeightY(): float;
		getHeightX(): float;
		getVertexDescription(): IVertexElementInterface[];
	
		_internalCreate(pParentSystem: ITerrain, 
						iSectorX: uint, iSectorY: uint, 
						iHeightMapX: uint, iHeightMapY: uint, 
						iXVerts: uint, iYVerts: uint, 
						pWorldRect: IRect2d): boolean;
		_createRenderable(): void;
	}
	
}
