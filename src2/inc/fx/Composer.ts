#ifndef AFXCOMPOSER_TS
#define AFXCOMPOSER_TS

#include "IAFXComposer.ts"
#include "io/files.ts"
#include "IAFXEffect.ts"
#include "fx/Effect.ts"
#include "IEngine.ts"

#ifdef DEBUG

#include "util/EffectParser.ts"
#include "IResourcePool.ts"

#endif

module akra.fx {
	export class Composer implements IAFXComposer {
		private _pEngine: IEngine = null;

		constructor(pEngine: IEngine){
			this._pEngine = pEngine;
		}

		getImportTechnique(sModuleName: string): void {

		}

		inline getEngine(): IEngine {
			return this._pEngine;
		}

#ifdef DEBUG
		_loadEffectFromSyntaxTree(pTree: IParseTree, sFileName: string): void {
			var pEffect: IAFXEffect = new fx.Effect(this);
			LOG(pTree);
			// pEffect.setAnalyzedFileName(sFileName);
			// pEffect.analyze(pParseTree);
		}
#endif

		_loadEffectFromBinary(pData: Uint8Array, sFileName: string): void {

		}
	}
}

#endif