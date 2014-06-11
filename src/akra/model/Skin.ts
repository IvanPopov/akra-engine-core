/// <reference path="../idl/ISkeleton.ts" />
/// <reference path="../idl/INode.ts" />
/// <reference path="../idl/IVertexData.ts" />
/// <reference path="../idl/IRenderDataCollection.ts" />
/// <reference path="../idl/IMesh.ts" />
/// <reference path="../idl/IMat4.ts" />
/// <reference path="../idl/ISceneNode.ts" />

module akra.model {
	import VE = data.VertexElement;
	import Mat4 = math.Mat4;
	import DeclUsages = data.Usages;

	export final class Skin implements ISkin {
		guid: uint = guid();

		/**
		 * @copydoc ISkin::transformed
		 */
		transformed: ISignal<{ (pSkin: ISkin): void;}>;

		private _pMesh: IMesh;

		private _pSkeleton: ISkeleton = null;
		
		// name of bones/nodes
		private _pNodeNames: string[] = null;

		//bind matrix from collada
		private _m4fBindMatrix: IMat4 = new Mat4(1);

		//BONE_MATRIX = WORLD_MATRIX x OFFSET_MATRIX
		private _pBoneTransformMatrices: IMat4[]  = null;

		/**
		 * Common buffer for all transform matrices.
		 * _pBoneOffsetMatrixBuffer = [_pBoneTransformMatrices[0], ..., _pBoneTransformMatrices[N]]
		 */
		private _pBoneOffsetMatrixBuffer: Float32Array = null;

		// bone offset matrices from collada
		private _pBoneOffsetMatrices: IMat4[] = null;
		
		/**
		 * Pointers to nodes, that affect to this skin.
		 */
		private _pAffectingNodes: ISceneNode[] = null;

		/**
		 * Format:
		 * BONE_INF_COUNT - number of bones, that influence to the vertex.
		 * BONE_INF_LOC - address of influence, pointer to InfData structire list.
		 * ..., [BONE_INF_COUNT: float, BONE_INF_LOC: float], ...
		 * 
		 */
		private _pInfMetaData: IVertexData = null;

		/**
		 * Format:
		 * BONE_INF_DATA - bone matrix address, pointer to BONE_MATRIX list
		 * BONE_WEIGHT - bone weight
		 * ..., [BONE_INF_DATA: float, BONE_WEIGHT: float], ...
		 */
		private _pInfData: IVertexData = null;

		/**
		 * Format:
		 * ..., [BONE_MATRIX: matrix4], ...
		 */
		private _pBoneTransformMatrixData: IVertexData = null;
		private _pWeights: Float32Array = null;

		/**
		 * Links to VertexData, that contain meta from this skin.
		 */
		private _pTiedData: IVertexData[] = [];

		constructor(pMesh: IMesh) {
			debug.assert(isDefAndNotNull(pMesh), "you must specify mesh for skin");

			this.setupSignals();
			this._pMesh = pMesh;
		}

		protected setupSignals(): void {
			this.transformed = this.transformed || new Signal(this);
		}

		getData(): IRenderDataCollection {
			return this._pMesh.getData();
		}

		getTotalBones(): uint {
			return this._pNodeNames.length;
		}

		getBoneName(iBone: uint): string {
			debug.assert(iBone >= 0 && iBone < this._pNodeNames.length, "invalid bone index");
			return this._pNodeNames[iBone];
		}

		getBoneIndex(sBone: string): uint {
			return this._pNodeNames.indexOf(sBone);
		}

		getSkeleton(): ISkeleton {
			return this._pSkeleton;
		}

		setBindMatrix(m4fMatrix: IMat4): void {
			this._m4fBindMatrix.set(m4fMatrix);
		}

		getBindMatrix(): IMat4 {
			return this._m4fBindMatrix;
		}

		/**
		 * Get scene node that are affected by this skin. 
		 * Nodes are arranged in the order they are located in video memory.
		 * @param iNode Node index.
		 */
		getAffectedNode(iNode: uint): ISceneNode {
			debug.assert(!isNull(this._pSkeleton), "nodes not exists");
			return this._pAffectingNodes[iNode];
		}

