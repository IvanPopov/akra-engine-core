
/// <reference path="IAnimationParameter.ts" />
/// <reference path="IPositionFrame.ts" />


/// <reference path="ISkeleton.ts" />
/// <reference path="ISceneNode.ts" />

module akra {
	export interface IAnimationTrack extends IAnimationParameter {
		targetName: string;
		
		/** readonly */ target: ISceneNode;
		
		keyFrame(pFrame: IPositionFrame): boolean;
		keyFrame(fTime: float, pMatrix: IMat4): boolean;
	
		bind(sJoint: string, pSkeleton: ISkeleton);
		bind(pSkeleton: ISkeleton);
		bind(pNode: ISceneNode);		
	}
}
