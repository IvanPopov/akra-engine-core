#ifndef PROJECTLIGHT_TS
#define PROJECTLIGHT_TS

#include "ITexture.ts"
#include "IResourcePoolManager.ts"
#include "ShadowCaster.ts"

module akra.scene.objects {
	export class ProjectLight extends LightPoint implements IProjectLight {
		protected _pDepthTexture: ITexture = null;
		// protected _pColorTexture: ITexture = null;
		protected _pShadowCaster: IShadowCaster;

		protected _m4fOptimizdeProj: IMat4 = null;
		protected _m4fCurrentOptimizedProj: IMat4 = null;

		inline get optimizedProjection(): IMat4 {
			return this._m4fOptimizdeProj;
		}

		inline get currentOptimizedProjection(): IMat4 {
			return this._m4fCurrentOptimizedProj;
		}

		inline get type(): ELightPointTypes {
			return ELightPointTypes.PROJECT;
		}

		constructor (pScene: IScene3d) {
			super(pScene);
		}

		create(isShadowCaster: bool = true): bool {
			var isOk: bool = super.create();

			var pCaster: IShadowCaster = new ShadowCaster(this);
			
			if (!pCaster.create()) {
				ERROR("cannot create shadow caster");
				return false;
			}

			pCaster.setParameter(ECameraParameters.CONST_ASPECT, true);
			pCaster.setInheritance(ENodeInheritance.ALL);
			pCaster.attachToParent(this);

			pCaster.accessLocalMatrix().identity();

			if (this.isShadowCaster()) {
				this._m4fOptimizdeProj = new Mat4();
			}

			this.initializeTextures();

			return isOk;
		}

		inline getDepthTexture(): ITexture {
			return this._pDepthTexture;
		}

		inline getRenderTarget(): ITexture {
			return this._pDepthTexture.getBuffer().getRenderTarget();
		}

		inline getShadowCaster(): IShadowCaster {
			return this._pShadowCaster;
		}

		private initializeTextures(): void {
			if (!this.isShadowCaster()) {
				return;
			}

			var pEngine: IEngine = this.scene.getManager().getEngine();
			var pResMgr: IResourcePoolManager = pEngine.getResourceManager();
			var iSize: uint = this._iMaxShadowResolution;

			if (this._pDepthTexture) {
				this._pDepthTexture.destroy();
			}

			var pDepthTexture: ITexture = this._pDepthTexture = 
				pResMgr.createTexture("depth_texture_" + this.getGuid());
			pDepthTexture.create(iSize, iSize, 1, Color.BLACK, 0,
				0, ETextureTypes.TEXTURE_2D, EPixelFormats.DEPTH);

			pDepthTexture.setParameter(ETextureParameters.WRAP_S, ETextureWrapModes.CLAMP_TO_EDGE);
			pDepthTexture.setParameter(ETextureParameters.WRAP_T, ETextureWrapModes.CLAMP_TO_EDGE);
			pDepthTexture.setParameter(ETextureParameters.MAG_FILTER, ETextureFilters.LINEAR);
			pDepthTexture.setParameter(ETextureParameters.MIN_FILTER, ETextureFilters.LINEAR);

			// if (this._pColorTexture) {
			// 	this._pColorTexture.destroy();
			// }

			// var pColorTexture: ITexture = pResMgr.createTexture("light_color_texture_" + this.getGuid());
			// pColorTexture(iSize, iSize, 1, Color.BLACK, 0,
			// 	0, ETextureTypes.TEXTURE_2D, EPixelFormats.LUMINANCE);

			// this._pColorTexture = pColorTexture;

			this.getRenderTarget().addViewport(this._pShadowCaster); //TODO: Multiple render target
		}

		_calculateShadows(): void {
			if (!this.isEnabled() || !this.isShadowCaster()) {
				return;
			}

			this.getRenderTarget().update();
		}
	}
}

#endif
