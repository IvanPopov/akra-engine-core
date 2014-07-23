
/// <reference path="IResourcePoolItem.ts" />
/// <reference path="IRenderer.ts" />
/// <reference path="IEffect.ts" />
/// <reference path="ISurfaceMaterial.ts" />
/// <reference path="IAFXPassInputBlend.ts" />
/// <reference path="ERenderStates.ts" />

module akra {
	export interface IRenderMethod extends IResourcePoolItem {
		/** Are all materials/effects loaded? */
		isReady(): boolean;

		getEffect(): IEffect;
		setEffect(pEffect: IEffect): void;

		getSurfaceMaterial(): ISurfaceMaterial;
		setSurfaceMaterial(pSurfaceMaterial: ISurfaceMaterial): void;

		getMaterial(): IMaterial;
	
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
