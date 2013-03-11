#ifndef IAFXCOMPONENTBLEND_TS
#define IAFXCOMPONENTBLEND_TS

#include "IAFXComponent.ts"

module akra {
	export interface IAFXComponentBlend {
		getComponentCount(): uint;
		getTotalValidPasses(): uint;
		getHash(): string;

		addComponent(pComponent: IAFXComponent, iShift: int): void;

		clone(): IAFXComponentBlend;
	}
}

#endif