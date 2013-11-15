// AIAnimationTrack interface
// [write description here...]

/// <reference path="AIAnimationParameter.ts" />
/// <reference path="AIPositionFrame.ts" />


/// <reference path="AISkeleton.ts" />
/// <reference path="AISceneNode.ts" />

interface AIAnimationTrack extends AIAnimationParameter {
	targetName: string;
	
	/** readonly */ target: AISceneNode;
	
	keyFrame(pFrame: AIPositionFrame): boolean;
	keyFrame(fTime: float, pMatrix: AIMat4): boolean;

	bind(sJoint: string, pSkeleton: AISkeleton);
	bind(pSkeleton: AISkeleton);
	bind(pNode: AISceneNode);		
}