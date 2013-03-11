#ifndef IUINODE_TS
#define IUINODE_TS

#include "IEntity.ts"
#include "IPoint.ts"
#include "IOffset.ts"

module akra {
	IFACE(IUI);

	export interface IUINode extends IEntity {
		readonly ui: IUI;
	}
}

#endif