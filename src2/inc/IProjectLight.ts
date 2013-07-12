#ifndef IPROJECTLIGHT_TS
#define IPROJECTLIGHT_TS

module akra {

	IFACE(ILightPoint);
	IFACE(ICamera);

	export interface IProjectParameters extends ILightParameters {
		 //default parameters
	    ambient: IColor;
	    diffuse: IColor;
	    specular: IColor;
	    attenuation: IVec3;	
	}

	export interface IProjectLight extends ILightPoint {
		params: IProjectParameters;
		
		getShadowCaster(): IShadowCaster;
		getDepthTexture(): ITexture;
		getRenderTarget(): IRenderTarget;

		//false if lighting not active 
		//or it's effect don't seen
		_prepareForLighting(pCamera: ICamera): bool;
	}
}

#endif

