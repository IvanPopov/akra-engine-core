#ifndef IDSVIEWPORT_TS
#define IDSVIEWPORT_TS

module akra {
	export interface IDSViewport extends IViewport {
		getSkybox(): ITexture;
		setSkybox(pSkyTexture: ITexture): void;
		setFXAA(bValue?: bool): void;

		signal addedSkybox(pSkyTexture: ITexture): void;
	}
}

#endif