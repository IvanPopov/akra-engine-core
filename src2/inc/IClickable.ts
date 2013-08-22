#ifndef ICLICKABLE_TS
#define ICLICKABLE_TS

#include "IEventProvider.ts"

module akra {
	export interface IClickable extends IEventProvider {
		signal click(x: uint, y: uint): void;
	}
}

#endif

