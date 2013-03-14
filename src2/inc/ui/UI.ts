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

#define UIGRAPH

#ifdef UIGRAPH

#include "graph/Graph.ts"	
#include "graph/Node.ts"
#include "graph/Connector.ts"
#include "graph/Route.ts"

#endif

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

		createComponent(sType: string, pOptions?: IUIComponentOptions): IUIComponent {
			if (isDefAndNotNull(COMPONENTS[sType])) {
				//console.log("Founded non-generic type: " + sType);
				return new COMPONENTS[sType](this, pOptions);
			}

			pOptions = pOptions || {};
			pOptions.generic = sType;
			
			return new Component(this, pOptions);
		}

		createLayout(eType: EUILayouts = EUILayouts.UNKNOWN, pAttrs?: IUILayoutAttributes): IUILayout;
		createLayout(sType: string = null, pAttrs?: IUILayoutAttributes): IUILayout;
		createLayout(type = null, pAttrs: IUILayoutAttributes = null): IUILayout {
			var pLayout: IUILayout = null;
			
			switch (type.toLowerCase()) {
				case "horizontal":
				case EUILayouts.HORIZONTAL:
					pLayout = new Horizontal(this);
					break;
				case "vertical":
				case EUILayouts.VERTICAL:
					pLayout = new Vertical(this);
					break;
				default:
					pLayout = new Layout(this);
			}

			if (!isNull(pLayout) && !isNull(pAttrs)) {
				pLayout.setAttributes(pAttrs);
			}

			return pLayout;
		}

		CREATE_EVENT_TABLE(UI);
	}
}

#endif
