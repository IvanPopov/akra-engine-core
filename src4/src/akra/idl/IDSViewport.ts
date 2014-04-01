/// <reference path="IRID.ts" />
/// <reference path="IColor.ts" />

module akra {
	export interface IDSViewport extends IViewport {
		getEffect(): IEffect;
		getDepthTexture(): ITexture;
		getLightSources() : IObjectArray<ILightPoint>;
		getColorTextures() : ITexture[];
		getView(): IRenderableObject;
	
		getSkybox(): ITexture;
		setSkybox(pSkyTexture: ITexture): void;
	
		setFXAA(bValue?: boolean): void;
		isFXAA(): boolean;
		
		highlight(iRid: int): void;
		highlight(pObject: ISceneObject, pRenderable?: IRenderableObject): void;
		highlight(pPair: IRIDPair): void;
	
		_getRenderId(x: uint, y: uint): int;
		_getDeferredTexValue(iTex: int, x: uint, y: uint): IColor;
	
		addedSkybox: ISignal<{ (pViewport: IViewport, pSkyTexture: ITexture): void; }>;
		//addedBackground: ISignal <{ (pViewport: IViewport, pTexture: ITexture): void ; }>;

	}
}
