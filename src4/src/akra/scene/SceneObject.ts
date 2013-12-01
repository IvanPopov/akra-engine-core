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

	export enum EObjectViewModes {
        k_Shadows = 0x01,
        k_Billboard = 0x02
    }

	export class SceneObject extends SceneNode implements ISceneObject {
		protected _iObjectFlags: int = 0;
		protected _pLocalBounds: IRect3d = new geometry.Rect3d();
		protected _pWorldBounds: IRect3d = new geometry.Rect3d();
		protected _iViewModes: int = 0;


		 get totalRenderable(): uint { return 0; }

		 get worldBounds(): IRect3d {
			return this._pWorldBounds;
		}

		 set worldBounds(pBox: IRect3d) {
			this._pWorldBounds = pBox;
		}

		 get localBounds(): IRect3d {
			return this._pLocalBounds;
		}

		 set onclick(
			fn: (pObject: ISceneObject, pViewport: IViewport, 
				pRenderable: IRenderableObject, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(click), fn);
        }

         set onmousemove(
        	fn: (pObject: ISceneObject, pViewport: IViewport, 
        		pRenderable: IRenderableObject, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(mousemove), fn);
        }

         set onmousedown(
        	fn: (pObject: ISceneObject, pViewport: IViewport, 
        		pRenderable: IRenderableObject, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(mousedown), fn);
        }

         set onmouseup(
        	fn: (pObject: ISceneObject, pViewport: IViewport, 
        		pRenderable: IRenderableObject, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(mouseup), fn);
        }

         set onmouseover(
        	fn: (pObject: ISceneObject, pViewport: IViewport, 
        		pRenderable: IRenderableObject, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(mouseover), fn);
        }

         set onmouseout(
        	fn: (pObject: ISceneObject, pViewport: IViewport, 
        		pRenderable: IRenderableObject, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(mouseout), fn);
        }

         set ondragstart(
        	fn: (pObject: ISceneObject, pViewport: IViewport, 
        		pRenderable: IRenderableObject, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(dragstart), fn);
        }

         set ondragstop(
        	fn: (pObject: ISceneObject, pViewport: IViewport, 
        		pRenderable: IRenderableObject, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(dragstop), fn);
        }

         set ondragging(
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
			bf.setBit(this._iObjectFlags, ESceneObjectFlags.k_NewLocalBounds);
			return this._pLocalBounds;
		}

		 isWorldBoundsNew(): boolean {
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

		update(): boolean {
			//если, обновится мировая матрица узла, то и AABB обновится 
			super.update();
			// do we need to update our local matrix?
		    // derived classes update the local matrix
		    // then call this base function to complete
		    // the update
		    return this.recalcWorldBounds();
		}

		private recalcWorldBounds(): boolean {
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
		        bf.setBit(this._iObjectFlags, ESceneObjectFlags.k_NewWorldBounds);
		        
		        this.worldBoundsUpdated();
		        
		        return true;
		    }

		    return false;
		}

    	 get shadow(): boolean {
    		return (this._iViewModes & EObjectViewModes.k_Shadows) != 0;
    	};

    	 set shadow(bValue: boolean) {
    		bValue ? SET_ALL(this._iViewModes, EObjectViewModes.k_Shadows) : CLEAR_ALL(this._iViewModes, EObjectViewModes.k_Shadows);

    		for(var i: uint = 0; i < this.totalRenderable; i++){
    			(<IRenderableObject>this.getRenderable(i)).shadow = bValue;
    		}
    	};

    	 set billboard(bValue: boolean) {
    		bValue ? SET_ALL(this._iViewModes, EObjectViewModes.k_Billboard) : CLEAR_ALL(this._iViewModes, EObjectViewModes.k_Billboard);
    	}

    	 get billboard(): boolean {
    		return (this._iViewModes & EObjectViewModes.k_Billboard) != 0;
    	}

    	 isBillboard(): boolean {
			return this.billboard;
		}

    	getObjectFlags(): int {
    		return this._iObjectFlags;
    	}

    	 prepareForRender(pViewport: IViewport): void {}

    	toString(isRecursive: boolean = false, iDepth: uint = 0): string {
#ifdef DEBUG
			if (!isRecursive) {
		        return "<scene_object" + (this._sName ? " " + this._sName : "") + ">"/* + " height: " + this.worldPosition.y*/;
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

	export  function isSceneObject(pEntity: IEntity): boolean {
		return !isNull(pEntity) && pEntity.type >= EEntityTypes.SCENE_OBJECT && pEntity.type < EEntityTypes.OBJECTS_LIMIT;
	}
}

#endif
