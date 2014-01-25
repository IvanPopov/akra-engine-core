/// <reference path="Viewport.ts" />
//#define DEFAULT_TEXTUREVIEW_NAME ".see_texture"

module akra.render {

	var DEFAULT_TEXTUREVIEW_NAME: string = ".see_texture";

	import Vec4 = math.Vec4;

	export class TextureViewport extends Viewport implements IViewport {
		private _pTargetTexture: ITexture;
		private _pDeferredView: IRenderableObject;
		private _pEffect: IEffect;
		private _v4fMapping: IVec4 = new Vec4(0., 0., 1., 1.);

		getType(): EViewportTypes {
			return EViewportTypes.TEXTUREVIEWPORT; 
		}

		constructor(pTexture: ITexture, fLeft: float = 0., fTop: float = 0., fWidth: float = 1., fHeight: float = 1., iZIndex: int = 0) {
			super(null, DEFAULT_TEXTUREVIEW_NAME, fLeft, fTop, fWidth, fHeight, iZIndex);

			this._pTargetTexture = pTexture;
		}

		getEffect(): IEffect {
			return this._pEffect;
		}

		_setTarget(pTarget: IRenderTarget): void {
			super._setTarget(pTarget);

			var pEngine: IEngine = this.getTarget().getRenderer().getEngine();
			var pResMgr: IResourcePoolManager = pEngine.getResourceManager();
			var pDefferedView: IRenderableObject = new Screen(pEngine.getRenderer());


			var pSeeTextureMethod: IRenderMethod = pResMgr.createRenderMethod(DEFAULT_TEXTUREVIEW_NAME + this.guid);
			var pSeeTextureEffect: IEffect = pResMgr.createEffect(DEFAULT_TEXTUREVIEW_NAME + this.guid);

			pSeeTextureEffect.addComponent("akra.system.texture_to_screen");
			pSeeTextureMethod.setEffect(pSeeTextureEffect);

			pDefferedView.addRenderMethod(pSeeTextureMethod, DEFAULT_TEXTUREVIEW_NAME);

			this._pDeferredView = pDefferedView;
			this._pEffect = pSeeTextureEffect;
		}

		_updateImpl(): void {
			this._pDeferredView.render(this, DEFAULT_TEXTUREVIEW_NAME);
		}

		setMapping(x: uint, y: uint, w: uint, h: uint): void {
			this._v4fMapping.set(x, y, w, h);
			// console.log("set mapping > ", x, y, w, h, this._v4fMapping.toString());
		}

		protected _onRender(pTechnique: IRenderTechnique, iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void {
			var pPass: IRenderPass = pTechnique.getPass(iPass);

			pPass.setTexture("TEXTURE0", this._pTargetTexture);
			pPass.setUniform("VIEWPORT", this._v4fMapping);

			super._onRender(pTechnique, iPass, pRenderable, pSceneObject);
		}
	}
}
