var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var akra;
(function (akra) {
    (function (util) {
        var EffectParser = (function (_super) {
            __extends(EffectParser, _super);
            function EffectParser() {
                _super.call(this);
                this.addAdditionalFunction("addType", this._addType);
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
            };
            EffectParser.prototype._addType = function () {
                var pTree = this.getSyntaxTree();
                var pNode = pTree.getLastNode();
                var sTypeId;
                sTypeId = pNode.children[pNode.children.length - 2].value;
                this.addTypeId(sTypeId);
                return 105 /* k_Ok */ ;
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