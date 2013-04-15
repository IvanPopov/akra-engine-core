#ifndef MESHSUBSET_TS
#define MESHSUBSET_TS

#include "IMeshSubset.ts"
#include "IRenderData.ts"
#include "IMesh.ts"
#include "ISkin.ts"
#include "IRect3d.ts"
#include "ISphere.ts"
#include "IVertexData.ts"

#include "geometry/geometry.ts"
#include "material/Material.ts"

#include "util/CalculateSkin.ts"

module akra.model {
	export class MeshSubset extends render.RenderableObject implements IMeshSubset {
		protected _sName: string = null;
		protected _pMesh: IMesh = null;
		protected _pSkin: ISkin = null;
		protected _pBoundingBox: IRect3d = null;
		protected _pBoundingSphere: ISphere = null;
		protected _isOptimizedSkinned: bool = false;

		inline get boundingBox(): IRect3d { return this._pBoundingBox; }
		inline get boundingSphere(): ISphere { return this._pBoundingSphere; }
		inline get skin(): ISkin { return this._pSkin; }
		inline get name(): string { return this._sName; }
		inline get mesh(): IMesh { return this._pMesh; }


		constructor (pMesh: IMesh, pRenderData: IRenderData, sName: string = null) {
			super(ERenderDataTypes.MESH_SUBSET); 
			this.setup(pMesh, pRenderData, sName);
		}

		protected setup(pMesh: IMesh, pRenderData: IRenderData, sName: string): void {
			debug_assert(this._pMesh === null, "mesh subset already prepared");
			
			this._pMesh = pMesh;
			this._pRenderData = pRenderData;
			this._sName = sName;

			super._setup(pMesh.getEngine().getRenderer());
		}

		createBoundingBox(): bool {
			var pVertexData: IVertexData;
			var pNewBoundingBox: IRect3d;

			pNewBoundingBox = new geometry.Rect3d();
			pVertexData = this.data._getData(DeclUsages.POSITION);

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
				if (this.data.addIndexSet(true, EPrimitiveTypes.LINELIST, ".BoundingBox") == -1) {
					ERROR("could not add index set '.BoundingBox'");
					return false;
				}

				iData = this.data.allocateData([VE_FLOAT3(DeclUsages.POSITION)], new Float32Array(pPoints));

				this.data.allocateIndex([VE_FLOAT(DeclUsages.INDEX0)], new Float32Array(pIndexes));

				this.data.index(iData,DeclUsages.INDEX0);

				this.applyFlexMaterial(".MaterialBoundingBox");

		        //TODO: некорректно задавать так boundingBox, т.к. надо рендерится со своим рендер методом, а его никто не выбирает. 
				pMaterial = this.getFlexMaterial(".MaterialBoundingBox");
				pMaterial.emissive = new Color(0.0, 0.0, 1.0, 1.0);
				pMaterial.diffuse  = new Color(0.0, 0.0, 1.0, 1.0);
			}
			else {
				this.data._getData(DeclUsages.POSITION).setData(new Float32Array(pPoints),DeclUsages.POSITION);
			}

			this.data.setRenderable(this.data.getIndexSet(), true);
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

		createBoundingSphere(): bool {
			var pVertexData: IVertexData;
			var pNewBoundingSphere: ISphere;

			pNewBoundingSphere = new geometry.Sphere();
			pVertexData = this.data._getData(DeclUsages.POSITION);

			if(!pVertexData) {
				return false;
			}

			if(!geometry.computeBoundingSphere(pVertexData, pNewBoundingSphere, false, this._pBoundingBox)) {
				return false;
			}

			this._pBoundingSphere = pNewBoundingSphere;

			return true;
		}


		deleteBoundingSphere(): bool {
			this._pBoundingSphere = null;
			return true;
		}

		

