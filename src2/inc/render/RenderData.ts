#ifndef RENDERDATA_TS
#define RENDERDATA_TS

#include "IRenderData.ts"
#include "IVertexData.ts"
#include "IVertexElement.ts"
#include "bf/bitflags.ts"
#include "data/VertexDeclaration.ts"

module akra.render {
	export interface IIndexSet {
		sName: string;
		pMap: IBufferMap;
		pIndexData: IBufferData;
		pAttribData: IVertexData;
		pI2IDataCache: IntMap;
		pAdditionCache: IntMap;
	};

	export class RenderData extends util.ReferenceCounter implements IRenderData {
		/**
		 * Options.
		 */
		private _eOptions: int = 0;
		/**
		 * Buffer, that create this class.
		 */
		private _pBuffer: IRenderDataCollection = null;
		/**
		 * ID of this data.
		 */
		private _iId: int = -1;
		/**
		 * Buffer with indices.
	     * If the data is the simplest mesh, with no more
	     * than one index, the type will be IndexBuffer,
	     * otherwise VertexBuffer.
	     */
		private _pIndexBuffer: IHardwareBuffer = null;
		/**
		 * Buffer with attributes.
		 */
		private _pAttribBuffer: IVertexBuffer = null;
		 /**
	      * Data with indices.
	      * If _pIndexBuffer has type IndexBuffer, indices data
	      * has type IndexData, otherwise VertexData.
	      */
		private _pIndexData: IBufferData = null;
		/**
	     * Data with attributes.
	     */
		private _pAttribData: IVertexData = null;
		/**
	     * Buffer map for current index set.
	     */
		private _pMap: IBufferMap = null;
		/**
	     * Buffer maps of all index sets.
	     */
		private _pIndicesArray: IIndexSet[] = [];
		/**
	     * Current index set.
	     */
		private _iIndexSet: int = 0;
		private _iRenderable: int = 1;

        private _pComposer: IAFXComposer = null;


		inline get buffer(): IRenderDataCollection {
			return this._pBuffer;
		}

		inline private get indexSet(): IIndexSet {
			return this._pIndicesArray[this._iIndexSet];
		}

		constructor(pCollection: IRenderDataCollection = null) {
			super();
			this._pBuffer = pCollection;
            this._pComposer = pCollection.getEngine().getComposer();
		}

