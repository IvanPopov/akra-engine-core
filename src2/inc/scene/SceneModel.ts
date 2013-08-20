#ifndef SCENEMODEL_TS
#define SCENEMODEL_TS

#include "ISceneModel.ts"
#include "model/Mesh.ts"
#include "SceneObject.ts"
#include "IMesh.ts"
#include "IMeshSubset.ts"


module akra.scene {
	export class SceneModel extends SceneObject implements ISceneModel {
		private _pMesh: IMesh = null;
		private _bShow: bool = true;

		inline get visible(): bool {
			return this._bShow;
		}

		inline set visible(bValue: bool) {
			this._bShow = bValue;
		}

		constructor (pScene: IScene3d) {
			super(pScene, EEntityTypes.MODEL);
		}

		inline get mesh(): IMesh {
			return this._pMesh;
		}

		inline set mesh(pMesh: IMesh) {
			if (!isNull(this._pMesh)) {
				this.accessLocalBounds().set(0.01, 0.01, 0.01);	
				this._pMesh.disconnect(this.scene, SIGNAL(postUpdate), SLOT(update));
				this._pMesh = null;
			}

			if (!isNull(pMesh)) {
				this.accessLocalBounds().set(pMesh.boundingBox);
				this._pMesh = pMesh;
				pMesh.connect(this.scene, SIGNAL(postUpdate), SLOT(update));
			}
		}

		inline get totalRenderable(): uint {
			return isNull(this._pMesh) || !this._bShow? 0: this._pMesh.length;
		}

		inline getRenderable(i: uint = 0): IRenderableObject {
			if(isNull(this._pMesh)){
				WARNING(this);
			}
			return this._pMesh.getSubset(i);
		}

		inline get hasShadow(): bool {
			return this._pMesh.hasShadow;
		}

		inline set hasShadow(bValue) {
			this._pMesh.hasShadow = bValue;
		}


		inline isVisible(): bool {
			return this._bShow;
		}

		toString(isRecursive: bool = false, iDepth: uint = 0): string {
#ifdef DEBUG
		    if (!isRecursive) {
		        var sData: string = "<model" + (this.name? " " + this.name: "") + "(" + (isNull(this._pMesh)? 0: this._pMesh.length) + ")" +  '>' + " height: " + this.worldPosition.y;
		        
		        if (!isNull(this._pMesh)) {
		            sData += "( " + this._pMesh.name + " )";
		        }

		        return sData;
		    }

		    return super.toString(isRecursive, iDepth);
#else
			return null;
#endif
		}


	}
	var iUpdatedOnce: int = 0;

	export inline function isModel(pEntity: IEntity): bool {
		return pEntity.type === EEntityTypes.MODEL;
	}
}

#endif