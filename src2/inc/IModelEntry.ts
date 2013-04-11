#ifndef IMODELENTRY_TS
#define IMODELENTRY_TS

#include "ISceneNode.ts"

module akra {
	IFACE(IModel);
	IFACE(IAnimationController);

	export interface IModelEntry extends ISceneNode {
		resource: IModel;
		controller: IAnimationController;
	}
}

#endif
