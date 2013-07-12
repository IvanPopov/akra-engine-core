#ifndef IMEGATEXTURE_TS
#define IMEGATEXTURE_TS

module akra {
	IFACE(IViewport);
	IFACE(IRenderPass);
	IFACE(ISceneObject);
	IFACE(IEventProvider);

	export interface IMegaTexture extends IEventProvider {
		init(pObject: ISceneObject, sSurfaceTextures: string): void;
		prepareForRender(pViewport: IViewport): void;
		applyForRender(pRenderPass: IRenderPass): void;
		
		getWidthOrig(iLevel: uint): uint;
		getHeightOrig(iLevel: uint): uint;
	}
}

#endif