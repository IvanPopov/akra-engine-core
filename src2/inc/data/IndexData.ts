#ifndef INDEXDATA_TS
#define INDEXDATA_TS

#include "IBufferData.ts"
#include "IIndexBuffer.ts"


module akra.data {
	export class IndexData implements IBufferData {
		private _pIndexBuffer: IIndexBuffer;
		private _iOffset: uint;
		private _iCount: uint;
		private _ePrimitiveType: EPrimitiveTypes;
		private _eElementsType: EDataTypes;

		/** @inline */
		get type(): uint { return this._eElementsType; };
		/** @inline */
		get count(): uint { return this._iCount; };
		/** @inline */
		get bytesPerIndex(): uint { return getTypeSize(this._eElementsType); };
		/** @inline */
		get offset(): uint { return this._iOffset; };
		/** @inline */
		get byteLength(): uint { return this._iCount * this.bytesPerIndex; };
		/** @inline */
		get buffer(): IIndexBuffer { return this._pIndexBuffer; };

		constructor (
			pIndexBuffer: IIndexBuffer, 
			iOffset: int, 
			iCount: int, 
			ePrimitiveType: EPrimitiveTypes = EPrimitiveTypes.TRIANGLELIST, 
			eElementsType: EDataTypes = EDataTypes.UNSIGNED_SHORT) {

			debug_assert(
				eElementsType == EDataTypes.UNSIGNED_SHORT || 
				eElementsType == EDataTypes.UNSIGNED_BYTE || 
				eElementsType == EDataTypes.UNSIGNED_INT, "supported only short, byte, uint data types.");

			this._pIndexBuffer = pIndexBuffer;
			this._iOffset = iOffset;
			this._iCount = iCount;

			debug_assert(pIndexBuffer.byteLength >= this.byteLength + this.offset, "out of buffer limits.");
		}


		getData(iOffset: int, iSize: int): ArrayBuffer {
			debug_assert(iOffset + iSize <= this.byteLength, "out of buffer limits");

			return this._pIndexBuffer.getData(this.offset + iOffset, iSize);
		}

		setData(pData: ArrayBufferView, iOffset: int, iCount: uint): bool {
			debug_assert((iOffset + iCount) * this.bytesPerIndex <= this.byteLength, "out of buffer limits.");
			
			return this._pIndexBuffer.setData(
				pData.buffer, 
				this.offset + iOffset * this.bytesPerIndex, 
				iCount * this.bytesPerIndex);
		}

		destroy(): void {
			this._pIndexBuffer = null;
			this._iOffset = undefined;
			this._iCount = undefined;
			this._eElementsType = undefined;
			this._eElementsType = undefined;
		}
		
		/** @inline */
		getPrimitiveType(): EPrimitiveTypes {
			return this._ePrimitiveType;
		}

		/** @inline */
		getPrimitiveCount(iIndexCount?: uint): uint {
			switch (arguments.length) {
		        case 0:
		            // when no count is specified, use the total count of indices
		            return this.getPrimitiveCount(this.count);
		        case 1:
		            var iCount: uint = iIndexCount;

		            switch (this._ePrimitiveType) {
			            case EPrimitiveTypes.TRIANGLELIST:
			                return iCount / 3.;
			            case EPrimitiveTypes.POINTLIST:
			                return iCount;
			            case EPrimitiveTypes.TRIANGLESTRIP:
			            case EPrimitiveTypes.TRIANGLEFAN:
			            	return iCount / 3 - 2;
			            default:
			            	debug_error("todo: count for other types..");
			        }
		    }

		    return 0;
		}
	}
}

#endif