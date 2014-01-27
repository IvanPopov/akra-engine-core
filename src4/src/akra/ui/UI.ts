/// <reference parg="IUI.ts" />

/// <reference parg="common.ts" />
/// <reference parg="HTMLNode.ts" />
/// <reference parg="DNDNode.ts" />
/// <reference parg="Component.ts" />
/// <reference parg="Panel.ts" />
/// <reference parg="Popup.ts" />
/// <reference parg="Tabs.ts" />
/// <reference parg="Button.ts" />
/// <reference parg="Menu.ts" />
/// <reference parg="Switch.ts" />
/// <reference parg="Label.ts" />
/// <reference parg="Vector.ts" />
/// <reference parg="Layout.ts" />
/// <reference parg="Horizontal.ts" />
/// <reference parg="Vertical.ts" />
/// <reference parg="Slider.ts" />
/// <reference parg="Checkbox.ts" />
/// <reference parg="CheckboxList.ts" />
/// <reference parg="Window.ts" />
/// <reference parg="RenderTargetStats.ts" />
/// <reference parg="Tree.ts" />


/// <reference parg="CodeEditor.ts" />

/// <reference parg="graph/Graph.ts" />	
/// <reference parg="graph/Node.ts" />
/// <reference parg="graph/Connector.ts" />
/// <reference parg="graph/Route.ts" />
/// <reference parg="graph/Controls.ts" />

/// <reference parg="animation/Controls.ts" />
/// <reference parg="animation/Graph.ts" />


module akra.ui {

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
}

