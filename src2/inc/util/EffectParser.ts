#ifndef EFFECTPARSER_TS
#define EFFECTPARSER_TS

#include "util/Parser.ts"
#include "IParser.ts"
#include "common.ts"
#include "io/files.ts"

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

		private _includeCode(): EOperationType {
			var pTree: IParseTree = this.getSyntaxTree();
		    var pNode: IParseNode = pTree.getLastNode();
		    var sFile: string = pNode.children[0].value;
		    
		    if(this._pIncludedFilesMap[sFile]){
		    	return EOperationType.k_Ok;
		    }
		    else {
		    	var me: EffectParser = this;
		    	var pFile: IFile = io.fopen(sFile, "r+t");

		    	pFile.read(function(err, sData: string){
		    		if(err){ ERROR("Can not read file"); }
		    		else {
		    			var index: uint = me._getLexer()._getIndex();
		    			var sSource: string = me._getSource().substr(0, index) +
		    								  sData + me._getSource().substr(index);
		    			me._setSource(sSource);
		    			me._getLexer()._setSource(sSource);
		    			me._addIncludedFile(sFile)
		    			me.resume();
		    		}
		    	});

				return EOperationType.k_Pause;
		    }
		}

	}	

	export var parser: EffectParser = new EffectParser();
	
	export function initParser(sGrammar?: string): void {
		parser.init(sGrammar, akra.EParseMode.k_Add | 
				    akra.EParseMode.k_Negate |
					akra.EParseMode.k_Optimize |
					akra.EParseMode.k_DebugMode);
	}

}


#endif