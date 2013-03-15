#ifndef IAFXBLENDER_TS
#define IAFXBLENDER_TS

#include "IAFXComponent.ts"
#include "IAFXComponentBlend.ts"
#include "IAFXPassBlend.ts"
#include "IAFXInstruction.ts"

module akra {
	export interface IAFXBlender {

		//Component and component blend
		addComponentToBlend(pComponentBlend: IAFXComponentBlend, 
						    pComponent: IAFXComponent, iShift: int, iPass: uint): IAFXComponentBlend;

		removeComponentFromBlend(pComponentBlend: IAFXComponentBlend, 
								 pComponent: IAFXComponent, iShift: int, iPass: uint): IAFXComponentBlend;

		addBlendToBlend(pComponentBlend: IAFXComponentBlend, 
						pAddBlend: IAFXComponentBlend, iShift: int): IAFXComponentBlend;

		//Pass blend
		
		generatePassBlend(pPassList: IAFXPassInstruction[],
						  pStates: any, pForeigns: any, pUniforms: any): IAFXPassBlend;

		getPassBlendById(id: uint): IAFXPassBlend;
	}
}

#endif