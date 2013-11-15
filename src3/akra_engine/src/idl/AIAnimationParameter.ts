// AIAnimationParameter interface
// [write description here...]


/// <reference path="AIFrame.ts" />

interface AIAnimationParameter {
	/** readonly */ totalFrames: uint;
	/** readonly */ duration: float;
	/** readonly */ first: float;

	/** Get keyframe by number */
	getKeyFrame(iFrame: int): AIFrame;
	/** Set keyframe */
	keyFrame(pFrame: AIFrame): boolean;
	/** Find keyframe by time */
	findKeyFrame(fTime: float): int;
	/** Calculate frame by time */
	frame(fTime: float): AIFrame;
}