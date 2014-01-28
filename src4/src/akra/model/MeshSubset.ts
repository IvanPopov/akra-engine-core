/// <reference path="../idl/IMeshSubset.ts" />
/// <reference path="../idl/IRenderData.ts" />
/// <reference path="../idl/IMesh.ts" />
/// <reference path="../idl/ISkin.ts" />
/// <reference path="../idl/IRect3d.ts" />
/// <reference path="../idl/ISphere.ts" />
/// <reference path="../idl/IVertexData.ts" />

/// <reference path="../data/VertexElement.ts" />
/// <reference path="../render/RenderableObject.ts" />
/// <reference path="../geometry/geometry.ts" />
/// <reference path="../material/materials.ts" />

/// <reference path="../webgl/CalculateSkin.ts" />

module akra.model {
	import VE = data.VertexElement;
	import DeclUsages = data.Usages;
	import VertexDeclaration = data.VertexDeclaration;

	export class MeshSubset extends render.RenderableObject implements IMeshSubset {
		skinAdded: ISignal<{ (pSubset: IMeshSubset, pSkin: ISkin) }>;

		protected _sName: string = null;
		protected _pMesh: IMesh = null;
		protected _pSkin: ISkin = null;
		protected _pBoundingBox: IRect3d = null;
		protected _pBoundingSphere: ISphere = null;
		protected _isOptimizedSkinned: boolean = false;

		getBoundingBox(): IRect3d {
			return this._pBoundingBox;
		}

		getBoundingSphere(): ISphere {
			return this._pBoundingSphere;
		}

		getSkin(): ISkin {
			return this._pSkin;
		}

		getName(): string {
			return this._sName;
		}

		getMesh(): IMesh {
			return this._pMesh;
		}


		constructor(pMesh: IMesh, pRenderData: IRenderData, sName: string = null) {
			super(ERenderableTypes.MESH_SUBSET);
			this.setup(pMesh, pRenderData, sName);
		}

		protected setupSignals(): void {
			this.skinAdded = this.skinAdded || new Signal(<any>this);

			super.setupSignals();
		}

		protected setup(pMesh: IMesh, pRenderData: IRenderData, sName: string): void {
			debug.assert(this._pMesh === null, "mesh subset already prepared");

			this._pMesh = pMesh;
			this._pRenderData = pRenderData;
			this._sName = sName;

			super._setup(pMesh.getEngine().getRenderer());
		}

		createBoundingBox(): boolean {
			var pVertexData: IVertexData;
			var pNewBoundingBox: IRect3d;

			pNewBoundingBox = new geometry.Rect3d();
			pVertexData = this.getData()._getData(DeclUsages.POSITION);

			if (isNull(pVertexData))
				return false;

			if (geometry.computeBoundingBox(pVertexData, pNewBoundingBox) == false)
				return false;

			this._pBoundingBox = pNewBoundingBox;

			return true;
		}

		deleteBoundingBox(): boolean {
			this._pBoundingBox = null;

			return true;
		}

