#ifndef RENDERABLEOBJECT_TS
#define RENDERABLEOBJECT_TS

#include "IRenderableObject.ts"
#include "RenderTechnique.ts"
#include "IRenderMethod.ts"


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
		protected _bShadow: bool = false;
		protected _eRenderableType: ERenderDataTypes;

		inline get type(): ERenderDataTypes {
			return this._eRenderableType;
		}

		constructor (eType: ERenderDataTypes = ERenderDataTypes.UNKNOWN) {
			this._eRenderableType = eType;
		}

		inline get renderMethod(): IRenderMethod {
			return this._pTechnique.getMethod();
		}

		inline set renderMethod(pMethod: IRenderMethod) {
			this.switchRenderMethod(pMethod);
		}
		
		inline get effect(): IEffect { return this._pTechnique.getMethod().effect; }
		inline get surfaceMaterial(): ISurfaceMaterial  { return this._pTechnique.getMethod().surfaceMaterial; }

		inline get material(): IMaterial  { return this.surfaceMaterial.material; }

		inline get data(): IRenderData { return this._pRenderData; }


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

		    if (isString(arguments[0]) || arguments.length === 0) {
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

		inline hasShadow(): bool {
			return this._bShadow;
		}

		setShadow(bValue: bool = true): void {
			if (this._bShadow != bValue) {
				this._bShadow = bValue;
				this.shadow(bValue);
			}
		}

		inline isReadyForRender(): bool {
			return this._pTechnique.isReady();
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


		render(pViewport: IViewport, csMethod?: string = null, pSceneObject?: ISceneObject = null): void {
			if(!this.switchRenderMethod(csMethod)){
				return;
			}

			this.data._draw(this.getTechnique(), pViewport, this, pSceneObject);
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

		CREATE_EVENT_TABLE(RenderableObject);
		UNICAST(shadow, CALL(bValue));
	}

	export inline function isMeshSubset(pObject: IRenderableObject): bool {
		return pObject.type === ERenderDataTypes.MESH_SUBSET;
	}

	export inline function isScreen(pObject: IRenderableObject): bool {
		return pObject.type === ERenderDataTypes.SCREEN;
	}
}

#endif
