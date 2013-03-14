#ifndef RENDERMETHOD_TS
#define RENDERMETHOD_TS

#include "IRenderMethod.ts"
#include "../ResourcePoolItem.ts"

module akra.core.pool.resources {
	export class RenderMethod extends ResourcePoolItem implements IRenderMethod {
		protected _pEffect: IEffect = null;
		surfaceMaterial: ISurfaceMaterial = null;
		
		inline get effect(): IEffect{
			return this._pEffect;
		}

		set effect(pEffect: IEffect) {
			if(!isNull(this._pEffect)){
				this.disconnect(this._pEffect, SIGNAL(altered), SLOT(_updateEffect), EEventTypes.BROADCAST);
			}

			this._pEffect = pEffect;
			
			if(!isNull(pEffect)){
				this.connect(pEffect, SIGNAL(altered), SLOT(_updateEffect), EEventTypes.BROADCAST);
			}

			this.notifyAltered();
		}

		isEqual(pRenderMethod: IRenderMethod): bool {return false;}

		_updateEffect(pEffect: IEffect): void {
			this.notifyAltered();
		}
	}

	
}

#endif
