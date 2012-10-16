///<reference path="../akra.ts" />

module akra.pool {

	export class ResourcePoolItem extends util.ReferenceCounter implements IResourcePoolItem {

		/** Constructor of ResourcePoolItem class */
		constructor (pEngine: IEngine);
	}

}