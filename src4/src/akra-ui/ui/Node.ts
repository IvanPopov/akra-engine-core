/// <reference path="../../../built/lib/akra.d.ts" />

/// <reference path="../idl/IUINode.ts" />
/// <reference path="../idl/IUILayout.ts" />

/// <reference path="../idl/3d-party/jquery.d.ts" />
/// <reference path="../idl/3d-party/jqueryui.d.ts" />

/// @: data/ui/3d-party/jQuery/jquery-1.9.1.js|location()|script()|data_location({data},DATA)
/// @: data/ui/3d-party/jQuery/jquery-ui.js|location()|script()|data_location({data},DATA)

module akra.ui {
	export var $document = $(document);
	export var $body = $(document.body);

	class RelocatedSignal extends Signal<IUINode> {
		emit(pLocation: IUINode): void {
			super.emit(pLocation);

			var pNode = this.getSender();
			var pChild: IUINode = <IUINode>pNode.getChild();

			while (!isNull(pChild)) {
				pChild.relocated.emit(pLocation);
				pChild = <IUINode>pChild.getSibling();
			}
		}
	}

	export class Node extends util.Entity implements IUINode {
		relocated: ISignal<{ (pNode: IUINode, pLocation: IUINode): void; }>;

		protected _pUI: IUI;
		protected _eNodeType: EUINodeTypes;

		getUI(): IUI { return this._pUI; }
		getNodeType(): EUINodeTypes { return this._eNodeType; }

		constructor(pParent: IUINode, eNodeType?: EUINodeTypes);
		constructor(pUI: IUI, eNodeType?: EUINodeTypes);
		constructor(parent, eNodeType: EUINodeTypes = EUINodeTypes.UNKNOWN) {
			super(EEntityTypes.UI_NODE);

			this._pUI = parent instanceof UI ? <IUI>parent : (<IUINode>parent).getUI();
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

			if (!isNull(this.getSibling())) {
				(<IUINode>this.getSibling()).recursiveRender();
			}

			if (!isNull(this.getChild())) {
				(<IUINode>this.getChild()).recursiveRender();
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
			if (this.getChild()) {
				var pRightSibling: IEntity = this.getChild().getRightSibling();

				if (pRightSibling) {
					pRightSibling.setSibling(pChild);
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
			var pParent: IUINode = <IUINode>this.getParent();

			while (!isNull(pParent)) {

				if (!isNull(pParent.hasRenderTarget())) {
					return pParent;
				}

				pParent = <IUINode>pParent.getParent();
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
		return isUI(parent) ? <IUI>parent : (<IUINode>parent).getUI();
	}

	export function isUINode(pEntity: IEntity): boolean {
		return isDefAndNotNull(pEntity) && pEntity.getType() === EEntityTypes.UI_NODE;
	}

	export function isLayout(pEntity: IEntity): boolean {
		return isUINode(pEntity) && (<IUINode>pEntity).getNodeType() === EUINodeTypes.LAYOUT;
	}

	export function containsHTMLElement(pEntity: IEntity): boolean {
		return isUINode(pEntity) && (<IUINode>pEntity).getNodeType() >= EUINodeTypes.HTML;
	}
}

