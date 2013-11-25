
module akra {
	interface AIFPSStat {
		last: float;
		avg: float;
		best: float;
		worst: float;
	}
	
	interface ITimeStat {
		best: float;
		worst: float;
	}
	
	interface IFrameStats {
		fps: AIFPSStat;
		time: ITimeStat;
		polygonsCount: uint;
	}
	
	
	
}
