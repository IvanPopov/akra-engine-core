#ifndef IRENDERMETHOD_TS
#define IRENDERMETHOD_TS

#include "IResourcePoolItem.ts"
#include "IRenderer.ts"
module akra {
	
	IFACE(IEffect);
	IFACE(ISurfaceMaterial);
	IFACE(IAFXPassInputBlend)

	export interface IRenderMethod extends IResourcePoolItem {
		effect: IEffect;
		surfaceMaterial: ISurfaceMaterial;
		material: IMaterial;

		setForeign(sName: string, pValue: any, iPass?: uint): void;
		setUniform(sName: string, pValue: any, iPass?: uint): void;
		setTexture(sName: string, pValue: ITexture, iPass?: uint): void;		
		setRenderState(eState: ERenderStates, eValue: ERenderStateValues, iPass?: uint): void;

		setSamplerTexture(sName: string, pTexture: ITexture, iPass?: uint): void;
		setSamplerTexture(sName: string, sTexture: string, iPass?: uint): void;
		
		isEqual(pRenderMethod: IRenderMethod): bool;
		

		_getPassInput(iPass: uint): IAFXPassInputBlend;
	}
}

#endif