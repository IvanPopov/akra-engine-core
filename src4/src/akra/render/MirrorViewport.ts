/// <reference path="../idl/IMirrorViewport.ts" />
/// <reference path="Viewport.ts" />
/// <reference path="../scene/Scene3d.ts" />
/// <reference path="LightingUniforms.ts" />

module akra.render {
	import Vec2 = math.Vec2;
	import Vec3 = math.Vec3;
	import Vec4 = math.Vec4;
	import Mat4 = math.Mat4;

	import Color = color.Color;

	var pDepthPixel: IPixelBox = new pixelUtil.PixelBox(new geometry.Box(0, 0, 1, 1), EPixelFormats.FLOAT32_DEPTH, new Uint8Array(4 * 1));
	var pFloatColorPixel: IPixelBox = new pixelUtil.PixelBox(new geometry.Box(0, 0, 1, 1), EPixelFormats.FLOAT32_RGBA, new Uint8Array(4 * 4));
	var pColor: IColor = new Color(0);

	export class MirrorViewport extends Viewport implements IMirrorViewport {
		private _pReflectionPlane: IPlane3d = new geometry.Plane3d(Vec3.temp(0.,1.,0.), -1.24);
		private _pInternal3dViewport: IViewport = null;
		private _v4fReflPlaneStruct: IVec4 = new math.Vec4();

		getReflectionPlane(): IPlane3d {
			return this._pReflectionPlane;
		}

		getInternalViewport(): IViewport {
			return this._pInternal3dViewport;
		}
		
		constructor(pCamera: ICamera, fLeft: float = 0., fTop: float = 0., fWidth: float = 1., fHeight: float = 1., iZIndex: int = 0) {
			super(pCamera, null, fLeft, fTop, fWidth, fHeight, iZIndex);
		}

		_setTarget(pTarget: IRenderTarget): void {
			super._setTarget(pTarget);

			this._pInternal3dViewport = new ForwardViewport(this.getCamera(), this.getLeft(), this.getTop(), this.getWidth(), this.getHeight(), 1001);
			this._pInternal3dViewport._setDefaultRenderMethod(this._csDefaultRenderMethod + "render_plane_culling");
			pTarget.addViewport(this._pInternal3dViewport);
			this._pInternal3dViewport.setAutoUpdated(false);
			(<IShadedViewport>this._pInternal3dViewport).setShadowEnabled(false);
			(<IShadedViewport>this._pInternal3dViewport).setTransparencySupported(false);
			
		}

		_updateImpl(): void {
			this._v4fReflPlaneStruct.set(this._pReflectionPlane.normal, this._pReflectionPlane.distance);
			this.prepareForMirrorRender();
			this._pInternal3dViewport.update();
		}
		_onRenderReflection(pTech: IRenderTechnique, iPass, pRenderable, pSceneObject, pViewport): void {
			pTech.getPass(iPass).setUniform("MESH_CULLING_PLANE", this._v4fReflPlaneStruct);
		}
		private prepareForMirrorRender(): void {
			var pNodeList: IObjectArray<ISceneObject> = this.getCamera().display();

			for (var i: int = 0; i < pNodeList.getLength(); ++i) {
				var pSceneObject: ISceneObject = pNodeList.value(i);

				for (var k: int = 0; k < pSceneObject.getTotalRenderable(); k++) {
					var pRenderable: IRenderableObject = pSceneObject.getRenderable(k);
					var pTechCurr: IRenderTechnique = pRenderable.getTechnique(this._csDefaultRenderMethod);

					var sMethod: string = this._csDefaultRenderMethod + "render_plane_culling";
					var pTechnique: IRenderTechnique = null;

					if (isNull(pRenderable.getTechnique(sMethod))) {
						if (!pRenderable.addRenderMethod(pRenderable.getRenderMethodByName(this._csDefaultRenderMethod), sMethod)) {
							logger.critical("error adding render_plane_culling render method");
						}

						pTechnique = pRenderable.getTechnique(sMethod);
						pTechnique.render._syncSignal(pTechCurr.render);
						pTechnique.copyTechniqueOwnComponentBlend(pTechCurr);
						pTechnique.addComponent("akra.system.render_plane_culling");
						pTechnique.render.connect( this, this._onRenderReflection );
					}
				}
			}
		}
	}
}
