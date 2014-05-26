/// <reference path="Viewport.ts" />

module akra.render {
	export class ViewportWithTransparencyMode extends Viewport {
		private _bTransparencyMode: boolean = false;

		setTransparencyMode(bValue: boolean) {
			this._bTransparencyMode = bValue;
		}

		protected renderAsNormal(csMethod: string, pCamera: ICamera): void {
			var pVisibleObjects: IObjectArray<ISceneObject> = pCamera.display();
			var pRenderable: IRenderableObject;

			for (var i: int = 0; i < pVisibleObjects.getLength(); ++i) {
				pVisibleObjects.value(i).prepareForRender(this);
			}

			for (var i: int = 0; i < pVisibleObjects.getLength(); ++i) {
				var pSceneObject: ISceneObject = pVisibleObjects.value(i);

				for (var j: int = 0; j < pSceneObject.getTotalRenderable(); j++) {
					pRenderable = pSceneObject.getRenderable(j);

					if (!isNull(pRenderable) &&
						!isNull(pRenderable.getRenderMethodByName(csMethod)) &&
						(this._bTransparencyMode || !material.isTransparent(pRenderable.getRenderMethodByName(csMethod).getMaterial()))) {
						pRenderable.render(this, csMethod, pSceneObject);
					}
				}
			}
		}

	}
}