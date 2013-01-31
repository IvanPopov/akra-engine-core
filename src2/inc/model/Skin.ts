#ifndef SKIN_TS
#define SKEIN_TS

#include "ISkeleton.ts"
#include "INode.ts"

module akra.model {

	export class Skin implements ISkin{
		private _m4fBindMatrix: IMat4;
		private _pRenderDataBuffer;
		private _pSkeleton: ISkeleton = null;
		private _pBoneTransformMatrixData = null;
		private _pBoneTransformMatrices  = null;
		private _pBoneOffsetMatrixBuffer = null;
		private _pNodeNames = null;
		private _pBoneOffsetMatrices = null;
		private _pAffectingNodes = null;
		private _pInfMetaData = null;
		private _pInfData = null;
		private _pWeightData = null;
		private _pTiedData = [];

		constructor(pRenderDataBuffer){
			if (arguments[0] instanceof a.Mesh) {
		        pRenderDataBuffer = arguments[0].data;
		    }

		    debug_assert(pRenderDataBuffer, 'you must specify mesh for skin');
		}

		inline get buffer(){
			return this._pRenderDataBuffer;
		}

		inline get data(){
			return this._pRenderDataBuffer;
		}

		inline get skeleton(): ISkeleton{
			return this._pSkeleton;
		}

		inline get totalBones(): int{
			return this._pNodeNames.length;
		}

		setBindMatrix(m4fMatrix): void {
			this._m4fBindMatrix.set(m4fMatrix);
		}

		getBindMatrix(): IMat4 {
			return this.getRootJoints()[0];
		}

		getBoneOffsetMatrices(): IMat4[] {
			var pBoneNames = this._pNodeNames;
		    for (var i = 0; i < pBoneNames.length; i++) {
		        if (pBoneNames[i] === sBoneName) {
		            return this._pBoneOffsetMatrices[i];
		        }
		    };

		    return null;
		}

		getBoneOffsetMatrix(): IMat4 {
			var pBoneNames = this._pNodeNames;
			for (var i = 0; i < pBoneNames.length; i++) {
			    if (pBoneNames[i] === sBoneName) {
			        return this._pBoneOffsetMatrices[i];
			    }
			};

			return null;
		}

		hasSkeleton(): bool{
			return this._pSkeleton !== null;
		}

		getSkeleton(): ISkeleton {
			return this._pSkeleton;
		}

		setSkeleton(pSkeleton: ISkeleton): bool {
			if (!pSkeleton || pSkeleton.totalBones < this.totalBones) {
			    return false;
			}

			for (var i: int = 0, nMatrices = this.totalBones; i < nMatrices; i++) {
			    this._pAffectingNodes[i] = pSkeleton.findJoint(this._pNodeNames[i]);
			    debug_assert(this._pAffectingNodes[i], 'joint<' + this._pNodeNames[i] + '> must exists...');
			}
			;

			this._pSkeleton = pSkeleton;

			return true;
		}

		attachToSceneTree(): bool {
			for (var i: int = 0, nMatrices = this.totalBones; i < nMatrices; i++) {
			    this._pAffectingNodes[i] = pRootNode.findNode(this._pNodeNames[i]);
			    debug_assert(this._pAffectingNodes[i], 'node<' + this._pNodeNames[i] + '> must exists...');
			}
			;

			return true;
		}

		bind(): bool {
			if (arguments[0] instanceof a.Skeleton) {
			    return this.setSkeleton(arguments[0]);
			}

			return this.attachToSceneTree(arguments[0]);
		}

		setBoneNames(pNames): bool {
			this._pNodeNames = pNames;
			this._pAffectingNodes = new Array(this._pNodeNames.length);

			return true;
		}

		setBoneOffsetMatrices(pMatrices): void {
			var pMatrixNames = this._pNodeNames;

			debug_assert(pMatrices && pMatrixNames && pMatrixNames.length === pMatrices.length,
			             'number of matrix names must equal matrices data length:\n' + pMatrixNames.length + ' / ' +
			             pMatrices.length);

			var nMatrices: uint = pMatrixNames.length;
			var pData = this.data;
			var pMatrixData: Float32Array = new Float32Array(nMatrices * 16);

			this._pBoneOffsetMatrices = pMatrices;//FIXME: правильно положить матрицы...

			this._pBoneTransformMatrixData = pData._allocateData(VE_MAT4('BONE_MATRIX'), pMatrixData);

			this._pBoneTransformMatrices = new Array(nMatrices);

			for (var i: int = 0; i < nMatrices; i++) {
			    this._pBoneTransformMatrices[i] = new Mat4(pMatrixData.subarray(i * 16, (i + 1) * 16), true);
			}
			;

			this._pBoneOffsetMatrixBuffer = pMatrixData;
		}

