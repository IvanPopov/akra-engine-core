
/// <reference path="IScene2d.ts" />


/// <reference path="IUIHTMLNode.ts" />
/// <reference path="IUIDNDNode.ts" />

module akra {
	interface IUI extends IScene2d {
		createHTMLNode(pElement: HTMLElement): IUIHTMLNode;
		createDNDNode(pElement: HTMLElement): IUIDNDNode;
		//createComponent(eType: EEntityTypes): IUIComponent;
		createComponent(sName: string, pOptions?: IUIComponentOptions): IUIComponent;
		createLayout(eType: EUILayouts, pAttrs?: IUILayoutAttributes): IUILayout;
		createLayout(sType: string, pAttrs?: IUILayoutAttributes): IUILayout;
	}
}