		getBoneOffsetMatrix(iBone: uint): IMat4;
		getBoneOffsetMatrix(sBoneName: string): IMat4;
		getBoneOffsetMatrix(bone): IMat4 {

			var pBoneNames: string[] = this._pNodeNames;

			if (isNumber(bone)) {
				return this._pBoneOffsetMatrices[bone];
			}

			for (var i = 0; i < pBoneNames.length; i++) {
				if (pBoneNames[i] === bone) {
			        return this._pBoneOffsetMatrices[i];
			    }
			}

			return null;
		}

		setSkeleton(pSkeleton: ISkeleton): boolean {
			if (isNull(pSkeleton) || pSkeleton.getTotalBones() < this.getTotalBones()) {
				debug.warn("number of bones in skeleton (" + pSkeleton.getTotalBones() +
					") less then number of bones in skin (" + this.getTotalBones() + ").");
				return false;
			}

			for (var i: int = 0, nMatrices = this.getTotalBones(); i < nMatrices; i++) {
				this._pAffectingNodes[i] = pSkeleton.findJoint(this._pNodeNames[i]);
				debug.assert(!isNull(this._pAffectingNodes[i]), "joint<" + this._pNodeNames[i] + "> must exists...");
			}

			this._pSkeleton = pSkeleton;

			this.transformed.emit();
			return true;
		}

		attachToScene(pRootNode: ISceneNode): boolean {
			for (var i: int = 0, nMatrices: uint = this.getTotalBones(); i < nMatrices; i++) {
			    this._pAffectingNodes[i] = <ISceneNode>pRootNode.findEntity(this._pNodeNames[i]);
			    debug.assert(isDefAndNotNull(this._pAffectingNodes[i]), "node<" + this._pNodeNames[i] + "> must exists...");
			}

			this.transformed.emit();
			return true;
		}

		setBoneNames(pNames: string[]): boolean {
			if (isNull(pNames)) {
				return false;
			}

			debug.assert(isNull(this._pNodeNames), "you try redefine e existing node names...");

			this._pNodeNames = pNames;
			this._pAffectingNodes = new Array(pNames.length);

			return true;
		}

		setBoneOffsetMatrices(pMatrices: IMat4[]): void {
			var pMatrixNames: string[] = this._pNodeNames;

			debug.assert(isDefAndNotNull(pMatrices) && isDefAndNotNull(pMatrixNames) && 
						pMatrixNames.length === pMatrices.length,
			            "number of matrix names must equal matrices data length:\n" + pMatrixNames.length + " / " +
			            pMatrices.length);

			var nMatrices: uint = pMatrixNames.length;
			var pData: IRenderDataCollection = this.getData();
			var pMatrixData: Float32Array = new Float32Array(nMatrices * 16);

			//FIXME: правильно положить матрицы...
			this._pBoneOffsetMatrices = pMatrices;
			this._pBoneTransformMatrixData = pData._allocateData([VE.float4x4("BONE_MATRIX")], pMatrixData);
			this._pBoneTransformMatrices = new Array<IMat4>(nMatrices);

			for (var i: int = 0; i < nMatrices; i++) {
			    this._pBoneTransformMatrices[i] = new Mat4(pMatrixData.subarray(i * 16, (i + 1) * 16), true);
			}
			

			this._pBoneOffsetMatrixBuffer = pMatrixData;
		}

		setWeights(pWeights: Float32Array): boolean {
			this._pWeights = pWeights;
			return true;
		}

		getInfluenceMetaData(): IVertexData {
			return this._pInfMetaData;
		}

		getInfluences(): IVertexData {
			return this._pInfData;
		}

