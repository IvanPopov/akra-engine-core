
/// <reference path="AIUnique.ts" />
/// <reference path="IRenderTarget.ts" />
/// <reference path="IAFXPassInputBlend.ts" />


module akra {
	export interface IRenderPass extends AIUnique {
		setForeign(sName: string, fValue: float): void;
		setTexture(sName: string, pTexture: ITexture): void;
		setUniform(sName: string, pValue: any): void;
		setStruct(sName: string, pValue: any): void;
		setRenderState(eState: ERenderStates, eValue: ERenderStateValues): void;
	
		setSamplerTexture(sName: string, sTexture: string): void;
		setSamplerTexture(sName: string, pTexture: ITexture): void;
	
		getRenderTarget(): IRenderTarget;
		setRenderTarget(pTarget: IRenderTarget): void;
	
		getPassInput(): IAFXPassInputBlend;
		setPassInput(pInput: IAFXPassInputBlend, isNeedRelocate: boolean): void;
	
		blend(sComponentName: string, iPass: uint): boolean;
	
		activate(): void;
		deactivate(): void;
		isActive(): boolean;
	}	
	
	
}
