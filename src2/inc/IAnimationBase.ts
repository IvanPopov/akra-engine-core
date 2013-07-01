#ifndef IANIMATIONBASE_TS
#define IANIMATIONBASE_TS

module akra {
	IFACE(ISceneNode);
	IFACE(IJoint);
	IFACE(IAnimationFrame);
	IFACE(IAnimationTrack);

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
		duration: float;
		name: string;
		type: EAnimationTypes;
		
		readonly first: float;

		extra: any;

		play(fRealTime: float): void;
		stop(fRealTime: float): void;

		isAttached(): bool;
		attach(pTarget: ISceneNode): void;
		
		frame(sName: string, fRealTime: float): IAnimationFrame;
		apply(fRealTime: float): bool;

		addTarget(sName: string, pTarget: ISceneNode): IAnimationTarget;
		setTarget(sName: string, pTarget: ISceneNode): IAnimationTarget;

		getTarget(sTargetName: string): IAnimationTarget;
		getTargetByName(sName: string): IAnimationTarget;
		
		getTargetList(): IAnimationTarget[];
		
		targetNames(): string[];
		targetList(): ISceneNode[];
		jointList(): IJoint[];
		
		grab(pAnimationBase: IAnimationBase, bRewrite?: bool): void;
		
		createAnimationMask(): FloatMap;

		signal played(fTime: float): void;
		signal stoped(fTime: float): void;
		signal renamed(sName: string): void;
	}

	export interface IAnimationMap {
		[name: string]: IAnimationBase;
	}
}

#endif