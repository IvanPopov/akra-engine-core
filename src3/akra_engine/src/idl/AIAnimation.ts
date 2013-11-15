// AIAnimation interface
// [write description here...]

/// <reference path="AIAnimationBase.ts" />


/// <reference path="AISceneNode.ts" />
/// <reference path="AIPositionFrame.ts" />
/// <reference path="AIAnimationTrack.ts" />

interface AIAnimation extends AIAnimationBase {
	/** readonly */ totalTracks: int;

	push(pTrack: AIAnimationTrack): void;
	attach(pTarget: AISceneNode): void;

	getTracks(): AIAnimationTrack[];
	getTrack(i: int): AIAnimationTrack;
	
	frame(sName: string, fTime: float): AIPositionFrame;
	extend(pAnimation: AIAnimation): void;
}