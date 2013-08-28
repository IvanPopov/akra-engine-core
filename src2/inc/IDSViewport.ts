#ifndef IDSVIEWPORT_TS
#define IDSVIEWPORT_TS

#include "IRID.ts"

module akra {
	IFACE(IColor);

	export interface IDSViewport extends IViewport {
		readonly effect: IEffect;
		readonly depth: ITexture;
		readonly view: IRenderableObject;
		
		getBackground(): ITexture;
		setBackground(pTexture: ITexture, v4fMapping?: IVec4): void;
		getBackgroundMapping(): IVec4;
		setBackgoundMapping(v4fMapping: IVec4): void;

		getSkybox(): ITexture;
		setSkybox(pSkyTexture: ITexture): void;

		setFXAA(bValue?: bool): void;
		isFXAA(): bool;
		
		highlight(iRid: int): void;
		highlight(pObject: ISceneObject, pRenderable?: IRenderableObject): void;
		highlight(pPair: IRIDPair): void;

		pick(x: uint, y: uint): IRIDPair;

		getObject(x: uint, y: uint): ISceneObject;
		getRenderable(x: uint, y: uint): IRenderableObject;

		_getRenderId(x: uint, y: uint): int;
		_getDeferredTexValue(iTex: int, x: uint, y: uint): IColor;

		signal addedSkybox(pSkyTexture: ITexture): void;
	}
}

#endif