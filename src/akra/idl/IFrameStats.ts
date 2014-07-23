
module akra {
	export interface AIFPSStat {
		last: float;
		avg: float;
		best: float;
		worst: float;
	}
	
	export interface ITimeStat {
		best: float;
		worst: float;
	}
	
	export interface IFrameStats {
		fps: AIFPSStat;
		time: ITimeStat;
		polygonsCount: uint;
	}
	
	
	
}
