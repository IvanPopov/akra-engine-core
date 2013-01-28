#ifndef MESHSUBSET_TS
#define MESHSUBSET_TS

#include "IMeshSubset.ts"
#include "IRenderData.ts"
#include "IMesh.ts"
#include "ISkin.ts"
#include "IRect3d.ts"
#include "ISphere.ts"
#include "IVertexData.ts"

module akra.model {
	export class MeshSubset extends render.RenderableObject implements IMeshSubset {
		protected _pRenderData: IRenderData = null;
		protected _sName: string = null;
		protected _pMesh: IMesh = null;
		protected _pSkin: ISkin = null;
		protected _pBoundingBox: IRect3d = null;
		protected _pBoundingSphere: ISphere = null;

		inline get boundingBox(): IRect3d { return this._pBoundingBox; }
		inline get boundingSphere(): IRect3d { return this._pBoundingSphere; }

		constructor (pMesh: IMesh, pRenderData: IRenderData, sName: string = null) {
			this.setup(pMesh, pRenderData, sName);
		}

		protected setup(pMesh: IMesh, pRenderData: IRenderData, sName: string): void {
			debug_assert(this._pMesh === null, "mesh subset already prepared");
			
			this._pMesh = pMesh;
			this._pRenderData = pRenderData;
			this._sName = sName;

			super.setup(pMesh.getEngine(), sName);
		}

		createBoundingBox(): bool {
			var pVertexData: IVertexData;
			var pNewBoundingBox: IRect3d;

			pNewBoundingBox = new geometry.Rect3d();
			pVertexData = this.data.getData(DeclUsages.POSITION);

			if(isNull(pVertexData))
				return false;

			if(geometry.computeBoundingBox(pVertexData, pNewBoundingBox) == false)
				return false;

			this._pBoundingBox = pNewBoundingBox;

			return true;
		}

		deleteBoundingBox(): bool {
			this._pBoundingBox = null;

			return true;
		}

		showBoundingBox(): bool {
			var pMaterial: IMaterial;
			var iData: int;
			var iCurrentIndexSet: int;
			var pPoints: float[], 
				pIndexes: uint [];

			if (isNull(this._pBoundingBox)) {
				return false;
			}

			pPoints = new Array();
			pIndexes = new Array();

			geometry.computeDataForCascadeBoundingBox(this._pBoundingBox, pPoints, pIndexes, 10.0);

			iCurrentIndexSet = this.data.getIndexSet();

			if(!this.data.selectIndexSet(".BoundingBox")) {
				this.data.addIndexSet(true, EPrimitiveTypes.LINELIST, ".BoundingBox");

				iData = this.data.allocateData(
						[VE_FLOAT3(DeclUsages.POSITION)],
						new Float32Array(pPoints));

				this.data.allocateIndex([VE_FLOAT(DeclUsages.INDEX0)], new Float32Array(pIndexes));

				this.data.index(iData,DeclUsages.INDEX0);

				this.applyFlexMaterial(".MaterialBoundingBox");

		        //TODO: некорректно задавать так boundingBox, т.к. надо рендерится со своим рендер методом, а его никто не выбирает. 
				pMaterial = this.getFlexMaterial(".MaterialBoundingBox");
				pMaterial.emissive = new a.Color4f(0.0, 0.0, 1.0, 1.0);
				pMaterial.diffuse  = new a.Color4f(0.0, 0.0, 1.0, 1.0);
			}
			else {
				this.data.getData(DeclUsages.POSITION).setData(new Float32Array(pPoints),DeclUsages.POSITION);
			}

			this.data.setRenderable();
			this.data.selectIndexSet(iCurrentIndexSet);

			return true;
		}

		hideBoundingBox(): bool {
			var iCurrentIndexSet: int;
			iCurrentIndexSet = this.data.getIndexSet();

			if(!this.data.selectIndexSet(".BoundingBox")) {
				return false;
			}
			else {
				this.data.setRenderable(this.data.getIndexSet(), false);
			}

			return this.data.selectIndexSet(iCurrentIndexSet);
		}


		BEGIN_EVENT_TABLE(MeshSubset);
		END_EVENT_TABLE();
	}
}

#endif

