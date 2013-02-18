#ifndef IPROJECTLIGHT_TS
#define IPROJECTLIGHT_TS

module akra {

	IFACE(ILightPoint);
	IFACE(ICamera);

	export interface IProjectLight extends ILightPoint {
		optimizedProjection: IMat4;
		//currentOptimizedProjection: IMat4;

		getShadowCaster(): IShadowCaster;
		getDepthTexture(): ITexture;
		getRenderTarget(): IRenderTarget;

		//false if lighting not active 
		//or it's effect don't seen
		_prepareForLighting(pCamera: ICamera): bool;
	}
}

#endif

