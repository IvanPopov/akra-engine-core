#ifndef ISURFACEMATERIAL_TS
#define ISURFACEMATERIAL_TS

module akra {
	IFACE(IMaterial);
	IFACE(ITexture);

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
        AMBIENT,
        SPECULAR,
        EMISSIVE,
        EMISSION = EMISSIVE
	};

	

    export interface ISurfaceMaterial extends IResourcePoolItem {
    	totalTextures: uint;
    	material: IMaterial;
    	textureFlags: int;
    	textureMatrixFlags: int;

        setTexture(iIndex: int, sTexture: string, iTexcoord?: int): bool;
        setTexture(iIndex: int, iTextureHandle: int, iTexcoord?: int): bool;
    	setTexture(iIndex: int, pTexture: ITexture, iTexcoord?: int): bool;
    	setTextureMatrix(iIndex: int, m4fValue: IMat4): bool;
    	setMaterial(pMaterial: IMaterial): void;
    	isEqual(pSurface: ISurfaceMaterial): bool;
    	
    	texture(iSlot: int): ITexture;
    	texcoord(iSlot: int): uint;
    	textureMatrix(iSlot: int): IMat4;
    }

}

#endif

