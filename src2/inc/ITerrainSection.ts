#ifndef ITERRAINSECTION_TS
#define ITERRAINSECTION_TS

module akra {
	IFACE(ITerrainSystem);
	IFACE(ISceneNode);

	export interface ITerrainSection {
		readonly sectorX: uint;
		readonly sectorY: uint;
		readonly terrainSystem: ITerrainSystem;
		readonly sectionIndex: uint;
		readonly heightY: float;
		readonly heightX: float;

		create(pRootNode: ISceneNode, pParentSystem: ITerrain, iSectorX: uint, iSectorY: uint, iHeightMapX: uint, iHeightMapY: uint, iXVerts: uint, iYVerts: uint, pWorldRect: IRec3d): bool;
		render(): bool;
		prepareForRender(): void;
	}
}