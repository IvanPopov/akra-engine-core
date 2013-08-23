#ifndef IDSVIEWPORT_TS
#define IDSVIEWPORT_TS

#include "IRID.ts"

module akra {
	IFACE(IColor);

	export interface IDSPickingResult extends IRIDPair {
		//render id - common id
		rid: int; 
		//renderable id - id of renderable object
		reid: int;
		//scene object id - id of scene object
		soid: int;
	}

	export interface IDSViewport extends IViewport {
		readonly effect: IEffect;
		readonly depth: ITexture;
		readonly view: IRenderableObject;
		
		getSkybox(): ITexture;
		setSkybox(pSkyTexture: ITexture): void;
		setFXAA(bValue?: bool): void;
		isFXAA(): bool;
		setOutlining(bValue?: bool): void;

		pick(x: uint, y: uint): IDSPickingResult;

		getObject(x: uint, y: uint): ISceneObject;
		getRenderable(x: uint, y: uint): IRenderableObject;

		_getRenderId(x: uint, y: uint): int;
		_getDeferredTexValue(iTex: int, x: uint, y: uint): IColor;

		signal addedSkybox(pSkyTexture: ITexture): void;
	}
}

#endif