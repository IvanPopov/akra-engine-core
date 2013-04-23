#ifndef MODELENTRY_TS
#define MODELENTRY_TS

#include "IModelEntry.ts"
#include "../SceneNode.ts"

module akra.scene.objects {
	export class ModelEntry extends SceneNode implements IModelEntry {
		protected _pModelResource: IModel = null;
		protected _pController: IAnimationController = null;

		inline get resource(): IModel {
			return this._pModelResource;
		}

		inline get controller(): IAnimationController {
			return this._pController;
		}

		inline set controller(pController: IAnimationController) {
			this._pController = pController;
		}

		constructor (pScene: IScene3d, pModel: IModel)  {
			super(pScene, EEntityTypes.MODEL_ENTRY);

			this._pModelResource = pModel;
		}
	}

	export function isModelEntry(pEntity: IEntity): bool {
		return !isNull(pEntity) && pEntity.type === EEntityTypes.MODEL_ENTRY;
	}
}

#endif