		setWeights(pWeights) {
			this._pWeightData = this.data._allocateData([
			                                                VE_FLOAT('BONE_WEIGHT')             //веса вершин
			                                            ], pWeights);

			return this._pWeightData !== null;
		}

		getWeights() {
			return this._pWeightData;
		}

		getInfluenceMetaData() {
			return this._pInfMetaData;
		}

		getInfluences(first_argument) {
			return this._pInfData;
		}

		setIfluences(pInfluencesCount, pInfluences): bool {
			debug_assert(this._pInfMetaData == null && this._pInfData == null,
			             'vertex weights already setuped.')

			debug_assert(this.getWeights(), 'you must set weight data before setup influences');

			var pData = this.data;
			var pInfluencesMeta = new Float32Array(pInfluencesCount.length * 2);
			var iInfLoc: int = 0;
			var iTransformLoc: int = 0;
			var iWeightsLoc: int = 0;

			//получаем копию массива влияний
			pInfluences = new Float32Array(pInfluences);

			//вычисляем адресса матриц транфсормации и весов
			iTransformLoc = this._pBoneTransformMatrixData.getOffset() / a.DTYPE.BYTES_PER_FLOAT;
			iWeightsLoc = this._pWeightData.getOffset() / a.DTYPE.BYTES_PER_FLOAT;


			for (var i: int = 0, n: int = pInfluences.length; i < n; i += 2) {
			    pInfluences[i] = pInfluences[i] * 16 + iTransformLoc;
			    pInfluences[i + 1] += iWeightsLoc;
			}
			;


			//запоминаем модифицированную информацию о влияниях
			this._pInfData = pData._allocateData([
			                                         VE_FLOAT('BONE_INF_DATA'), //адрес матрицы кости
			                                         VE_FLOAT('BONE_WEIGHT_IND')         //адрес весового коэффициента
			                                     ],
			                                     pInfluences);

			iInfLoc = this._pInfData.getOffset() / a.DTYPE.BYTES_PER_FLOAT;

			//подсчет мета данных, которые укажут, где взять влияния на кость..
			for (var i: int = 0, j: int = 0, n: int = iInfLoc; i < pInfluencesMeta.length; i += 2) {
			    var iCount: int = pInfluencesCount[j++];
			    pInfluencesMeta[i] = iCount;        //число влияний на вершину
			    pInfluencesMeta[i + 1] = n;         //адресс начала информации о влияниях 
			    //(пары индекс коэф. веса и индекс матрицы)
			    n += 2 * iCount;
			}
			;

			//influences meta: разметка влияний
			this._pInfMetaData = pData._allocateData([
			                                             VE_FLOAT('BONE_INF_COUNT'), //число костей и весов, влияющих на вершину
			                                             VE_FLOAT('BONE_INF_LOC'), //адресс начала влияний на вершину
			                                         ], pInfluencesMeta);

			return this._pInfMetaData !== null &&
			       this._pInfData !== null;
		}

		setVertexWeights(pInfluencesCount, pInfluences, pWeights): bool {
			debug_assert(arguments.length > 1, 'you must specify all parameters');

			//загружаем веса 
			if (pWeights) {
			    this.setWeights(pWeights);
			}

			return this.setIfluences(pInfluencesCount, pInfluences);
		}

		applyBoneMatrices(bForce: bool): bool {
			var pData;
			var bResult: bool;
			var pNode;
			var isUpdated: bool = false;

			for (var i = 0, nMatrices = this.totalBones; i < nMatrices; ++i) {
			    pNode = this._pAffectingNodes[i];

			    if (pNode.isWorldMatrixNew() || bForce) {
			        pNode._m4fWorldMatrix.mult(this._pBoneOffsetMatrices[i], this._pBoneTransformMatrices[i]);
			        isUpdated = true;
			    }
			}
			;

			if (isUpdated) {
			    pData = this._pBoneOffsetMatrixBuffer;
			    return this._pBoneTransformMatrixData.setData(pData, 0, pData.byteLength);
			}

			return false;
		}