		showBoundingBox(): boolean {
			var pMaterial: IMaterial;
			var iData: int;
			var iCurrentIndexSet: int;
			var pPoints: float[],
				pIndexes: uint[];

			if (isNull(this._pBoundingBox)) {
				if (!this.createBoundingBox()) {
					return false;
				}
			}

			pPoints = new Array();
			pIndexes = new Array();

			geometry.computeDataForCascadeBoundingBox(this._pBoundingBox, pPoints, pIndexes, 10.0);

			iCurrentIndexSet = this.getData().getIndexSet();

			if (!this.getData().selectIndexSet(".BoundingBox")) {
				if (this.getData().addIndexSet(false, EPrimitiveTypes.LINELIST, ".BoundingBox") == -1) {
					logger.error("could not add index set '.BoundingBox'");
					return false;
				}

				iData = this.getData().allocateData([VE.float3(DeclUsages.POSITION)], new Float32Array(pPoints));

				this.getData().allocateIndex([VE.float(DeclUsages.INDEX0)], new Float32Array(pIndexes));

				this.getData().index(iData, DeclUsages.INDEX0);

				// this.applyFlexMaterial(".MaterialBoundingBox");

				//       //TODO: некорректно задавать так boundingBox, т.к. надо рендерится со своим рендер методом, а его никто не выбирает. 
				// pMaterial = this.getFlexMaterial(".MaterialBoundingBox");
				// pMaterial.emissive = new Color(0.0, 0.0, 1.0, 1.0);
				// pMaterial.diffuse  = new Color(0.0, 0.0, 1.0, 1.0);
			}
			else {
				this.getData()._getData(DeclUsages.POSITION).setData(new Float32Array(pPoints), DeclUsages.POSITION);
			}

			this.getData().setRenderable(this.getData().getIndexSet(), true);
			this.getData().selectIndexSet(iCurrentIndexSet);

			return true;
		}

		isBoundingBoxVisible(): boolean {
			return this.getData().isRenderable(this.getData().findIndexSet(".BoundingBox"));
		}

		hideBoundingBox(): boolean {
			var iCurrentIndexSet: int;
			iCurrentIndexSet = this.getData().getIndexSet();

			if (!this.getData().selectIndexSet(".BoundingBox")) {
				return false;
			}
			else {
				this.getData().setRenderable(this.getData().getIndexSet(), false);
			}

			return this.getData().selectIndexSet(iCurrentIndexSet);
		}

		createBoundingSphere(): boolean {
			var pVertexData: IVertexData;
			var pNewBoundingSphere: ISphere;

			pNewBoundingSphere = new geometry.Sphere();
			pVertexData = this.getData()._getData(DeclUsages.POSITION);

			if (!pVertexData) {
				return false;
			}

			if (!geometry.computeBoundingSphere(pVertexData, pNewBoundingSphere, false, this._pBoundingBox)) {
				return false;
			}

			this._pBoundingSphere = pNewBoundingSphere;

			return true;
		}


		deleteBoundingSphere(): boolean {
			this._pBoundingSphere = null;
			return true;
		}



		showBoundingSphere(): boolean {
			var pMaterial: IMaterial;
			var iData: int;
			var iCurrentIndexSet: int;
			var pPoints: float[], pIndexes: uint[];

			if (isNull(this._pBoundingSphere)) {
				if (!this.createBoundingSphere()) {
					return false;
				}
			}

			pPoints = new Array();
			pIndexes = new Array();
			geometry.computeDataForCascadeBoundingSphere(this._pBoundingSphere, pPoints, pIndexes);

			iCurrentIndexSet = this.getData().getIndexSet();
			if (!this.getData().selectIndexSet(".BoundingSphere")) {
				this.getData().addIndexSet(false, EPrimitiveTypes.LINELIST, ".BoundingSphere");

				iData = this.getData().allocateData([VE.float3(DeclUsages.POSITION)], new Float32Array(pPoints));

				this.getData().allocateIndex([VE.float(DeclUsages.INDEX0)], new Float32Array(pIndexes));
				this.getData().index(iData, DeclUsages.INDEX0);

				// this.applyFlexMaterial(".MaterialBoundingSphere");

				// pMaterial = this.getFlexMaterial(".MaterialBoundingSphere");
				// pMaterial.emissive = new Color(0.0, 0.0, 1.0, 1.0);
				// pMaterial.diffuse  = new Color(0.0, 0.0, 1.0, 1.0);
			}
			else {
				this.getData()._getData(DeclUsages.POSITION).setData(new Float32Array(pPoints), DeclUsages.POSITION);
			}

			this.getData().setRenderable(this.getData().getIndexSet(), true);
			this.getData().selectIndexSet(iCurrentIndexSet);

			return true;
		}


