

/// <reference path="IMaterial.ts" />
/// <reference path="ITexture.ts" />

module akra {
	export enum ESurfaceMaterialTextures {
		TEXTURE0 = 0,
		TEXTURE1,
		TEXTURE2,
		TEXTURE3,
		TEXTURE4,
		TEXTURE5,
		TEXTURE6,
		TEXTURE7,
		TEXTURE8,
		TEXTURE9,
		TEXTURE10,
		TEXTURE11,
		TEXTURE12,
		TEXTURE13,
		TEXTURE14,
		TEXTURE15,
		DIFFUSE = TEXTURE0,
		AMBIENT = TEXTURE1,
		SPECULAR = TEXTURE2,
		EMISSIVE = TEXTURE3,
		NORMAL = TEXTURE4,
		SHININESS = TEXTURE5,
		EMISSION = EMISSIVE,
	};
	
	
	
	export interface ISurfaceMaterial extends IResourcePoolItem {
		getTotalUpdatesOfTextures(): uint;
		getTotalUpdatesOfTexcoords(): uint;
	
		getTotalTextures(): uint;
		getTextureFlags(): int;
		getTextureMatrixFlags(): int;

		getMaterial(): IMaterial;
		setMaterial(pMaterial: IMaterial): void;

		setTexture(iIndex: int, sTexture: string, iTexcoord?: int): boolean;
		setTexture(iIndex: int, iTextureHandle: int, iTexcoord?: int): boolean;
		setTexture(iIndex: int, pTexture: ITexture, iTexcoord?: int): boolean;
		setTextureMatrix(iIndex: int, m4fValue: IMat4): boolean;
		isEqual(pSurface: ISurfaceMaterial): boolean;
		
		texture(iSlot: int): ITexture;
		texcoord(iSlot: int): uint;
		textureMatrix(iSlot: int): IMat4;
	}
	
}
