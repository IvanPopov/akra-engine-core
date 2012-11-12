#ifndef IANIMATIONTRACK_TS
#define IANIMATIONTRACK_TS

module akra {
	IFACE(IAnimationFrame);
	IFACE(ISkeleton);
	IFACE(INode);
	IFACE(IMat4);
	export interface IAnimationTrack {
		targetName: string;
		readonly target: INode;
		readonly duration: float;

		keyFrame(fTime: float, pMatrix: IMat4): bool;
		getKeyFrame(iFrame: int): IAnimationFrame;
		findKeyFrame(fTime: float): int;
		bind(sJoint: string, pSkeleton: ISkeleton);
		bind(pSkeleton: ISkeleton);
		bind(pNode: INode);
		frame(fTime: float): IAnimationFrame;
	}
}

#endif