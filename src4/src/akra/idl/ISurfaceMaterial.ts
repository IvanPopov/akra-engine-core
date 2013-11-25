

/// <reference path="IMaterial.ts" />
/// <reference path="ITexture.ts" />

module akra {
	enum ESurfaceMaterialTextures {
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
		EMISSION = EMISSIVE,
	};
	
	
	
	interface ISurfaceMaterial extends IResourcePoolItem {
		/** readonly */ totalUpdatesOfTextures: uint;
		/** readonly */ totalUpdatesOfTexcoords: uint;
	
		totalTextures: uint;
		material: IMaterial;
		textureFlags: int;
		textureMatrixFlags: int;
	
		setTexture(iIndex: int, sTexture: string, iTexcoord?: int): boolean;
		setTexture(iIndex: int, iTextureHandle: int, iTexcoord?: int): boolean;
		setTexture(iIndex: int, pTexture: ITexture, iTexcoord?: int): boolean;
		setTextureMatrix(iIndex: int, m4fValue: IMat4): boolean;
		setMaterial(pMaterial: IMaterial): void;
		isEqual(pSurface: ISurfaceMaterial): boolean;
		
		texture(iSlot: int): ITexture;
		texcoord(iSlot: int): uint;
		textureMatrix(iSlot: int): IMat4;
	}
	
}
