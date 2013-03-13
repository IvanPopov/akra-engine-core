#ifndef ISCREENINFO_TS
#define ISCREENINFO_TS

module akra {
	export interface IScreenInfo {
		width: int;
		height: int;
		aspect: float;
		pixelDepth: int;
		colorDepth: int;
	}
}

#endif
