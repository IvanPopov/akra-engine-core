#ifndef ITERRAINROAM_TS
#define ITERRAINROAM_TS

module akra {
	IFACE(ITerrain);
	IFACE(ITerrainSectionROAM);
	IFACE(IRect3d);
	IFACE(ISceneNode);
	export interface ITerrainROAM extends ITerrain {
		readonly verts: float[];
		readonly index: Float32Array;
		readonly maxTriTreeNodes: uint;
		totalIndex: uint;
		readonly vertexId: uint;

		create(pRootNode: ISceneNode, pImgMap: IImageMap, worldExtents: IRect3d, iShift: uint, iShiftX: uint, iShiftY: uint, sSurfaceTextures: string): bool;
		destroy(): void;
		allocateSectors(): bool;
		reset(): void;
		requestTriNode();
		addToTessellationQueue(pSection: ITerrainSectionROAM): bool;
		prepareForRender(): void;
		render(pWorldMatrix: IMat4): bool;
		processTessellationQueue(): void;
	}
}

#endif