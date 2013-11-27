// AIFrameStats interface


interface AIFPSStat {
	last: float;
	avg: float;
	best: float;
	worst: float;
}

interface AITimeStat {
	best: float;
	worst: float;
}

interface AIFrameStats {
	fps: AIFPSStat;
	time: AITimeStat;
	polygonsCount: uint;
}


