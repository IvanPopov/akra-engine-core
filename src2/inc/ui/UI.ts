#ifndef UI_TS
#define UI_TS

#include "IUI.ts"

#include "common.ts"
#include "HTMLNode.ts"
#include "DNDNode.ts"
#include "DOM.ts"

module akra.ui {
	export class UI implements IUI {
		protected _pManager: ISceneManager;
		protected _pDOM: IDOM = null;

		inline get type(): ESceneTypes { return ESceneTypes.TYPE_2D; }
		inline get dom(): IDOM { return this._pDOM; }

		constructor (pManager: ISceneManager = null) {
			this._pManager = pManager;
			this._pDOM = new DOM(this);
		}

		inline getManager(): ISceneManager {
			return this._pManager;
		}

		createHTMLNode(pElement: HTMLElement): IUIHTMLNode {
			return new ui.HTMLNode(this, pElement);
		}

		createDNDNode(pElement: HTMLElement): IUIDNDNode {
			return new ui.DNDNode(this, pElement);
		}

		BEGIN_EVENT_TABLE(UI);
		END_EVENT_TABLE();
	}
}

#endif
