#ifndef IBROWSERINFO_TS
#define IBROWSERINFO_TS

module akra {
	export interface IBrowserInfo {
		name: string;
		version: string;
		os: string;
	}
}

#endif