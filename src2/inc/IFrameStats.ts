#ifndef IFRAMESTATS_TS
#define IFRAMESTATS_TS

module akra {
	export interface IFPSStat {
		last: float;
		avg: float;
		best: float;
		worst: float;
	};

	export interface ITimeStat {
		best: float;
		worst: float;
	};

	export interface IFrameStats {
		fps: IFPSStat;
		time: ITimeStat;
		polygonsCount: uint;
	}
}

#endif