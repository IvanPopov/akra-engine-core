/// <reference path="../../../built/Lib/akra.d.ts" />

/// <reference path="IUIHTMLNode.ts" />
/// <reference path="IUIDNDNode.ts" />

/// <reference path="IUIButton.ts" />
/// <reference path="IUICheckbox.ts" />
/// <reference path="IUICheckboxList.ts" />
/// <reference path="IUILabel.ts" />
/// <reference path="IUIPanel.ts" />
/// <reference path="IUIPopup.ts" />
/// <reference path="IUITabs.ts" />
/// <reference path="IUIVector.ts" />
/// <reference path="IUILayout.ts" />

module akra {
	export interface IUI extends IScene2d {
		createHTMLNode(pElement: HTMLElement): IUIHTMLNode;
		createDNDNode(pElement: HTMLElement): IUIDNDNode;
		//createComponent(eType: EEntityTypes): IUIComponent;
		createComponent(sName: string, pOptions?: IUIComponentOptions): IUIComponent;
		createLayout(eType: EUILayouts, pAttrs?: IUILayoutAttributes): IUILayout;
		createLayout(sType: string, pAttrs?: IUILayoutAttributes): IUILayout;
	}
}
