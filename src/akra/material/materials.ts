/// <reference path="../config/config.ts" />

/// <reference path="Material.ts" />


module akra.material {
	export function create(
		sName: string = config.material.name,
		pMat: IMaterialBase = <any>(config.material.default)): IMaterial {
		return new Material(sName, pMat);
	}
}
