#ifndef IUI_TS
#define IUI_TS

#include "IScene2d.ts"

module akra {
	IFACE(IUIHTMLNode);
	IFACE(IUIDNDNode);

	export interface IUI extends IScene2d {
		dom: IDOM;

		createHTMLNode(pElement: HTMLElement): IUIHTMLNode;
		createDNDNode(pElement: HTMLElement): IUIDNDNode;
	}
}

#endif