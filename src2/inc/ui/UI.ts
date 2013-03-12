#ifndef UI_TS
#define UI_TS

#include "IUI.ts"

#include "common.ts"
#include "HTMLNode.ts"
#include "DNDNode.ts"
#include "Component.ts"
#include "Button.ts"
#include "Label.ts"
#include "Layout.ts"

module akra.ui {
	export class UI implements IUI {
		protected _pManager: ISceneManager;

		inline get type(): ESceneTypes { return ESceneTypes.TYPE_2D; }

		constructor (pManager: ISceneManager = null) {
			this._pManager = pManager;
		}

		inline getManager(): ISceneManager {
			return this._pManager;
		}

		createHTMLNode(pElement: HTMLElement): IUIHTMLNode {
			return new HTMLNode(this, pElement);
		}

		createDNDNode(pElement: HTMLElement): IUIDNDNode {
			return new DNDNode(this, pElement);
		}

		createComponent(sName: string, pOptions?: IUIComponentOptions): IUIComponent {
			switch (sName.toLowerCase()) {
				case "component": 
					return new Component(this, pOptions);
				case "button":
					return new Button(this, pOptions);
				case "label":
					return new Label(this, pOptions);
			}

			return null;
		}

		createLayout(eType: EUILayouts = EUILayouts.UNKNOWN): IUILayout {
			switch (eType) {
				case EUILayouts.HORIZONTAL:
					return null;
				case EUILayouts.VERTICAL;
					return null;
				default:
					return new Layout(this);
			}
		}

		BEGIN_EVENT_TABLE(UI);
		END_EVENT_TABLE();
	}
}

#endif
