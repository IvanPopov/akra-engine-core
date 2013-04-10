#ifndef IMEGATEXTURE_TS
#define IMEGATEXTURE_TS

module akra {
	IFACE(IViewport);
	IFACE(IRenderPass);
	
	export interface IMegaTexture {
		prepareForRender(pViewport: IViewport): void;
		applyForRender(pRenderPass: IRenderPass): void;
		setBufferMapNULL(pBuffer): void;
		setData(pBuffer, iX: uint, iY: uint, iWidth: uint, iHeight: uint, pBufferIn, iInX: uint, iInY: uint, iInWidth: uint, iInHeight: uint, iBlockWidth: uint, iBlockHeight: uint, iComponents: uint): void;
		setDataT(pBuffer, iX: uint, iY: uint, iWidth: uint, iHeight: uint, pBufferIn, iInX: uint, iInY: uint, iInWidth: uint, iInHeight: uint, iBlockWidth: uint, iBlockHeight: uint, iComponents: uint): void;
		getWidthOrig(iLevel: uint): uint;
		getHeightOrig(iLevel: uint): uint;
		getDataFromServer(iLevelTex: uint, iOrigTexX: uint, iOrigTexY: uint, iWidth: uint, iHeight: uint, iAreaX: uint, iAreaY: uint, iAreaWidth: uint, iAreaHeight: uint): void;
	}
}

#endif