		setInfluences(pInfluencesCount: uint[], pInfluences: Float32Array): boolean {
			debug.assert(this._pInfMetaData == null && this._pInfData == null, "vertex weights already setuped.");
			debug.assert(!isNull(this._pWeights), "you must set weight data before setup influences");

			var pData: IRenderDataCollection = this.getData();
			var pInfluencesMeta: Float32Array = new Float32Array(pInfluencesCount.length * 2);
			var pWeights: Float32Array = this._pWeights;

			var iInfLoc: int = 0;
			var iTransformLoc: int = 0;

			//получаем копию массива влияний
			pInfluences = new Float32Array(pInfluences);

			//вычисляем адресса матриц транфсормации и весов
			iTransformLoc = this._pBoneTransformMatrixData.getByteOffset() / EDataTypeSizes.BYTES_PER_FLOAT;


			for (var i: int = 0, n: int = pInfluences.length; i < n; i += 2) {
			    pInfluences[i] = pInfluences[i] * 16 + iTransformLoc;
			    pInfluences[i + 1] = pWeights[pInfluences[i + 1]];
			}

			//запоминаем модифицированную информацию о влияниях
			this._pInfData = pData._allocateData([
			                                         VE.float('BONE_INF_DATA'), /*адрес матрицы кости*/
			                                         VE.float('BONE_WEIGHT')    /*весовой коэффициент*/
			                                     ],
			                                     pInfluences);

			iInfLoc = this._pInfData.getByteOffset() / EDataTypeSizes.BYTES_PER_FLOAT;

			//подсчет мета данных, которые укажут, где взять влияния на кость..
			for (var i: int = 0, j: int = 0, n: int = iInfLoc; i < pInfluencesMeta.length; i += 2) {
			    var iCount: int = pInfluencesCount[j++];
			    pInfluencesMeta[i] = iCount;        /*число влияний на вершину*/
			    pInfluencesMeta[i + 1] = n;         /*адрес начала информации о влияниях */
			    //(пары индекс коэф. веса и индекс матрицы)
			    n += 2 * iCount;
			}

			//influences meta: разметка влияний
			this._pInfMetaData = pData._allocateData([
			                                             VE.float('BONE_INF_COUNT'), /*число костей и весов, влияющих на вершину*/
			                                             VE.float('BONE_INF_LOC'), /*адресс начала влияний на вершину*/
			                                         ], pInfluencesMeta);


			return this._pInfMetaData !== null &&
			       this._pInfData !== null;
		}


		setVertexWeights(pInfluencesCount: uint[], pInfluences: Float32Array, pWeights: Float32Array): boolean {
			debug.assert(arguments.length > 1, 'you must specify all parameters');

			//загружаем веса 
			if (pWeights) {
			    this.setWeights(pWeights);
			}

			return this.setInfluences(pInfluencesCount, pInfluences);
		}

		applyBoneMatrices(bForce: boolean = false): boolean {
			var pData: Float32Array;
			var bResult: boolean;
			var pNode: ISceneNode;
			var isUpdated: boolean = false;

			for (var i: int = 0, nMatrices = this.getTotalBones(); i < nMatrices; ++i) {
				pNode = this._pAffectingNodes[i];


				if (pNode && (pNode.isWorldMatrixNew() || bForce)) {
			        pNode.getWorldMatrix().multiply(this._pBoneOffsetMatrices[i], this._pBoneTransformMatrices[i]);
			        isUpdated = true;
			    }
			}

			if (isUpdated) {
				this.transformed.emit();
			    pData = this._pBoneOffsetMatrixBuffer;
			    return this._pBoneTransformMatrixData.setData(pData, 0, pData.byteLength);
			}

			return false;
		}

		isReady(): boolean {
			return !(isNull(this._pInfMetaData) || isNull(this._pInfData) || isNull(this._pWeights) ||
			         isNull(this._pBoneOffsetMatrixBuffer) || isNull(this._pBoneOffsetMatrices) ||
			         isNull(this._pNodeNames) ||
			         isNull(this._m4fBindMatrix));
		}

		getBoneTransforms(): IVertexData {
			return this._pBoneTransformMatrixData;
		}

		isAffect(pData: IVertexData): boolean {
			if (isDefAndNotNull(pData)) {
			    for (var i: int = 0; i < this._pTiedData.length; i++) {
			        if (this._pTiedData[i] === pData) {
			            return true;
			        }
			    }
			}

			return false;
		}

		//for MeshSubset 
		_attach(pData: IVertexData): void {
			debug.assert(pData.getStride() === 16, "you cannot add skin to mesh with POSITION: {x, y, z}" +
			                                  "\nyou need POSITION: {x, y, z, w}");

			//adding BLENDMETA usage to [{X, Y, Z}, T_END] ==> [{X, Y, Z, BLENDMETA}];
			pData.getVertexDeclaration().append(VE.float(DeclUsages.BLENDMETA, 12));

			this._pTiedData.push(pData);
		}
	}

	export function createSkin(pMesh: IMesh): ISkin {
		return new Skin(pMesh);
	}
}