		showBoundingSphere(): bool {
			var pMaterial: IMaterial;
			var iData: int;
			var iCurrentIndexSet: int;
			var pPoints: float[], pIndexes: uint[];

			if(isNull(this._pBoundingSphere)) {
				return false;
			}

			pPoints = new Array();
			pIndexes = new Array();
			geometry.computeDataForCascadeBoundingSphere(this._pBoundingSphere, pPoints, pIndexes);

			iCurrentIndexSet = this.data.getIndexSet();
			if(!this.data.selectIndexSet(".BoundingSphere")) {
				this.data.addIndexSet(false, EPrimitiveTypes.LINELIST, ".BoundingSphere");

				iData = this.data.allocateData([VE_FLOAT3(DeclUsages.POSITION)], new Float32Array(pPoints));

				this.data.allocateIndex([VE_FLOAT(DeclUsages.INDEX0)], new Float32Array(pIndexes));
				this.data.index(iData,DeclUsages.INDEX0);

				this.applyFlexMaterial(".MaterialBoundingSphere");

				pMaterial = this.getFlexMaterial(".MaterialBoundingSphere");
				pMaterial.emissive = new Color(0.0, 0.0, 1.0, 1.0);
				pMaterial.diffuse  = new Color(0.0, 0.0, 1.0, 1.0);
			}
			else {
				this.data._getData(DeclUsages.POSITION).setData(new Float32Array(pPoints), DeclUsages.POSITION);
			}

			this.data.setRenderable(this.data.getIndexSet(), true);
			this.data.selectIndexSet(iCurrentIndexSet);

			return true;
		}

		hideBoundingSphere(): bool{
			var iCurrentIndexSet: int = this.data.getIndexSet();

			if(!this.data.selectIndexSet(".BoundingSphere")) {
				return false;
			}
			else {
				this.data.setRenderable(this.data.getIndexSet(), false);
			}

			return this.data.selectIndexSet(iCurrentIndexSet);
		}


		computeNormals () {
		    //TODO: calc normals
		}

		computeTangents () {
		    //TODO: compute normals
		}

		computeBinormals () {
		    //TODO: calc binormals
		}

		inline isSkinned(): bool {
		    return this._pSkin !== null;
		}

		inline isOptimizedSkinned(): bool{
			return this.isSkinned() && this._isOptimizedSkinned;
		}

		getSkin(): ISkin{
		    return this._pSkin;
		}

