#ifndef SCENEOBJECT_TS
#define SCENEOBJECT_TS

#include "ISceneObject.ts"
#include "SceneNode.ts"
#include "geometry/Rect3d.ts"
#include "IRenderableObject.ts"

module akra.scene {

	export enum ESceneObjectFlags {
		k_NewLocalBounds = 0,
		k_NewWorldBounds
	};

	export class SceneObject extends SceneNode implements ISceneObject {
		protected _iObjectFlags: int = 0;
		protected _pLocalBounds: IRect3d = new geometry.Rect3d();
		protected _pWorldBounds: IRect3d = new geometry.Rect3d();
		protected _hasShadows: bool = false;

		inline get totalRenderable(): uint { return 0; }

		inline get worldBounds(): IRect3d {
			return this._pWorldBounds;
		}

		inline set worldBounds(pBox: IRect3d) {
			this._pWorldBounds = pBox;
		}

		inline get localBounds(): IRect3d {
			return this._pLocalBounds;
		}


		constructor (pScene: IScene3d) {
			super(pScene);

			pScene.connect(this, SIGNAL(attached), SLOT(nodeAttachment), EEventTypes.UNICAST);
			pScene.connect(this, SIGNAL(detached), SLOT(nodeDetachment), EEventTypes.UNICAST);
			
			this._eType = EEntityTypes.SCENE_OBJECT;
		}

		inline getRenderable(i?: uint): IRenderableObject {
			return null;
		}

		accessLocalBounds(): IRect3d {
			TRUE_BIT(this._iObjectFlags, ESceneObjectFlags.k_NewLocalBounds);
			return this._pLocalBounds;
		}

		inline isWorldBoundsNew(): bool {
			return TEST_BIT(this._iObjectFlags, ESceneObjectFlags.k_NewLocalBounds);
		}

		destroy(): void {
			super.destroy();
		}

		prepareForUpdate(): void {
			super.prepareForUpdate();

			CLEAR_ALL(this._iObjectFlags, 
				FLAG(ESceneObjectFlags.k_NewLocalBounds) | FLAG(ESceneObjectFlags.k_NewWorldBounds));
		}

		update(): bool {
			//если, обновится мировая матрица узла, то и AABB обновится 
			super.update();
			// do we need to update our local matrix?
		    // derived classes update the local matrix
		    // then call this base function to complete
		    // the update
		    return this.recalcWorldBounds();
		}

		private recalcWorldBounds(): bool {
			// nodes only get their bounds updated
		    // as nessesary
		    if (TEST_BIT(this._iObjectFlags, ESceneObjectFlags.k_NewLocalBounds)
		        || this.isWorldMatrixNew()) {
		        // transform our local rectangle 
		        // by the current world matrix
		        this._pWorldBounds.set(this._pLocalBounds);
		        // make sure we have some degree of thickness
		        if (true) {
		            this._pWorldBounds.x1 = Math.max(this._pWorldBounds.x1, this._pWorldBounds.x0 + 0.01);
		            this._pWorldBounds.y1 = Math.max(this._pWorldBounds.y1, this._pWorldBounds.y0 + 0.01);
		            this._pWorldBounds.z1 = Math.max(this._pWorldBounds.z1, this._pWorldBounds.z0 + 0.01);
		        }
		        this._pWorldBounds.transform(this.worldMatrix);

		        // set the flag that our bounding box has changed
		        TRUE_BIT(this._iObjectFlags, ESceneObjectFlags.k_NewWorldBounds);
		        
		        this.worldBoundsUpdated();
		        
		        return true;
		    }

		    return false;
		}

    	hasShadows(): bool {
    		return this._hasShadows;
    	}

    	setShadows(bValue: bool = true): void {
    		this._hasShadows = bValue;
    	}

    	getObjectFlags(): int {
    		return this._iObjectFlags;
    	}

    	toString(isRecursive: bool = false, iDepth: uint = 0): string {
#ifdef DEBUG
			if (!isRecursive) {
		        return "<scene_object" + (this._sName ? " " + this._sName : "") + ">";
		    }

		    return super.toString(isRecursive, iDepth);
#else
			return null;
#endif
    	}

		BEGIN_EVENT_TABLE(SceneObject);
			UNICAST(worldBoundsUpdated, VOID);
		END_EVENT_TABLE();
	}

	export inline function isSceneObject(pEntity: IEntity): bool {
		return pEntity.type >= EEntityTypes.SCENE_OBJECT && pEntity.type < EEntityTypes.OBJECTS_LIMIT;
	}
}

#endif
