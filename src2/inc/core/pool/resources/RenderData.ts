#ifndef RENDERDATA_TS
#define RENDERDATA_TS

#include "IRenderData.ts"
#include "IVertexData.ts"
#include "IVertexElement.ts"

module akra.core.pool.resources {
	interface iIndexSet {
		sName: string;
		pMap: IBufferMap;
		pIndexData: IBufferData;
		pAttribData: IVertexData;
	};

	export class RenderData implements IRenderData extends ReferenceCounter {
		/**
		 * Options.
		 */
		private _eOptions: int = 0;
		/**
		 * Buffer, that create this class.
		 */
		private _pBuffer: IVertexBuffer = null;
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
		private _pIndicesArray: IIndexSet = [];
		/**
	     * Current index set.
	     */
		private _iIndexSet: int = 0;
		private _iRenderable: int = 1;


		inline get buffer(): IVertexBuffer{
			return this._pBuffer;
		}

		constructor(pBuffer){
			this._pBuffer = pBuffer || null;
		}

		/*Setup.*/
		protected setup(pBuffer: IVertexBuffer, iId: int, ePrimType: EPrimitiveTypes = EPrimitiveTypes.TRIANGLELIST, eOptions: int = 0): bool {
			if (this._pBuffer === null && arguments.length < 2) {
		        return false;
		    }

		    this.renderable(true);

		    this._eOptions |= eOptions;
		    this._pBuffer = pBuffer;
		    this._iId = iId;

		    //setup buffer map
		    this._pMap = new a.BufferMap(pBuffer.getEngine());
		    this._pMap.primType = ePrimType;
		    this._pMap._pI2IDataCache = {};

		    //setup default index set
		    this._pIndicesArray.push({
		                                 pMap        : this._pMap,
		                                 pIndexData  : null,
		                                 pAttribData : null,
		                                 sName       : ".main"
		                             });

		    debug_assert(this.useSingleIndex() === false, 'single indexed data not implimented');

		    return true;
		}

        renderable(bValue: bool): void {
        	bValue ? SET_ALL(this._eOptions, ERenderDataOptions.RENDERABLE): CLEAR_ALL(this._eOptions, ERenderDataOptions.RENDERABLE);
        }

        /*isRenderable(): bool {
        	return this._eOptions & a.RenderData.RENDERABLE ? true : false;
        }*/

