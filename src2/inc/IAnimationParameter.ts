#ifndef IANIMATIONPARAMETER_TS
#define IANIMATIONPARAMETER_TS

module akra {
	IFACE(IFrame);

	export interface IAnimationParameter {
		readonly totalFrames: uint;
		readonly duration: float;
		readonly first: float;

		/** Get keyframe by number */
		getKeyFrame(iFrame: int): IFrame;
		/** Set keyframe */
		keyFrame(pFrame: IFrame): bool;
		/** Find keyframe by time */
		findKeyFrame(fTime: float): int;
		/** Calculate frame by time */
		frame(fTime: float): IFrame;
	}
}

#endif