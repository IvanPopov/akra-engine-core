#ifndef ISEQUENCERENDERTARGET_TS
#define ISEQUENCERENDERTARGET_TS

#include "IRenderTarget.ts"

module akra {
	export interface ISequenceRenderTarget extends IRenderTarget {
		bindTarget(pTarget: IRenderTarget): bool;
		unbindTarget(iIndex: uint): bool;
		unbindTarget(pTarget: IRenderTarget): bool;

		getBoundTarget(iIndex: uint): IRenderTarget;
	}
}

#endif