        private _allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBuffer, eType: ERenderDataTypes): int;
        private _allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBufferView, eType: ERenderDataTypes): int; 
        private _allocateData(pDataDecl: IVertexDeclaration, pData: any, eType: ERenderDataTypes): int {
        	if (eType === a.RenderData.DT_DIRECT) {
		        return this.allocateAttribute(pDataDecl, pData);
		    }

		    var iFlow: int;
		    var pVertexData: IVertexData = this._pBuffer._allocateData(pDataDecl, pData);
		    var iOffset: int = pVertexData.getOffset();

		    iFlow = this._addData(pVertexData, undefined, eType);

		    if (iFlow < 0) {
		        trace('invalid data', pDataDecl, pData);
		        debug_assert('cannot allocate data for submesh');
		        return -1;
		    }

		    return iOffset;
        }

        /**
		 * Add vertex data to this render data.
		 */
        _addData(pVertexData: IVertexData, iFlow?: int, eType: ERenderDataTypes = ERenderDataTypes.TRIANGLELIST): int {

		    if ((arguments.length < 3 && this.useAdvancedIndex()) ||
		        arguments[2] === a.RenderData.DT_I2I) {
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
		    var iOffset: int = pVertexData.getOffset();
		    var pDataDecl: IVertexDeclaration = pVertexData.getVertexDeclaration();

		    //необходимо запоминать расположение данных, которые подаются,
		    //т.к. иначе их потом нельзя будет найти среди других данных
		    for (var i: int = 0; i < pDataDecl.length; i++) {
		        this._pMap._pI2IDataCache[pDataDecl[i].eUsage] = iOffset;
		    }
		    ;

		    return 0;
		};

		/**
		 * Allocate data for rendering.
		 */
        allocateData(pDataDecl: IVertexElementInterface[], pData: ArrayBuffer, hasIndex: bool = true): int;
        allocateData(pDataDecl: IVertexElementInterface[], pData: ArrayBufferView, hasIndex: bool = true): int;
        allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBuffer, hasIndex: bool = true): int;
        allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBufferView, hasIndex: bool = true): int;
        allocateData(pDecl: any, pData: any, hasIndex: bool = true): int{
        	var pDataDecl: IVertexDeclaration = createVertexDeclaration(<IVertexElementInterface[]>pDecl);
        	var eType: ERenderDataTypes = ERenderDataTypes.INDEXED;

		    if (!hasIndex || this.useSingleIndex()) {
		        eType = a.RenderData.DT_DIRECT;
		    }
		    else if (this.useAdvancedIndex()) {
		        eType = a.RenderData.DT_I2I;
		    }

		    return this._allocateData(pDataDecl, pData, eType);
        }

        /**
		 * Specifies uses advanced index.
		 */
        useAdvancedIndex(): bool {
        	return (this._eOptions & a.RenderData.ADVANCED_INDEX) != 0;
        }

        useSingleIndex(): bool {
        	return (this._eOptions & a.RenderData.SINGLE_INDEX) != 0;
        }

        useMultiIndex(): bool {
        	return (this._eOptions & a.RenderData.SINGLE_INDEX) == 0;
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
		    var pBuffer: IVertexBuffer = this._pBuffer;

		    if (!pAttribData) {
		        if (!pAttribBuffer) {
		            pAttribBuffer = pBuffer.getEngine().displayManager()
		                .vertexBufferPool().createResource('render_data_attrs_' + a.sid());
		            pAttribBuffer.create(0, FLAG(a.VBufferBase.RamBackupBit));
		            this._pAttribBuffer = pAttribBuffer;
		        }

		        this._pAttribData = this._pAttribBuffer.allocateData(pAttrDecl, pData);
		        this._pIndicesArray[this._iIndexSet].pAttribData = this._pAttribData;
		        this._pMap.flow(this._pAttribData);
		        return this._pAttribData !== null;
		    }

		    if (!pAttribData.extend(pAttrDecl, pData)) {
		        trace('invalid data for allocation:', arguments);
		        warning('cannot allocate attribute in data subset..');
		        return false;
		    }

		    return true;
        }

        /**
		 * Allocate advanced index.
		 */
		 private _allocateAdvancedIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBuffer): bool; 
		 private _allocateAdvancedIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBufferView): bool; 
		 private _allocateAdvancedIndex(pAttrDecl: IVertexDeclaration, pData: any): bool {

		    var pDecl = a.normalizeVertexDecl(pAttrDecl);
		    var nCount: int = pData.byteLength / pDecl.iStride;
		    //TODO: remove index dublicates
		    var iIndLoc: int = this._allocateData(pAttrDecl, pData, a.RenderData.DT_INDEXED);
		    var pI2IData: Float32Array = new Float32Array(nCount);
		    var pI2IDecl = [];

		    for (var i: int = 0; i < pDecl.length; i++) {
		        pI2IDecl.push(VE_FLOAT('INDEX_' + pDecl[i].eUsage, 0));
		    }
		    ;

		    for (var i: int = 0; i < pI2IData.length; i++) {
		        pI2IData[i] = i;
		    }
		    ;

		    if (!this._allocateIndex(pI2IDecl, pI2IData)) {
		        this.releaseData(iIndLoc);
		        pI2IData = null;
		        pI2IDecl = null;
		        warning('cannot allocate index for index in render data subset');
		        return false;
		    }

		    return true;
		};

		

        /**
		 * Create IndexBuffer/IndexData for storage indices.
		 */
		private _createIndex(pAttrDecl: IVertexDeclaration, pData:ArrayBuffer): bool;
		private _createIndex(pAttrDecl: IVertexDeclaration, pData:ArrayBufferView): bool;
		private _createIndex(pAttrDecl: IVertexDeclaration, pData:ArrayBufferView): bool{
		    'use strict';

		    if (!this._pIndexBuffer) {
		        if (this.useMultiIndex()) {
		            this._pIndexBuffer = this._pBuffer.getEngine().displayManager()
		                .vertexBufferPool().createResource('subset_' + a.sid());
		            this._pIndexBuffer.create(0, FLAG(a.VBufferBase.RamBackupBit));
		        }
		        else {
		            //TODO: add support for sinle indexed mesh.
		        }
		    }

		    this._pIndexData = this._pIndexBuffer.allocateData(pAttrDecl, pData);
		    this._pIndexData._iAdditionCache = {};
		    this._pIndicesArray[this._iIndexSet].pIndexData = this._pIndexData;
		    return this._pIndexData !== null;
		};

		/**
		 * Allocate index.
		 */
		private _allocateIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBuffer): bool;
		private _allocateIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBufferView): bool;
		private _allocateIndex(pAttrDecl: IVertexDeclaration, pData: any): bool {
		    'use strict';

		    var pIndexData = this._pIndexData;
		    var pIndexBuffer = this._pIndexBuffer;
		    var pBuffer: IVertexBuffer = this._pBuffer;

		    Ifdef(__DEBUG)
		    for (var i: int = 0; i < pAttrDecl.length; i++) {
		        if (pAttrDecl[i].eType !== a.DTYPE.FLOAT) {
		            return false;
		        }
		    }
		    ;
		    Endif();

		    if (!this._pIndexData) {
		        return this._createIndex(pAttrDecl, pData);
		    }

		    if (!this._pIndexData.extend(pAttrDecl, pData)) {
		        trace('invalid data for allocation:', arguments);
		        warning('cannot allocate index in data subset..');
		        return false;
		    }

		    return true;
		};

		/**
		 * Allocate index.
		 */
		allocateIndex(pAttrDecl: IVertexElementInterface[], pData: ArrayBuffer): bool;
		allocateIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBuffer): bool;
		allocateIndex(pAttrDecl: IVertexElementInterface[], pData: ArrayBufferView): bool;
		allocateIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBufferView): bool;
		allocateIndex(pDecl: any, pData: any): bool{
			var pAttrDecl: IVertexDeclaration = createVertexDeclaration(<IVertexElementInterface[]>pDecl);
			if (this.useAdvancedIndex()) {
		        return this._allocateAdvancedIndex(pAttrDecl, pData);
		    }
		    return this._allocateIndex(pAttrDecl, pData);
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
        	        return -1;
        	    }
        	}
        	else {
        	    this._pMap = new a.BufferMap(this._pBuffer.getEngine());
        	    this._pAttribData = null;
        	}

        	this._pMap.primType = ePrimType;
        	this._pIndexData = null;
        	this._iIndexSet = this._pIndicesArray.length;
        	this._pIndicesArray.push({
        	                             pMap        : this._pMap,
        	                             pIndexData  : this._pIndexData,
        	                             pAttribData : this._pAttribData,
        	                             sName       : sName
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
        		for (var i: int = 0; i < this._pIndicesArray.length; ++ i) {
        			if (this._pIndicesArray[i].sName === <string>arguments[0]) {
        				iSet = i;
        				break;
        			}
        		};

        		if (iSet < 0) {
        			return false;
        		}
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

        /**
         * Get number of current index set.
         */
        getIndexSet(): int {
        	return this._iIndexSet;
        }

        setRenderable(iIndexSet: int = this.getIndexSet(), bValue: bool = true): bool{
        	SET_BIT(this._iRenderable, iIndexSet, bValue);
        	return true;
        }

        isRenderable(iIndexSet: int = this.getIndexSet()): bool {
        	return TEST_BIT(this._iRenderable, iIndexSet);
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
        getDataLocation(sSemantics: string): int {
        	var pData: IVertexData = this._getData(sSemantics);

        	return pData ? pData.getOffset() : -1;
        }

        /**
         * Get indices that uses in current index set.
         */
        getIndices(): IBufferData {
        	return this._pIndexData;
        }

        /**
         * Get data flow by semantics or data location.
         */
        _getFlow(iDataLocation: int): IDataFlow;
        _getFlow(sSemantics: string, bSearchComplete?: bool): IDataFlow;
        _getFlow(a?, b): IDataFlow {
        	if (typeof arguments[0] === 'string') {
		        return this._pMap._getFlow(arguments[0], arguments[1]);
		    }

		    for (var i: int = 0, pFlows = this._pMap._pFlows, n = pFlows.length; i < n; ++i) {
		        var pFlow = pFlows[i];

		        if (pFlow.pData && pFlow.pData.getOffset() === arguments[0]) {
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
        	        return this._getData(this._pMap._pI2IDataCache[arguments[0]]);
        	    }

        	    return this._pBuffer._getData(arguments[0]);
        	}

        	if (typeof arguments[0] === 'string') {
        	    for (var i = 0, pFlows = this._pMap._pFlows, n = pFlows.length; i < n; ++i) {
        	        pFlow = pFlows[i];
        	        if (pFlow.pData != null && pFlow.pData.hasSemantics(arguments[0])) {
        	            return pFlow.pData;
        	        }
        	    }

        	    return null;//this._pBuffer._getData(arguments[0]);
        	}

        	pFlow = this._getFlow(arguments[0]);
        	return pFlow === null ? null : pFlow.pData;
        }

        /**
         * Get number of primitives for rendering.
         */
        getPrimitiveCount(): uint {
        	return this._pMap.primCount;
        }

        /**
         * Setup index.
         */
        index(iData: int, sSemantics: string, useSame?: bool, iBeginWith?: int): bool {
        	iBeginWith = iBeginWith || 0;
        	useSame = useSame || false;

        	var iFlow: int = -1;
        	var iAddition: int, iRealAddition: int, iPrevAddition: int;
        	var pFlow: IDataFlow;
        	var pData: IVertexData, pRealData: IVertexData;
        	var iIndexOffset: uint;
        	var pIndexData = this._pIndexData;
        	var sData: string;
        	var iStride: int;
        	var iTypeSize: int = 4;//a.getTypeSize(a.DTYPE.FLOAT);

        	if (this.useAdvancedIndex()) {
        	    pRealData = this._getData(iData);
        	    iAddition = pRealData.getOffset();
        	    iStride = pRealData.stride;
        	    pData = this._getData(eSemantics, true); //индекс, который подал юзер

        	    pData.applyModifier(eSemantics, function (pTypedData) {
        	        for (var i: int = 0; i < pTypedData.length; i++) {
        	            pTypedData[i] = (pTypedData[i] * iStride + iAddition) / iTypeSize;
        	        }
        	        ;
        	    });

        	    iData = pData.getOffset();
        	    eSemantics = 'INDEX_' + eSemantics;
        	}
        	else if (typeof arguments[0] === 'string') {
        	    if (arguments[0] === 'TEXCOORD') {
        	        iData = 'TEXCOORD0';
        	    }
        	    iData = this._getDataLocation(iData);

        	    debug_assert(iData >= 0, 'cannot find data with semantics: ' + arguments[0]);
        	}

        	pFlow = this._getFlow(iData);

        	if (pFlow === null) {
        	    return false;
        	}

        	iFlow = pFlow.iFlow;
        	iIndexOffset = pIndexData._pVertexDeclaration.element(eSemantics).iOffset;
        	pData = pIndexData.getTypedData(eSemantics);
        	iAddition = iData;

        	if (!pData) {
        	    return false;
        	}


        	iStride = pFlow.pData.stride;

        	if (pIndexData._iAdditionCache[iIndexOffset] !== iAddition) {
        	    if (!useSame) {
        	        iPrevAddition = pIndexData._iAdditionCache[iIndexOffset] || 0;
        	        iRealAddition = iAddition - iPrevAddition;

        	        for (var i = 0; i < pData.length; i++) {
        	            pData[i] = (pData[i] * iStride + iRealAddition) / iTypeSize;
        	        }
        	        ;
        	    }
        	    else {
        	        iRealAddition = iAddition;
        	        for (var i = 0; i < pData.length; i++) {
        	            pData[i] = (iBeginWith + iRealAddition) / iTypeSize;
        	        }
        	        ;
        	    }

        	    //remeber addition, that we added to index.
        	    pIndexData._iAdditionCache[iIndexOffset] = iAddition;

        	    if (!pIndexData.setData(pData, eSemantics)) {
        	        return false;
        	    }
        	}

        	return this._pMap.mapping(iFlow, pIndexData, eSemantics);
        }

        /**
         * Draw this data.
         */
        draw(): bool {
        	var isOK: bool = true;
        	var bResult: bool;
        	var i: int;
        	for (i = 0; i < this._pIndicesArray.length; i++) {
        	    if (this.isRenderable(i)) {
        	        this._pBuffer._pEngine.shaderManager().getActiveProgram().applyBufferMap(this._pIndicesArray[i].pMap);
        	        bResult = this._pIndicesArray[i].pMap.draw();
        	        //trace(this._pIndicesArray[i].pMap.toString());
        	        isOK = isOK && bResult;
        	    }
        	}
        	return isOK;
        }

        //applyMe(): bool;
        
        toString(): string {
        	var s: string;
        	s = 'RENDER DATA SUBSET: #' + this._iId + '\n';
        	s += '        ATTRIBUTES: ' + (this._pAttribData ? 'TRUE' : 'FALSE') + '\n';
        	s += '----------------------------------------------------------------\n';
        	s += this._pMap.toString();

        	return s;
        }
	}
}

#endif