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

	export interface IAFXComponentBlendMap {
		[index: uint]: IAFXComponentBlend;
		[index: string]: IAFXComponentBlend; 
	}

	export interface IAFXComponentMap {
		[index: uint]: IAFXComponent;
		[index: string]: IAFXComponent;
	}

	export interface IAFXComposer {
		getComponentByName(sComponentName: string): IAFXComponent;
		getEngine(): IEngine;

		//API for Effect-resource
		
		getComponentCountForEffect(pEffectResource: IEffect): uint;
		getTotalPassesForEffect(pEffectResource: IEffect): uint;
		addComponentToEffect(pEffectResource: IEffect, pComponent: IAFXComponent, iShift: int, iPass: uint): bool;
		removeComponentFromEffect(pEffectResource: IEffect, pComponent: IAFXComponent, iShift: int, iPass: uint): bool;

		//API for load components/AFXEffects
		
		#ifdef DEBUG
		_loadEffectFromSyntaxTree(pTree: IParseTree, sFileName: string): bool;
		#endif
		_loadEffectFromBinary(pData: Uint8Array, sFileName: string): bool;
	}
}

#endif