/// <reference path="../idl/parser/IParser.ts" />

module akra.parser {
	final export class ParseTree implements IParseTree {
		private _pRoot: IParseNode;
		private _pNodes: IParseNode[];
		private _pNodesCountStack: uint[];
		private _isOptimizeMode: boolean;

		getRoot(): IParseNode {
			return this._pRoot;
		}

		setRoot(pRoot: IParseNode): void {
			this._pRoot = pRoot;
		}

		constructor() {
			this._pRoot = null;
			this._pNodes = <IParseNode[]>[];
			this._pNodesCountStack = <uint[]>[];
			this._isOptimizeMode = false;
		}

		finishTree(): void {
			this._pRoot = this._pNodes.pop();
		}

		setOptimizeMode(isOptimize: boolean): void {
			this._isOptimizeMode = isOptimize;
		}

		addNode(pNode: IParseNode): void {
			this._pNodes.push(pNode);
			this._pNodesCountStack.push(1);
		}

		reduceByRule(pRule: IRule, eCreate: ENodeCreateMode = ENodeCreateMode.k_Default): void {
			var iReduceCount: uint = 0;
			var pNodesCountStack: uint[] = this._pNodesCountStack;
			var pNode: IParseNode;
			var iRuleLength: uint = pRule.right.length;
			var pNodes: IParseNode[] = this._pNodes;
			var nOptimize: uint = this._isOptimizeMode ? 1 : 0;

			while (iRuleLength) {
				iReduceCount += pNodesCountStack.pop();
				iRuleLength--;
			}

			if ((eCreate === ENodeCreateMode.k_Default && iReduceCount > nOptimize) || (eCreate === ENodeCreateMode.k_Necessary)) {
				pNode = <IParseNode>{
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

		clone(): IParseTree {
			var pTree = new ParseTree();
			pTree.setRoot(this.cloneNode(this._pRoot));
			return pTree;
		}

		getNodes(): IParseNode[] {
			return this._pNodes;
		}

		getLastNode(): IParseNode {
			return this._pNodes[this._pNodes.length - 1];
		}

		private addLink(pParent: IParseNode, pNode: IParseNode): void {
			if (!pParent.children) {
				pParent.children = <IParseNode[]>[];
			}
			pParent.children.push(pNode);
			pNode.parent = pParent;
		}

		private cloneNode(pNode: IParseNode): IParseNode {
			var pNewNode: IParseNode;
			pNewNode = <IParseNode>{
				name: pNode.name,
				value: pNode.value,
				children: null,
				parent: null,
				isAnalyzed: pNode.isAnalyzed,
				position: pNode.position
			};

			var pChildren: IParseNode[] = pNode.children;
			for (var i = 0; pChildren && i < pChildren.length; i++) {
				this.addLink(pNewNode, this.cloneNode(pChildren[i]));
			}

			return pNewNode;
		}

		private toStringNode(pNode: IParseNode, sPadding: string = ""): string {
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

				var pChildren: IParseNode[] = pNode.children;

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
}
