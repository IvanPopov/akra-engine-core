#ifndef AFXCOMPOSER_TS
#define AFXCOMPOSER_TS

#include "IAFXComposer.ts"
#include "io/files.ts"
#include "IAFXEffect.ts"
#include "fx/Effect.ts"

#ifdef DEBUG

#include "util/EffectParser.ts"

#endif

module akra{
	export class AFXComposer implements IAFXComposer {
		
		constructor(){

		}

		loadEffect(sFileName: string): void {
			try{
				var reExt: RegExp  = /^(.+)(\.afx|\.abf|\.fx)$/;
	    		var pRes:RegExpExecArray = reExt.exec(sFileName);

	    		if(isNull(pRes)){
	    			ERROR("Bad effect file extension. Only .afx, .fx, .abf are available");
	    			return;
	    		}

	    		var isBinary: bool = pRes[pRes.length - 1] === ".abf";
	    		var me: AFXComposer = this;

	    	#ifndef DEBUG

	    		if(!isBinary){
	    			ERROR("You can load text effect-files only in debug-mode");
	    			return;
	    		}

	    		var pFile: IFile = io.fopen(sFileName, "r+b");
	    		pFile.read(function(err, pData: Uint8Array) {
					if (err){ ERROR("Can not read file"); }
					else me._loadEffectFromBinary(pData, sFileName);
				});

			#else

				var pFile: IFile = io.fopen(sFileName, isBinary ? "r+b" : "r+t");
	    		if(isBinary){
		    		pFile.read(function(err, pData: Uint8Array) {
						if (err){ ERROR("Can not read file"); }
						else me._loadEffectFromBinary(pData, sFileName);
					});
				}
				else{
					pFile.read(function(err, sData: string) {
						if (err){ ERROR("Can not read file"); }
						else me._loadEffectFromText(sData, sFileName);
					});
	    		}

	    	#endif
    		} catch(e){}
		}

		#ifdef DEBUG
		_loadEffectFromText(sFileData: string, sFileName: string): void {
			util.parser.setParseFileName(sFileName);
			util.parser.parse(sFileData, this._analyzeParsedEffect, this);
		}

		_analyzeParsedEffect(eCode: EParserCode, sFileName: string): void {
			if(eCode === EParserCode.k_Error){
				return;
			}

			var pParseTree: IParseTree = util.parser.getSyntaxTree();
			var pEffect: IAFXEffect = new fx.Effect(this);

			pEffect.setAnalyzedFileName(sFileName);
			pEffect.analyze(pParseTree);

			//TODO: load each component from effect
		}

		#endif

		_loadEffectFromBinary(pData: Uint8Array, sFileName: string): void {

		}

		getImportTechnique(sModuleName: string): void {

		}
	}
}

#endif