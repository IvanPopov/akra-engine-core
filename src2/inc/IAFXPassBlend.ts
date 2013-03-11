#ifndef IAFXPASSBLEND_TS
#define IAFXPASSBLEND_TS


module akra {
	export interface IAFXPassBlend {
		blend(csComponent: string, iPass: uint): bool;
	}
}

#endif
