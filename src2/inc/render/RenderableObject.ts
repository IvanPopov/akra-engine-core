#ifndef RENDERABLEOBJECT_TS
#define RENDERABLEOBJECT_TS

#include "IRenderableObject.ts"
#include "RenderTechnique.ts"
#include "IRenderMethod.ts"
#include "ShadowViewport.ts"

#define DEFAULT_RM DEFAULT_NAME 
#define DEFAULT_RT DEFAULT_NAME 

module akra.render {

	export interface IRenderTechniqueMap {
		[key: string]: IRenderTechnique;
	}

	export class RenderableObject implements IRenderableObject {
		protected _pRenderData: IRenderData = null;
		protected _pRenderer: IRenderer;
		protected _pTechnique: IRenderTechnique = null;
		protected _pTechniqueMap: IRenderTechniqueMap = {};
		protected _eRenderableType: ERenderDataTypes;
		protected _bShadow: bool = true;
		protected _bVisible: bool = true;
		protected _bFrozen: bool = false;

		inline get type(): ERenderDataTypes { return this._eRenderableType; }
		inline get renderMethod(): IRenderMethod { return this._pTechnique.getMethod(); }
		inline set renderMethod(pMethod: IRenderMethod) {this.switchRenderMethod(pMethod); }
		inline get effect(): IEffect { return this._pTechnique.getMethod().effect; }
		inline get surfaceMaterial(): ISurfaceMaterial  { return this._pTechnique.getMethod().surfaceMaterial; }
		inline get material(): IMaterial  { return this.surfaceMaterial.material; }
		inline get data(): IRenderData { return this._pRenderData; }
		inline get hasShadow(): bool { return this._bShadow; }
		
		inline set hasShadow(bShadow: bool) {
			if(this._bShadow !== bShadow){
				this._bShadow = bShadow;
				this.shadow(bShadow);
			}
		}

		inline set onclick(
			fn: (pRenderable: IRenderableObject, pViewport: IViewport, 
				pObject: ISceneObject, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(click), fn);
        }

        inline set onmousemove(
        	fn: (pRenderable: IRenderableObject, pViewport: IViewport, 
        		pObject: ISceneObject, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(mousemove), fn);
        }

        inline set onmousedown(
        	fn: (pRenderable: IRenderableObject, pViewport: IViewport, 
        		pObject: ISceneObject, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(mousedown), fn);
        }

        inline set onmouseup(
        	fn: (pRenderable: IRenderableObject, pViewport: IViewport, 
        		pObject: ISceneObject, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(mouseup), fn);
        }

        inline set onmouseover(
        	fn: (pRenderable: IRenderableObject, pViewport: IViewport, 
        		pObject: ISceneObject, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(mouseover), fn);
        }

        inline set onmouseout(
        	fn: (pRenderable: IRenderableObject, pViewport: IViewport, 
        		pObject: ISceneObject, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(mouseout), fn);
        }

        inline set ondragstart(
        	fn: (pRenderable: IRenderableObject, pViewport: IViewport, 
        		pObject: ISceneObject, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(dragstart), fn);
        }

		inline set ondragstop(
        	fn: (pRenderable: IRenderableObject, pViewport: IViewport, 
        		pObject: ISceneObject, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(dragstop), fn);
        }

        inline set ondragging(
        	fn: (pRenderable: IRenderableObject, pViewport: IViewport, 
        		pObject: ISceneObject, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(dragging), fn);
        }


		constructor (eType: ERenderDataTypes = ERenderDataTypes.UNKNOWN) {
			this._eRenderableType = eType;
		}

		inline _setRenderData(pData: IRenderData): void {
			this._pRenderData = pData;
		}

		_setup(pRenderer: IRenderer, csDefaultMethod: string = null): void {
			this._pRenderer = pRenderer;

			if (!this.addRenderMethod(csDefaultMethod) || this.switchRenderMethod(null) === false) {
				CRITICAL("cannot add & switch render method to default");
			}
		}

		inline getRenderer(): IRenderer {
			return this._pRenderer;
		}

		destroy(): void {
			this._pRenderer = null;
			this._pTechnique = null;

			for (var i in this._pTechniqueMap) {
				this._pTechniqueMap[i].destroy();
			}

			this._pTechniqueMap = null;
		}

