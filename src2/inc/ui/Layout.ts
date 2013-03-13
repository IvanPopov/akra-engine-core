#ifndef UILAYOUT_TS
#define UILAYOUT_TS

#include "IUILayout.ts"
#include "HTMLNode.ts"

module akra.ui {
	export class Layout extends HTMLNode implements IUILayout {
		private _eLayoutType: EUILayouts;

		inline get layoutType(): EUILayouts { return this._eLayoutType; }

		constructor (parent, pElement?: HTMLElement, eType?: EUILayouts);
		constructor (parent, pElement?: JQuery, eType?: EUILayouts);
		constructor (parent, element = $("<div class=\"layout\" />"), eType: EUILayouts = EUILayouts.UNKNOWN) {
			super(parent, element, EUINodeTypes.LAYOUT);
			this._eLayoutType = eType;
		}

		attachToParent(pParent: IUINode): bool {
			//layout must be a first child
			if (isNull(pParent) || !isNull(pParent.child)) {
				return false;
			}

			return super.attachToParent(pParent);
		}


#ifdef DEBUG
		toString(isRecursive: bool = false, iDepth: int = 0): string {
			if (!isRecursive) {
		        return '<layout' + (this.name? " " + this.name: "") + '>';
		    }

		    return super.toString(isRecursive, iDepth);
		}
#endif

	}
}

#endif