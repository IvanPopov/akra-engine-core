#ifndef IDSVIEWPORT_TS
#define IDSVIEWPORT_TS

module akra {
	export interface IDSViewport extends IViewport {
		setSkybox(pSkyTexture: ITexture): void;
		setFXAA(bValue?: bool): void;
	}
}

#endif