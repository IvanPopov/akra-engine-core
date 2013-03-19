#ifndef ANIMATIONLIST_TS
#define ANIMATIONLIST_TS

#include "Base.ts"

module akra.animation {
	export class List extends Base implements IAnimationBase {
		
	}

	export inline function isList(pAnimation: IAnimationBase): bool {
		return pAnimation.type === EAnimationTypes.LIST;
	}
}

#endif

