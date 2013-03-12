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
#include "Horizontal.ts"
#include "Vertical.ts"
#include "Slider.ts"
#include "Checkbox.ts"
#include "CheckboxList.ts"

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
				case "slider":
					return new Slider(this, pOptions);
				case "checkbox":
					return new Checkbox(this, pOptions);
				case "checkboxlist":
					return new CheckboxList(this, pOptions);
				default: 
					pOptions = pOptions || {};
					pOptions.generic = sName;
					return new Component(this, pOptions);
			}
		}

		createLayout(eType: EUILayouts = EUILayouts.UNKNOWN): IUILayout;
		createLayout(sType: string = null): IUILayout;
		createLayout(type = null): IUILayout {
			switch (type) {
				case "horizontal":
				case EUILayouts.HORIZONTAL:
					return new Horizontal(this);
				case "vertical":
				case EUILayouts.VERTICAL:
					return new Vertical(this);
				default:
					return new Layout(this);
			}
		}

		CREATE_EVENT_TABLE(UI);
	}
}

#endif
