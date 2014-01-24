/// <reference path="../../idl/IAFXComposer.ts" />
/// <reference path="../../idl/IFile.ts" />
/// <reference path="../../idl/parser/IParser.ts" />

/// <reference path="../../io/io.ts" />
/// <reference path="../../config/config.ts" />
/// <reference path="../../common.ts" />
/// <reference path="../../fx/EffectParser.ts" />

/// <reference path="../ResourcePoolItem.ts" />

module akra.pool.resources {
	export class EffectData extends ResourcePoolItem {
		private _pFile: IFile = null;
		private _pSyntaxTree: parser.IParseTree = null;

		 get byteLength(): uint {
			return this._pFile? this._pFile.getByteLength(): 0;
		}

		loadResource(sFileName?: string): boolean {
			var reExt: RegExp  = /^(.+)(\.afx|\.abf|\.fx)$/;
			var pRes:RegExpExecArray = reExt.exec(sFileName);

			if(isNull(pRes)){
				logger.error("Bad effect file extension. Only .afx, .fx, .abf are available");
				return;
			}

			var isBinary: boolean = pRes[pRes.length - 1] === ".abf";
			var pComposer: IAFXComposer = this.getManager().getEngine().getComposer();

			if (!config.AFX_ENABLE_TEXT_EFFECTS) {
				//binary only
				if (!isBinary) {
					logger.error("You can load text effect-files only in debug-mode");
					return;
				}
			}

			if(isBinary) {
				var pFile: IFile = this._pFile = io.fopen(sFileName, "r+b");
				
				pFile.read((err: Error, pData: Uint8Array) => {
					if (err) {
						logger.error("Can not read file");
					}
					else {
						this._initFromBinaryData(pData, sFileName);
					}
				});

				return true;
			}

			if (config.AFX_ENABLE_TEXT_EFFECTS) {
				//text only
				var pFile: IFile = this._pFile = io.fopen(sFileName, "r+t");
				var me: EffectData = this;

				pFile.read(function (pErr: Error, sData: string) {
					if (!isNull(pErr)) {
						logger.error("Can not load .afx file: '" + sFileName + "'");
					}
					else {

						fx.effectParser.setParseFileName(sFileName);
						fx.effectParser.parse(sData, me._initFromParsedEffect, me);
					}
				});
			}

			return true;
		}

		_initFromParsedEffect(eCode: parser.EParserCode, sFileName: string): void {
			if (eCode === parser.EParserCode.k_Error) {
				return;
			}
			
			this._pSyntaxTree = fx.effectParser.getSyntaxTree();

			var pComposer: IAFXComposer = this.getManager().getEngine().getComposer();

			if(pComposer._loadEffectFromSyntaxTree(this._pSyntaxTree, sFileName)){
				this.notifyLoaded();
			}
		}

		_initFromBinaryData(pData: Uint8Array, sFileName: string): void {
			// var pComposer: IAFXComposer = this.getManager().getEngine().getComposer();
			// pComposer._loadEffectFromBinary(this._pSyntaxTree, sFileName);
		}
	}
}
