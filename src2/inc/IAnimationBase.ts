#ifndef IANIMATIONBASE_TS
#define IANIMATIONBASE_TS

module akra {
	IFACE(ISceneNode);
	IFACE(IJoint);
	IFACE(IAnimationFrame);
	IFACE(IAnimationTrack);

	export interface IAnimationTarget{
		target: ISceneNode;
		index: int;
		name: string;
		track?: IAnimationTrack;
	}

	export interface IAnimationBase extends IEventProvider {
		duration: float;
		name: string;


		play(fRealTime: float): void;
		stop(fRealTime: float): void;

		attach(pTarget: ISceneNode): void;
		
		frame(sName: string, fRealTime: float): IAnimationFrame;
		apply(fRealTime: float): void;

		addTarget(sName: string, pTarget: ISceneNode): IAnimationTarget;
		setTarget(sName: string, pTarget: ISceneNode): IAnimationTarget;
		getTarget(sTargetName: string): IAnimationTarget;
		getTargetList(): IAnimationTarget[];
		getTargetByName(sName: string): IAnimationTarget;
		targetNames(): string[];
		targetList(): ISceneNode[];
		jointList(): IJoint[];
		grab(pAnimationBase: IAnimationBase, bRewrite?: bool): void;
		
		createAnimationMask(): FloatMap;

	}
}

#endif