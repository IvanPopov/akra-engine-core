#ifndef UINODE_TS
#define UINODE_TS

#include "IUINode.ts"
#include "IUILayout.ts"
#include "util/Entity.ts"

#include "jquery.d.ts"
#include "jqueryui.d.ts"

/// @script http://code.jquery.com/jquery-1.9.1.js
/// @script http://code.jquery.com/ui/1.10.1/jquery-ui.js

module akra.ui {
	//export const $ = jQuery;
	export const $document = $(document);
	export const $body = $(document.body);

	export class Node extends util.Entity implements IUINode {
		protected _pUI: IUI;
		protected _eNodeType: EUINodeTypes;

		inline get ui(): IUI { return this._pUI; }
		inline get nodeType(): EUINodeTypes { return this._eNodeType; }

		constructor (pParent: IUINode, eNodeType?: EUINodeTypes);
		constructor (pUI: IUI, eNodeType?: EUINodeTypes);
		constructor (parent, eNodeType: EUINodeTypes = EUINodeTypes.UNKNOWN) {
			super(EEntityTypes.UI_NODE);

			this._pUI = parent instanceof UI? <IUI>parent: (<IUINode>arguments[0]).ui;
			this._eNodeType = eNodeType;

			if (parent instanceof Node) {
				this.attachToParent(<Node>parent);
			}
		}

		render(): bool;
		render(pParent: IUINode): bool;
		render(pElement: HTMLElement): bool;
		render(sSelector: string): bool;
		render(to?): bool {
			return false;
		}

		recursiveRender(): void {
			this.render();

			if (this.sibling) {
				(<IUINode>this.sibling).recursiveRender();
			}

			if (this.child) {
				(<IUINode>this.child).recursiveRender();
			}
		}

		renderTarget(): JQuery {
			if (!isNull(this.child) && isLayout(<IUINode>this.child)) {
				return (<IUINode>this.child).renderTarget();
			}

			var pTarget: IUINode = this.findRenderTarget();

			return isNull(pTarget)? null: pTarget.renderTarget();
		}

		setLayout(eType: EUILayout = EUILayout.UNKNOWN): void {
			var pLayout: IUILayout = this.ui.createLayout(eType);

			if (isLayout(<IUINode>this.child)) {
				ERROR("//TODO: LAYOUT");
			}

			pLayout.attachToParent(this);
		}

		protected findRenderTarget(): IUINode {
			var pParent: IUINode = <IUINode>this.parent;
			
			while (!isNull(pParent)) {

				if (!isNull(pParent.renderTarget())) {
					return pParent;
				}

				pParent = <IUINode>pParent.parent;
			}

			return null;
		}

		protected label(): string {
			return null;
		}

		protected className(): string {
			return "component-" + (this.label() || "").toLowerCase();
		}
	}

	export inline function isUINode(pEntity: IEntity): bool {
		return pEntity.type === EEntityTypes.UI_NODE;
	}

	export inline function isLayout(pNode: IUINode): bool {
		return pNode.nodeType === EUINodeTypes.LAYOUT;
	}

	export inline function containsHTMLElement(pNode: IUINode): bool {
		return true;
	}
}


#endif