		isReady(): bool {
			return this._pInfMetaData && this._pInfData && this._pWeightData &&
			       this._pBoneOffsetMatrixBuffer && this._pBoneOffsetMatrices &&
			       this._pNodeNames &&
			       this._m4fBindMatrix;
		}

		getBoneTransforms() {
			return this._pBoneTransformMatrixData;
		}

		isAffect(pData): bool {
			if (pData) {
			    for (var i = 0; i < this._pTiedData.length; i++) {
			        if (this._pTiedData[i] === pData) {
			            return true;
			        }
			    }
			    ;
			}

			return false;
		}

		attach(pData): void {
			debug_assert(pData.stride === 16, 'you cannot add skin to mesh with POSITION: {x, y, z}' +
			                                  '\nyou need POSITION: {x, y, z, w}');

			pData.getVertexDeclaration().append(VE_FLOAT(a.DECLUSAGE.BLENDMETA, 12));

			this._pTiedData.push(pData);
		}

		static debugMeshSubset(pSubMesh) {
			var pMesh = pSubMesh.mesh;
			var pSkin = pSubMesh.skin;
			var pMatData = pSkin.getBoneTransforms();
			var pPosData = pSubMesh.data.getData('POSITION');
			var pEngine = pMesh.getEngine();

			pPosData = pPosData.getTypedData(a.DECLUSAGE.BLENDMETA);

			var pVideoBuffer = pSubMesh.mesh.data.buffer;
			var iFrom: int = 2618, iTo: int = 2619;
			var pWeights = pSkin.getWeights().getTypedData('BONE_WEIGHT');
			//trace(pWeights);
			trace('===== debug vertices from ', iFrom, 'to', iTo, ' ======');
			trace('transformation data location:', pMatData.getOffset() / 4.);
			trace('155 weight: ', pSkin.getWeights().getTypedData('BONE_WEIGHT')[155]);
			trace('vertices info ===================>');
			for (var i = iFrom; i < iTo; i++) {
			    trace(pPosData[i], '<< inf meta location');
			    var pMetaData = new Float32Array(pVideoBuffer.getData(4 * pPosData[i], 8));
			    trace(pMetaData.X, '<< count');
			    trace(pMetaData.Y, '<< inf. location');

			    for (var j = 0; j < pMetaData.X; ++j) {
			        var pInfData = new Float32Array(pVideoBuffer.getData(4 * (pMetaData.Y + 2 * j), 8));

			        trace(pInfData.X, '<< matrix location');
			        trace(pInfData.Y, '/', pInfData.Y - 30432, '<< weight location / index');

			        var pWeightData = new Float32Array(pVideoBuffer.getData(4 * (pInfData.Y), 4));
			        trace(pWeightData[0], '<< weight');

			        var pMatrixData = new Float32Array(pVideoBuffer.getData(4 * (pInfData.X), 4 * 16));

			        trace(pMatrixData.toString());
			    }
			}

			trace('#############################################');

			for (var i = 0; i < pPosData.length; i++) {
			    var pMetaData = new Float32Array(pVideoBuffer.getData(4 * pPosData[i], 8));
			    for (var j = 0; j < pMetaData.X; ++j) {
			        var pInfData = new Float32Array(pVideoBuffer.getData(4 * (pMetaData.Y + 2 * j), 8));
			        var iWeightsIndex = pInfData.Y - 30432;

			        var fWeightOrigin = pWeights[iWeightsIndex];
			        var pWeightData = new Float32Array(pVideoBuffer.getData(4 * (pInfData.Y), 4));
			        var fWeight = pWeightData[0];

			        if (Math.abs(fWeight - fWeightOrigin) > 0.001) {
			            alert(1);
			            trace('weight with index', iWeightsIndex, 'has wrong weight', fWeightOrigin, '/', fWeightOrigin);
			        }

			        //var pWeightData = new Float32Array(pVideoBuffer.getData(4 * (pInfData.Y), 4));
			        //var pMatrixData = new Float32Array(pVideoBuffer.getData(4 * (pInfData.X), 4 * 16));
			    }
			}

			trace('##############################################');
			// var pBoneTransformMatrices = pSkin._pBoneTransformMatrixData;
			// var pBonetmData = pBoneTransformMatrices.getTypedData('BONE_MATRIX');

			// for (var i = 0; i < pBonetmData.length; i += 16) {
			//     trace('bone transform matrix data >>> ');
			//     trace(Mat4.str(pBonetmData.subarray(i, i + 16)));
			// };


			//for (var i = 0; i < pMesh.length; i++) {
			// var i = pMesh.length - 1;
			//     var pPosData = pMesh[i].data.getData('POSITION').getTypedData('POSITION');
			//     var pIndData = pMesh[i].data._pIndexData.getTypedData('INDEX0');

			//     var j = pIndData[pIndData.length - 1];
			//     var j0 = pMesh[i].data.getData('POSITION').getOffset()/4;

			//     j -= j0;
			//     j/=4;

			//     trace('last index >> ', j);
			//     trace('pos data size', pPosData.length);

			//     var pVertex = pPosData.subarray(j * 3, j * 3 + 3);

			//     trace('last vertex in submesh >> ', pVertex[0], pVertex[1], pVertex[2]);

			//         var pSceneNode = pEngine.appendMesh(
			//             pEngine.pCubeMesh.clone(a.Mesh.GEOMETRY_ONLY|a.Mesh.SHARED_GEOMETRY),
			//             pEngine.getRootNode());

			//         pSceneNode.setPosition(pVertex);
			//         pSceneNode.setScale(0.1);
			//     var pMeta = pSkin.getInfluenceMetaData().getTypedData('BONE_INF_COUNT');
			//     trace(pMeta[j], 'count << ');

			//};
		}

