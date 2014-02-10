/// <reference path="../idl/parser/IParser.ts" />
var akra;
(function (akra) {
    (function (parser) {
        var ParseTree = (function () {
            function ParseTree() {
                this._pRoot = null;
                this._pNodes = [];
                this._pNodesCountStack = [];
                this._isOptimizeMode = false;
            }
            ParseTree.prototype.getRoot = function () {
                return this._pRoot;
            };

            ParseTree.prototype.setRoot = function (pRoot) {
                this._pRoot = pRoot;
            };

            ParseTree.prototype.finishTree = function () {
                this._pRoot = this._pNodes.pop();
            };

            ParseTree.prototype.setOptimizeMode = function (isOptimize) {
                this._isOptimizeMode = isOptimize;
            };

            ParseTree.prototype.addNode = function (pNode) {
                this._pNodes.push(pNode);
                this._pNodesCountStack.push(1);
            };

            ParseTree.prototype.reduceByRule = function (pRule, eCreate) {
                if (typeof eCreate === "undefined") { eCreate = 0 /* k_Default */; }
                var iReduceCount = 0;
                var pNodesCountStack = this._pNodesCountStack;
                var pNode;
                var iRuleLength = pRule.right.length;
                var pNodes = this._pNodes;
                var nOptimize = this._isOptimizeMode ? 1 : 0;

                while (iRuleLength) {
                    iReduceCount += pNodesCountStack.pop();
                    iRuleLength--;
                }

                if ((eCreate === 0 /* k_Default */ && iReduceCount > nOptimize) || (eCreate === 1 /* k_Necessary */)) {
                    pNode = {
                        name: pRule.left,
                        children: null,
                        parent: null,
                        value: "",
                        isAnalyzed: false,
                        position: this._pNodes.length
                    };

                    while (iReduceCount) {
                        this.addLink(pNode, pNodes.pop());
                        iReduceCount -= 1;
                    }

                    pNodes.push(pNode);
                    pNodesCountStack.push(1);
                } else {
                    pNodesCountStack.push(iReduceCount);
                }
            };

            ParseTree.prototype.toString = function () {
                if (this._pRoot) {
                    return this.toStringNode(this._pRoot);
                } else {
                    return "";
                }
            };

            ParseTree.prototype.clone = function () {
                var pTree = new ParseTree();
                pTree.setRoot(this.cloneNode(this._pRoot));
                return pTree;
            };

            ParseTree.prototype.getNodes = function () {
                return this._pNodes;
            };

            ParseTree.prototype.getLastNode = function () {
                return this._pNodes[this._pNodes.length - 1];
            };

            ParseTree.prototype.addLink = function (pParent, pNode) {
                if (!pParent.children) {
                    pParent.children = [];
                }
                pParent.children.push(pNode);
                pNode.parent = pParent;
            };

            ParseTree.prototype.cloneNode = function (pNode) {
                var pNewNode;
                pNewNode = {
                    name: pNode.name,
                    value: pNode.value,
                    children: null,
                    parent: null,
                    isAnalyzed: pNode.isAnalyzed,
                    position: pNode.position
                };

                var pChildren = pNode.children;
                for (var i = 0; pChildren && i < pChildren.length; i++) {
                    this.addLink(pNewNode, this.cloneNode(pChildren[i]));
                }

                return pNewNode;
            };

            ParseTree.prototype.toStringNode = function (pNode, sPadding) {
                if (typeof sPadding === "undefined") { sPadding = ""; }
                var sRes = sPadding + "{\n";
                var sOldPadding = sPadding;
                var sDefaultPadding = "  ";

                sPadding += sDefaultPadding;

                if (pNode.value) {
                    sRes += sPadding + "name : \"" + pNode.name + "\"" + ",\n";
                    sRes += sPadding + "value : \"" + pNode.value + "\"" + "\n";
                } else {
                    sRes += sPadding + "name : \"" + pNode.name + "\"" + "\n";
                    sRes += sPadding + "children : [";

                    var pChildren = pNode.children;

                    if (pChildren) {
                        sRes += "\n";
                        sPadding += sDefaultPadding;

                        for (var i = pChildren.length - 1; i >= 0; i--) {
                            sRes += this.toStringNode(pChildren[i], sPadding);
                            sRes += ",\n";
                        }

                        sRes = sRes.slice(0, sRes.length - 2);
                        sRes += "\n";
                        sRes += sOldPadding + sDefaultPadding + "]\n";
                    } else {
                        sRes += " ]\n";
                    }
                }
                sRes += sOldPadding + "}";
                return sRes;
            };
            return ParseTree;
        })();
        parser.ParseTree = ParseTree;
    })(akra.parser || (akra.parser = {}));
    var parser = akra.parser;
})(akra || (akra = {}));
//# sourceMappingURL=ParseTree.js.map
