#ifndef IPROJECTLIGHT_TS
#define IPROJECTLIGHT_TS

module akra {

	IFACE(ILightPoint);
	IFACE(ICamera);

	export interface IProjectLight extends ILightPoint {
		
		getShadowCaster(): IShadowCaster;
		getDepthTexture(): ITexture;
		getRenderTarget(): IRenderTarget;

		//false if lighting not active 
		//or it's effect don't seen
		_prepareForLighting(pCamera: ICamera): bool;
	}
}

#endif

