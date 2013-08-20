#ifndef IDSVIEWPORT_TS
#define IDSVIEWPORT_TS

module akra {
	export interface IDSViewport extends IViewport {
		readonly effect: IEffect;
		readonly depth: ITexture;
		readonly view: IRenderableObject;
		
		getSkybox(): ITexture;
		setSkybox(pSkyTexture: ITexture): void;
		setFXAA(bValue?: bool): void;
		isFXAA(): bool;
		setOutlining(bValue?: bool): void;

		getRenderId(x: int, y: int): int;

		signal addedSkybox(pSkyTexture: ITexture): void;
	}
}

#endif