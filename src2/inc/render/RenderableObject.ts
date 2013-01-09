#ifndef RENDERABLEOBJECT_TS
#define RENDERABLEOBJECT_TS

#include "IRenderableObject.ts"
#include "RenderTechnique.ts"
#define DEFAULT_RM DEFAULT_NAME 
#define DEFAULT_RT DEFAULT_NAME 

module akra.render {

	export interface IRenderTechniqueMap {
		[key: string]: IRenderTechnique;
	}

	export class RenderableObject implements IRenderableObject {
		protected _pRenderer: IRenderer;
		protected _pTechnique: IRenderTechnique = null;
		protected _pTechniqueMap: IRenderTechniqueMap = {};
		protected _bShadow: bool = false;
		protected _iGuid: uint = sid();

		inline get renderMethod(): IRenderMethod {
			return this._pTechnique.getMethod();
		}

		inline set renderMethod(pMethod: IRenderMethod) {
			this.switchRenderMethod(pMethod);
		}
		
		inline get effect(): IEffect { return this._pTechnique.getMethod().effect; }
		inline get surfaceMaterial(): ISurfaceMaterial  { return this._pTechnique.getMethod().surfaceMaterial; }

		inline get material(): IMaterial  { return this.surfaceMaterial.material; }

		constructor () {
			
		}

		_setup(pRenderer: IRenderer, csDefaultMethod: string = null): void {
			this._pRenderer = pRenderer;

			if (this.addRenderMethod(csDefaultMethod) < 0 || this.switchRenderMethod(0) === false) {
				CRITICAL("cannot add & switch render method to default");
			}
		}

		inline getGuid(): uint {
			return this._iGuid;
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

		addRenderMethod(pMethod: IRenderMethod, csName: string = DEFAULT_RM): bool;
		addRenderMethod(csMethod: string, csName: string = DEFAULT_RM): bool;
		addRenderMethod(csMethod: any, csName: string = DEFAULT_RM): bool {
			var pTechnique: IRenderTechnique = new RenderTechnique;
			var pRmgr: IResourcePoolManager = this.getRenderer().getEngine().getResourceManager();
			var pMethod: IRenderMethod;

			if (isNull(csMethod)) {
				return false;
			}

		    if (isString(arguments[0])) {
		        pMethod = pRmgr.createRenderMethod((csMethod) + this.getGuid());

		        if (!isDefAndNotNull(pMethod)) {
		        	return false;
		        }

		        //adding empty, but NOT NULL effect & material
		        pMethod.setMaterial();
		        pMethod.setEffect();
		    }
		    else {
		    	pMethod = <IRenderMethod>arguments[0];
		    }


		    debug_assert(pMethod.getRenderer() === this.getRenderer(),
		                 "Render method should belong to the same engine instance that the renderable object.");

		    pTechnique.setMethod(pMethod);
		    pTechnique.name = csName || DEFAULT_RT;

		    this._pTechniqueMap[csName || DEFAULT_RT] = pTechnique;

		    return true;
		}
		
		switchRenderMethod(pMethod: IRenderMethod): bool;
		switchRenderMethod(csName: string): bool;
		switchRenderMethod(csName: any): bool {
			var pTechnique: IRenderTechnique;
			var sName: string;

			if (isString(arguments[0])) {
				sName = <string>csName;
			}
			else if (isDefAndNotNull(arguments[0])) {
				sName = (<IRenderMethod>arguments[0]).name;

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
		
		inline getRenderMethod(csName: string): IRenderMethod {
			return this._pTechniqueMap[csName || DEFAULT_RT] || null;
		}

		inline hasShadow(): bool {
			return this._bShadow;
		}

		inline setShadow(bValue: bool = true): void {
			this._bShadow = bValue;
		}

		inline isReadyForRender(): bool {
			this._pTechnique.isReady();
		}

		isAllMethodsLoaded(): bool {
			for (var i in this._pTechniqueMap) {
				var pMethod: IRenderMethod = this._pTechniqueMap[i];

				if (!isDefAndNotNull(pMethod) || !pMethod.isResourceLoaded()) {
					return false;
				}
			}

			return true;
		}


		render(csMethod: string = null): void {
			TODO("DRAW!!!!");
		}

	}
}

#endif