		/*wireframe(bEnable: boolean = true): boolean {
			if(this.getData().findIndexSet(".wireframe") == -1) {
				var ePrimType: EPrimitiveTypes = this.getData().getPrimitiveType();

				if (ePrimType !== EPrimitiveTypes.TRIANGLELIST) {
					logger.warn("wireframe supported only for TRIANGLELIST");
					return false;
				}

				var pIndices: Float32Array = <Float32Array>this.getData().getIndexFor("POSITION");

				var pWFindices: int[] = [];
				var pWFCache: BoolMap = <any>{};
				var pPairs: int[][] = [[0, 1], [1, 2], [2, 0]];

				for (var n = 0; n < pIndices.length / 3; ++ n) {
					var t: int = n * 3;
					for (var i: int = 0; i < pPairs.length; ++ i) {
						
						var i1: int = pPairs[i][0];
						var i2: int = pPairs[i][1];

						var v1: int = pIndices[t + i1];
						var v2: int = pIndices[t + i2];

						if (v2 < v1) {
							var y: int = v2; v1 = v2; v2 = y;
						}

						var k: string = v1 + "_" + v2;

						if (pWFCache[k]) {
							continue;
						}

						pWFCache[k] = true;
						pWFindices.push(v1, v2);
					}
				}

				var iData: int = this.getData().getDataLocation("POSITION");
				var iCurrentIndexSet: int = this.getData().getIndexSet();
				var iWireframeSet: int = this.getData().addIndexSet(false, EPrimitiveTypes.LINELIST, ".wireframe");

				this.getData().allocateIndex([VE.float("WF_INDEX")], new Float32Array(pWFindices));
				this.getData().index(iData, "WF_INDEX", false, 0, true);
				
				this.getData().setRenderable(iWireframeSet, true);
				this.getData().setRenderable(iCurrentIndexSet, false);

				this.getData().selectIndexSet(iCurrentIndexSet);
			}

			var iWireframeSet: int = this.getData().findIndexSet(".wireframe");
			var iCurrentIndexSet: int = 0;

			this.getData().setRenderable(iWireframeSet, bEnable);
			this.getData().setRenderable(iCurrentIndexSet, !bEnable);

			return true;
		}*/

		isBoundingSphereVisible(): boolean {
			return this.getData().isRenderable(this.getData().findIndexSet(".BoundingSphere"));
		}

		hideBoundingSphere(): boolean {
			var iCurrentIndexSet: int = this.getData().getIndexSet();

			if (!this.getData().selectIndexSet(".BoundingSphere")) {
				return false;
			}
			else {
				this.getData().setRenderable(this.getData().getIndexSet(), false);
			}

			return this.getData().selectIndexSet(iCurrentIndexSet);
		}


		computeNormals() {
			//TODO: calc normals
		}

		computeTangents() {
			//TODO: compute normals
		}

		computeBinormals() {
			//TODO: calc binormals
		}

		isSkinned(): boolean {
			return this._pSkin !== null;
		}

		isOptimizedSkinned(): boolean {
			return this.isSkinned() && this._isOptimizedSkinned;
		}

		applyFlexMaterial(sMaterial: string, pMaterialData: IMaterial = null): boolean {
			if (this._pMesh.addFlexMaterial(sMaterial, pMaterialData)) {
				return this.setFlexMaterial(sMaterial);
			}

			return false;
		}

		getFlexMaterial(csName: string): IMaterial;
		getFlexMaterial(iMaterial: int): IMaterial;
		getFlexMaterial(iMaterial): IMaterial {
			return this._pMesh.getFlexMaterial(<int>iMaterial);
		}

		hasFlexMaterial(): boolean {
			return this._pRenderData.hasSemantics(DeclUsages.MATERIAL);
		}

