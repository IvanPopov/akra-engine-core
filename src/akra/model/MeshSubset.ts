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

	import Vec3 = math.Vec3;
	import Mat4 = math.Mat4;
	import Vec4 = math.Vec4;

	export class MeshSubset extends render.RenderableObject implements IMeshSubset {
		skinAdded: ISignal<{ (pSubset: IMeshSubset, pSkin: ISkin): void; }>;
		skinRemoved: ISignal<{ (pSubset: IMeshSubset, pSkin: ISkin): void; }>;
		transformed: ISignal<{ (pSubset: IMeshSubset, pSkin: ISkin): void; }>;

		private _sName: string = null;
		private _pMesh: IMesh = null;
		private _pSkin: ISkin = null;

		//in local coords
		private _pBoundingBox: IRect3d = null;
		private _pBoundingSphere: ISphere = null;

		//is this mesh uses precomputed skin?
		private _isOptimizedSkinned: boolean = false;

		private _pInitialGeometryBoundingBox = null;
		private _pInitialGeometryBoundingSphere = null;


		//list of local bounding boxes for current skin.
		//this boxes neeeds for calculating common bounding box;
		private _pSkinLocalBounds: IRect3d[] = null;

		constructor(pMesh: IMesh, pRenderData: IRenderData, sName: string = null) {
			super(ERenderableTypes.MESH_SUBSET);
			this.setup(pMesh, pRenderData, sName);
		}


		final getBoundingBox(): IRect3d {
			if (isNull(this._pBoundingBox)) {
				this.createBoundingBox();
			}

			return this._pBoundingBox;
		}

		final getBoundingSphere(): ISphere {
			if (isNull(this._pBoundingSphere)) {
				this.createBoundingSphere();
			}
			
			return this._pBoundingSphere;
		}

		getInitialGeometryBoundingBox(): IRect3d {
			if (isNull(this._pInitialGeometryBoundingBox)) {
				logger.assert(this.createBoundingBox(), "could not compute bounding box");
			}

			return this._pInitialGeometryBoundingBox;
		}

		getInitialGeometryBoundingSphere(): ISphere {
			if (isNull(this._pInitialGeometryBoundingSphere)) {
				logger.assert(this.createBoundingSphere(), "could not compute bounding sphere");
			}

			return this._pInitialGeometryBoundingSphere;
		}

		final getSkin(): ISkin {
			return this._pSkin;
		}

		final getName(): string {
			return this._sName;
		}

		final getMesh(): IMesh {
			return this._pMesh;
		}

		protected setupSignals(): void {
			this.skinAdded = this.skinAdded || new Signal(this);
			this.skinRemoved = this.skinRemoved || new Signal(this);
			this.transformed = this.transformed || new Signal(this);

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

			this._pInitialGeometryBoundingBox = pNewBoundingBox;

			if (isNull(this._pBoundingBox)) {
				this._pBoundingBox = pNewBoundingBox;
			}

			return true;
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

			this._pInitialGeometryBoundingSphere = pNewBoundingSphere;

			if (isNull(this._pBoundingSphere)) {
				this._pBoundingSphere = pNewBoundingSphere;
			}

			return true;
		}

		deleteBoundingBox(): boolean {
			this._pBoundingBox = null;

			return true;
		}
		deleteBoundingSphere(): boolean {
			this._pBoundingSphere = null;
			return true;
		}

		_showBoundingBox(): boolean {
			if (config.DEBUG) {
				return false;
			}

			//TODO: write method correctly...

			/*
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
			}
			else {
				this.getData()._getData(DeclUsages.POSITION).setData(new Float32Array(pPoints), DeclUsages.POSITION);
			}

			this.getData().setRenderable(this.getData().getIndexSet(), true);
			this.getData().selectIndexSet(iCurrentIndexSet);

			return true;*/

			return false;
		}
		_isBoundingBoxVisible(): boolean {
			return config.DEBUG && this.getData().isRenderable(this.getData().findIndexSet(".BoundingBox"));
		}
		_hideBoundingBox(): boolean {
			if (config.DEBUG) {
				return false;
			}

			/*
			var iCurrentIndexSet: int;
			iCurrentIndexSet = this.getData().getIndexSet();

			if (!this.getData().selectIndexSet(".BoundingBox")) {
				return false;
			}
			else {
				this.getData().setRenderable(this.getData().getIndexSet(), false);
			}

			return this.getData().selectIndexSet(iCurrentIndexSet);
			*/

			return false;
		}
		
		_showBoundingSphere(): boolean {
			if (config.DEBUG) {
				return false;
			}

			/*
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
			}
			else {
				this.getData()._getData(DeclUsages.POSITION).setData(new Float32Array(pPoints), DeclUsages.POSITION);
			}

			this.getData().setRenderable(this.getData().getIndexSet(), true);
			this.getData().selectIndexSet(iCurrentIndexSet);

			return true;
			*/

			return false;
		}
		_isBoundingSphereVisible(): boolean {
			return config.DEBUG && this.getData().isRenderable(this.getData().findIndexSet(".BoundingSphere"));
		}
		_hideBoundingSphere(): boolean {
			if (config.DEBUG) {
				return false;
			}
			/*
			var iCurrentIndexSet: int = this.getData().getIndexSet();

			if (!this.getData().selectIndexSet(".BoundingSphere")) {
				return false;
			}
			else {
				this.getData().setRenderable(this.getData().getIndexSet(), false);
			}

			return this.getData().selectIndexSet(iCurrentIndexSet);
			*/

			return false;
		}

		getTotalBones(): uint {
			if (!this.isSkinned()) {
				return null;
			}			

			return this._pSkin.getTotalBones();
		}

		getBoneLocalBound(sBone: string): IRect3d;
		getBoneLocalBound(iBone: uint): IRect3d;
		getBoneLocalBound(bone): IRect3d {
			debug.assert(this.isSkinned(), "could not get local bound for non-skinned model.");
			if (!this.isSkinned()) {
				return null;
			}

			var iBone: uint;

			if (isString(arguments[0])) {
				iBone = this._pSkin.getBoneIndex(arguments[0]);
			}
			else {
				iBone = arguments[0];
			}

			return this._pSkinLocalBounds[iBone];
		}

		//computeNormals() {
			//TODO: calc normals
		//}

		computeNormals(): boolean {
			var pData: IRenderData = this.getData();
			var pVertexData: IVertexData = this.getVertexData(DeclUsages.POSITION);
			var pNormalData: IVertexData = this.getVertexData(DeclUsages.NORMAL);

			var pVertexBuffer: Float32Array = <Float32Array>pVertexData.getTypedData(DeclUsages.POSITION);
			var pNormalBuffer: Float32Array;

			//var nFaces: uint = this.getData().getPrimitiveCount();

			if (!isNull(pNormalData)) {
				debug.warn("Could not compute face normals. Normals already exists.");
				return false;
			}

			if (pData.useSingleIndex()) {
				logger.error("TODO: single index not supported yet.");
				return false;
			}

			if (pData.useMultiIndex()) {
				pNormalBuffer = new Float32Array(pVertexData.getLength() * 3);

			}

			logger.error("TODO");


			return false;
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

		getVertexData(sUsage: string): IVertexData;
		getVertexData(sUsage: 'TEXCOORD'): IVertexData;
		getVertexData(sUsage: 'NORMAL'): IVertexData;
		getVertexData(sUsage: 'POSITION'): IVertexData;
		getVertexData(sUsage): IVertexData {
			var pFlow: IDataFlow = this.getData()._getFlow(sUsage);

			if (!isDefAndNotNull(pFlow)) {
				return null;
			}

			return pFlow.data;
		}

		//исходим из того, что данные скина 1:1 соотносятся с вершинами.
		setSkin(pSkin: ISkin): boolean {

			logger.assert(pSkin.isReady(), "cannot add invalid skin");

			var pRenderData: IRenderData = this.getData();
			var pPosData: IVertexData;
			var pPositionFlow: IDataFlow;
			var pNormalFlow: IDataFlow;
			var pMetaData: Float32Array;
			// markup meta-data 
			var pInfMetaData: IVertexData;
			// meta-data address (in floats)
			var iInfMetaDataLoc: int;
			// meta-data step (in floats)
			var iInfMetaDataStride: int;


			// Get vertex data to put in {W} component, 
			// address of meta information about the impact of this on vertex.


			// getting vertex flow
			pPositionFlow = pRenderData._getFlow(DeclUsages.POSITION);
			debug.assert(isDefAndNotNull(pPositionFlow), "skin require position with indices in mesh subset");

			pPosData = pPositionFlow.data;

			// check that the data has not yet been tied to another Skin
			if (pPosData.hasSemantics(DeclUsages.BLENDMETA)) {
				// Is the same skin?
				if (pSkin.isAffect(pPosData)) {
					return true;
				}

				debug.error("Mesh subset already has another skin.");
				return false;
			}

			// Check, that current mesh subset in Mesh, which stretched skin,
			// or his clone.
			debug.assert(this.getData().getBuffer() == pSkin.getData(),
				"can not bind to skin mesh subset that does not belong skin's mesh.")

		    // tie up the skin, according to the vertices of the current mesh susbset
			// ie add markup at the end of each pixel
		    pSkin._attach(pPosData);

			var pDeclaration: IVertexDeclaration = pPosData.getVertexDeclaration();
			var pVEMeta: IVertexElement = pDeclaration.findElement(DeclUsages.BLENDMETA);

			//if BLENDMETA not found
			debug.assert(isDefAndNotNull(pVEMeta), "you must specify location for storage blending data");

			//read all data for acceleration
			pMetaData = new Float32Array(pPosData.getData(0, pDeclaration.stride));

			// setup vertices metadata markup, so they immediately addressable data
			pInfMetaData = pSkin.getInfluenceMetaData();
			iInfMetaDataLoc = pInfMetaData.getByteOffset() / EDataTypeSizes.BYTES_PER_FLOAT;
			iInfMetaDataStride = pInfMetaData.getStride() / EDataTypeSizes.BYTES_PER_FLOAT;

			var iCount: uint = pMetaData.byteLength / pDeclaration.stride;
			var iOffset: uint = pVEMeta.offset / EDataTypeSizes.BYTES_PER_FLOAT;
			var iStride: uint = pDeclaration.stride / EDataTypeSizes.BYTES_PER_FLOAT;

			for (var i: uint = 0; i < iCount; ++i) {
				//setuo meta data addresses
				pMetaData[iOffset + i * iStride] = iInfMetaDataLoc + i * iInfMetaDataStride;
			}

			pPosData.setData(pMetaData, 0, pDeclaration.stride);

			var pIndexData: IVertexData = <IVertexData>pRenderData.getIndices();

			pNormalFlow = pRenderData._getFlow(DeclUsages.NORMAL);

			var pPositionIndexData: Float32Array = <Float32Array>pIndexData.getTypedData(pPositionFlow.mapper.semantics);
			var pNormalIndexData: Float32Array = <Float32Array>pIndexData.getTypedData(pNormalFlow.mapper.semantics);

			var iAdditionPosition: uint = pPosData.getByteOffset();
			var iAdditionNormal: uint = pNormalFlow.data.getByteOffset();

			for (var i: uint = 0; i < pPositionIndexData.length; i++) {
				// calc real indexes ??
				pPositionIndexData[i] = (pPositionIndexData[i] * EDataTypeSizes.BYTES_PER_FLOAT - iAdditionPosition) / pPositionFlow.data.getStride();
				pNormalIndexData[i] = (pNormalIndexData[i] * EDataTypeSizes.BYTES_PER_FLOAT - iAdditionNormal) / pNormalFlow.data.getStride();
			}

			//update position index
			var pUPPositionIndex: Float32Array = new Float32Array(pPosData.getLength());

			for (var i: uint = 0; i < pPosData.getLength(); i++) {
				pUPPositionIndex[i] = i;
			}

			//update normal index

			var pTmp: any = {};								//unique pairs <position, normal>

			var pSkinnedNormalIndex: uint[] = [];			//indexes of <position, normal> pairs

			var pUNPositionIndex: uint[] = [];				/*update normal position index*/ //unique position indexes
			var pUNNormalIndex: uint[] = [];				/*update normal normal index*/	 //unique normal indexes
			var pDestinationSkinnedNormalIndex: uint[] = [];

			var iCounter: uint = 0;

			for (var i: uint = 0; i < pPositionIndexData.length; i++) {
				//real pair position & normal
				var sKey: string = pPositionIndexData[i].toString() + "_" + pNormalIndexData[i].toString();

				if (!isDef(pTmp[sKey])) {
					pTmp[sKey] = iCounter;
					pUNPositionIndex.push(pPositionIndexData[i]);
					pUNNormalIndex.push(pNormalIndexData[i]);
					pSkinnedNormalIndex.push(iCounter);
					pDestinationSkinnedNormalIndex.push(iCounter);
					iCounter++;
				}
				else {
					pSkinnedNormalIndex.push(pDestinationSkinnedNormalIndex[pTmp[sKey]]);
				}
			}

			//debug.time("\t\t\tMesh::setSkin allocations");

			pRenderData.allocateAttribute([VE.float3("SKINNED_POSITION"), VE.end(16)], new Float32Array(pPosData.getLength() * 4), ERenderDataAttributeTypes.DYNAMIC);

			// skinned vertices uses same index as vertices
			//FIXME: call VertexData resize...
			pRenderData.allocateIndex([VE.float("SP_INDEX")], pPositionIndexData);
			// skinned normals uses new index
			pRenderData.allocateIndex([VE.float("SN_INDEX")], new Float32Array(pSkinnedNormalIndex));

			pRenderData.allocateAttribute([VE.float3("SKINNED_NORMAL"), VE.end(16)], new Float32Array(pUNNormalIndex.length * 4), ERenderDataAttributeTypes.DYNAMIC);

			pRenderData.index("SKINNED_POSITION", "SP_INDEX");
			pRenderData.index("SKINNED_NORMAL", "SN_INDEX");

			var iPreviousSet: uint = pRenderData.getIndexSet();

			//////////////////////////////////////////////////////////////////// [iUPIndexSet]

			var iUPIndexSet: uint = pRenderData.addIndexSet(true, EPrimitiveTypes.POINTLIST, ".update_skinned_position");


			pRenderData.allocateIndex([VE.float("UPP_INDEX")], pUPPositionIndex);
			pRenderData.allocateIndex([VE.float("DESTINATION_SP")], pUPPositionIndex);	//FIXME: call VertexData resize...

			pRenderData.index(pPosData.getByteOffset(), "UPP_INDEX");
			pRenderData.index("SKINNED_POSITION", "DESTINATION_SP");

			//////////////////////////////////////////////////////////////////// [iUNIndexSet]

			var iUNIndexSet: uint = pRenderData.addIndexSet(true, EPrimitiveTypes.POINTLIST, ".update_skinned_normal");
			pRenderData.allocateIndex([VE.float("UNP_INDEX")], new Float32Array(pUNPositionIndex));
			pRenderData.allocateIndex([VE.float("DESTINATION_SN")], new Float32Array(pDestinationSkinnedNormalIndex));	//FIXME: call VertexData resize...
			pRenderData.allocateIndex([VE.float("UNN_INDEX")], new Float32Array(pUNNormalIndex));

			pRenderData.index(pPosData.getByteOffset(), "UNP_INDEX");
			pRenderData.index(pRenderData._getFlow(DeclUsages.NORMAL, false).data.getByteOffset(), "UNN_INDEX");
			pRenderData.index("SKINNED_NORMAL", "DESTINATION_SN");
			//debug.timeEnd("\t\t\tMesh::setSkin allocations");
			//////////////////////////

			pRenderData.selectIndexSet(iPreviousSet);

			pRenderData.setRenderable(iUPIndexSet, false);
			pRenderData.setRenderable(iUNIndexSet, false);

			this._pSkin = pSkin;
			this.skinAdded.emit(pSkin);
			pSkin.transformed.connect(this.transformed);

			this.calculateBoneLocalBoundingBoxes();

			return true;
		}

		update(): boolean {
			var isUpdated: boolean = false;

			if (this.isSkinned()) {
				isUpdated = this._pSkin.applyBoneMatrices()? true: isUpdated;

				if (isUpdated) {
					this.calculateSkin();
					this.calculateSkinBasedBoundingBox();
				}
			}

			return isUpdated;
		}

		private calculateBoneLocalBoundingBoxes(): IRect3d[] {

			debug.time("MeshSubset::calculateBonesLocalBoundingBoxes()");

			var pSkin = this.getSkin();

			//List of all bones.
			var nBones: uint = pSkin.getTotalBones();

			//List of vertex indices depend on each of the bones.
			var pBoneDependentVertices: int[][] = new Array<int[]>(nBones);
			var pBoneDependentVerticesWeights: int[][] = new Array<int[]>(nBones);

			//Get bone influens meta data float2 = {BONE_INF_COUNT, BONE_INF_LOC}.
			var pInfMetaData = pSkin.getInfluenceMetaData();
			var pInfCount: Float32Array = <Float32Array>pInfMetaData.getTypedData("BONE_INF_COUNT");

			//Get bome influences
			var pInfData = pSkin.getInfluences();
			//{weght, matrix_addr}
			var pInfWeightLoc: Float32Array = new Float32Array(pInfData.getData());

			//Get all vertices
			var pRenderData: IRenderData = this.getData();
			var pPositionFlow: IDataFlow = pRenderData._getFlow(DeclUsages.POSITION);
			var pPosData: IVertexData = pPositionFlow.data;

			var pPositions: Float32Array = <Float32Array>pPosData.getTypedData(DeclUsages.POSITION);

			//Get bone trasform matrices data
			var pMatricesData = pSkin.getBoneTransforms();

			//число влияний, которые мы прочитали, в соответствие с тегом <vcount> в collada
			var iTotalReadedInf: int = 0;

			for (var i = 0, n = 0; i < pPositions.length; i += 3, n++) {
				//var vVertex: IVec3 = math.Vec3.temp(pPositions[i], pPositions[i + 1], pPositions[i + 2]);
				//var iBlendMetaAddr: int = <int>pBlendMeta[n];

				//console.log("vertex: ", vVertex.toString(), "vcount: ", pInfCount[n]/*, pInfLoc[n]*/);


				for (var j = 0; j < pInfCount[n]; ++j) {
					var k = (iTotalReadedInf + j) * 2;

					var fWeight = pInfWeightLoc[k + 1];
					var iMatAddr = pInfWeightLoc[k];
					var iBone: uint = (iMatAddr - pMatricesData.getByteOffset() / Float32Array.BYTES_PER_ELEMENT) / 16;

					//console.log("matrix:", iBone, "weight", fWeight);

					//skip weak influences
					if (fWeight > 0.25) {
						if (!isDefAndNotNull(pBoneDependentVertices[iBone])) {
							pBoneDependentVertices[iBone] = [];
							pBoneDependentVerticesWeights[iBone] = [];
						}

						pBoneDependentVertices[iBone].push(n);
						pBoneDependentVerticesWeights[iBone].push(fWeight);
					}
				}

				iTotalReadedInf += pInfCount[n]
			}

			var mBindShapeMatrix: IMat4 = pSkin.getBindMatrix();

			var pBoneLocalBoxes: IRect3d[] = new Array<IRect3d>(nBones);

			for (var iBone: uint = 0; iBone < nBones; ++iBone) {
				var pVertexIndices = pBoneDependentVertices[iBone];
				var pvertexWeights = pBoneDependentVerticesWeights[iBone];

				if (!pVertexIndices) {
					pBoneLocalBoxes[iBone] = null;
					continue;
				}

				var mBoneOffsetMatrix: IMat4 = pSkin.getBoneOffsetMatrix(iBone);
				var pLocalBox: IRect3d = pBoneLocalBoxes[iBone] =
					new geometry.Rect3d(MAX_UINT32, MIN_UINT32, MAX_UINT32, MIN_UINT32, MAX_UINT32, MIN_UINT32);

				for (var j = 0; j < pVertexIndices.length; ++j) {
					var iVertex = pVertexIndices[j] * 3;
					var vVertex: IVec4 =
						Vec4.temp(pPositions[iVertex], pPositions[iVertex + 1], pPositions[iVertex + 2], 1.);
					var fWeight: float = pvertexWeights[j];

					var mBoneMatrix =
						mBoneOffsetMatrix.multiplyNumber(fWeight, Mat4.temp()).multiply(mBindShapeMatrix);

					mBoneMatrix.multiplyVec4(vVertex);

					pLocalBox.x0 = math.min(pLocalBox.x0, vVertex.x);
					pLocalBox.x1 = math.max(pLocalBox.x1, vVertex.x);

					pLocalBox.y0 = math.min(pLocalBox.y0, vVertex.y);
					pLocalBox.y1 = math.max(pLocalBox.y1, vVertex.y);

					pLocalBox.z0 = math.min(pLocalBox.z0, vVertex.z);
					pLocalBox.z1 = math.max(pLocalBox.z1, vVertex.z);
				}
			}

			debug.timeEnd("MeshSubset::calculateBonesLocalBoundingBoxes()");

			this._pSkinLocalBounds = pBoneLocalBoxes;

			return pBoneLocalBoxes;
		}

		private calculateSkin(): boolean {
			var isOk: boolean = config.WEBGL ? webgl.calculateSkin(this) : false;
			this._isOptimizedSkinned = isOk;
			return isOk;
		}

		private calculateSkinBasedBoundingBox(): void {
			if (isNull(this._pBoundingBox)) {
				this._pBoundingBox = new geometry.Rect3d();
			}

			var pLocalBounds: IRect3d[] = this._pSkinLocalBounds;
			var pSkin: ISkin = this._pSkin;

			var pBB: IRect3d = this._pBoundingBox.set(
				MAX_UINT32, MIN_UINT32, MAX_UINT32, MIN_UINT32, MAX_UINT32, MIN_UINT32);

			for (var i: uint = 0; i < pLocalBounds.length; ++i) {
				if (isNull(pLocalBounds[i])) {
					continue;
				}

				var pLocalBB =
					geometry.Rect3d.temp(pLocalBounds[i]).transform(pSkin.getAffectedNode(i).getWorldMatrix());

				pBB.x0 = math.min(pBB.x0, pLocalBB.x0);
				pBB.x1 = math.max(pBB.x1, pLocalBB.x1);

				pBB.y0 = math.min(pBB.y0, pLocalBB.y0);
				pBB.y1 = math.max(pBB.y1, pLocalBB.y1);

				pBB.z0 = math.min(pBB.z0, pLocalBB.z0);
				pBB.z1 = math.max(pBB.z1, pLocalBB.z1);
			}

			//var mInvWorldMatrix: IMat4 = (<INode>pSkin.getSkeleton().getRoot().getParent()).getInverseWorldMatrix();

			//pBB.transform(mInvWorldMatrix);
		}

		static isMeshSubset(pObject: IRenderableObject): boolean {
			return pObject.getType() === ERenderableTypes.MESH_SUBSET;
		}
	}
}
