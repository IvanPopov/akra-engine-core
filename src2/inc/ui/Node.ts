#ifndef UINODE_TS
#define UINODE_TS

#include "IUINode.ts"
#include "util/Entity.ts"

module akra.ui {
	export class Node extends util.Entity implements IUINode {
		protected _pUI: IUI;

		inline get ui(): IUI { return this._pUI; }

		constructor (pUI: IUI, eType: EEntityTypes) {
			super(eType);

			this._pUI = pUI;
		}
	}

	export function containsHTMLElement(pEntity: IEntity): bool {
		return pEntity.type == EEntityTypes.UI_HTMLNODE || pEntity.type == EEntityTypes.UI_DNDNODE;
	}
}


#endif