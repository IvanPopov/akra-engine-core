#ifndef MODELENTRY_TS
#define MODELENTRY_TS

#include "IModelEntry.ts"
#include "../SceneNode.ts"

module akra.scene.objects {
	export class ModelEntry extends SceneNode implements IModelEntry {
		protected _pModelResource: IModel = null;

		inline get resource(): IModel {
			return this._pModelResource;
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
