#ifndef ITERRAINROAM_TS
#define ITERRAINROAM_TS

module akra {
	export interface ITerrainROAM {
		readonly verts;
		readonly index;
		totalIndex: uint;
		readonly vertexId: uint;

		destroy(): void;
		allocateSectors(): bool;
		reset(): void;
		requestTriNode();
		addToTessellationQueue(): bool;
		prepareForRender(): void;
		render(): void;
		processTessellationQueue(): void;
	}
}