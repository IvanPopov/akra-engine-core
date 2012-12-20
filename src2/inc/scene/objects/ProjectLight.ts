#ifndef PROJECTLIGHT
#define PROJECTLIGHT

module akra.scene.objects {
	export class ProjectLight extends LightPoint implements IProjectLight {
		protected _pDepthTexture: ITexture = null;
		protected _pColorTexture: ITexture = null;
		protected _pShadowCaster: IShadowCaster;

		protected _m4fOptimizdeProj: IMat4 = null;
		protected _m4fCurrentOptimizedProj: IMat4 = null;


		constructor (pScene: IScene3d) {
			super(pScene);
		}

		create(isShadowCaster: bool = true): bool {
			var isOk: bool = super.create();

			var pCaster: IShadowCaster = new ShadowCaster(this.scene);
			
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

		private initializeTextures(): void {
			if (!this.isShadowCaster()) {
				return;
			}

			var pEngine: IEngine = this.scene.getManager().getEngine();
			var pResMgr: IResourcePoolManager = pEngine.getResourceManager();
			var iSize: uint = this._iMaxShadowResolution;

			var pDepthTexture: ITexture = pResMgr.createTexture("depth_texture_" + this.getGuid());
			pDepthTexture.create(iSize, iSize, 1, Color.BLACK, 0, 0, ETextureTypes.TEXTURE_2D, DEPTH);

		}
	}
}

#endif