		setFlexMaterial(iMaterial: int): boolean;
		setFlexMaterial(csName: string): boolean;
		setFlexMaterial(iMaterial): boolean {
			var pMaterial: IMaterial = this._pMesh.getFlexMaterial(iMaterial);

			if (isNull(pMaterial)) {
				logger.warn("could not find material <" + iMaterial + "> in sub mesh <" + this.getName() + ">");
				return false;
			}

			var pRenderData: IRenderData = this._pRenderData;
			var pIndexData: IBufferData = pRenderData.getIndices();
			var pMatFlow: IDataFlow = pRenderData._getFlow(DeclUsages.MATERIAL);
			var eSemantics: string = DeclUsages.INDEX10;
			var pIndexDecl: IVertexDeclaration, pFloatArray: Float32Array;
			var iMatFlow: int;
			var iMat: int = (<IFlexMaterial>pMaterial).data.getByteOffset();

			if (pMatFlow) {
				iMatFlow = pMatFlow.flow;
				eSemantics = pMatFlow.mapper.semantics;
				pIndexData = pMatFlow.mapper.data;

				pRenderData._addData((<IFlexMaterial>pMaterial).data, iMatFlow);

				return pRenderData.index(iMat, eSemantics, true);
			}

			pIndexDecl = VertexDeclaration.normalize([VE.float(eSemantics)]);
			pFloatArray = new Float32Array((<IVertexData>pIndexData).getLength());
			iMatFlow = pRenderData._addData((<IFlexMaterial>pMaterial).data);

			debug.assert(iMatFlow >= 0, "cannot add data flow with material for mesh subsset");

			if (!pRenderData.allocateIndex(pIndexDecl, pFloatArray)) {
				logger.warn("cannot allocate index for material!!!");
				return false;
			}

			return pRenderData.index(iMat, eSemantics, true);
		}

		_draw(): void {
			//		    this._pRenderData._draw();
			logger.critical("Need to do.");
		}

		show(): void {
			this.getData().setRenderable(true);
		}

		hide(): void {
			this.getData().setRenderable(false);
		}

		isRenderable(): boolean {
			return this.getData().isRenderable();
		}

