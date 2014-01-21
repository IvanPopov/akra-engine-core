/// <reference path="../../idl/IModelEntry.ts" />
/// <reference path="../SceneNode.ts" />

module akra.scene.objects {
	export class ModelEntry extends SceneNode implements IModelEntry {
		protected _pModelResource: IModel = null;

		get resource(): IModel {
			return this._pModelResource;
		}

		constructor (pScene: IScene3d, pModel: IModel)  {
			super(pScene, EEntityTypes.MODEL_ENTRY);

			this._pModelResource = pModel;
		}

		static isModelEntry(pEntity: IEntity): boolean {
			return !isNull(pEntity) && pEntity.type === EEntityTypes.MODEL_ENTRY;
		}
	}
}
