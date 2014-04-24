/// <reference path="../idl/IRenderData.ts" />
/// <reference path="../idl/IVertexData.ts" />
/// <reference path="../idl/IVertexElement.ts" />
/// <reference path="../idl/IBufferMap.ts" />
/// <reference path="../idl/IBufferData.ts" />
/// <reference path="../idl/IRenderDataCollection.ts" />
/// <reference path="../idl/IMap.ts" />

/// <reference path="../bf/bf.ts" />
/// <reference path="VertexDeclaration.ts" />
/// <reference path="../util/ReferenceCounter.ts" />
/// <reference path="../debug.ts" />
/// <reference path="../guid.ts" />
/// <reference path="../config/config.ts" />

module akra.data {

	interface IIndexSet {
		sName: string;
		pMap: IBufferMap;
		pIndexData: IBufferData;
		pAttribData: IVertexData;
		pI2IDataCache: IMap<int>;
		pAdditionCache: IMap<int>;
	}

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
		* VextexTextureBuffer with attributes
		*/
		private _pAttribVideoBuffer: IVertexBuffer = null;

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


		getBuffer(): IRenderDataCollection {
			return this._pBuffer;
		}

		_getAttribBuffer(eType: ERenderDataAttributeTypes): IVertexBuffer {
			return eType === ERenderDataAttributeTypes.STATIC ? this._pAttribBuffer : this._pAttribVideoBuffer;
		}

