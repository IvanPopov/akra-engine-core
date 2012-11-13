#ifndef IANIMATIONBLEND_TS
#define IANIMATIONBLEND_TS

module akra {
	IFACE(IAnimationBase);

	export interface IAnimationElement{
		animation: IAnimationBase;
		weight: float;
		mask: FloatMap;
		acceleration?: float;
		time: float;
		realTime: float;
	}

	export interface IAnimationBlend extends IAnimationBase {
		readonly totalAnimations: int;

		play(fRealTime: float): void;
		stop(): void;

		attach(pTarget: INode): void;

		addAnimation(pAnimation: IAnimationBase, fWeight: float, pMask: FloatMap): int;
		setAnimation(iAnimation: int, pAnimation: IAnimationBase, fWeight: float, pMask: FloatMap): int;
		updateDuration(): void;
		getAnimationIndex(sName: string): int;
		getAnimation(iAnimation: int); IAnimationBase;
		getAnimationWeight(iAnimation: int): float;
		setWeights(): bool;
		setWeightSwitching(fWeight: float, iAnimationFrom: int, iAnimationTo: int): bool;
		setAnimationWeight(iAnimation: int, fWeight: float): bool;

		setAnimationMask(iAnimation: int, pMask: FloatMap): bool;
		getAnimationMask(iAnimation: int): FloatMap;
		createAnimationMask(iAnimation?: int): FloatMap;

		frame(sName: string, fRealTime: float): IAnimationFrame;
	}
}

#endif