		applyFlexMaterial(sMaterial: string, pMaterialData: IMaterial = null): bool {
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

		hasFlexMaterial (): bool {
		    return this._pRenderData.hasSemantics(DeclUsages.MATERIAL);
		}

		setFlexMaterial (iMaterial: int): bool;
		setFlexMaterial (csName: string): bool;
		setFlexMaterial (iMaterial): bool {
		    var pMaterial: IMaterial = this._pMesh.getFlexMaterial(iMaterial);

		    if (isNull(pMaterial)) {
		    	WARNING("could not find material <" + iMaterial + "> in sub mesh <" + this.name + ">");
		        return false;
		    }

		    var pRenderData: IRenderData = this._pRenderData;
		    var pIndexData: IBufferData = pRenderData.getIndices();
		    var pMatFlow: IDataFlow = pRenderData._getFlow(DeclUsages.MATERIAL);
		    var eSemantics: string = DeclUsages.INDEX10;
		    var pIndexDecl: IVertexDeclaration, pFloatArray: Float32Array;
		    var iMatFlow: int;
			var iMat: int = (<IFlexMaterial>pMaterial).data.byteOffset;
		
		    if (pMatFlow) {
		        iMatFlow = pMatFlow.flow;
		        eSemantics = pMatFlow.mapper.semantics;
		        pIndexData = pMatFlow.mapper.data;

		        pRenderData._addData((<IFlexMaterial>pMaterial).data, iMatFlow);
		        
		        return pRenderData.index(iMat, eSemantics, true);
		    }
		  
		    pIndexDecl = createVertexDeclaration([VE_FLOAT(eSemantics)]);
		    pFloatArray = new Float32Array((<IVertexData>pIndexData).length);    
		    iMatFlow = pRenderData._addData((<IFlexMaterial>pMaterial).data);

		    debug_assert(iMatFlow >= 0, "cannot add data flow with material for mesh subsset");

		    if (!pRenderData.allocateIndex(pIndexDecl, pFloatArray)) {
		        WARNING("cannot allocate index for material!!!");
		        return false;
		    }

		    return pRenderData.index(iMat, eSemantics, true);
		}

		_draw (): void {
//		    this._pRenderData._draw();
			CRITICAL("Need to do.");
		}

		show(): void {
		    this.data.setRenderable(true);
		}

		hide(): void {
		    this.data.setRenderable(false);
		}


		//исходим из того, что данные скина 1:1 соотносятся с вершинами.
		setSkin(pSkin: ISkin): bool {
		    var pPosData: IVertexData;
		    var pPositionFlow: IDataFlow;
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
		    pPositionFlow = this.data._getFlow(DeclUsages.POSITION);
		    debug_assert(isDefAndNotNull(pPositionFlow), "skin require position with indices in mesh subset");
		    
		    pPosData = pPositionFlow.data;

		    //проверяем, что данные еще не подвязаны к другому Skin'у
		    if (pPosData.hasSemantics(DeclUsages.BLENDMETA)) {
		        //тоже самый skin?
		        if (pSkin.isAffect(pPosData)) {
		            this._pSkin = pSkin;
		            return true;
		        }

		        debug_error("mesh subset already has another skin");
		        return false;
		    }

		    //проверяем, что текущий подмеш пренадлежит мешу, на который натягивается skin,
		    //или его клону.
		    debug_assert(this.data.buffer == pSkin.data, 
		        "can not bind to skin mesh subset that does not belong skin's mesh.")

		    //подвязывем скин, к данным с вершинами текущего подмеша.
		    //т.е. добавляем разметку в конец каждого пикселя
		    pSkin.attach(pPosData);
		    
		    /*
		    //получаем данные разметки
		    pMetaData = <Float32Array>pPosData.getTypedData(DeclUsages.BLENDMETA);

		    //если по каким то причинам нет разметки...
		    debug_assert(isDefAndNotNull(pMetaData), "you must specify location for storage blending data");

		    //выставляем разметку мета данных вершин, так чтобы они адрессовали сразу на данные
		    pInfMetaData = pSkin.getInfluenceMetaData();
		    iInfMetaDataLoc = pInfMetaData.byteOffset / EDataTypeSizes.BYTES_PER_FLOAT;
		    iInfMetaDataStride = pInfMetaData.stride / EDataTypeSizes.BYTES_PER_FLOAT;

		    for (var i: int = 0; i < pMetaData.length; ++ i) {
		        pMetaData[i] = iInfMetaDataLoc + i * iInfMetaDataStride;
		    }

		    //обновляем адреса мета данных вершин
		    pPosData.setData(pMetaData, DeclUsages.BLENDMETA);

		    //trace(this.data.toString());
		    this._pSkin = pSkin;*/

		    var pDeclaration: IVertexDeclaration = pPosData.getVertexDeclaration();
		    var pVEMeta: IVertexElement = pDeclaration.findElement(DeclUsages.BLENDMETA);
		    //if BLENDMETA not found
		    debug_assert(isDefAndNotNull(pVEMeta), "you must specify location for storage blending data");

			//read all data for acceleration
		    pMetaData = new Float32Array(pPosData.getData(0, pDeclaration.stride));

		    //выставляем разметку мета данных вершин, так чтобы они адрессовали сразу на данные
		    pInfMetaData = pSkin.getInfluenceMetaData();
		    iInfMetaDataLoc = pInfMetaData.byteOffset / EDataTypeSizes.BYTES_PER_FLOAT;
		    iInfMetaDataStride = pInfMetaData.stride / EDataTypeSizes.BYTES_PER_FLOAT;

		    var iCount: uint = pMetaData.byteLength/pDeclaration.stride;
		    var iOffset: uint = pVEMeta.offset/EDataTypeSizes.BYTES_PER_FLOAT;
		    var iStride: uint = pDeclaration.stride/EDataTypeSizes.BYTES_PER_FLOAT;

		    for (var i: int = 0; i < iCount; ++ i) {
		        pMetaData[iOffset + i*iStride] = iInfMetaDataLoc + i * iInfMetaDataStride;
		    }

		    pPosData.setData(pMetaData, 0, pDeclaration.stride);

		    // LOG(pPosData.toString());
		    // LOG(pPosData.length);
		    // LOG(this.data.getIndices().toString());
		    // LOG(this.data.toString());
		    
		    var pRenderData: IRenderData = this.data;

		    var pIndexData: IVertexData = <IVertexData>pRenderData.getIndices();

		    var pIndex0: Float32Array = <Float32Array>pIndexData.getTypedData("INDEX0")
		    var pIndex1: Float32Array = <Float32Array>pIndexData.getTypedData("INDEX1")

		    var iAdditionPosition: uint = pPosData.byteOffset;
		    var iAdditionNormal: uint = pRenderData._getFlow(DeclUsages.NORMAL).data.byteOffset;
		    var iStride: uint = pIndexData.getVertexDeclaration().stride;

	    	for(var i=0; i<pIndex0.length; i++){
	    		pIndex0[i] = (pIndex0[i] * EDataTypeSizes.BYTES_PER_FLOAT - iAdditionPosition)/iStride;
	    		pIndex1[i] = (pIndex1[i] * EDataTypeSizes.BYTES_PER_FLOAT - iAdditionNormal)/iStride;
	    	}

	    	//update position index
	    	var pUPPositionIndex: Float32Array = new Float32Array(pPosData.length);
	    	for(var i: uint=0; i<pPosData.length; i++){
	    		pUPPositionIndex[i] = i;
	    	}

	    	//update normal index

	    	var pTmp: any = {};

	    	var pSkinnedNormalIndex: uint[] = [];
	    	var pUNPositionIndex: uint[] = []; /*update normal position index*/
	    	var pUNNormalIndex: uint[] = []; /*update normal normal index*/
	    	var pDestinationSkinnedNormalIndex: uint[] = [];

	    	var iCounter: uint = 0;

	    	for(var i=0; i<pIndex0.length; i++){
	    		var sKey: string = pIndex0[i].toString() + "_" + pIndex1[i];
	    		if(!isDef(pTmp[sKey])){
	    			pTmp[sKey] = iCounter;
	    			pUNPositionIndex.push(pIndex0[i]);
	    			pUNNormalIndex.push(pIndex1[i]);
	    			pSkinnedNormalIndex.push(iCounter);
	    			pDestinationSkinnedNormalIndex.push(iCounter);
	    			iCounter++;
	    		}
	    		else{
	    			pSkinnedNormalIndex.push(pSkinnedNormalIndex[pTmp[sKey]]);
	    		}
	    	}

	    	var pSkinnedNormalUpdateIndex = new Float32Array(pUNPositionIndex.length);
	    	for(var i=0; i<pUNPositionIndex.length; i++){
	    		pSkinnedNormalUpdateIndex[i] = i;
	    	}

	    	var iSkinnedPos: uint = pRenderData.allocateData([VE_FLOAT3("SKINNED_POSITION"), VE_END(16)], new Float32Array(pPosData.length * 4));
	    	/*skinned vertices uses same index as vertices*/
	    	pRenderData.allocateIndex([VE_FLOAT("SP_INDEX")], pIndex0); 
	    	pRenderData.index(iSkinnedPos, "SP_INDEX");

	    	var iSkinnedNorm: uint = pRenderData.allocateData([VE_FLOAT3("SKINNED_NORMAL"), VE_END(16)], new Float32Array(pUNNormalIndex.length * 4));
	    	/*skinned normals uses new index*/
	    	pRenderData.allocateIndex([VE_FLOAT("SN_INDEX")], new Float32Array(pSkinnedNormalIndex));
	    	pRenderData.index(iSkinnedNorm, "SN_INDEX");

	    	var iPreviousSet: uint = pRenderData.getIndexSet();

	    	var iUPIndexSet: uint = pRenderData.addIndexSet(true, EPrimitiveTypes.POINTLIST, ".update_skinned_position");
	    	pRenderData.allocateIndex([VE_FLOAT("UPP_INDEX")], pUPPositionIndex);
	    	pRenderData.index(pPosData.byteOffset, "UPP_INDEX");
	    	pRenderData.allocateIndex([VE_FLOAT("DESTINATION_SP")], pUPPositionIndex);
	    	pRenderData.index(iSkinnedPos, "DESTINATION_SP");

	    	var iUNIndexSet: uint = pRenderData.addIndexSet(true, EPrimitiveTypes.POINTLIST, ".update_skinned_normal");
	    	pRenderData.allocateIndex([VE_FLOAT("UNP_INDEX")], new Float32Array(pUNPositionIndex));
	    	pRenderData.index(pPosData.byteOffset, "UNP_INDEX");
	    	pRenderData.allocateIndex([VE_FLOAT("UNN_INDEX")], new Float32Array(pUNNormalIndex));
	    	pRenderData.index(pRenderData._getFlow(DeclUsages.NORMAL, false).data.byteOffset, "UNN_INDEX");
	    	pRenderData.allocateIndex([VE_FLOAT("DESTINATION_SN")], new Float32Array(pDestinationSkinnedNormalIndex));
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

		    return true;
		}

		update(): bool {
			return this.isSkinned() ? this.skin.applyBoneMatrices() : false;
		};

		_calculateSkin(): bool{
			var isOk: bool = util.calculateSkin(this._pRenderData);
			this._isOptimizedSkinned = isOk;
			return isOk;
		};
	}
}

#endif

