#ifndef OMNILIGHT_TS
#define OMNILIGHT_TS

#include "ITexture.ts"
#include "ShadowCaster.ts"

module akra.scene.light {
	export class OmniLight extends LightPoint implements IOmniLight {
		protected _pDepthTextureCube: ITexture[] = null;
		// protected _pColorTexture: ITexture = null;
		protected _pShadowCasterCube: IShadowCasterCube;

		protected _pOptimizedProjCube: IMat4[] = new Array(6);
		protected _m4fCurrentOptimizedProj: IMat4 = null;

		inline get optimizedProjectionCube(): IMat4[] {
			return this._pOptimizedProjCube;
		}

		inline get currentOptimizedProjection(): IMat4 {
			return this._m4fCurrentOptimizedProj;
		}

		constructor (pScene: IScene3d) {
			super(pScene);

			this._eType = EEntityTypes.LIGHT_OMNI_DIRECTIONAL;
		}

		create(isShadowCaster: bool = true): bool {
			var isOk: bool = super.create();

			var pCaster: IShadowCaster;
			var pCasterCube: IShadowCasterCube = this._pShadowCasterCube;
			
			for (var i = 0; i < 6; i++) {
	            pCaster = pCasterCube[i] = new ShadowCaster(this, i);
	            pCaster.create();
				pCaster.setInheritance(ENodeInheritance.ALL);
				pCaster.attachToParent(this);
	            pCaster.setProjParams(math.PI / 2, 1, 0.01, 1000);
	            pCaster.setParameter(ECameraParameters.CONST_ASPECT, true);
	        }

	        //POSITIVE_X
	        pCasterCube[POSITIVE_X].accessLocalMatrix().set(
	            [ 0, 0, 1, 0, //first column, not row!
	              0, 1, 0, 0,
	              -1, 0, 0, 0,
	              0, 0, 0, 1
	            ]);

	        //NEGATIVE_X
	        pCasterCube[NEGATIVE_X].accessLocalMatrix().set(
	            [ 0, 0, -1, 0, //first column, not row!
	              0, 1, 0, 0,
	              1, 0, 0, 0,
	              0, 0, 0, 1
	            ]);

	        //POSITIVE_Y
	        pCasterCube[POSITIVE_Y].accessLocalMatrix().set(
	            [ 1, 0, 0, 0, //first column, not row!
	              0, 0, 1, 0,
	              0, -1, 0, 0,
	              0, 0, 0, 1
	            ]);

	        //NEGATIVE_Y
	        pCasterCube[NEGATIVE_Y].accessLocalMatrix().set(
	            [ 1, 0, 0, 0, //first column, not row!
	              0, 0, -1, 0,
	              0, 1, 0, 0,
	              0, 0, 0, 1
	            ]);

	        //POSITIVE_Z
	        pCasterCube[POSITIVE_Z].accessLocalMatrix().set(
	            [ -1, 0, 0, 0, //first column, not row!
	              0, 1, 0, 0,
	              0, 0, -1, 0,
	              0, 0, 0, 1
	            ]);

	        //NEGATIVE_Z
	        pCasterCube[NEGATIVE_Z].accessLocalMatrix().set(
	            [ 1, 0, 0, 0, //first column, not row!
	              0, 1, 0, 0,
	              0, 0, 1, 0,
	              0, 0, 0, 1
	            ]);

	        //create optimized projection matrix

	        for (var i = 0; i < 6; i++) {
	            this._pOptimizedProjCube[i] = new Mat4;
	        }

			this.initializeTextures();

			return isOk;
		}

		inline getDepthTextureCube(): ITexture[] {
			return this._pDepthTextureCube;
		}

		inline getDepthTexture(iFace: uint): ITexture {
			return this._pDepthTextureCube[iFace] || null;
		}

		inline getRenderTarget(iFace: uint): ITexture {
			return this._pDepthTextureCube[iFace].getBuffer().getRenderTarget();
		}

		inline getShadowCaster(): IShadowCasterCube {
			return this._pShadowCasterCube;
		}

		private initializeTextures(): void {
			if (!this.isShadowCaster()) {
				return;
			}

			var pEngine: IEngine = this.scene.getManager().getEngine();
			var pResMgr: IResourcePoolManager = pEngine.getResourceManager();
			var iSize: uint = this._iMaxShadowResolution;

			for (var i: int = 0; i < 6; ++ i) {

				if (this._pDepthTextureCube[i]) {
					this._pDepthTextureCube[i].destroy();
				}

				var pDepthTexture: ITexture = this._pDepthTextureCube[i] = 
					pResMgr.createTexture("depth_texture_" + <string>(i) + "_" + <string>this.getGuid());
				pDepthTexture.create(iSize, iSize, 1, Color.BLACK, 0,
					0, ETextureTypes.TEXTURE_2D, EPixelFormats.DEPTH);

				pDepthTexture.setParameter(ETextureParameters.WRAP_S, ETextureWrapModes.CLAMP_TO_EDGE);
				pDepthTexture.setParameter(ETextureParameters.WRAP_T, ETextureWrapModes.CLAMP_TO_EDGE);
				pDepthTexture.setParameter(ETextureParameters.MAG_FILTER, ETextureFilters.LINEAR);
				pDepthTexture.setParameter(ETextureParameters.MIN_FILTER, ETextureFilters.LINEAR);

				this.getRenderTarget(i).addViewport(this._pShadowCasterCube[i]); //TODO: Multiple render target
			}

			// if (this._pColorTexture) {
			// 	this._pColorTexture.destroy();
			// }

			// var pColorTexture: ITexture = pResMgr.createTexture("light_color_texture_" + this.getGuid());
			// pColorTexture(iSize, iSize, 1, Color.BLACK, 0,
			// 	0, ETextureTypes.TEXTURE_2D, EPixelFormats.LUMINANCE);

			// this._pColorTexture = pColorTexture;
		}

		_calculateShadows(): void {
			if (!this.isEnabled() || !this.isShadowCaster()) {
				return;
			}

			for (var i: int = 0; i < 6; ++ i) {
				this.getRenderTarget(i).update();
			}
		}
	}
}

#endif