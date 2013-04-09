#ifndef IMODELENTRY_TS
#define IMODELENTRY_TS

#include "ISceneNode.ts"

module akra {
	IFACE(IModel);

	export interface IModelEntry extends ISceneNode {
		resource: IModel;
	}
}

#endif
