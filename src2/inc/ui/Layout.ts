#ifndef UILAYOUT_TS
#define UILAYOUT_TS

#include "IUILayout.ts"
#include "HTMLNode.ts"

module akra.ui {
	export class Layout extends HTMLNode implements IUILayout {
		private _eLayoutType: EUILayouts;

		inline get layoutType(): EUILayouts { return this._eLayoutType; }

		constructor (parent, pOptions: IUIComponentOptions = null, eType: EUILayouts = EUILayouts.UNKNOWN) {
			super(parent, $("<div class=\"layout\" />"), EUINodeTypes.LAYOUT);

			this._eLayoutType = eType;
		}
	}
}

#endif