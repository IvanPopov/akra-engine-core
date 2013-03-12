#ifndef IANIMATIONTRACK_TS
#define IANIMATIONTRACK_TS

module akra {
	IFACE(IAnimationFrame);
	IFACE(ISkeleton);
	IFACE(ISceneNode);
	IFACE(IMat4);
	export interface IAnimationTrack {
		targetName: string;
		readonly target: ISceneNode;
		readonly duration: float;

		keyFrame(fTime: float, pMatrix: IMat4): bool;
		getKeyFrame(iFrame: int): IAnimationFrame;
		findKeyFrame(fTime: float): int;
		bind(sJoint: string, pSkeleton: ISkeleton);
		bind(pSkeleton: ISkeleton);
		bind(pNode: ISceneNode);
		frame(fTime: float): IAnimationFrame;
	}
}

#endif