		/**
		 * Allocate data for rendering.
		 */
        allocateData(pDataDecl: IVertexElementInterface[], pData: ArrayBuffer, hasIndex: bool = true): int;
        allocateData(pDataDecl: IVertexElementInterface[], pData: ArrayBufferView, hasIndex: bool = true): int;
        allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBuffer, hasIndex: bool = true): int;
        allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBufferView, hasIndex: bool = true): int;
        allocateData(pDecl: any, pData: any, hasIndex: bool = true): int{
        	var pDataDecl: data.VertexDeclaration = createVertexDeclaration(<IVertexElementInterface[]>pDecl);
        	var eType: ERenderDataTypes = ERenderDataTypes.INDEXED;

		    if (!hasIndex || this.useSingleIndex()) {
		        eType = ERenderDataTypes.DIRECT;
		    }
		    else if (this.useAdvancedIndex()) {
		        eType = ERenderDataTypes.I2I;
		    }

		    return this._allocateData(pDataDecl, pData, eType);
        }

        /**
         * Remove data from this render data.
         */
        releaseData(iDataLocation: int): void {
        	//TODO: release data.
        }

        /**
		 * Allocate attribute.
		 * Attribute - data without index.
		 */
        allocateAttribute(pAttrDecl: IVertexDeclaration, pData: ArrayBuffer): bool;
        allocateAttribute(pAttrDecl: IVertexDeclaration, pData: ArrayBufferView): bool;
        allocateAttribute(pAttrDecl: IVertexDeclaration, pData: any): bool {
        	var pIndexData = this._pIndexData;
		    var pAttribData: IVertexData = this._pAttribData;
		    var pAttribBuffer: IVertexBuffer = this._pAttribBuffer;
		    var pBuffer: IRenderDataCollection = this._pBuffer;

		    if (!pAttribData) {
		        if (!pAttribBuffer) {
		            pAttribBuffer = pBuffer.getEngine().getResourceManager().createVertexBuffer('render_data_attrs_' + sid());
		            pAttribBuffer.create((<ArrayBufferView>pData).byteLength, EHardwareBufferFlags.BACKUP_COPY);
		            this._pAttribBuffer = pAttribBuffer;
		        }

		        this._pAttribData = this._pAttribBuffer.allocateData(pAttrDecl, pData);
		        this._pIndicesArray[this._iIndexSet].pAttribData = this._pAttribData;
		        this._pMap.flow(this._pAttribData);
		        return this._pAttribData !== null;
		    }

		    if (!pAttribData.extend(pAttrDecl, pData)) {
		        LOG('invalid data for allocation:', arguments);
		        WARNING('cannot allocate attribute in data subset..');
		        return false;
		    }

		    return true;
        }

        /**
		 * Allocate index.
		 */
		allocateIndex(pAttrDecl: IVertexElementInterface[], pData: ArrayBuffer): bool;
		allocateIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBuffer): bool;
		allocateIndex(pAttrDecl: IVertexElementInterface[], pData: ArrayBufferView): bool;
		allocateIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBufferView): bool;
		allocateIndex(pDecl: any, pData: any): bool{
			var pAttrDecl: data.VertexDeclaration = createVertexDeclaration(<IVertexElementInterface[]>pDecl);

			if (this.useAdvancedIndex()) {
		        return this._allocateAdvancedIndex(pAttrDecl, pData);
		    }
		    return this._allocateIndex(pAttrDecl, pData);
		}

		getAdvancedIndexData(sSemantics: string): IVertexData {
			return this._getData(sSemantics, true);
		}

		/**
		 * Add new set of indices.
		 */
        addIndexSet(usePreviousDataSet: bool = true, ePrimType:EPrimitiveTypes = EPrimitiveTypes.TRIANGLELIST, sName: string = null): int {

        	// if (this._pIndexData === null) {
        	//     return false;
        	// }


        	if (usePreviousDataSet) {
        	    this._pMap = this._pMap.clone(false);

        	    if (!this._pMap) {
                    debug_warning("could not clone buffer map");
        	        return -1;
        	    }
        	}
        	else {
        	    this._pMap = this._pBuffer.getEngine().createBufferMap();
        	    this._pAttribData = null;
        	}

        	this._pMap.primType = ePrimType;
        	this._pIndexData = null;
        	this._iIndexSet = this._pIndicesArray.length;
        	this._pIndicesArray.push({
        	                             pMap        	: this._pMap,
        	                             pIndexData  	: this._pIndexData,
        	                             pAttribData 	: this._pAttribData,
        	                             sName       	: sName,
        	                             pI2IDataCache	: <IntMap> null,
										 pAdditionCache	: <IntMap> null
        	                         });

        	return  this._iIndexSet;
        }

        getNumIndexSet(): int {
        	return this._pIndicesArray.length;
        }

        getIndexSetName(iSet: int = this._iIndexSet): string {
        	return this._pIndicesArray[iSet].sName;
        }

        /**
         * Select set of indices.
         */
        selectIndexSet(iSet: int): bool;
        selectIndexSet(sName: string): bool;
        selectIndexSet(a): bool {
        	var iSet: int = -1;

        	if (isString(arguments[0])) {
        		iSet = this.findIndexSet(arguments[0]);

        		if (iSet < 0) {
        			return false;
        		}
        	}
            else{
                iSet = arguments[0];
            }

        	var pIndexSet = this._pIndicesArray[iSet];

        	if (pIndexSet) {
        	    this._pMap = pIndexSet.pMap;
        	    this._pIndexData = pIndexSet.pIndexData;
        	    this._pAttribData = pIndexSet.pAttribData;
        	    this._iIndexSet = iSet;
        	    return true;
        	}

        	return false;
        }

        findIndexSet(sName: string): int {
            for (var i: int = 0; i < this._pIndicesArray.length; ++ i) {
                if (this._pIndicesArray[i].sName === <string>sName) {
                    return i;
                }
            }

            return -1;
        }

        /**
         * Get number of current index set.
         */
        getIndexSet(): int {
        	return this._iIndexSet;
        }

        inline hasAttributes(): bool {
            return !isNull(this._pAttribData);
        }

        /**
		 * Specifies uses advanced index.
		 */
        useAdvancedIndex(): bool {
        	return (this._eOptions & ERenderDataOptions.ADVANCED_INDEX) != 0;
        }

        useSingleIndex(): bool {
        	return (this._eOptions & ERenderDataOptions.SINGLE_INDEX) != 0;
        }

        useMultiIndex(): bool {
        	return (this._eOptions & ERenderDataOptions.SINGLE_INDEX) == 0;
        }

        setRenderable(bValue: bool): void;
        setRenderable(iIndexSet: int, bValue: bool): void;
        setRenderable(iIndexSet: any, bValue?: bool = true): void {
        	if (arguments.length < 2) {
        		//mark all render data as renderable or not
        		if (<bool>arguments[0]) {
        			SET_ALL(this._eOptions, ERenderDataOptions.RENDERABLE)
        		}
        		else {
        			CLEAR_ALL(this._eOptions, ERenderDataOptions.RENDERABLE);
        		}
        	}

        	//mark index set is renderable or not
        	SET_BIT(this._iRenderable, <int>iIndexSet, bValue);
        }

        isRenderable(): bool;
        isRenderable(iIndexSet: int): bool;
        isRenderable(iIndexSet?: int): bool {
        	if (arguments.length > 0) {
        		//is this index set renderable ?
        		return TEST_BIT(this._iRenderable, iIndexSet);
        	}

        	//is this data renderable ?
        	return this._eOptions & ERenderDataOptions.RENDERABLE ? true : false; 
        }

        /**
         * Check whether the semantics used in this data set.
         */
        hasSemantics(sSemantics: string, bSearchComplete: bool = true): bool {
        	return this._getFlow(sSemantics, bSearchComplete) !== null;
        }

        /**
         * Get data location.
         */
        getDataLocation(sSemantics: string): int;
        getDataLocation(iDataLocation: int): int;
        getDataLocation(sSemantics?): int {
        	var pData: IVertexData = this._getData(<string>sSemantics);

        	return pData ? pData.byteOffset : -1;
        }

        /**
         * Get indices that uses in current index set.
         */
        getIndices(): IBufferData {
        	return this._pIndexData;
        }

        getIndexFor(sSemantics: string): ArrayBufferView;
        getIndexFor(iDataLocation: int): ArrayBufferView;
        getIndexFor(sSemantics?): ArrayBufferView {
            var pFlow: IDataFlow = this._getFlow(<string>sSemantics);

            if (!isNull(pFlow.mapper)) {
                return pFlow.mapper.data.getTypedData(pFlow.mapper.semantics);
            }

            return null;
        }

        /**
         * Get number of primitives for rendering.
         */
        inline getPrimitiveCount(): uint {
        	return this._pMap.primCount;
        }

        inline getPrimitiveType(): EPrimitiveTypes {
            return this._pMap.primType;
        }

        /**
         * Setup index.
         */
        index(sData: string, sSemantics: string, useSame?: bool, iBeginWith?: int, bForceUsage?: bool): bool;
        index(iData: int, sSemantics: string, useSame?: bool, iBeginWith?: int, bForceUsage?: bool): bool;
        index(data: any, sSemantics: string, useSame: bool = false, iBeginWith: int = 0, bForceUsage?: bool = false): bool {
            var iData: int = isNumber(arguments[0]) ? arguments[0] : 0;
        	var iFlow: int = -1;
        	var iAddition: int, iRealAddition: int, iPrevAddition: int;
        	var pFlow: IDataFlow;
        	var pData: IVertexData, pRealData: IVertexData;
        	var pFloat32Array: Float32Array;
        	var iIndexOffset: uint;
        	var pIndexData: IBufferData = this._pIndexData;
        	var sData: string;
        	var iStride: int;
        	var iTypeSize: int = EDataTypeSizes.BYTES_PER_FLOAT;

        	if (this.useAdvancedIndex()) {
        	    pRealData = this._getData(<string>arguments[0]);
        	    iAddition = pRealData.byteOffset;
        	    iStride = pRealData.stride;
        	    //индекс, который подал юзер
        	    pData = this._getData(sSemantics, true); 

        	    pData.applyModifier(sSemantics, function (pTypedData: Float32Array) {
        	        for (var i: int = 0; i < pTypedData.length; i++) {
        	            pTypedData[i] = (pTypedData[i] * iStride + iAddition) / iTypeSize;
        	        }
        	    });

        	    iData = pData.byteOffset;
        	    sSemantics = "INDEX_" + sSemantics;
        	}
        	else if (isString(arguments[0])) {
        	    if (arguments[0] === "TEXCOORD") {
        	        iData = this.getDataLocation("TEXCOORD0");
        	    }
        	    else {
        	    	iData = this.getDataLocation(<string>arguments[0]);
        		}

        	    debug_assert(iData >= 0, "cannot find data with semantics: " + arguments[0]);
        	}

            pFlow = this._getFlow(iData);

        	if (pFlow === null) {
                //поищем эти данные в общем буфере
                pData = this.buffer.getData(iData);

                if (isNull(pData)) {
                    debug_warning("Could not find data flow <" + iData + "> int buffer map: " + this._pMap.toString(true));
                    return false;
                }
                //все ок, данные найдены, зарегистрируем их у себя в мапе
                ASSERT(this._addData(pData) !== -1, "could not add automatcly add data to map");
                pFlow = this._getFlow(iData);
        	}

        	iFlow = pFlow.flow;
        	iIndexOffset = (<IVertexData>pIndexData).getVertexDeclaration().findElement(sSemantics).offset;
        	pFloat32Array = <Float32Array>(<IVertexData>pIndexData).getTypedData(sSemantics);
        	iAddition = iData;

        	if (!pFloat32Array) {
        	    return false;
        	}


        	iStride = pFlow.data.stride;

        	if (this.indexSet.pAdditionCache[iIndexOffset] !== iAddition && !bForceUsage) {
        	    if (!useSame) {
        	        iPrevAddition = this.indexSet.pAdditionCache[iIndexOffset] || 0;
        	        iRealAddition = iAddition - iPrevAddition;

        	        for (var i = 0; i < pFloat32Array.length; i++) {
        	            pFloat32Array[i] = (pFloat32Array[i] * iStride + iRealAddition) / iTypeSize;
        	        }
        	        
        	    }
        	    else {
        	        iRealAddition = iAddition;
        	        for (var i = 0; i < pFloat32Array.length; i++) {
        	            pFloat32Array[i] = (iBeginWith + iRealAddition) / iTypeSize;
        	        }
        	        
        	    }

        	    //remeber addition, that we added to index.
        	    this.indexSet.pAdditionCache[iIndexOffset] = iAddition;

        	    if (!(<IVertexData>pIndexData).setData(pFloat32Array, sSemantics)) {
        	        return false;
        	    }
        	}

        	return this._pMap.mapping(iFlow, <IVertexData>pIndexData, sSemantics);
        }


		/*Setup.*/
		_setup(pCollection: IRenderDataCollection, iId: int, ePrimType: EPrimitiveTypes = EPrimitiveTypes.TRIANGLELIST, eOptions: int = 0): bool {
			if (this._pBuffer === null && arguments.length < 2) {
		        return false;
		    }

		    this.setRenderable(true);

		    this._eOptions |= eOptions;
		    this._pBuffer = pCollection;
		    this._iId = iId;

		    //setup buffer map
		    this._pMap = pCollection.getEngine().createBufferMap();
		    this._pMap.primType = ePrimType;

		    //setup default index set
		    this._pIndicesArray.push({
		                                 sName       	: ".main",
		                                 pMap        	: <IBufferMap>this._pMap,
		                                 pIndexData  	: <IBufferData>null,
		                                 pAttribData 	: <IVertexData>null,
		                                 pI2IDataCache	: <IntMap>{},
		                                 pAdditionCache : <IntMap>null
		                             });

		    debug_assert(this.useSingleIndex() === false, "single indexed data not implimented");

		    return true;
		}


        private _allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBuffer, eType: ERenderDataTypes): int;
        private _allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBufferView, eType: ERenderDataTypes): int; 
        private _allocateData(pDataDecl: IVertexDeclaration, pData: any, eType: ERenderDataTypes): int {
        	if (eType === ERenderDataTypes.DIRECT) {
		        return this.allocateAttribute(pDataDecl, pData)? 0: -1;
		    }

		    var iFlow: int;
		    var pVertexData: IVertexData = this._pBuffer._allocateData(pDataDecl, pData);
		    var iOffset: int = pVertexData.byteOffset;

		    iFlow = this._addData(pVertexData, undefined, eType);

		    if (iFlow < 0) {
		        LOG("invalid data", pDataDecl, pData);
		        debug_error("cannot allocate data for submesh");
		        return -1;
		    }

		    return iOffset;
        }

        /**
		 * Add vertex data to this render data.
		 */
        _addData(pVertexData: IVertexData, iFlow?: int, eType: ERenderDataTypes = ERenderDataTypes.DIRECT): int {

		    if ((arguments.length < 3 && this.useAdvancedIndex()) ||
		        arguments[2] === ERenderDataTypes.I2I) {
		        return this._registerData(pVertexData);
		    }

		    return (!isDef(iFlow) ? this._pMap.flow(pVertexData) :
		            this._pMap.flow(iFlow, pVertexData));
		}

		/**
		 * Register data in this render.
		 * Necessary for index to index mode, when data realy
		 * not using in this render data for building final buffer map.
		 */
		private _registerData(pVertexData: IVertexData): int {
		    'use strict';
		    var iOffset: int = pVertexData.byteOffset;
		    var pDataDecl: data.VertexDeclaration = <data.VertexDeclaration>pVertexData.getVertexDeclaration();

		    //необходимо запоминать расположение данных, которые подаются,
		    //т.к. иначе их потом нельзя будет найти среди других данных
		    for (var i: int = 0; i < pDataDecl.length; i++) {
		        this.indexSet.pI2IDataCache[pDataDecl.element(i).usage] = iOffset;
		    }
		    

		    return 0;
		};


        /**
		 * Allocate advanced index.
		 */
		 private _allocateAdvancedIndex(pAttrDecl: IVertexElementInterface[], pData: ArrayBuffer): bool; 
		 private _allocateAdvancedIndex(pAttrDecl: IVertexElementInterface[], pData: ArrayBufferView): bool; 
		 private _allocateAdvancedIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBuffer): bool; 
		 private _allocateAdvancedIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBufferView): bool; 
		 private _allocateAdvancedIndex(pAttrDecl: any, pData: any): bool {

		    var pDecl: data.VertexDeclaration = createVertexDeclaration(<IVertexElementInterface[]>pAttrDecl);
		    var nCount: int = pData.byteLength / pDecl.stride;
		    //TODO: remove index dublicates
		    var iIndLoc: int = this._allocateData(pAttrDecl, pData, ERenderDataTypes.INDEXED);
		    var pI2IData: Float32Array = new Float32Array(nCount);
		    var pI2IDecl: IVertexElementInterface[] = [];

		    for (var i: int = 0; i < pDecl.length; i++) {
		        pI2IDecl.push(VE_FLOAT('INDEX_' + pDecl.element(i).usage, 0));
		    }
		    

		    for (var i: int = 0; i < pI2IData.length; i++) {
		        pI2IData[i] = i;
		    }
		    

		    if (!this._allocateIndex(pI2IDecl, pI2IData)) {
		        this.releaseData(iIndLoc);
		        pI2IData = null;
		        pI2IDecl = null;
		        WARNING('cannot allocate index for index in render data subset');
		        return false;
		    }

		    return true;
		};

		

        /**
		 * Create IndexBuffer/IndexData for storage indices.
		 */
		private _createIndex(pAttrDecl: IVertexDeclaration, pData:ArrayBuffer): bool;
		private _createIndex(pAttrDecl: IVertexDeclaration, pData:ArrayBufferView): bool;
		private _createIndex(pAttrDecl: IVertexDeclaration, pData:any): bool{
		    'use strict';

		    if (!this._pIndexBuffer) {
		        if (this.useMultiIndex()) {
		            this._pIndexBuffer = this._pBuffer.getEngine().getResourceManager().createVertexBuffer('subset_' + sid());
		            this._pIndexBuffer.create(((<ArrayBufferView>pData).byteLength), <int>EHardwareBufferFlags.BACKUP_COPY);
		        }
		        else {
		            //TODO: add support for sinle indexed mesh.
		        }
		    }

		    this._pIndexData = (<IVertexBuffer>this._pIndexBuffer).allocateData(pAttrDecl, pData);
		    this.indexSet.pIndexData = this._pIndexData;
		    this.indexSet.pAdditionCache = <IntMap>{};
		    return this._pIndexData !== null;
		};

		/**
		 * Allocate index.
		 */
		private _allocateIndex(pAttrDecl: IVertexElementInterface[], pData: ArrayBuffer): bool;
		private _allocateIndex(pAttrDecl: IVertexElementInterface[], pData: ArrayBufferView): bool;
		private _allocateIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBuffer): bool;
		private _allocateIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBufferView): bool;
		private _allocateIndex(pDecl: any, pData: any): bool {
		    'use strict';
            var pAttrDecl: data.VertexDeclaration = createVertexDeclaration(<IVertexElementInterface[]> pDecl);

		    var pIndexData: IBufferData = this._pIndexData;
		    var pIndexBuffer: IHardwareBuffer = this._pIndexBuffer;
		    var pBuffer: IRenderDataCollection = this._pBuffer;

#ifdef DEBUG
		    for (var i: int = 0; i < pAttrDecl.length; i++) {
		        if (pAttrDecl.element(i).type !== EDataTypes.FLOAT) {
		            return false;
		        }
		    }
#endif

		    if (!this._pIndexData) {
		        return this._createIndex(pAttrDecl, pData);
		    }

		    if (!(<IVertexData>this._pIndexData).extend(pAttrDecl, pData)) {
		        LOG('invalid data for allocation:', arguments);
		        WARNING('cannot allocate index in data subset..');
		        return false;
		    }

		    return true;
		};


		_setIndexLength(iLength: uint): bool {
			var bResult: bool = (<IVertexData>this._pIndexData).resize(iLength);
			
			if(bResult) {
				this._pMap._length = iLength;
			}

			return bResult;
		}


        /**
         * Get data flow by semantics or data location.
         */
        _getFlow(iDataLocation: int): IDataFlow;
        _getFlow(sSemantics: string, bSearchComplete?: bool): IDataFlow;
        _getFlow(a, b?): IDataFlow {
        	if (typeof arguments[0] === 'string') {
		        return this._pMap.getFlow(arguments[0], arguments[1]);
		    }

		    for (var i: int = 0, n = this._pMap.limit; i < n; ++i) {
		        var pFlow = this._pMap.getFlow(i, false);

		        if (pFlow.data && pFlow.data.byteOffset === arguments[0]) {
		            return pFlow;
		        }
		    }

		    return null;
        }

        /**
         * Get data by semantics or location.
         */
        _getData(iDataLocation: int, bSearchOnlyInCurrentMap?: bool): IVertexData;
        _getData(sSemanticsn: string, bSearchOnlyInCurrentMap?: bool): IVertexData;
        _getData(a, b?): IVertexData {
        	var pFlow: IDataFlow;

        	if (this.useAdvancedIndex() && arguments.length < 2) {
        	    if (typeof arguments[0] === 'string') {
        	        return this._getData(this.indexSet.pI2IDataCache[arguments[0]]);
        	    }

        	    return this._pBuffer.getData(<string>arguments[0]);
        	}

        	if (typeof arguments[0] === 'string') {
        	    for (var i = 0, n = this._pMap.limit; i < n; ++i) {
        	        pFlow = this._pMap.getFlow(i, false);
        	        if (pFlow.data != null && pFlow.data.hasSemantics(arguments[0])) {
        	            return pFlow.data;
        	        }
        	    }

        	    return null;//this._pBuffer._getData(arguments[0]);
        	}

        	pFlow = this._getFlow(arguments[0]);
        	return pFlow === null ? null : pFlow.data;
        }

        

        /**
         * Draw this data.
         */
        _draw(pTechnique: IRenderTechnique, pViewport: IViewport, 
              pRenderable: IRenderableObject, pSceneObject: ISceneObject): void {
        	for (var i: int = 0; i < this._pIndicesArray.length; i++) {
        	    if (this.isRenderable(i)) {
        	        //this._pIndicesArray[i].pMap._draw();
                    this._pComposer.applyBufferMap(this._pIndicesArray[i].pMap);
                    pTechnique._renderTechnique(pViewport, pRenderable, pSceneObject);
        	    }
        	}
        }

        //applyMe(): bool;
        
        toString(): string {
        	var s: string;
        	s = "\nRENDER DATA SUBSET: #" + this._iId + "\n";
        	s += "        ATTRIBUTES: " + (this._pAttribData ? "TRUE" : "FALSE") + "\n";
        	s += "----------------------------------------------------------------\n";
        	s += this._pMap.toString();

        	return s;
        }
	}
}

#endif