		private getCurrentIndexSet(): IIndexSet {
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
		allocateData(pDataDecl: IVertexElementInterface[], pData: ArrayBuffer, hasIndex?: boolean): int;
		allocateData(pDataDecl: IVertexElementInterface[], pData: ArrayBufferView, hasIndex?: boolean): int;
		allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBuffer, hasIndex?: boolean): int;
		allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBufferView, hasIndex?: boolean): int;
		allocateData(pDecl: any, pData: any, hasIndex: boolean = true): int {
			var pDataDecl: IVertexDeclaration = VertexDeclaration.normalize(<IVertexElementInterface[]>pDecl);
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
		allocateAttribute(pDecl: IVertexElementInterface[], pData: ArrayBuffer, eType?: ERenderDataAttributeTypes): boolean;
		allocateAttribute(pDecl: IVertexDeclaration, pData: ArrayBuffer, eType?: ERenderDataAttributeTypes): boolean;
		allocateAttribute(pDecl: IVertexDeclaration, pData: ArrayBufferView, eType?: ERenderDataAttributeTypes): boolean;
		allocateAttribute(pDecl: IVertexElementInterface[], pData: ArrayBufferView, eType?: ERenderDataAttributeTypes): boolean;
		allocateAttribute(pDecl: any, pData: any, eType: ERenderDataAttributeTypes = ERenderDataAttributeTypes.STATIC): boolean {
			var pAttrDecl: IVertexDeclaration = VertexDeclaration.normalize(<IVertexElementInterface[]>pDecl);
			var pIndexData = this._pIndexData;
			var pAttribData: IVertexData = this._pAttribData;
			var pAttribBuffer: IVertexBuffer = eType === ERenderDataAttributeTypes.STATIC ? this._pAttribBuffer : this._pAttribVideoBuffer;
			var pBuffer: IRenderDataCollection = this._pBuffer;

			if (!pAttribData || eType === ERenderDataAttributeTypes.DYNAMIC) {
				if (!pAttribBuffer) {
					if (eType === ERenderDataAttributeTypes.STATIC) {
						pAttribBuffer = pBuffer.getEngine().getResourceManager().createVertexBuffer('render_data_attrs_' + guid());
						pAttribBuffer.create((<ArrayBufferView>pData).byteLength, EHardwareBufferFlags.BACKUP_COPY);
						this._pAttribBuffer = pAttribBuffer;
					}
					else {
						pAttribBuffer = pBuffer.getEngine().getResourceManager().createVideoBuffer('render_data_dynamic_attrs_' + guid());
						pAttribBuffer.create((<ArrayBufferView>pData).byteLength, EHardwareBufferFlags.BACKUP_COPY);
						this._pAttribVideoBuffer = pAttribBuffer;
					}


				}

				this._pAttribData = pAttribBuffer.allocateData(pAttrDecl, pData);
				this._pIndicesArray[this._iIndexSet].pAttribData = this._pAttribData;
				this._pMap.flow(this._pAttribData);
				return this._pAttribData !== null;
			}

			if (!pAttribData.extend(pAttrDecl, pData)) {
				logger.log('invalid data for allocation:', arguments);
				logger.warn('cannot allocate attribute in data subset..');
				return false;
			}

			return true;
		}

		/**
		 * Allocate index.
		 */
		allocateIndex(pAttrDecl: IVertexElementInterface[], pData: ArrayBuffer): boolean;
		allocateIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBuffer): boolean;
		allocateIndex(pAttrDecl: IVertexElementInterface[], pData: ArrayBufferView): boolean;
		allocateIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBufferView): boolean;
		allocateIndex(pDecl: any, pData: any): boolean {
			var pAttrDecl: IVertexDeclaration =
				VertexDeclaration.normalize(<IVertexElementInterface[]>pDecl);


			if (this.useAdvancedIndex()) {
				return this._allocateAdvancedIndex(pAttrDecl, pData);
			}

			logger.assert(!this.useSingleIndex() || isNull(pAttrDecl),
				"Index declaration(VertexDeclaration) will be ignored when SINGLE_INDEX mode used for render data");

			return this._allocateIndex(pAttrDecl, pData);
		}

		getAdvancedIndexData(sSemantics: string): IVertexData {
			return this._getData(sSemantics, true);
		}

		/**
		 * Add new set of indices.
		 */
		addIndexSet(usePreviousDataSet: boolean = true, ePrimType: EPrimitiveTypes = EPrimitiveTypes.TRIANGLELIST, sName: string = null): int {

			// if (this._pIndexData === null) {
			//     return false;
			// }


			if (usePreviousDataSet) {
				this._pMap = this._pMap.clone(false);

				if (!this._pMap) {
					debug.warn("could not clone buffer map");
					return -1;
				}
			}
			else {
				this._pMap = this._pBuffer.getEngine().createBufferMap();
				this._pAttribData = null;
			}

			this._pMap.setPrimType(ePrimType);
			this._pIndexData = null;
			this._iIndexSet = this._pIndicesArray.length;
			this._pIndicesArray.push({
				pMap: this._pMap,
				pIndexData: this._pIndexData,
				pAttribData: this._pAttribData,
				sName: sName,
				pI2IDataCache: <IMap<int>> null,
				pAdditionCache: <IMap<int>> null
			});

			return this._iIndexSet;
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
		selectIndexSet(iSet: int): boolean;
		selectIndexSet(sName: string): boolean;
		selectIndexSet(a): boolean {
			var iSet: int = -1;

			if (isString(arguments[0])) {
				iSet = this.findIndexSet(arguments[0]);

				if (iSet < 0) {
					return false;
				}
			}
			else {
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
			for (var i: int = 0; i < this._pIndicesArray.length; ++i) {
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

		hasAttributes(): boolean {
			return !isNull(this._pAttribData);
		}

		/**
		 * Specifies uses advanced index.
		 */
		useAdvancedIndex(): boolean {
			return (this._eOptions & ERenderDataOptions.ADVANCED_INDEX) != 0;
		}

		useSingleIndex(): boolean {
			return (this._eOptions & ERenderDataOptions.SINGLE_INDEX) != 0;
		}

		useMultiIndex(): boolean {
			return (this._eOptions & ERenderDataOptions.SINGLE_INDEX) == 0;
		}

		setRenderable(bValue: boolean): void;
		setRenderable(iIndexSet: int, bValue?: boolean): void;
		setRenderable(iIndexSet: any, bValue: boolean = true): void {
			if (arguments.length < 2) {
				//mark all render data as renderable or not
				if (<boolean>arguments[0]) {
					this._eOptions = bf.setAll(this._eOptions, ERenderDataOptions.RENDERABLE)
				}
				else {
					this._eOptions = bf.clearAll(this._eOptions, ERenderDataOptions.RENDERABLE);
				}
			}

			//mark index set is renderable or not
			this._iRenderable = bf.setBit(this._iRenderable, <int>iIndexSet, bValue);
		}

		isRenderable(): boolean;
		isRenderable(iIndexSet: int): boolean;
		isRenderable(iIndexSet?: int): boolean {
			if (arguments.length > 0) {
				//is this index set renderable ?
				return bf.testBit(this._iRenderable, iIndexSet);
			}

			//is this data renderable ?
			return this._eOptions & ERenderDataOptions.RENDERABLE ? true : false;
		}

		/**
		 * Check whether the semantics used in this data set.
		 */
		hasSemantics(sSemantics: string, bSearchComplete: boolean = true): boolean {
			return this._getFlow(sSemantics, bSearchComplete) !== null;
		}

		/**
		 * Get data location.
		 */
		getDataLocation(sSemantics: string): int;
		getDataLocation(iDataLocation: int): int;
		getDataLocation(sSemantics?): int {
			var pData: IVertexData = this._getData(<string>sSemantics);

			return pData ? pData.getByteOffset() : -1;
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
		getPrimitiveCount(): uint {
			return this._pMap.getPrimCount();
		}

		getPrimitiveType(): EPrimitiveTypes {
			return this._pMap.getPrimType();
		}

		/**
		 * Setup index.
		 *
		 * @param sData Data semantics.
		 * @param useSame All data will be addressed with same(zero by default) index. Default to FALSE. (??)
		 * @param iBeginWith If @useSame will be setted to TRUE, all data will be addressed with @iBeginWith address. Default to zero.
		 * @param bForceUsage If FALSE, original indices will be recalculated according to them data memory location. Default to FALSE.
		 */
		index(sData: string, sSemantics: string, useSame?: boolean, iBeginWith?: int, bForceUsage?: boolean): boolean;
		index(iData: int, sSemantics: string, useSame?: boolean, iBeginWith?: int, bForceUsage?: boolean): boolean;
		index(data: any, sSemantics: string, useSame: boolean = false, iBeginWith: int = 0, bForceUsage: boolean = false): boolean {
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

			if (this.useSingleIndex()) {
				//TODO: выяснить у Сереги, надо ли тут пересчитывать индексы??
				return;
			}

			if (this.useAdvancedIndex()) {
				pRealData = this._getData(<string>arguments[0]);
				iAddition = pRealData.getByteOffset();
				iStride = pRealData.getStride();
				//индекс, который подал юзер
				pData = this._getData(sSemantics, true);

				pData.applyModifier(sSemantics, (pTypedData: Float32Array) => {
					for (var i: int = 0; i < pTypedData.length; i++) {
						pTypedData[i] = (pTypedData[i] * iStride + iAddition) / iTypeSize;
					}
				});

				iData = pData.getByteOffset();
				sSemantics = "INDEX_" + sSemantics;
			}
			else if (isString(arguments[0])) {
				if (arguments[0] === "TEXCOORD") {
					iData = this.getDataLocation("TEXCOORD0");
					pFlow = this._getFlow("TEXCOORD0", false);
				}
				else {
					iData = this.getDataLocation(<string>arguments[0]);
					pFlow = this._getFlow(<string>arguments[0], false);
				}

				debug.assert(iData >= 0, "cannot find data with semantics: " + arguments[0]);
			}


			if (!pFlow) {
				pFlow = this._getFlow(iData);
			}

			if (pFlow === null) {
				//поищем эти данные в общем буфере
				pData = this.getBuffer().getData(iData);

				if (isNull(pData)) {
					debug.warn("Could not find data flow <" + iData + "> int buffer map: " + this._pMap.toString(true));
					return false;
				}
				//все ок, данные найдены, зарегистрируем их у себя в мапе
				logger.assert(this._addData(pData) !== -1, "could not add automatcly add data to map");
				pFlow = this._getFlow(iData);
			}

			iFlow = pFlow.flow;
			iIndexOffset = (<IVertexData>pIndexData).getVertexDeclaration().findElement(sSemantics).offset;
			pFloat32Array = <Float32Array>(<IVertexData>pIndexData).getTypedData(sSemantics);
			iAddition = iData;

			if (!pFloat32Array) {
				debug.log((<IVertexData>pIndexData).toString());
				debug.error("RenderData.index() fail! Couldn`t find indeces");
				return false;
			}


			iStride = pFlow.data.getStride();

			if (this.getCurrentIndexSet().pAdditionCache[iIndexOffset] !== iAddition && !bForceUsage) {
				if (!useSame) {
					iPrevAddition = this.getCurrentIndexSet().pAdditionCache[iIndexOffset] || 0;
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
				this.getCurrentIndexSet().pAdditionCache[iIndexOffset] = iAddition;

				if (!(<IVertexData>pIndexData).setData(pFloat32Array, sSemantics)) {
					debug.error("RenderData.index() fail! Couldn`t update indeces");
					return false;
				}
			}

			return this._pMap.mapping(iFlow, <IVertexData>pIndexData, sSemantics);
		}


		/*Setup.*/
		_setup(pCollection: IRenderDataCollection, iId: int, ePrimType: EPrimitiveTypes = EPrimitiveTypes.TRIANGLELIST, eOptions: int = 0): boolean {
			if (this._pBuffer === null && arguments.length < 2) {
				return false;
			}

			this.setRenderable(true);

			this._eOptions |= eOptions;
			this._pBuffer = pCollection;
			this._iId = iId;

			//setup buffer map
			this._pMap = pCollection.getEngine().createBufferMap();
			this._pMap.setPrimType(ePrimType);

			//setup default index set
			this._pIndicesArray.push({
				sName: ".main",
				pMap: <IBufferMap>this._pMap,
				pIndexData: <IBufferData>null,
				pAttribData: <IVertexData>null,
				pI2IDataCache: <IMap<int>>{},
				pAdditionCache: <IMap<int>>null
			});

			debug.assert(this.useSingleIndex() === false, "single indexed data not implimented");

			return true;
		}


		private _allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBuffer, eType: ERenderDataTypes): int;
		private _allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBufferView, eType: ERenderDataTypes): int;
		private _allocateData(pDataDecl: IVertexDeclaration, pData: any, eType: ERenderDataTypes): int {
			if (eType === ERenderDataTypes.DIRECT) {
				return this.allocateAttribute(pDataDecl, pData) ? 0 : -1;
			}

			var iFlow: int;
			var pVertexData: IVertexData = this._pBuffer._allocateData(pDataDecl, pData);
			var iOffset: int = pVertexData.getByteOffset();

			iFlow = this._addData(pVertexData, undefined, eType);

			if (iFlow < 0) {
				logger.log("invalid data", pDataDecl, pData);
				debug.error("cannot allocate data for submesh");
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

		_getComposer(): IAFXComposer {
			return null;
		}

		/**
		 * Register data in this render.
		 * Necessary for index to index mode, when data realy
		 * not using in this render data for building final buffer map.
		 */
		private _registerData(pVertexData: IVertexData): int {
			'use strict';
			var iOffset: int = pVertexData.getByteOffset();
			var pDataDecl: data.VertexDeclaration = <data.VertexDeclaration>pVertexData.getVertexDeclaration();

			//необходимо запоминать расположение данных, которые подаются,
			//т.к. иначе их потом нельзя будет найти среди других данных
			for (var i: int = 0; i < pDataDecl.getLength(); i++) {
				this.getCurrentIndexSet().pI2IDataCache[pDataDecl.element(i).usage] = iOffset;
			}


			return 0;
		}


		/**
		 * Allocate advanced index.
		 */
		private _allocateAdvancedIndex(pAttrDecl: IVertexElementInterface[], pData: ArrayBuffer): boolean;
		private _allocateAdvancedIndex(pAttrDecl: IVertexElementInterface[], pData: ArrayBufferView): boolean;
		private _allocateAdvancedIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBuffer): boolean;
		private _allocateAdvancedIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBufferView): boolean;
		private _allocateAdvancedIndex(pAttrDecl: any, pData: any): boolean {

			var pDecl: IVertexDeclaration = VertexDeclaration.normalize(<IVertexElementInterface[]>pAttrDecl);
			var nCount: int = pData.byteLength / pDecl.stride;
			//TODO: remove index dublicates
			var iIndLoc: int = this._allocateData(pAttrDecl, pData, ERenderDataTypes.INDEXED);
			var pI2IData: Float32Array = new Float32Array(nCount);
			var pI2IDecl: IVertexElementInterface[] = [];

			for (var i: int = 0; i < pDecl.getLength(); i++) {
				pI2IDecl.push(VertexElement.float('INDEX_' + pDecl.element(i).usage, 0));
			}


			for (var i: int = 0; i < pI2IData.length; i++) {
				pI2IData[i] = i;
			}


			if (!this._allocateIndex(pI2IDecl, pI2IData)) {
				this.releaseData(iIndLoc);
				pI2IData = null;
				pI2IDecl = null;
				logger.warn('cannot allocate index for index in render data subset');
				return false;
			}

			return true;
		}



		/**
		 * Create IndexBuffer/IndexData for storage indices.
		 */
		private _createIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBuffer): boolean;
		private _createIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBufferView): boolean;
		private _createIndex(pAttrDecl: IVertexDeclaration, pData: any): boolean {
			'use strict';


			if (this.useMultiIndex()) {
				//MULTIPLE INDEXES
				if (!this._pIndexBuffer) {
					this._pIndexBuffer = this._pBuffer.getEngine().getResourceManager().createVertexBuffer('subset_' + guid());
					this._pIndexBuffer.create(((<ArrayBufferView>pData).byteLength), <int>EHardwareBufferFlags.BACKUP_COPY);
				}

				this._pIndexData = (<IVertexBuffer>this._pIndexBuffer).allocateData(pAttrDecl, pData);
			}
			else {
				debug.assert(isNull(pAttrDecl),
					"Index declaration(VertexDeclaration) will be ignored when SINGLE_INDEX mode used for render data");
				debug.assert(pData instanceof Uint16Array, "Indexes must be packed to Uint16Array");

				//SINGLE INDEX
				if (!this._pIndexBuffer) {
					this._pIndexBuffer = this._pBuffer.getEngine().getResourceManager().createIndexBuffer('subset_' + guid());
					this._pIndexBuffer.create(((<ArrayBufferView>pData).byteLength),
						<int>EHardwareBufferFlags.BACKUP_COPY | EHardwareBufferFlags.STATIC);
				}

				this._pIndexData = (<IIndexBuffer>this._pIndexBuffer).allocateData(this._pMap.getPrimType(), EDataTypes.UNSIGNED_SHORT, pData);
			}


			
			this.getCurrentIndexSet().pIndexData = this._pIndexData;
			this.getCurrentIndexSet().pAdditionCache = <IMap<int>>{}
			return this._pIndexData !== null;
		}

		/**
		 * Allocate index.
		 */
		private _allocateIndex(pAttrDecl: IVertexElementInterface[], pData: ArrayBuffer): boolean;
		private _allocateIndex(pAttrDecl: IVertexElementInterface[], pData: ArrayBufferView): boolean;
		private _allocateIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBuffer): boolean;
		private _allocateIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBufferView): boolean;
		private _allocateIndex(pDecl: any, pData: any): boolean {
			'use strict';

			var pAttrDecl: IVertexDeclaration =
				VertexDeclaration.normalize(<IVertexElementInterface[]> pDecl);

			var pIndexData: IBufferData = this._pIndexData;
			var pIndexBuffer: IHardwareBuffer = this._pIndexBuffer;
			var pBuffer: IRenderDataCollection = this._pBuffer;

			if (config.DEBUG) {
				for (var i: int = 0; i < pAttrDecl.getLength(); i++) {
					if (pAttrDecl.element(i).type !== EDataTypes.FLOAT) {
						return false;
					}
				}
			}

			if (!this._pIndexData) {
				return this._createIndex(pAttrDecl, pData);
			}
			else {
				logger.assert(!this.useSingleIndex(), "Multiple indexes not allowed for SINGLE_INDEX'ed render data.");
			}

			
			if (!(<IVertexData>this._pIndexData).extend(pAttrDecl, pData)) {
				logger.log('invalid data for allocation:', arguments);
				logger.warn('cannot allocate index in data subset..');
				return false;
			}
			

			return true;
		}


		_setIndexLength(iLength: uint): boolean {
			var bResult: boolean = (<IVertexData>this._pIndexData).resize(iLength);

			if (bResult) {
				this._pMap._setLengthForce(iLength);
			}

			return bResult;
		}


		/**
		 * Get data flow by semantics or data location.
		 */
		_getFlow(iDataLocation: int): IDataFlow;
		_getFlow(sSemantics: string, bSearchComplete?: boolean): IDataFlow;
		_getFlow(a, b?): IDataFlow {
			if (typeof arguments[0] === 'string') {
				return this._pMap.getFlow(arguments[0], arguments[1]);
			}

			for (var i: int = 0, n = this._pMap.getLimit(); i < n; ++i) {
				var pFlow = this._pMap.getFlow(i, false);

				if (pFlow.data && pFlow.data.getByteOffset() === arguments[0]) {
					return pFlow;
				}
			}

			return null;
		}

		/**
		 * Get data by semantics or location.
		 */
		_getData(iDataLocation: int, bSearchOnlyInCurrentMap?: boolean): IVertexData;
		_getData(sSemanticsn: string, bSearchOnlyInCurrentMap?: boolean): IVertexData;
		_getData(a, b?): IVertexData {
			var pFlow: IDataFlow;

			if (this.useAdvancedIndex() && arguments.length < 2) {
				if (typeof arguments[0] === 'string') {
					return this._getData(this.getCurrentIndexSet().pI2IDataCache[arguments[0]]);
				}

				return this._pBuffer.getData(<string>arguments[0]);
			}

			if (typeof arguments[0] === 'string') {
				for (var i = 0, n = this._pMap.getLimit(); i < n; ++i) {
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

		//applyMe(): boolean;

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

