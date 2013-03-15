#ifndef IAFXBLENDER_TS
#define IAFXBLENDER_TS

#include "IAFXComponent.ts"
#include "IAFXComponentBlend.ts"

module akra {
	export interface IAFXBlender {
		addComponentToBlend(pComponentBlend: IAFXComponentBlend, 
						    pComponent: IAFXComponent, iShift: int, iPass: uint): IAFXComponentBlend;

		removeComponentFromBlend(pComponentBlend: IAFXComponentBlend, 
								 pComponent: IAFXComponent, iShift: int, iPass: uint): IAFXComponentBlend;

		addBlendToBlend(pComponentBlend: IAFXComponentBlend, 
						pAddBlend: IAFXComponentBlend, iShift: int): IAFXComponentBlend;
	}
}

#endif