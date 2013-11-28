/// <reference path="../idl/IParser.ts />"
/// <reference path="../idl/IMap.ts />"
/// <reference path="../parser/Parser.ts" />
/// <reference path="../common.ts" />
/// <reference path="../io/io.ts" />
/// <reference path="../uri/uri.ts" />
/// <reference path="../path/path.ts" />

module akra.fx {
	import Parser = parser.Parser;

	export class EffectParser extends Parser {
		private _pIncludedFilesMap: IMap<boolean> = null;

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
		    var sFile: string = pNode.value;
		    
		    //cuttin qoutes
			sFile = uri.resolve(sFile.substr(1, sFile.length - 2), this.getParseFileName());

		    if (this._pIncludedFilesMap[sFile]) {
		    	return EOperationType.k_Ok;
		    }
		    else {
		    	var pParserState: IParserState = this._saveState();
		    	var pFile: IFile = io.fopen(sFile, "r+t");
				
		    	pFile.read((err, sData: string) => {
		    		if (err) { 
		    			logger.error("Can not read file"); 
		    		}
		    		else {
		    			pParserState.source = pParserState.source.substr(0, pParserState.index) +
		    								  sData + pParserState.source.substr(pParserState.index);

		    			this._loadState(pParserState);
						this._addIncludedFile(sFile);
						this.resume();
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
			this._pIncludedFilesMap = <IMap<boolean>>pState["includeFiles"];
		}

	}	
}

