#ifndef IAFXCOMPOSER_TS
#define IAFXCOMPOSER_TS

#ifdef DEBUG
#include "IParser.ts"
#endif

#include "IEngine.ts"
#include "IAFXComponent.ts"

module akra{
	export interface IAFXComposer {
		getComponentByName(sComponentName: string): IAFXComponent;
		getEngine(): IEngine;

		#ifdef DEBUG
		_loadEffectFromSyntaxTree(pTree: IParseTree, sFileName: string): void;
		#endif
		_loadEffectFromBinary(pData: Uint8Array, sFileName: string): void;
	}
}

#endif