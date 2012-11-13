#ifndef IANIMATIONBASE_TS
#define IANIMATIONBASE_TS

module akra {
	IFACE(INode);
	IFACE(IJoint);
	IFACE(IAnimationFrame);
	IFACE(IAnimationTrack);
	export interface IAnimationTarget{
		target: INode;
		index: int;
		name: string;
		track?: IAnimationTrack;
	}

	export interface IAnimationBase extends IEventProvider {
		duration: float;
		name: string;


		play(fRealTime: float): void;
		stop(fRealTime: float): void;

		attach(pTarget: INode): void;
		
		frame(sName: string, fRealTime: float): IAnimationFrame;
		apply(fRealTime: float): void;

		addTarget(sName: string, pTarget: INode): IAnimationTarget;
		setTarget(sName: string, pTarget: INode): IAnimationTarget;
		getTarget(sTargetName: string): IAnimationTarget;
		getTargetList(): IAnimationTarget[];
		getTargetByName(sName: string): IAnimationTarget;
		targetNames(): string[];
		targetList(): INode[];
		jointList(): IJoint[];
		grab(pAnimationBase: IAnimationBase, bRewrite?: bool): void;
		
		createAnimationMask(): FloatMap;

	}
}

#endif