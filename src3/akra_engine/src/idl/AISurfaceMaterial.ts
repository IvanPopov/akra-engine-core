// AISurfaceMaterial interface
// [write description here...]


/// <reference path="AIMaterial.ts" />
/// <reference path="AITexture.ts" />

enum AESurfaceMaterialTextures {
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



interface AISurfaceMaterial extends AIResourcePoolItem {
	/** readonly */ totalUpdatesOfTextures: uint;
	/** readonly */ totalUpdatesOfTexcoords: uint;

	totalTextures: uint;
	material: AIMaterial;
	textureFlags: int;
	textureMatrixFlags: int;

	setTexture(iIndex: int, sTexture: string, iTexcoord?: int): boolean;
	setTexture(iIndex: int, iTextureHandle: int, iTexcoord?: int): boolean;
	setTexture(iIndex: int, pTexture: AITexture, iTexcoord?: int): boolean;
	setTextureMatrix(iIndex: int, m4fValue: AIMat4): boolean;
	setMaterial(pMaterial: AIMaterial): void;
	isEqual(pSurface: AISurfaceMaterial): boolean;
	
	texture(iSlot: int): AITexture;
	texcoord(iSlot: int): uint;
	textureMatrix(iSlot: int): AIMat4;
}
