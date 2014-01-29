/// <reference path="../idl/IUI.ts" />

/// <reference path="HTMLNode.ts" />
/// <reference path="DNDNode.ts" />
/// <reference path="Component.ts" />
/// <reference path="Panel.ts" />
/// <reference path="Popup.ts" />
/// <reference path="Tabs.ts" />
/// <reference path="Button.ts" />
/// <reference path="Menu.ts" />
/// <reference path="Switch.ts" />
/// <reference path="Label.ts" />
/// <reference path="Vector.ts" />
/// <reference path="Layout.ts" />
/// <reference path="Horizontal.ts" />
/// <reference path="Vertical.ts" />
/// <reference path="Slider.ts" />
/// <reference path="Checkbox.ts" />
/// <reference path="CheckboxList.ts" />
/// <reference path="Window.ts" />
/// <reference path="RenderTargetStats.ts" />
/// <reference path="Tree.ts" />
/// <reference path="IDE.ts" />
				 
				 
/// <reference path="CodeEditor.ts" />
				 
/// <reference path="graph/Graph.ts" />	
/// <reference path="graph/Node.ts" />
/// <reference path="graph/Connector.ts" />
/// <reference path="graph/Route.ts" />
/// <reference path="graph/Controls.ts" />
				 
/// <reference path="animation/Controls.ts" />
/// <reference path="animation/Graph.ts" />


module akra.ui {

	config.UI = true;

	export class UI implements IUI {
		guid: uint = guid();

		private _sUIName: string = null;

		getName(): string {
			return this._sUIName;
		}

		protected _pManager: ISceneManager;

		getType(): ESceneTypes { return ESceneTypes.TYPE_2D; }

		constructor(pManager: ISceneManager = null) {
			this._pManager = pManager;
		}

		protected setupSignals(): void {

		}

		getManager(): ISceneManager {
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

			return new Component(this, mergeOptions(pOptions, { generic: sType }));
		}

		createLayout(eType?: EUILayouts, pAttrs?: IUILayoutAttributes): IUILayout;
		createLayout(sType?: string, pAttrs?: IUILayoutAttributes): IUILayout;
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
	}

	export function createUI(pManager?: ISceneManager): IUI {
		return new UI(pManager);
	}
}

