// AIAnimationBase interface
// [write description here...]

/// <reference path="AIMap.ts" />
/// <reference path="AISceneNode.ts" />
/// <reference path="AIJoint.ts" />
/// <reference path="AIPositionFrame.ts" />
/// <reference path="AIAnimationTrack.ts" />

interface AIAnimationTarget {
	target: AISceneNode;
	index: int;
	name: string;
	track?: AIAnimationTrack;
}

enum AEAnimationTypes {
	ANIMATION,
	LIST,
	CLIP,
	CONTAINER,
	BLEND
}

interface AIAnimationBase extends AIEventProvider {
	duration: float;
	name: string;
	type: AEAnimationTypes;
	
	/** readonly */ first: float;

	extra: any;

	play(fRealTime: float): void;
	stop(fRealTime: float): void;

	isAttached(): boolean;
	attach(pTarget: AISceneNode): void;
	
	frame(sName: string, fRealTime: float): AIPositionFrame;
	apply(fRealTime: float): boolean;

	addTarget(sName: string, pTarget: AISceneNode): AIAnimationTarget;
	setTarget(sName: string, pTarget: AISceneNode): AIAnimationTarget;

	getTarget(sTargetName: string): AIAnimationTarget;
	getTargetByName(sName: string): AIAnimationTarget;
	
	getTargetList(): AIAnimationTarget[];
	
	targetNames(): string[];
	targetList(): AISceneNode[];
	jointList(): AIJoint[];
	
	grab(pAnimationBase: AIAnimationBase, bRewrite?: boolean): void;
	
	createAnimationMask(): AIFloatMap;

	signal played(fTime: float): void;
	signal stoped(fTime: float): void;
	signal renamed(sName: string): void;
}

interface AIAnimationMap {
	[name: string]: AIAnimationBase;
}
