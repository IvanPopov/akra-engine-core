#ifndef RENDERMETHOD_TS
#define RENDERMETHOD_TS

#include "IRenderMethod.ts"
#include "../ResourcePoolItem.ts"

module akra.core.pool.resources {
	export class RenderMethod extends ResourcePoolItem implements IRenderMethod {
		protected _pEffect: IEffect = null;
		protected _pSurfaceMaterial: ISurfaceMaterial = null;
		
		inline get effect(): IEffect{
			return this._pEffect;
		}

		set effect(pEffect: IEffect) {
			if(!isNull(this._pEffect)){
				this.unsync(this._pEffect, EResourceItemEvents.ALTERED);
				this.unsync(this._pEffect, EResourceItemEvents.LOADED);
				this._pEffect.release();
			}

			this._pEffect = pEffect;
			
			if(!isNull(pEffect)){
				this.sync(this._pEffect, EResourceItemEvents.ALTERED);
				this.sync(this._pEffect, EResourceItemEvents.LOADED);
			}

			this._pEffect.addRef();

			this.notifyAltered();
		}

		inline get surfaceMaterial(): ISurfaceMaterial {
			return this._pSurfaceMaterial;
		}

		inline set surfaceMaterial(pMaterial: ISurfaceMaterial) {
			if(!isNull(this._pSurfaceMaterial)){
				this.unsync(this._pSurfaceMaterial, EResourceItemEvents.ALTERED);
				this.unsync(this._pSurfaceMaterial, EResourceItemEvents.LOADED);
				this._pSurfaceMaterial.release();
			}

			this._pSurfaceMaterial = pMaterial;
			
			if(!isNull(pMaterial)){
				this.sync(this._pSurfaceMaterial, EResourceItemEvents.ALTERED);
				this.sync(this._pSurfaceMaterial, EResourceItemEvents.LOADED);
			}

			this._pSurfaceMaterial.addRef();

			this.notifyAltered();
		}

		isEqual(pRenderMethod: IRenderMethod): bool {return false;}
	}

	
}

#endif
