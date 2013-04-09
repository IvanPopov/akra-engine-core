#ifndef IUIIDE_TS
#define IUIIDE_TS

module akra {
	export enum ECMD {
		SET_PREVIEW_RESOLUTION,
		SET_PREVIEW_FULLSCREEN
	}

	export interface IUIIDE {
		cmd(eCommand: ECMD, ...argv: any[]): bool;
	}

	export var ide: IUIIDE = null;
}

#endif