		addRenderMethod(pMethod: IRenderMethod, csName: string = DEFAULT_RT): bool;
		addRenderMethod(csMethod: string, csName: string = DEFAULT_RT): bool;
		addRenderMethod(csMethod: any, csName: string = DEFAULT_RT): bool {
			var pTechnique: IRenderTechnique = new RenderTechnique;
			var pRmgr: IResourcePoolManager = this.getRenderer().getEngine().getResourceManager();
			var pMethod: IRenderMethod = null;
			
			if (isNull(csMethod)) {
				csMethod = DEFAULT_RM;
			}

		    if (isString(csMethod) || arguments.length === 0) {
		        pMethod = pRmgr.createRenderMethod((csMethod) + this.getGuid());

		        if (!isDefAndNotNull(pMethod)) {
		        	return false;
		        }

		        //adding empty, but NOT NULL effect & material
		        pMethod.surfaceMaterial = pRmgr.createSurfaceMaterial(csMethod + ".material." + this.getGuid());
		        pMethod.effect = pRmgr.createEffect(csMethod + ".effect." + this.getGuid());
		    }
		    else {
		    	pMethod = <IRenderMethod>arguments[0];
		    }


		    debug_assert(pMethod.getManager().getEngine().getRenderer() === this._pRenderer,
		                 "Render method should belong to the same engine instance that the renderable object.");

		    pTechnique.setMethod(pMethod);
		    //pTechnique.name = csName || DEFAULT_RT;

		    this._pTechniqueMap[csName || DEFAULT_RT] = pTechnique;

		    return true;
		}
		
		switchRenderMethod(pMethod: IRenderMethod): bool;
		switchRenderMethod(csName: string): bool;
		switchRenderMethod(csName: any): bool {
			var pTechnique: IRenderTechnique;
			var sName: string = null;

			if(isNull(arguments[0])) {
				sName = DEFAULT_RT;
			}
			else if (isString(arguments[0])) {
				sName = <string>csName;
			}
			else if (isDefAndNotNull(arguments[0])) {
				sName = (<IRenderMethod>arguments[0]).findResourceName();

				if (!isDefAndNotNull(this._pTechniqueMap[sName])) {
					if (!this.addRenderMethod(<IRenderMethod>arguments[0], sName)) {
						return false;
					}
				}
			}
			
			pTechnique = this._pTechniqueMap[sName];

			if (isDefAndNotNull(pTechnique)) {
				this._pTechnique = pTechnique;
				return true;
			}

			return false;
		}
		
		removeRenderMethod(csName: string): bool {
			var pTechnique: IRenderTechnique = this._pTechniqueMap[csName];

			if (isDefAndNotNull(pTechnique)) {
				delete this._pTechniqueMap[csName || DEFAULT_RT];
				return true
			}

		    return false;
		}


		
		inline getRenderMethod(csName: string = null): IRenderMethod {
			var pTechnique: IRenderTechnique = this._pTechniqueMap[csName || DEFAULT_RT];
			return pTechnique? pTechnique.getMethod(): null;
		}

		inline getRenderMethodDefault(): IRenderMethod {
			return this.getRenderMethod(DEFAULT_RM);
		}

		inline isReadyForRender(): bool {
			return this._bVisible && this._pTechnique.isReady();
		}

		isAllMethodsLoaded(): bool {
			for (var i in this._pTechniqueMap) {
				var pMethod: IRenderMethod = this._pTechniqueMap[i].getMethod();

				if (!isDefAndNotNull(pMethod) || !pMethod.isResourceLoaded()) {
					return false;
				}
			}

			return true;
		}

		inline isFrozen(): bool {
			return this._bFrozen;
		}


		render(pViewport: IViewport, csMethod?: string = null, pSceneObject?: ISceneObject = null): void {
			if (!this.isReadyForRender()) {
				return;
			}
			
			if (!this.switchRenderMethod(csMethod)) {
				//debug_error("could not switch render method <" + csMethod + ">");
				return;
			}

			this.beforeRender(pViewport);
			
			this.data._draw(this._pTechnique, pViewport, this, pSceneObject);
		}

		inline getTechnique(sName: string = DEFAULT_RT): IRenderTechnique {
			return this._pTechniqueMap[sName] || null;
		}

		inline getTechniqueDefault(): IRenderTechnique{
			return this.getTechnique(DEFAULT_RT);
		}

		_draw(): void {
			ERROR("RenderableObject::_draw() pure virtual method() isn't callable!!");
		}

		inline isVisible(): bool {
			return this._bVisible;
		}
		inline setVisible(bVisible: bool = true): void {
			this._bVisible = bVisible;
		}

		CREATE_EVENT_TABLE(RenderableObject);
		
		UNICAST(shadow, CALL(bValue));
		UNICAST(beforeRender, CALL(pViewport));

		BROADCAST(click, CALL(pViewport, pObject, x, y));
		BROADCAST(mousemove, CALL(pViewport, pObject, x, y));
		BROADCAST(mousedown, CALL(pViewport, pObject, x, y));
		BROADCAST(mouseup, CALL(pViewport, pObject, x, y));
		BROADCAST(mouseover, CALL(pViewport, pObject, x, y));
		BROADCAST(mouseout, CALL(pViewport, pObject, x, y));
		BROADCAST(dragstart, CALL(pViewport, pObject, x, y));
		BROADCAST(dragstop, CALL(pViewport, pObject, x, y));
		BROADCAST(dragging, CALL(pViewport, pObject, x, y));
	}

	export inline function isMeshSubset(pObject: IRenderableObject): bool {
		return pObject.type === ERenderDataTypes.MESH_SUBSET;
	}

	export inline function isScreen(pObject: IRenderableObject): bool {
		return pObject.type === ERenderDataTypes.SCREEN;
	}
}

#endif
