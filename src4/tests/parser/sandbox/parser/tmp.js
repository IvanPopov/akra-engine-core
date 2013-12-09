/**
 * @constructor
 * @struct
 * @extends {akra.parser.Parser}
 */

akra.util.EffectParser = function() {
    akra.parser.Parser.call(this);
    this._pIncludedFilesMap = null;
    this.addAdditionalFunction("addType", this._addType);
}
__extends(akra.util.EffectParser, akra.parser.Parser);

akra.util.EffectParser.prototype.defaultInit = function () {
    akra.parser.Parser.prototype.defaultInit.call(this);
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
};

/**
* @return {number}
*/
akra.util.EffectParser.prototype._addType = function () {
    var pTree = ((this)._pSyntaxTree);
    var pNode = pTree.getLastNode();
    var sTypeId;
    sTypeId = pNode.children[pNode.children.length - 2].value;
    this.addTypeId(sTypeId);
    return 105 /* k_Ok */ ;
};

/**
* @param {akra.parser.IParseNode=} pNode
* @param {string=} sPadding
* @return {string}
*/
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
/**
* @param {akra.parser.IParseNode=} pNode
* @return {?}
*/
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



akra.parser.Parser.prototype['init'] = akra.parser.Parser.prototype.init;
akra.parser.Parser.prototype['parse'] = akra.parser.Parser.prototype.parse;
akra.parser.Parser.prototype['getSyntaxTree'] = akra.parser.Parser.prototype.getSyntaxTree;

akra.parser.ParseTree.prototype['toHTMLString'] = akra.parser.ParseTree.prototype.toHTMLString;
akra.parser.ParseTree.prototype['toTreeView'] = akra.parser.ParseTree.prototype.toTreeView;

// window['akra']['parser']['EParserType'] = akra.parser.EParserType;
// window['akra']['parser']['EParseMode'] = akra.parser.EParseMode;
// window['akra']['parser']['EParserCode'] = akra.parser.EParserCode;

window['akra'] = akra;
window['akra']['parser'] = akra.parser;
window['akra']['util'] = akra.util;
window['akra']['parser']['EParserType'] = akra.parser.EParserType;
window['akra']['parser']['EParseMode'] = akra.parser.EParseMode;
window['akra']['parser']['EParserCode'] = akra.parser.EParserCode;
window['akra']['parser']['Parser'] = akra.parser.Parser;
window['akra']['util']['EffectParser'] = akra.util.EffectParser;