var akra;
(function (akra) {
    (function (util) {
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
                var pTree = ((this)._pSyntaxTree);
                var pNode = pTree.getLastNode();
                var sTypeId;
                sTypeId = pNode.children[pNode.children.length - 2].value;
                this.addTypeId(sTypeId);
                return 105 /* k_Ok */ ;
            };
            EffectParser.prototype.normalizeIncludePath = function (sFile) {
                // console.log(sFile, this.getParseFileName(), path.resolve(sFile, this.getParseFileName()));
                return akra.path.resolve(sFile, this.getParseFileName());
            };
            EffectParser.prototype._includeCode = function () {
                var pTree = ((this)._pSyntaxTree);
                var pNode = pTree.getLastNode();
                var sFile = pNode.value;
                //cuttin qoutes
                sFile = this.normalizeIncludePath(sFile.substr(1, sFile.length - 2));
                if (this._pIncludedFilesMap[sFile]) {
                    return 105 /* k_Ok */ ;
                } else {
                    var pParserState = this._saveState();
                    var me = this;
                    var pFile = akra.io.fopen(sFile, "r+t");
                    pFile.read(function (err, sData) {
                        if (err) {
                            util.logger.setSourceLocation("util/EffectParser.ts", 85)
                            util.logger.error("Can not read file");
                        } else {
                            pParserState.source = pParserState.source.substr(0, pParserState.index) + sData + pParserState.source.substr(pParserState.index);
                            me._loadState(pParserState);
                            me._addIncludedFile(sFile);
                            me.resume();
                        }
                    });
                    return 104 /* k_Pause */ ;
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
        })(akra.parser.Parser);
        util.EffectParser = EffectParser;
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));

akra.parser.ParseTree.prototype.toHTMLString = function (pNode, sPadding) {
    pNode = pNode || this.getRoot();
    sPadding = sPadding || "";
    var sRes = sPadding + "{\n";
    var sOldPadding = sPadding;
    var sDefaultPadding = "  ";
    sPadding += sDefaultPadding;
    if (pNode.value) {
        sRes += sPadding + "<b style=\"color: #458383;\">name</b>: \"" + pNode.name + "\"" + ",\n";
        sRes += sPadding + "<b style=\"color: #458383;\">value</b>: \"" + pNode.value + "\"" + ",\n";
        sRes += sPadding + "<b style=\"color: #458383;\">line</b>: \"" + pNode.line + "\"" + ",\n";
        sRes += sPadding + "<b style=\"color: #458383;\">column</b>: \"" + pNode.start + "\"" + "\n";
    }
    else {
        var i;
        sRes += sPadding + "<i style=\"color: #8A2BE2;\">name</i>: \"" + pNode.name + "\"" + "\n";
        sRes += sPadding + "<i style=\"color: #8A2BE2;\">children</i>: [";
        if (pNode.children) {
            sRes += "\n";
            sPadding += sDefaultPadding;
            for (i = pNode.children.length - 1; i >= 0; i--) {
                sRes += this.toHTMLString(pNode.children[i], sPadding);
                sRes += ",\n";
            }
            sRes = sRes.slice(0, sRes.length - 2);
            sRes += "\n";
            sRes += sOldPadding + sDefaultPadding + "]\n";
        }
        else {
            sRes += " ]\n";
        }
    }
    sRes += sOldPadding + "}";
    return sRes;
}

akra.parser.ParseTree.prototype.toTreeView = function (pNode) {
    pNode = pNode || this.getRoot();
    var pRes = {};
    if (pNode.value) {
        pRes.label = pNode.name + ": " + pNode.value;
    }
    else {
        pRes.label = pNode.name;
        if (pNode.children) {
            pRes.children = [];
            pRes.expanded = true;
            for (var i = pNode.children.length - 1; i >= 0; i--) {
                pRes.children.push(this.toTreeView(pNode.children[i]));
            }
        }
    }
    return pRes;
}