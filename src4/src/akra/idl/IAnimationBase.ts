
/// <reference path="IMap.ts" />
/// <reference path="ISceneNode.ts" />
/// <reference path="IJoint.ts" />
/// <reference path="IPositionFrame.ts" />
/// <reference path="IAnimationTrack.ts" />

module akra {
	export interface IAnimationTarget {
		target: ISceneNode;
		index: int;
		name: string;
		track?: IAnimationTrack;
	}
	
	export enum EAnimationTypes {
		ANIMATION,
		LIST,
		CLIP,
		CONTAINER,
		BLEND
	}
	
	export interface IAnimationBase extends IEventProvider {
		getDuration(): float;
		setDuration(fDuration: float): void;

		getName(): string;
		setName(sName: string): void;
			
		getType(): EAnimationTypes;
		getFirst(): float;

		extra: any;

		play(fRealTime: float): void;
		stop(fRealTime: float): void;
	
		isAttached(): boolean;
		attach(pTarget: ISceneNode): void;
		
		frame(sName: string, fRealTime: float): IPositionFrame;
		apply(fRealTime: float): boolean;
	
		addTarget(sName: string, pTarget: ISceneNode): IAnimationTarget;
		setTarget(sName: string, pTarget: ISceneNode): IAnimationTarget;
	
		getTarget(sTargetName: string): IAnimationTarget;
		getTargetByName(sName: string): IAnimationTarget;
		
		getTargetList(): IAnimationTarget[];
		
		targetNames(): string[];
		targetList(): ISceneNode[];
		jointList(): IJoint[];
		
		grab(pAnimationBase: IAnimationBase, bRewrite?: boolean): void;
		
		createAnimationMask(): IMap<float>;
	
		played: ISignal<{ (pBase: IAnimationBase, fRealTime: float): void; }>;
		stoped: ISignal <{ (pBase: IAnimationBase, fRealTime: float): void ; }>;
		renamed: ISignal <{ (pBase: IAnimationBase, sName: float): void; }>;
	}	
}
