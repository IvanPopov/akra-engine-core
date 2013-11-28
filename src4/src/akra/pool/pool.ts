/// <reference path="ResourcePoolItem.ts" />

module akra.pool {
	export function isVideoResource(pItem: IResourcePoolItem): boolean {
		return !isNull(pItem) && pItem.resourceCode.family === EResourceFamilies.VIDEO_RESOURCE;
	}
}