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
		private _bShow: boolean = true;

		 get visible(): boolean {
			return this._bShow;
		}

		 set visible(bValue: boolean) {
			this._bShow = bValue;
		}

		constructor (pScene: IScene3d) {
			super(pScene, EEntityTypes.MODEL);
		}

		 get mesh(): IMesh {
			return this._pMesh;
		}

		 set mesh(pMesh: IMesh) {
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

		 get totalRenderable(): uint {
			return isNull(this._pMesh) || !this._bShow? 0: this._pMesh.length;
		}

		 getRenderable(i: uint = 0): IRenderableObject {
			if(isNull(this._pMesh)){
				logger.warn(this);
			}
			return this._pMesh.getSubset(i);
		}

		 get shadow(): boolean {
			return this._pMesh.shadow;
		}

		 set shadow(bValue) {
			this._pMesh.shadow = bValue;
		}


		 isVisible(): boolean {
			return this._bShow;
		}

		toString(isRecursive: boolean = false, iDepth: uint = 0): string {
#ifdef DEBUG
		    if (!isRecursive) {
		        var sData: string = "<model" + (this.name? " " + this.name: "") + "(" + (isNull(this._pMesh)? 0: this._pMesh.length) + ")" +  '>'/* + " height: " + this.worldPosition.y*/;
		        
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

	export  function isModel(pEntity: IEntity): boolean {
		return !isNull(pEntity) && pEntity.type === EEntityTypes.MODEL;
	}
}

#endif