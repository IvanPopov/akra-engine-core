

/// <reference path="IAnimationBase.ts" />
/// <reference path="IMap.ts" />

module akra {
	export interface IAnimationElement {
		animation: IAnimationBase;
		weight: float;
		mask: IMap<float>;
		acceleration?: float;
		time: float;
		realTime: float;
	}
	
	export interface IAnimationBlend extends IAnimationBase {
		getTotalAnimations(): int;
	
	    addAnimation(pAnimation: IAnimationBase, fWeight?: float, pMask?: IMap<float>): int;
	    setAnimation(iAnimation: int, pAnimation: IAnimationBase, fWeight?: float, pMask?: IMap<float>): boolean;
		
		getAnimationIndex(sName: string): int;
		getAnimation(sName: string): IAnimationBase;
		getAnimation(iAnimation: int): IAnimationBase;
		getAnimationWeight(sName: string): float;
		getAnimationWeight(iAnimation: int): float;
	
		swapAnimations(i: int, j: int): boolean;
		removeAnimation(iAnimation: int): boolean;
		
		setWeights(...pWeight: float[]): boolean;
		setWeightSwitching(fWeight: float, iAnimationFrom: int, iAnimationTo: int): boolean;
		setAnimationWeight(iAnimation: int, fWeight: float): boolean;
		setAnimationWeight(fWeight: float): boolean;
	
	    setAnimationMask(sName: string, pMask: IMap<float>): boolean;
	    setAnimationMask(iAnimation: int, pMask: IMap<float>): boolean;
		
	    getAnimationMask(sName: string): IMap<float>;
	    getAnimationMask(iAnimation: int): IMap<float>;
	
		getAnimationAcceleration(sName: string): float;
		getAnimationAcceleration(iAnimation: int): float;
		
	    createAnimationMask(iAnimation?: int): IMap<float>;
	
		weightUpdated: ISignal<{ (pBlend: IAnimationBlend, iAnim: int, fWeight: float): void; }>;
		durationUpdated: ISignal <{ (pBlend: IAnimationBlend, fDuration: float): void ; }>;
	}
	
}
