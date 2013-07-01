#ifndef IANIMATIONTRACK_TS
#define IANIMATIONTRACK_TS

module akra {
	IFACE(IAnimationFrame);
	IFACE(ISkeleton);
	IFACE(ISceneNode);
	IFACE(IMat4);

	export interface IAnimationTrack {
		targetName: string;
		
		readonly totalFrames: uint;
		readonly target: ISceneNode;
		readonly duration: float;
		readonly first: float;

		/** Get keyframe by number */
		getKeyFrame(iFrame: int): IAnimationFrame;
		/** Set keyframe */
		keyFrame(pFrame: IAnimationFrame): bool;
		keyFrame(fTime: float, pMatrix: IMat4): bool;
		/** Find keyframe by time */
		findKeyFrame(fTime: float): int;
		/** Calculate frame by time */
		frame(fTime: float): IAnimationFrame;
		
		bind(sJoint: string, pSkeleton: ISkeleton);
		bind(pSkeleton: ISkeleton);
		bind(pNode: ISceneNode);
		
	}
}

#endif