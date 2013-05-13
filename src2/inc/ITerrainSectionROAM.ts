#ifndef ITERRAINSECTIONROAM_TS
#define ITERRAINSECTIONROAM_TS

module akra {
	IFACE(ISceneObject);
	IFACE(ITriTreeNode);
	IFACE(IRect3d);
	IFACE(ITerrainSection);
	
	export interface ITerrainSectionROAM extends ITerrainSection{
		readonly triangleA: ITriTreeNode;
		readonly triangleB: ITriTreeNode;
		readonly queueSortValue: float;
		readonly terrainSystem: ITerrainROAM;

		_internalCreate(pParentSystem: ITerrainROAM, 
						iSectorX: uint, iSectorY: uint, 
						iHeightMapX: uint, iHeightMapY: uint, 
						iXVerts: uint, iYVerts: uint, 
						pWorldRect: IRect2d, iStartIndex?: uint): bool;

		reset(): void;
		tessellate(fScale: float, fLimit: float): void;
		buildTriangleList(): void;
	}
}

#endif