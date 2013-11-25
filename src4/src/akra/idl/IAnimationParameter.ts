

/// <reference path="IFrame.ts" />

module akra {
	interface IAnimationParameter {
		/** readonly */ totalFrames: uint;
		/** readonly */ duration: float;
		/** readonly */ first: float;
	
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
