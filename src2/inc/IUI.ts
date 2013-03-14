#ifndef IUI_TS
#define IUI_TS

#include "IScene2d.ts"

module akra {
	IFACE(IUIHTMLNode);
	IFACE(IUIDNDNode);
	IFACE(IUIComponentOptions);

	export interface IUI extends IScene2d {
		createHTMLNode(pElement: HTMLElement): IUIHTMLNode;
		createDNDNode(pElement: HTMLElement): IUIDNDNode;
		//createComponent(eType: EEntityTypes): IUIComponent;
		createComponent(sName: string, pOptions?: IUIComponentOptions): IUIComponent;
		createLayout(eType: EUILayouts, pAttrs?: IUILayoutAttributes): IUILayout;
		createLayout(sType: string, pAttrs?: IUILayoutAttributes): IUILayout;
	}
}

#endif