		/*getNodeList(): INode[]{
			return this._pNodeList;
		}

		addRootJoint(pJoint: INode): bool {

		    var pRootJoints = this._pRootJoints;

			for (var i = 0; i < pRootJoints.length; i++) {
				if (pJoint.childOf(pRootJoints[i])) {
					return false;
				}	
				else if (pRootJoints[i].childOf(pJoint)) {
					pRootJoints.splice(i, 1);
				}
			};

			this._pRootJoints.push(pJoint);

			return this.update();
		}

		update(): bool {
			var pRootJoints = this._pRootJoints;
		    var pJointList = this._pJointList = {};
		    var pNodeList = this._pNodeList = [];
		    //var pNotificationJoints = this._pNotificationJoints = [];

		    function findNodes (pNode) {
		    	var sJoint;

		    	if (pNode) {
			    	sJoint = pNode.boneName;

			    	if (sJoint) {
			    		debug_assert(!pJointList[sJoint], 
			    			'joint with name<' + sJoint + '> already exists in skeleton <' + this._sName + '>');
			    		pJointList[sJoint] = pNode;
			    	}

			    	pNodeList.push(pNode);

			    	findNodes(pNode.sibling());
			    	findNodes(pNode.child());
		    	}
		    }

		    for (var i = 0; i < pRootJoints.length; i++) {
		    	findNodes(pRootJoints[i]);
		    };

			// for (var sJoint in pJointList) {
			// 	var pJoint = pJointList[sJoint];

		 //    	if (pJoint.sibling() == null && pJoint.child() == null) {
		 //    		pNotificationJoints.push(pJoint);
		 //    	}
		 //    };    

			return true;
		}

		findJoint(sName: string): INode {
			return this._pJointList[sName];
		}

		findJointByName(sName: string): INode {
			for (var s in this._pJointList) {
				if (this._pJointList[s].name === sName) {
					return this._pJointList[s];
				}
			}

			return null;
		}

		attachMesh(pMesh: IMesh): void {
			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			FIX a. , getEngine
			debug_assert(this.getEngine() === pMesh.getEngine(), 'mesh must be from same engine instance');

		    if (this._pMeshNode == null) {
		    	this._pMeshNode = new a.SceneModel(this.getEngine());
		    	this._pMeshNode.create();
		    	this._pMeshNode.setInheritance(a.Scene.k_inheritAll);
		    	this._pMeshNode.attachToParent(this.root);
		    }

		    this._pMeshNode.name = this.name + "[mesh-container]";
		    this._pMeshNode.addMesh(pMesh);
		}

		detachMesh(): void {
			//TODO: write detach method.
		}*/
	}
}

#endif