#ifndef EFFECTPARSER_TS
#define EFFECTPARSER_TS

#include "util/Parser.ts"
#include "IParser.ts"
#include "common.ts"
#include "io/files.ts"
#include "util/URI.ts"
#include "util/Pathinfo.ts"

module akra.util {

	export class EffectParser extends Parser {
		private _pIncludedFilesMap: BoolMap = null;

		constructor(){
			super();

			this.addAdditionalFunction("addType", this._addType);
			this.addAdditionalFunction("includeCode", this._includeCode);
		}

		protected defaultInit(): void {
			super.defaultInit();

			this.addTypeId("float2");
			this.addTypeId("float3");
			this.addTypeId("float4");
			
			this.addTypeId("float2x2");
			this.addTypeId("float3x3");
			this.addTypeId("float4x4");
			
			this.addTypeId("int2");
			this.addTypeId("int3");
			this.addTypeId("int4");
			
			this.addTypeId("bool2");
			this.addTypeId("bool3");
			this.addTypeId("bool4");

			this._pIncludedFilesMap = <BoolMap>{};
			this._pIncludedFilesMap[this.getParseFileName()] = true; 
		}

		_addIncludedFile(sFileName: string): void {
			this._pIncludedFilesMap[sFileName] = true;
		}

		private _addType(): EOperationType {
			var pTree: IParseTree = this.getSyntaxTree();
			var pNode: IParseNode = pTree.getLastNode();
			var sTypeId: string;

			sTypeId = pNode.children[pNode.children.length - 2].value;

			this.addTypeId(sTypeId);

			return EOperationType.k_Ok;
		}

		private normalizeIncludePath(sFile: string): string {
			// console.log(sFile, this.getParseFileName(), path.resolve(sFile, this.getParseFileName()));
			return path.resolve(sFile, this.getParseFileName());
		}

		private _includeCode(): EOperationType {
			var pTree: IParseTree = this.getSyntaxTree();
		    var pNode: IParseNode = pTree.getLastNode();
		    var sFile: string = pNode.value;
		    
		    //cuttin qoutes
		    sFile = this.normalizeIncludePath(sFile.substr(1, sFile.length - 2));
		    
		    if (this._pIncludedFilesMap[sFile]) {
		    	return EOperationType.k_Ok;
		    }
		    else {
		    	var pParserState: IParserState = this._saveState();
		    	var me: EffectParser = this;
		    	var pFile: IFile = io.fopen(sFile, "r+t");

		    	pFile.read((err, sData: string) => {
		    		if (err) { 
		    			ERROR("Can not read file"); 
		    		}
		    		else {
		    			pParserState.source = pParserState.source.substr(0, pParserState.index) +
		    								  sData + pParserState.source.substr(pParserState.index);

		    			me._loadState(pParserState);
		    			me._addIncludedFile(sFile);
		    			me.resume();
		    		}
		    	});

				return EOperationType.k_Pause;
		    }
		}

		_saveState(): IParserState {
			var pState: IParserState = super._saveState();
			pState["includeFiles"] = this._pIncludedFilesMap;
			return pState;
		}

		_loadState(pState: IParserState): void {
			super._loadState(pState);
			this._pIncludedFilesMap = <BoolMap>pState["includeFiles"];
		}

	}	

	export var parser: EffectParser = new EffectParser();
	
	export function initAFXParser(sGrammar: string): void {
		parser.init(sGrammar, akra.EParseMode.k_Add | 
				    akra.EParseMode.k_Negate |
					akra.EParseMode.k_Optimize |
					akra.EParseMode.k_DebugMode);
	}

}


#endif