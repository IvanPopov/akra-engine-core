#ifndef IANIMATIONTRACK_TS
#define IANIMATIONTRACK_TS

#include "IAnimationParameter.ts"
#include "IPositionFrame.ts"

module akra {
	IFACE(ISkeleton);
	IFACE(ISceneNode);

	export interface IAnimationTrack extends IAnimationParameter {
		targetName: string;
		
		readonly target: ISceneNode;
		
		keyFrame(pFrame: IPositionFrame): bool;
		keyFrame(fTime: float, pMatrix: IMat4): bool;

		bind(sJoint: string, pSkeleton: ISkeleton);
		bind(pSkeleton: ISkeleton);
		bind(pNode: ISceneNode);		
	}
}

#endif