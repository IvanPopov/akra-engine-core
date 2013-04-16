#ifndef ITERRAINSECTION_TS
#define ITERRAINSECTION_TS

module akra {
	IFACE(ITerrainSystem);
	IFACE(ISceneObject);
	IFACE(IRect2d);
	IFACE(IVertexElementInterface);
	IFACE(IRenderableObject);

	export interface ITerrainSection extends ISceneObject {
		readonly sectorX: uint;
		readonly sectorY: uint;
		readonly terrainSystem: ITerrain;
		readonly sectionIndex: uint;
		readonly heightY: float;
		readonly heightX: float;
		readonly vertexDescription: IVertexElementInterface[];

		_internalCreate(pParentSystem: ITerrain, 
						iSectorX: uint, iSectorY: uint, 
						iHeightMapX: uint, iHeightMapY: uint, 
						iXVerts: uint, iYVerts: uint, 
						pWorldRect: IRect2d): bool;
		_createRenderable(): void;
	}
}

#endif