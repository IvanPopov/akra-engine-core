/// <reference path="../config/config.ts" />

/// <reference path="Material.ts" />


module akra.material {
	export function create(
		sName: string = config.material.name,
		pMat: IMaterialBase = <any>(config.material.default)): IMaterial {
		return new Material(sName, pMat);
	}

	export function isTransparent(pMat: IMaterial): boolean {
		return pMat.transparency < 1;
	}
}
