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

			this._pUI = parent instanceof UI? <IUI>parent: (<IUINode>parent).ui;
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
			var pTarget: IUINode = this.findRenderTarget();
			return isNull(pTarget)? null: pTarget.renderTarget();
		}

		addChild(pChild: IEntity): IEntity {
			if (this.child) {
				var pRightSibling: IEntity = this.child.rightSibling;	

				if (pRightSibling) {
					pRightSibling.sibling = pChild;	
					this.childAdded(pChild);	
					return pChild;
				}
			}

    		return super.addChild(pChild); 
		}

		attachToParent(pParent: IUINode): bool {
			if (super.attachToParent(pParent)) {
				this.relocated(pParent);
				return true;
			}

			return false;
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

		signal relocated(pLocation: IUINode): void {
			EMIT_BROADCAST(relocated, _CALL(pLocation));
			
			var pNode: IUINode = <IUINode>this.child;
			while(!isNull(pNode)) {
				pNode.relocated(pLocation);
				pNode = <IUINode>pNode.sibling;
			}
		}
	}

	export function isUI(parent: IUINode): bool;
	export function isUI(parent: IUI): bool;
	export function isUI(parent): bool {
		return parent instanceof UI;
	}

	export function getUI(parent: IUINode): IUI;
	export function getUI(parent: IUI): IUI;
	export function getUI(parent): IUI {
		return isUI(parent)? <IUI>parent: (<IUINode>parent).ui;
	}

	export inline function isUINode(pEntity: IEntity): bool {
		return !isNull(pEntity) && pEntity.type === EEntityTypes.UI_NODE;
	}

	export inline function isLayout(pEntity: IEntity): bool {
		return isUINode(pEntity) && (<IUINode>pEntity).nodeType === EUINodeTypes.LAYOUT;
	}

	export inline function containsHTMLElement(pEntity: IEntity): bool {
		return isUINode(pEntity) && (<IUINode>pEntity).nodeType >= EUINodeTypes.HTML;
	}
}


#endif