		//исходим из того, что данные скина 1:1 соотносятся с вершинами.
		setSkin(pSkin: ISkin): boolean {
			var pRenderData: IRenderData = this.getData();
			var pPosData: IVertexData;
			var pPositionFlow: IDataFlow;
			var pNormalFlow: IDataFlow;
			var pMetaData: Float32Array;
			//мета данные разметки
			var pInfMetaData: IVertexData;
			//адресс мета данных во флотах
			var iInfMetaDataLoc: int;
			//шаг мета данных во флотах
			var iInfMetaDataStride: int;
			/*
			 Получаем данные вершин, чтобы проложить в {W} компоненту адерес мета информации,
			 о влиянии на данную вершины.
			 */

			//получаем поток данных с вершиными
			pPositionFlow = pRenderData._getFlow(DeclUsages.POSITION);
			debug.assert(isDefAndNotNull(pPositionFlow), "skin require position with indices in mesh subset");

			pPosData = pPositionFlow.data;

			//проверяем, что данные еще не подвязаны к другому Skin'у
			if (pPosData.hasSemantics(DeclUsages.BLENDMETA)) {
				//тоже самый skin?
				if (pSkin.isAffect(pPosData)) {
					return true;
				}

				debug.error("mesh subset already has another skin");
				return false;
			}

			//проверяем, что текущий подмеш пренадлежит мешу, на который натягивается skin,
			//или его клону.
			debug.assert(this.getData().getBuffer() == pSkin.getData(),
				"can not bind to skin mesh subset that does not belong skin's mesh.")

		    //подвязывем скин, к данным с вершинами текущего подмеша.
		    //т.е. добавляем разметку в конец каждого пикселя
		    pSkin.attach(pPosData);

			/*
			//получаем данные разметки
			pMetaData = <Float32Array>pPosData.getTypedData(DeclUsages.BLENDMETA);

			//если по каким то причинам нет разметки...
			debug.assert(isDefAndNotNull(pMetaData), "you must specify location for storage blending data");

			//выставляем разметку мета данных вершин, так чтобы они адрессовали сразу на данные
			pInfMetaData = pSkin.getInfluenceMetaData();
			iInfMetaDataLoc = pInfMetaData.byteOffset / EDataTypeSizes.BYTES_PER_FLOAT;
			iInfMetaDataStride = pInfMetaData.stride / EDataTypeSizes.BYTES_PER_FLOAT;

			for (var i: int = 0; i < pMetaData.length; ++ i) {
				pMetaData[i] = iInfMetaDataLoc + i * iInfMetaDataStride;
			}

			//обновляем адреса мета данных вершин
			pPosData.setData(pMetaData, DeclUsages.BLENDMETA);

			*/

			var pDeclaration: IVertexDeclaration = pPosData.getVertexDeclaration();
			var pVEMeta: IVertexElement = pDeclaration.findElement(DeclUsages.BLENDMETA);
			//if BLENDMETA not found
			debug.assert(isDefAndNotNull(pVEMeta), "you must specify location for storage blending data");

			//read all data for acceleration
			pMetaData = new Float32Array(pPosData.getData(0, pDeclaration.stride));

			//выставляем разметку мета данных вершин, так чтобы они адрессовали сразу на данные
			pInfMetaData = pSkin.getInfluenceMetaData();
			iInfMetaDataLoc = pInfMetaData.getByteOffset() / EDataTypeSizes.BYTES_PER_FLOAT;
			iInfMetaDataStride = pInfMetaData.getStride() / EDataTypeSizes.BYTES_PER_FLOAT;

			var iCount: uint = pMetaData.byteLength / pDeclaration.stride;
			var iOffset: uint = pVEMeta.offset / EDataTypeSizes.BYTES_PER_FLOAT;
			var iStride: uint = pDeclaration.stride / EDataTypeSizes.BYTES_PER_FLOAT;

			for (var i: uint = 0; i < iCount; ++i) {
				pMetaData[iOffset + i * iStride] = iInfMetaDataLoc + i * iInfMetaDataStride;
			}

			pPosData.setData(pMetaData, 0, pDeclaration.stride);

			var pIndexData: IVertexData = <IVertexData>pRenderData.getIndices();

			pNormalFlow = pRenderData._getFlow(DeclUsages.NORMAL);

			var pIndex0: Float32Array = <Float32Array>pIndexData.getTypedData(pPositionFlow.mapper.semantics);
			var pIndex1: Float32Array = <Float32Array>pIndexData.getTypedData(pNormalFlow.mapper.semantics);

			var iAdditionPosition: uint = pPosData.getByteOffset();
			var iAdditionNormal: uint = pNormalFlow.data.getByteOffset();

			for (var i: uint = 0; i < pIndex0.length; i++) {
				pIndex0[i] = (pIndex0[i] * EDataTypeSizes.BYTES_PER_FLOAT - iAdditionPosition) / pPositionFlow.data.getStride();
				pIndex1[i] = (pIndex1[i] * EDataTypeSizes.BYTES_PER_FLOAT - iAdditionNormal) / pNormalFlow.data.getStride();
			}

			//update position index
			var pUPPositionIndex: Float32Array = new Float32Array(pPosData.getLength());
			for (var i: uint = 0; i < pPosData.getLength(); i++) {
				pUPPositionIndex[i] = i;
			}

			//update normal index

			var pTmp: any = {};

			var pSkinnedNormalIndex: uint[] = [];
			var pUNPositionIndex: uint[] = []; /*update normal position index*/
			var pUNNormalIndex: uint[] = []; /*update normal normal index*/
			var pDestinationSkinnedNormalIndex: uint[] = [];

			var iCounter: uint = 0;

			for (var i : uint= 0; i < pIndex0.length; i++) {
				var sKey: string = pIndex0[i].toString() + "_" + pIndex1[i];
				if (!isDef(pTmp[sKey])) {
					pTmp[sKey] = iCounter;
					pUNPositionIndex.push(pIndex0[i]);
					pUNNormalIndex.push(pIndex1[i]);
					pSkinnedNormalIndex.push(iCounter);
					pDestinationSkinnedNormalIndex.push(iCounter);
					iCounter++;
				}
				else {
					pSkinnedNormalIndex.push(pDestinationSkinnedNormalIndex[pTmp[sKey]]);
				}
			}

			var iSkinnedPos: uint = pRenderData.allocateData([VE.float3("SKINNED_POSITION"), VE.end(16)], new Float32Array(pPosData.getLength() * 4));
			/*skinned vertices uses same index as vertices*/
			pRenderData.allocateIndex([VE.float("SP_INDEX")], pIndex0);
			pRenderData.index(iSkinnedPos, "SP_INDEX");

			var iSkinnedNorm: uint = pRenderData.allocateData([VE.float3("SKINNED_NORMAL"), VE.end(16)], new Float32Array(pUNNormalIndex.length * 4));
			/*skinned normals uses new index*/
			pRenderData.allocateIndex([VE.float("SN_INDEX")], new Float32Array(pSkinnedNormalIndex));
			pRenderData.index(iSkinnedNorm, "SN_INDEX");

			var iPreviousSet: uint = pRenderData.getIndexSet();

			var iUPIndexSet: uint = pRenderData.addIndexSet(true, EPrimitiveTypes.POINTLIST, ".update_skinned_position");
			pRenderData.allocateIndex([VE.float("UPP_INDEX")], pUPPositionIndex);
			pRenderData.index(pPosData.getByteOffset(), "UPP_INDEX");
			pRenderData.allocateIndex([VE.float("DESTINATION_SP")], pUPPositionIndex);
			pRenderData.index(iSkinnedPos, "DESTINATION_SP");

			var iUNIndexSet: uint = pRenderData.addIndexSet(true, EPrimitiveTypes.POINTLIST, ".update_skinned_normal");
			pRenderData.allocateIndex([VE.float("UNP_INDEX")], new Float32Array(pUNPositionIndex));
			pRenderData.index(pPosData.getByteOffset(), "UNP_INDEX");
			pRenderData.allocateIndex([VE.float("UNN_INDEX")], new Float32Array(pUNNormalIndex));
			pRenderData.index(pRenderData._getFlow(DeclUsages.NORMAL, false).data.getByteOffset(), "UNN_INDEX");
			pRenderData.allocateIndex([VE.float("DESTINATION_SN")], new Float32Array(pDestinationSkinnedNormalIndex));
			pRenderData.index(iSkinnedNorm, "DESTINATION_SN");

			pRenderData.selectIndexSet(iPreviousSet);
			// LOG(pRenderData.toString());

			// pRenderData.selectIndexSet(iUPIndexSet);
			// LOG(pRenderData.toString());

			// pRenderData.selectIndexSet(iUNIndexSet);
			// LOG(pRenderData.toString());

			pRenderData.setRenderable(iUPIndexSet, false);
			pRenderData.setRenderable(iUNIndexSet, false);

			// LOG(iPreviousSet, iUPIndexSet);

			// LOG(pSkinnedNormalIndex);
			// LOG(pUNPositionIndex);
			// LOG(pUNNormalIndex);

			this._pSkin = pSkin;
			this.skinAdded.emit(pSkin);

			return true;
		}

		_calculateSkin(): boolean {
			
			var isOk: boolean = config.WEBGL? webgl.calculateSkin(this): false;
			this._isOptimizedSkinned = isOk;
			return isOk;
		}

		static isMeshSubset(pObject: IRenderableObject): boolean {
			return pObject.getType() === ERenderableTypes.MESH_SUBSET;
		}
	}
}
