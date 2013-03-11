#ifndef IUILIST_TS
#define IUILIST_TS

#include "IUINode.ts"

module akra {
	export interface IUIList extends IUINode {
		set(pList: NodeList): IUIList;
	}
}

#endif
