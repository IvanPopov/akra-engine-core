
/// <reference path="AIRID.ts" />


/// <reference path="IColor.ts" />

module akra {
	export interface IDSViewport extends IViewport {
		/** readonly */ effect: IEffect;
		/** readonly */ depth: ITexture;
		/** readonly */ view: IRenderableObject;
	
		getSkybox(): ITexture;
		setSkybox(pSkyTexture: ITexture): void;
	
		setFXAA(bValue?: boolean): void;
		isFXAA(): boolean;
		
		highlight(iRid: int): void;
		highlight(pObject: ISceneObject, pRenderable?: IRenderableObject): void;
		highlight(pPair: IRIDPair): void;
	
		_getRenderId(x: uint, y: uint): int;
		_getDeferredTexValue(iTex: int, x: uint, y: uint): IColor;
	
		signal addedSkybox(pSkyTexture: ITexture): void;
	}
}
