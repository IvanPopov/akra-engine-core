/// <reference path="RenderableObject.ts" />
/// <reference path="../data/VertexDeclaration.ts" />

module akra.render {
	import VE = data.VertexElement;
	import DeclUsages = data.Usages;

	export class Screen extends RenderableObject {
		protected _pBuffer: IRenderDataCollection;

		constructor(pRenderer: IRenderer, pCollection?: IRenderDataCollection) {
			super(ERenderableTypes.SCREEN);

			if (!isDefAndNotNull(pCollection)) {
				pCollection = pRenderer.getEngine().createRenderDataCollection(0);	
			}
			
			var pData: IRenderData = pCollection.getEmptyRenderData(EPrimitiveTypes.TRIANGLESTRIP);

			pData.allocateAttribute(data.VertexDeclaration.normalize([VE.float2(DeclUsages.POSITION)]), 
				new Float32Array([-1, -1, -1, 1, 1, -1, 1, 1]));

			this._pRenderData = pData;
			this._setup(pRenderer);
		}
	}
}
