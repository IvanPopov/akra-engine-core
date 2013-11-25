
/// <reference path="IResourcePoolItem.ts" />
/// <reference path="IRenderer.ts" />
/// <reference path="IEffect.ts" />
/// <reference path="ISurfaceMaterial.ts" />
/// <reference path="IAFXPassInputBlend.ts" />
/// <reference path="ERenderStates.ts" />

module akra {
	interface IRenderMethod extends IResourcePoolItem {
		effect: IEffect;
		surfaceMaterial: ISurfaceMaterial;
		material: IMaterial;
	
		setForeign(sName: string, pValue: any, iPass?: uint): void;
		setUniform(sName: string, pValue: any, iPass?: uint): void;
		setTexture(sName: string, pValue: ITexture, iPass?: uint): void;		
		setRenderState(eState: ERenderStates, eValue: ERenderStateValues, iPass?: uint): void;
	
		setSamplerTexture(sName: string, pTexture: ITexture, iPass?: uint): void;
		setSamplerTexture(sName: string, sTexture: string, iPass?: uint): void;
		
		isEqual(pRenderMethod: IRenderMethod): boolean;
	
		_getPassInput(iPass: uint): IAFXPassInputBlend;
	}
	
}
