#ifndef IRENDERPASS_TS
#define IRENDERPASS_TS

#include "IUnique.ts"
#include "IRenderTarget.ts"
#include "IAFXPassInputBlend.ts"

module akra {
	export interface IRenderPass extends IUnique {
		setForeign(sName: string, fValue: float): void;
		setTexture(sName: string, pTexture: ITexture): void;
		setUniform(sName: string, pValue: any): void;
		setStruct(sName: string, pValue: any): void;

		setSamplerTexture(sName: string, sTexture: string): void;
		setSamplerTexture(sName: string, pTexture: ITexture): void;

		getRenderTarget(): IRenderTarget;
		setRenderTarget(pTarget: IRenderTarget): void;

		getPassInput(): IAFXPassInputBlend;
		setPassInput(pInput: IAFXPassInputBlend, isNeedRelocate: bool): void;

		blend(sComponentName: string, iPass: uint): bool;

		activate(): void;
		deactivate(): void;
		isActive(): bool;
	}	
}

#endif
