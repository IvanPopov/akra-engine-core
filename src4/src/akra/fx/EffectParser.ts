/// <reference path="../idl/parser/IParser.ts" />
/// <reference path="../idl/IMap.ts" />
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

		defaultInit(): void {
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

			this._pIncludedFilesMap = <IMap<boolean>>{};
			this._pIncludedFilesMap[this.getParseFileName()] = true; 
		}

		_addIncludedFile(sFileName: string): void {
			this._pIncludedFilesMap[sFileName] = true;
		}

		private _addType(): parser.EOperationType {
			var pTree: parser.IParseTree = this.getSyntaxTree();
			var pNode: parser.IParseNode = pTree.getLastNode();
			var sTypeId: string;
								 
			sTypeId = pNode.children[pNode.children.length - 2].value;

			this.addTypeId(sTypeId);

			return parser.EOperationType.k_Ok;
		}

		private _includeCode(): parser.EOperationType {
			var pTree: parser.IParseTree = this.getSyntaxTree();
			var pNode: parser.IParseNode = pTree.getLastNode();
		    var sFile: string = pNode.value;

			//cuttin qoutes
			var sIncludeURL: string = sFile.substr(1, sFile.length - 2);

			if (uri.parse(this.getParseFileName()).getScheme() === "blob:") {

				sIncludeURL = deps.resolve(sIncludeURL, this.getParseFileName());
			}

			sFile = akra.uri.resolve(sIncludeURL, this.getParseFileName());

		    if (this._pIncludedFilesMap[sFile]) {
		    	return parser.EOperationType.k_Ok;
		    }
		    else {
				var pParserState: parser.IParserState = this._saveState();
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

				return parser.EOperationType.k_Pause;
		    }
		}

		_saveState(): parser.IParserState {
			var pState: parser.IParserState = super._saveState();
			pState["includeFiles"] = this._pIncludedFilesMap;
			return pState;
		}

		_loadState(pState: parser.IParserState): void {
			super._loadState(pState);
			this._pIncludedFilesMap = <IMap<boolean>>pState["includeFiles"];
		}

	}	
}

