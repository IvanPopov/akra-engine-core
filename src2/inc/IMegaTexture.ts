#ifndef IMEGATEXTURE_TS
#define IMEGATEXTURE_TS

module akra {
	IFACE(IViewport);
	IFACE(IRenderPass);
	IFACE(ISceneObject);

	export interface IMegaTexture {
		init(pObject: ISceneObject, sSurfaceTextures: string): void;
		prepareForRender(pViewport: IViewport): void;
		applyForRender(pRenderPass: IRenderPass): void;
		
		getWidthOrig(iLevel: uint): uint;
		getHeightOrig(iLevel: uint): uint;
	}
}

#endif