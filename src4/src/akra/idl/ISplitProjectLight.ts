

/// <reference path="ILightPoint.ts" />
/// <reference path="IProjectLight.ts" />
/// <reference path="ICamera.ts" />
/// <reference path="IVec4.ts" />

module akra {
	
	export interface ISplitProjectLight extends ILightPoint {
		getParams(): IProjectParameters;
		
		getShadowCaster(iSplit?: uint): IShadowCaster;
		getDepthTexture(): ITexture;
        getRenderTarget(): IRenderTarget;
        getSplitCount(): uint;
        getViewportPosition(iSplit: uint): IVec4;
	
		//false if lighting not active 
		//or it's effect don't seen
		_prepareForLighting(pCamera: ICamera): boolean;
	}
}
