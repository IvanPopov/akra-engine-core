#ifndef IANIMATIONBLEND_TS
#define IANIMATIONBLEND_TS

module akra {
	IFACE(IAnimationBase);

	export interface IAnimationElement {
		animation: IAnimationBase;
		weight: float;
		mask: FloatMap;
		acceleration?: float;
		time: float;
		realTime: float;
	}

	export interface IAnimationBlend extends IAnimationBase {
		readonly totalAnimations: int;

		addAnimation(pAnimation: IAnimationBase, fWeight?: float, pMask?: FloatMap): int;
		setAnimation(iAnimation: int, pAnimation: IAnimationBase, fWeight?: float, pMask?: FloatMap): int;
		
		getAnimationIndex(sName: string): int;
		getAnimation(sName: string): IAnimationBase;
		getAnimation(iAnimation: int): IAnimationBase;
		getAnimationWeight(sName: string): float;
		getAnimationWeight(iAnimation: int): float;
		
		setWeights(...pWeight: float[]): bool;
		setWeightSwitching(fWeight: float, iAnimationFrom: int, iAnimationTo: int): bool;
		setAnimationWeight(iAnimation: int, fWeight: float): bool;
		setAnimationWeight(fWeight: float): bool;

		setAnimationMask(sName: string, pMask: FloatMap): bool;
		setAnimationMask(iAnimation: int, pMask: FloatMap): bool;
		
		getAnimationMask(sName: string): FloatMap;
		getAnimationMask(iAnimation: int): FloatMap;

		getAnimationAcceleration(sName: string): float;
		getAnimationAcceleration(iAnimation: int): float;
		
		createAnimationMask(iAnimation?: int): FloatMap;

		signal durationUpdated(fDuration: float);
	}
}

#endif