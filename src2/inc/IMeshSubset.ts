#ifndef IMESHSUBSET_TS
#define IMESHSUBSET_TS

#include "IEventProvider.ts"

module akra {
	
	IFACE (IRect3d);
	IFACE (IMesh);
	IFACE (ISkin);
	IFACE (IRenderData);

	export interface IMeshSubset extends IEventProvider, IRenderableObject {
		name: string;

		readonly mesh: IMesh;
		readonly skin: ISkin;
		readonly data: IRenderData;

		createBoundingBox(): bool;
		deleteBoundingBox(): bool;
		getBoundingBox(): IRect3d;
		showBoundingBox(): bool;
		hideBoundingBox(): bool;

		createBoundingSphere(): bool;
		deleteBoundingSphere(): bool;
		getBoundingSphere(): ISphere;
		showBoundingSphere(): bool;
		hideBoundingSphere(): bool;

		computeNormals(): void;
		computeTangents(): void;
		computeBinormals(): void;

		isSkinned(): bool;
		getSkin(): ISkin;
		setSkin(pSkin: ISkin): bool;

		/** @deprecated */
		applyFlexMaterial(csMaterial: string, pMaterial: IMaterial): IMaterial;
		getFlexMaterial(iMaterial: int): IMaterial;
		getFlexMaterial(csName: string): IMaterial;
		setFlexMaterial(iMaterial: int): bool;
		setFlexMaterial(csName: string): bool;

		show(): void;
		hide(): void;

		destroy(): void;
	}
}

#endif