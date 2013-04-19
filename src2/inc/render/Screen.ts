#ifndef RENDERSCREEN_TS
#define RENDERSCREEN_TS

#include "RenderableObject.ts"
#include "data/VertexDeclaration.ts"

module akra.render {
	export class Screen extends RenderableObject {
		protected _pBuffer: IRenderDataCollection;

		constructor(pRenderer: IRenderer) {
			super(ERenderDataTypes.SCREEN);

			var pCollection: IRenderDataCollection = pRenderer.getEngine().createRenderDataCollection(0);	
			var pData: IRenderData = pCollection.getEmptyRenderData(EPrimitiveTypes.TRIANGLESTRIP);

			pData.allocateAttribute(createVertexDeclaration([VE_FLOAT2(DeclUsages.POSITION)]), 
				new Float32Array([-1, -1, -1, 1, 1, -1, 1, 1]));

			this._pRenderData = pData;
			this._setup(pRenderer);
		}
	}
}

#endif