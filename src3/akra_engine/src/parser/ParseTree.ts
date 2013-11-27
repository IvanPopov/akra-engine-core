/// <reference path="../idl/AIParser.ts" />

class ParseTree implements AIParseTree {
    private _pRoot: AIParseNode;
    private _pNodes: AIParseNode[];
    private _pNodesCountStack: uint[];
    private _isOptimizeMode: boolean;

    get root(): AIParseNode {
        return this._pRoot;
    }

    set root(pRoot: AIParseNode) {
        this._pRoot = pRoot;
    }

    constructor() {
        this._pRoot = null;
        this._pNodes = <AIParseNode[]>[];
        this._pNodesCountStack = <uint[]>[];
        this._isOptimizeMode = false;
    }

    setRoot(): void {
        this._pRoot = this._pNodes.pop();
    }

    setOptimizeMode(isOptimize: boolean): void {
        this._isOptimizeMode = isOptimize;
    }

    addNode(pNode: AIParseNode): void {
        this._pNodes.push(pNode);
        this._pNodesCountStack.push(1);
    }

    reduceByRule(pRule: AIRule, eCreate: AENodeCreateMode = AENodeCreateMode.k_Default): void {
        var iReduceCount: uint = 0;
        var pNodesCountStack: uint[] = this._pNodesCountStack;
        var pNode: AIParseNode;
        var iRuleLength: uint = pRule.right.length;
        var pNodes: AIParseNode[] = this._pNodes;
        var nOptimize: uint = this._isOptimizeMode ? 1 : 0;

        while (iRuleLength) {
            iReduceCount += pNodesCountStack.pop();
            iRuleLength--;
        }

        if ((eCreate === AENodeCreateMode.k_Default && iReduceCount > nOptimize) || (eCreate === AENodeCreateMode.k_Necessary)) {
            pNode = <AIParseNode>{
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
        }
        else {
            pNodesCountStack.push(iReduceCount);
        }
    }

    toString(): string {
        if (this._pRoot) {
            return this.toStringNode(this._pRoot);
        }
        else {
            return "";
        }
    }

    clone(): AIParseTree {
        var pTree = new ParseTree();
        pTree.root = this.cloneNode(this._pRoot);
        return pTree;
    }

    getNodes(): AIParseNode[] {
        return this._pNodes;
    }

    getLastNode(): AIParseNode {
        return this._pNodes[this._pNodes.length - 1];
    }

    private addLink(pParent: AIParseNode, pNode: AIParseNode): void {
        if (!pParent.children) {
            pParent.children = <AIParseNode[]>[];
        }
        pParent.children.push(pNode);
        pNode.parent = pParent;
    }

    private cloneNode(pNode: AIParseNode): AIParseNode {
        var pNewNode: AIParseNode;
        pNewNode = <AIParseNode>{
            name: pNode.name,
            value: pNode.value,
            children: null,
            parent: null,
            isAnalyzed: pNode.isAnalyzed,
            position: pNode.position
        };

        var pChildren: AIParseNode[] = pNode.children;
        for (var i = 0; pChildren && i < pChildren.length; i++) {
            this.addLink(pNewNode, this.cloneNode(pChildren[i]));
        }

        return pNewNode;
    }

    private toStringNode(pNode: AIParseNode, sPadding: string = ""): string {
        var sRes: string = sPadding + "{\n";
        var sOldPadding: string = sPadding;
        var sDefaultPadding: string = "  ";

        sPadding += sDefaultPadding;

        if (pNode.value) {
            sRes += sPadding + "name : \"" + pNode.name + "\"" + ",\n";
            sRes += sPadding + "value : \"" + pNode.value + "\"" + "\n";
        }
        else {

            sRes += sPadding + "name : \"" + pNode.name + "\"" + "\n";
            sRes += sPadding + "children : [";

            var pChildren: AIParseNode[] = pNode.children;

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
            }
            else {
                sRes += " ]\n";
            }
        }
        sRes += sOldPadding + "}";
        return sRes;
    }
}


export = ParseTree;