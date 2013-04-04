#ifndef UI_TS
#define UI_TS

#include "IUI.ts"

#include "common.ts"
#include "HTMLNode.ts"
#include "DNDNode.ts"
#include "Component.ts"
#include "Panel.ts"
#include "Button.ts"
#include "Label.ts"
#include "Layout.ts"
#include "Horizontal.ts"
#include "Vertical.ts"
#include "Slider.ts"
#include "Checkbox.ts"
#include "CheckboxList.ts"
#include "Window.ts"
#include "RenderTargetStats.ts"
#include "Tree.ts"

#define UI_GRAPH
#define UI_ANIMATION

#ifdef UI_GRAPH

#include "graph/Graph.ts"	
#include "graph/Node.ts"
#include "graph/Connector.ts"
#include "graph/Route.ts"
#include "graph/Controls.ts"

#endif

#ifdef UI_ANIMATION

#include "animation/Controls.ts"
#include "animation/Graph.ts"

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
			
			return new Component(this, mergeOptions(pOptions, {generic: sType}));
		}

		createLayout(eType: EUILayouts = EUILayouts.UNKNOWN, pAttrs?: IUILayoutAttributes): IUILayout;
		createLayout(sType: string = null, pAttrs?: IUILayoutAttributes): IUILayout;
		createLayout(type = null, pAttrs: IUILayoutAttributes = null): IUILayout {
			var pLayout: IUILayout = null;
			
			if (isString(type)) {
				type = type.toLowerCase();
			}

			switch (type) {
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
