/// <reference "IUINode.ts" />
/// <reference "IUILayout.ts" />

/// <reference path="../util/Entity.ts" />

/// <reference path="../idl/3d-party/jquery.d.ts" />
/// <reference path="../idl/3d-party/jqueryui.d.ts" />

/// @: data/ui/3d-party/jQuery/jquery-1.9.1.js|location()|script()|data_location({data},DATA)
/// @: data/ui/3d-party/jQuery/jquery-ui.js|location()|script()|data_location({data},DATA)

module akra.ui {
	export var $document = $(document);
	export var $body = $(document.body);

	class RelocatedSignal extends Signal<{ (pNode: IUINode, pLocation: IUINode): void; }, IUINode> {
		emit(pLocation?: IUINode): void {
			super.emit(pLocation);

			var pNode = this.getSender();
			var pChild: IUINode = <IUINode>pNode.child;

			while (!isNull(pChild)) {
				pChild.relocated.emit(pLocation);
				pChild = <IUINode>pChild.sibling;
			}
		}
	}

	export class Node extends util.Entity implements IUINode {
		relocated: ISignal<{ (pNode: IUINode, pLocation: IUINode): void; }>;

		protected _pUI: IUI;
		protected _eNodeType: EUINodeTypes;

		get ui(): IUI { return this._pUI; }
		get nodeType(): EUINodeTypes { return this._eNodeType; }

		constructor(pParent: IUINode, eNodeType?: EUINodeTypes);
		constructor(pUI: IUI, eNodeType?: EUINodeTypes);
		constructor(parent, eNodeType: EUINodeTypes = EUINodeTypes.UNKNOWN) {
			super(EEntityTypes.UI_NODE);

			this._pUI = parent instanceof UI ? <IUI>parent : (<IUINode>parent).ui;
			this._eNodeType = eNodeType;

			if (parent instanceof Node) {
				this.attachToParent(<Node>parent);
			}
		}

		protected setupSignals(): void {
			this.relocated = this.relocated || new RelocatedSignal(this);
			super.setupSignals();
		}

		render(): boolean;
		render(pParent: IUINode): boolean;
		render(pElement: HTMLElement): boolean;
		render(sSelector: string): boolean;
		render(to?): boolean {
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
			return isNull(pTarget) ? null : pTarget.renderTarget();
		}

		hasRenderTarget(): boolean {
			return false;
		}

		addChild(pChild: IEntity): IEntity {
			if (this.child) {
				var pRightSibling: IEntity = this.child.rightSibling;

				if (pRightSibling) {
					pRightSibling.sibling = pChild;
					this.childAdded.emit(pChild);
					return pChild;
				}
			}

			return super.addChild(pChild);
		}

		attachToParent(pParent: IUINode): boolean {
			if (super.attachToParent(pParent)) {
				this.relocated.emit(pParent);
				return true;
			}

			return false;
		}

		protected findRenderTarget(): IUINode {
			var pParent: IUINode = <IUINode>this.parent;

			while (!isNull(pParent)) {

				if (!isNull(pParent.hasRenderTarget())) {
					return pParent;
				}

				pParent = <IUINode>pParent.parent;
			}

			return null;
		}
	}

	export function isUI(parent: IUINode): boolean;
	export function isUI(parent: IUI): boolean;
	export function isUI(parent): boolean {
		return parent instanceof UI;
	}

	export function getUI(parent: IUINode): IUI;
	export function getUI(parent: IUI): IUI;
	export function getUI(parent): IUI {
		return isUI(parent) ? <IUI>parent : (<IUINode>parent).ui;
	}

	export function isUINode(pEntity: IEntity): boolean {
		return isDefAndNotNull(pEntity) && pEntity.type === EEntityTypes.UI_NODE;
	}

	export function isLayout(pEntity: IEntity): boolean {
		return isUINode(pEntity) && (<IUINode>pEntity).nodeType === EUINodeTypes.LAYOUT;
	}

	export function containsHTMLElement(pEntity: IEntity): boolean {
		return isUINode(pEntity) && (<IUINode>pEntity).nodeType >= EUINodeTypes.HTML;
	}
}

