#ifndef IAFXPASSBLEND_TS
#define IAFXPASSBLEND_TS


module akra {
	export interface IAFXPassBlend {
		blend(csPass: string): void;
	}
}

#endif
