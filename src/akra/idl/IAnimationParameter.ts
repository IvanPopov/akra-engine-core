

/// <reference path="IFrame.ts" />

module akra {
	export interface IAnimationParameter {
		getTotalFrames(): uint;
		getDuration(): float;
		getFirst(): float;
	
		/** Get keyframe by number */
		getKeyFrame(iFrame: int): IFrame;
		/** Set keyframe */
		keyFrame(pFrame: IFrame): boolean;
		/** Find keyframe by time */
		findKeyFrame(fTime: float): int;
		/** Calculate frame by time */
		frame(fTime: float): IFrame;
	}
}
