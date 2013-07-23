#ifndef IMEGATEXTURE_TS
#define IMEGATEXTURE_TS

module akra {
	IFACE(IViewport);
	IFACE(IRenderPass);
	IFACE(ISceneObject);
	IFACE(IEventProvider);
	IFACE(IImg);

	export interface IMegaTexture extends IEventProvider {
		manualMinLevelLoad: bool;

		init(pObject: ISceneObject, sSurfaceTextures: string): void;
		prepareForRender(pViewport: IViewport): void;
		applyForRender(pRenderPass: IRenderPass): void;
		
		getWidthOrig(iLevel: uint): uint;
		getHeightOrig(iLevel: uint): uint;

		setMinLevelTexture(pImg: IImg);
	}
}

#endif