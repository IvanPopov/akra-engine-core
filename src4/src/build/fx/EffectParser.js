/// <reference path="../idl/parser/IParser.ts" />
/// <reference path="../idl/IMap.ts" />
/// <reference path="../parser/Parser.ts" />
/// <reference path="../common.ts" />
/// <reference path="../io/io.ts" />
/// <reference path="../uri/uri.ts" />
/// <reference path="../path/path.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (fx) {
        var Parser = akra.parser.Parser;

        var EffectParser = (function (_super) {
            __extends(EffectParser, _super);
            function EffectParser() {
                _super.call(this);
                this._pIncludedFilesMap = null;

                this.addAdditionalFunction("addType", this._addType);
                this.addAdditionalFunction("includeCode", this._includeCode);
            }
            EffectParser.prototype.defaultInit = function () {
                _super.prototype.defaultInit.call(this);

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

                this._pIncludedFilesMap = {};
                this._pIncludedFilesMap[this.getParseFileName()] = true;
            };

            EffectParser.prototype._addIncludedFile = function (sFileName) {
                this._pIncludedFilesMap[sFileName] = true;
            };

            EffectParser.prototype._addType = function () {
                var pTree = this.getSyntaxTree();
                var pNode = pTree.getLastNode();
                var sTypeId;

                sTypeId = pNode.children[pNode.children.length - 2].value;

                this.addTypeId(sTypeId);

                return 105 /* k_Ok */;
            };

            EffectParser.prototype._includeCode = function () {
                var _this = this;
                var pTree = this.getSyntaxTree();
                var pNode = pTree.getLastNode();
                var sFile = pNode.value;

                //cuttin qoutes
                sFile = akra.uri.resolve(sFile.substr(1, sFile.length - 2), this.getParseFileName());

                if (this._pIncludedFilesMap[sFile]) {
                    return 105 /* k_Ok */;
                } else {
                    var pParserState = this._saveState();
                    var pFile = akra.io.fopen(sFile, "r+t");

                    pFile.read(function (err, sData) {
                        if (err) {
                            akra.logger.error("Can not read file");
                        } else {
                            pParserState.source = pParserState.source.substr(0, pParserState.index) + sData + pParserState.source.substr(pParserState.index);

                            _this._loadState(pParserState);
                            _this._addIncludedFile(sFile);
                            _this.resume();
                        }
                    });

                    return 104 /* k_Pause */;
                }
            };

            EffectParser.prototype._saveState = function () {
                var pState = _super.prototype._saveState.call(this);
                pState["includeFiles"] = this._pIncludedFilesMap;
                return pState;
            };

            EffectParser.prototype._loadState = function (pState) {
                _super.prototype._loadState.call(this, pState);
                this._pIncludedFilesMap = pState["includeFiles"];
            };
            return EffectParser;
        })(Parser);
        fx.EffectParser = EffectParser;
    })(akra.fx || (akra.fx = {}));
    var fx = akra.fx;
})(akra || (akra = {}));
//# sourceMappingURL=EffectParser.js.map
