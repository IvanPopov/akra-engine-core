/// <reference path="../idl/IUILayout.ts" />
/// <reference path="HTMLNode.ts" />

module akra.ui {
	export class Layout extends HTMLNode implements IUILayout {
		protected _eLayoutType: EUILayouts;
		protected _pAttrs: IUILayoutAttributes = null;

		getLayoutType(): EUILayouts { return this._eLayoutType; }

		constructor (parent, pElement?: HTMLElement, eType?: EUILayouts);
		constructor (parent, pElement?: JQuery, eType?: EUILayouts);
		constructor (parent, element: any = $("<div class=\"layout\"/>"), eType: EUILayouts = EUILayouts.UNKNOWN) {
			super(parent, element, EUINodeTypes.LAYOUT);
			this._eLayoutType = eType;
		}

		attachToParent(pParent: IUINode): boolean {
			//layout must be a first child
			if (isNull(pParent) || !isNull(pParent.getChild())) {
				//return false;
				//logger.warn("Node: \n" + pParent.toString(true) + "\nalready has layout node as child.");
			}

			return super.attachToParent(pParent);
		}

		attr(sAttr: string): any {
			return isNull(this._pAttrs)? null: (<any>this._pAttrs)[sAttr];
		}

		setAttributes(pAttrs: IUILayoutAttributes): void {
			if (isNull(pAttrs)) {
				return;
			}

			this._pAttrs = pAttrs;
		}

		toString(isRecursive: boolean = false, iDepth: int = 0): string {
			if (!isRecursive) {
				return '<layout' + (this.getName() ? " " + this.getName(): "") + '>';
		    }

		    return super.toString(isRecursive, iDepth);
		}

	}
}
