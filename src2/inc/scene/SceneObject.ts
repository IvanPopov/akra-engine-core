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
		protected _hasShadow: bool = false;

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

		inline set onclick(
			fn: (pObject: ISceneObject, pViewport: IViewport, 
				pRenderable: IRenderableObject, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(click), fn);
        }

        inline set onmousemove(
        	fn: (pObject: ISceneObject, pViewport: IViewport, 
        		pRenderable: IRenderableObject, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(mousemove), fn);
        }

        inline set onmousedown(
        	fn: (pObject: ISceneObject, pViewport: IViewport, 
        		pRenderable: IRenderableObject, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(mousedown), fn);
        }

        inline set onmouseup(
        	fn: (pObject: ISceneObject, pViewport: IViewport, 
        		pRenderable: IRenderableObject, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(mouseup), fn);
        }

        inline set onmouseover(
        	fn: (pObject: ISceneObject, pViewport: IViewport, 
        		pRenderable: IRenderableObject, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(mouseover), fn);
        }

        inline set onmouseout(
        	fn: (pObject: ISceneObject, pViewport: IViewport, 
        		pRenderable: IRenderableObject, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(mouseout), fn);
        }

        inline set ondragstart(
        	fn: (pObject: ISceneObject, pViewport: IViewport, 
        		pRenderable: IRenderableObject, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(dragstart), fn);
        }

        inline set ondragstop(
        	fn: (pObject: ISceneObject, pViewport: IViewport, 
        		pRenderable: IRenderableObject, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(dragstop), fn);
        }

        inline set ondragging(
        	fn: (pObject: ISceneObject, pViewport: IViewport, 
        		pRenderable: IRenderableObject, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(dragging), fn);
        }


		constructor (pScene: IScene3d, eType: EEntityTypes = EEntityTypes.SCENE_OBJECT) {
			super(pScene, eType);
		}

		getRenderable(i?: uint): IRenderableObject {
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
		    if ((TEST_BIT(this._iObjectFlags, ESceneObjectFlags.k_NewLocalBounds)
		    		        || this.isWorldMatrixNew())) {
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

    	inline get hasShadow(): bool {
    		return this._hasShadow;
    	};

    	inline set hasShadow(bValue: bool){
    		this._hasShadow = bValue;
    		for(var i: uint = 0; i < this.totalRenderable; i++){
    			(<IRenderableObject>this.getRenderable(i)).hasShadow = bValue;
    		}
    	};

    	getObjectFlags(): int {
    		return this._iObjectFlags;
    	}

    	inline prepareForRender(pViewport: IViewport): void {}

    	toString(isRecursive: bool = false, iDepth: uint = 0): string {
#ifdef DEBUG
			if (!isRecursive) {
		        return "<scene_object" + (this._sName ? " " + this._sName : "") + ">" + " height: " + this.worldPosition.y;
		    }

		    return super.toString(isRecursive, iDepth);
#else
			return null;
#endif
    	}

		UNICAST(worldBoundsUpdated, VOID);

		BROADCAST(click, CALL(pViewport, pRenderable, x, y));
		
		BROADCAST(mousemove, CALL(pViewport, pRenderable, x, y));
		BROADCAST(mousedown, CALL(pViewport, pRenderable, x, y));
		BROADCAST(mouseup, CALL(pViewport, pRenderable, x, y));
		BROADCAST(mouseover, CALL(pViewport, pRenderable, x, y));
		BROADCAST(mouseout, CALL(pViewport, pRenderable, x, y));

		BROADCAST(dragstart, CALL(pViewport, pRenderable, x, y));
		BROADCAST(dragstop, CALL(pViewport, pRenderable, x, y));
		BROADCAST(dragging, CALL(pViewport, pRenderable, x, y));
	}

	export inline function isSceneObject(pEntity: IEntity): bool {
		return !isNull(pEntity) && pEntity.type >= EEntityTypes.SCENE_OBJECT && pEntity.type < EEntityTypes.OBJECTS_LIMIT;
	}
}

#endif
