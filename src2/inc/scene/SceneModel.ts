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

		constructor (pScene: IScene3d) {
			super(pScene, EEntityTypes.MODEL);
		}

		inline get mesh(): IMesh {
			return this._pMesh;
		}

		inline set mesh(pMesh: IMesh) {
			WARNING(pMesh, this);
			if (!isNull(this._pMesh)) {
				this.accessLocalBounds().set(0.01, 0.01, 0.01);	
				this._pMesh = null;
			}

			if (!isNull(pMesh)) {
				this.accessLocalBounds().set(pMesh.boundingBox);
				this._pMesh = pMesh;
			}
		}

		inline get totalRenderable(): uint {
			return isNull(this._pMesh)? 0: this._pMesh.length;
		}

		inline getRenderable(i: uint = 0): IRenderableObject {
			if(isNull(this._pMesh)){
				WARNING(this);
			}
			return this._pMesh.getSubset(i);
		}

		inline hasShadow(): bool {
			return this._pMesh.hasShadow();
		}

		inline setShadow(bValue: bool = true): void {
			this._pMesh.setShadow(bValue);
		}

		toString(isRecursive: bool = false, iDepth: uint = 0): string {
#ifdef DEBUG
		    if (!isRecursive) {
		        var sData: string = "<model" + (this.name? " " + this.name: "") + "(" + String(isNull(this._pMesh)) + ")" +  '>';
		        
		        if (!isNull(this._pMesh)) {
		            sData += "( " + this._pMesh.name + " )";
		        }

		        return sData;
		    }

		    return super.toString(isRecursive, iDepth);
#else
			return null;
#endif
		};

	}

	export inline function isModel(pEntity: IEntity): bool {
		return pEntity.type === EEntityTypes.MODEL;
	}
}

#endif