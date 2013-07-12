#ifndef IOMNILIGHT_TS
#define IOMNILIGHT_TS

module akra {

	IFACE(ILightPoint);
	IFACE(IShadowCaster);
	IFACE(ITexture);
	IFACE(IRenderTarget);
	IFACE(ICamera);

	export interface IOmniParameters extends ILightParameters {
		 //default parameters
	    ambient: IColor;
	    diffuse: IColor;
	    specular: IColor;
	    attenuation: IVec3;	
	}

	export interface IOmniLight extends ILightPoint {
		params: IOmniParameters;

		getShadowCaster(): IShadowCaster[];
		getDepthTextureCube(): ITexture[];
		getRenderTarget(iFace: uint): IRenderTarget;

		//false if lighting not active 
		//or it's effect don't seen
		_prepareForLighting(pCamera: ICamera): bool;
	}
}

#endif

