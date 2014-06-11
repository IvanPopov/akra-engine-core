/// <reference path="ResourcePoolItem.ts" />

module akra.pool {
	export function isVideoResource(pItem: IResourcePoolItem): boolean {
		return !isNull(pItem) && pItem.getResourceCode().getFamily() === EResourceFamilies.VIDEO_RESOURCE;
	}
}