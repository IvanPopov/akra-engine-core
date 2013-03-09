#ifndef EFFECTDATA_TS
#define EFFECTDATA_TS

#include "../ResourcePoolItem.ts"
#include "io/files.ts"
#include "IAFXComposer.ts"
#ifdef DEBUG
#include "IParser.ts"
#include "util/EffectParser.ts"
#endif

module akra.core.pool.resources {
	export class EffectData extends ResourcePoolItem {
		#ifdef DEBUG
		private _pSyntaxTree: IParseTree = null;
		#endif

		loadResource(sFileName?: string): bool {
			var reExt: RegExp  = /^(.+)(\.afx|\.abf|\.fx)$/;
    		var pRes:RegExpExecArray = reExt.exec(sFileName);

    		if(isNull(pRes)){
    			ERROR("Bad effect file extension. Only .afx, .fx, .abf are available");
    			return;
    		}

    		var isBinary: bool = pRes[pRes.length - 1] === ".abf";
    		var pComposer: IAFXComposer = this.getManager().getEngine().getComposer();
#ifndef DEBUG
    		if(!isBinary){
    			ERROR("You can load text effect-files only in debug-mode");
    			return;
    		}
#endif
			if(isBinary){
    			var pFile: IFile = io.fopen(sFileName, "r+b");
	    		pFile.read(function(err, pData: Uint8Array) {
					if (err){ ERROR("Can not read file"); }
					else me._initFromBinaryData(pData, sFileName);
				});
			}

#ifdef DEBUG
			var me: EffectData = this;

			io.fopen(sFileName, "r+t").read(function(pErr: Error, sData: string){
				if(!isNull(pErr)){
					ERROR("Can not load .afx file: '" + sFileName + "'");
				}
				else {

					util.parser.setParseFileName(sFileName);
					util.parser.parse(sData, me._initFromParsedEffect, me);
				}
			});
#endif
			return true;
		}

#ifdef DEBUG
		_initFromParsedEffect(eCode: EParserCode, sFileName: string): void {
			if(eCode === EParserCode.k_Error) {
				return;
			}
			
			this._pSyntaxTree = util.parser.getSyntaxTree();
			this.notifyLoaded();

			var pComposer: IAFXComposer = this.getManager().getEngine().getComposer();
			pComposer._loadEffectFromSyntaxTree(this._pSyntaxTree, sFileName);
		}
#endif

		_initFromBinaryData(pData: Uint8Array, sFileName: string): void {
			// var pComposer: IAFXComposer = this.getManager().getEngine().getComposer();
			// pComposer._loadEffectFromBinary(this._pSyntaxTree, sFileName);
		}
	}

	
}

#endif