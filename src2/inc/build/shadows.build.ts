#ifndef DSBUILD_TS
#define DSBUILD_TS

module akra.build {\
	export class ShadowBuild extends BuildScenario implements ISceneBuilder {

		build(pLightCamera: ICamera, pViewport: IViewport): bool {
			var pRenderer: IRenderer = this.getRenderer();
			var pEngine: IEngine = this.getEngine();
			var pScene: IScene3d = pCamera.scene;

			var pVisibleObjects: ISceneObject[] = this.findVisibleObjects(pCamera);
			var pRenderable: IRenderableObject;

			for (var i: int = 0; i < pVisibleObjects.length; ++ i) {
				pRenderable = pVisibleObjects[i].getRenderable();

				if (pRenderable.switchRenderMethod(SHADOW_RENDER_METHOD)) {
					pRenderable.render();
				}
			}
			
			return true;
		}
	}
}

#endif

