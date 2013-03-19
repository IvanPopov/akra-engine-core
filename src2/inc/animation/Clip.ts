#ifndef ANIMATIONCLIP_TS
#define ANIMATIONCLIP_TS

#include "Base.ts"

module akra.animation {
	export class Clip extends Base {
		
	}

	export inline function isClip (pAnimation: IAnimationBase): bool {
		return pAnimation.type === EAnimationTypes.CLIP;
	}
}

#endif

