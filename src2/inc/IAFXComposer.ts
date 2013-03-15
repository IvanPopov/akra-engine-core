#ifndef IAFXCOMPOSER_TS
#define IAFXCOMPOSER_TS

#ifdef DEBUG
#include "IParser.ts"
#endif

#define ALL_PASSES 0xffffff

#include "IEngine.ts"
#include "IAFXComponent.ts"
#include "IEffect.ts"
#include "IAFXComponentBlend.ts"

module akra {
	export interface IAFXComposer {
		getComponentByName(sComponentName: string): IAFXComponent;
		getEngine(): IEngine;

		//API for Effect-resource
		
		getComponentCountForEffect(pEffectResource: IEffect): uint;
		getTotalPassesForEffect(pEffectResource: IEffect): uint;
		addComponentToEffect(pEffectResource: IEffect, 
							 pComponent: IAFXComponent, iShift: int, iPass: uint): bool;
		removeComponentFromEffect(pEffectResource: IEffect, 
								  pComponent: IAFXComponent, iShift: int, iPass: uint): bool;

		activateEffectResource(pEffectResource: IEffect, iShift: int): bool;
		deactivateEffectResource(pEffectResource: IEffect): bool; 

		//API for RenderTechnique
		
		getTotalPassesForTechnique(pRenderTechnique: IRenderTechnique): uint;
		
		addOwnComponentToTechnique(pRenderTechnique: IRenderTechnique, 
								   pComponent: IAFXComponent, iShift: int, iPass: uint): bool;
		removeOwnComponentToTechnique(pRenderTechnique: IRenderTechnique, 
									  pComponent: IAFXComponent, iShift: int, iPass: uint): bool;

		prepareTechniqueBlend(pRenderTechnique: IRenderTechnique): bool;

		markTechniqueAsNeedUpdate(pRenderTechnique: IRenderTechnique): void;

		//API for load components/AFXEffects
		
		#ifdef DEBUG
		_loadEffectFromSyntaxTree(pTree: IParseTree, sFileName: string): bool;
		#endif
		_loadEffectFromBinary(pData: Uint8Array, sFileName: string): bool;
	}
}

#endif