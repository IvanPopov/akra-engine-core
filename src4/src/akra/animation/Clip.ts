/// <reference path="Base.ts" />

module akra.animation {
	export class Clip extends Base {
		static isClip(pAnimation: IAnimationBase): boolean {
			return pAnimation.getType() === EAnimationTypes.CLIP;
		}
	}
}


