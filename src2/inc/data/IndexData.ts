#ifndef INDEXDATA_TS
#define INDEXDATA_TS

#include "IBufferData.ts"
#include "IIndexBuffer.ts"


module akra.data {
	export class IndexData implements IIndexData {
		private _pIndexBuffer: IIndexBuffer;
		private _iOffset: uint;
		private _iLength: uint;
		private _ePrimitiveType: EPrimitiveTypes;
		private _eElementsType: EDataTypes;
		private _iId: int;

		inline get id(): uint { return this._iId; }
		inline get type(): uint { return this._eElementsType; };
		inline get length(): uint { return this._iLength; };
		inline get bytesPerIndex(): uint { return getTypeSize(this._eElementsType); };
		inline get byteOffset(): uint { return this._iOffset; };
		inline get byteLength(): uint { return this._iLength * this.bytesPerIndex; };
		inline get buffer(): IIndexBuffer { return this._pIndexBuffer; };

		constructor (
			pIndexBuffer: IIndexBuffer, 
			id: uint,
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
			this._iLength = iCount;
			this._iId = id;

			debug_assert(pIndexBuffer.byteLength >= this.byteLength + this.byteOffset, "out of buffer limits.");
		}


		getData(iOffset: int, iSize: int): ArrayBuffer {
			debug_assert(iOffset + iSize <= this.byteLength, "out of buffer limits");
			var pBuffer: Uint8Array = new Uint8Array(iSize);
			
			if (this._pIndexBuffer.readData(this.byteOffset + iOffset, iSize, pBuffer)) {
				return pBuffer.buffer;
			}

			debug_error("cannot read data from index buffer");

			return null;
		}

		setData(pData: ArrayBufferView, iOffset: int = 0, iCount: uint = pData.byteLength / this.bytesPerIndex): bool {
			debug_assert((iOffset + iCount) * this.bytesPerIndex <= this.byteLength, "out of buffer limits.");
			
			return this._pIndexBuffer.writeData(
				pData, 
				this.byteOffset + iOffset * this.bytesPerIndex, 
				iCount * this.bytesPerIndex);
		}

		destroy(): void {
			this._pIndexBuffer = null;
			this._iOffset = undefined;
			this._iLength = undefined;
			this._eElementsType = undefined;
			this._eElementsType = undefined;
		}
		
		inline getPrimitiveType(): EPrimitiveTypes {
			return this._ePrimitiveType;
		}

		inline getPrimitiveCount(iIndexCount: uint = this.length): uint {
			return IndexData.getPrimitiveCount(this._ePrimitiveType, iIndexCount);
		}

		inline getBufferHandle(): int {
			return this._pIndexBuffer.resourceHandle;
		}

		static getPrimitiveCount(eType: EPrimitiveTypes, nVertices: uint): uint {
			switch (eType) {
	            case EPrimitiveTypes.POINTLIST:
	                return nVertices;
	            case EPrimitiveTypes.LINELIST: 
	            	return nVertices / 2;
	            case EPrimitiveTypes.LINESTRIP: 
	            	return nVertices - 1;
	            case EPrimitiveTypes.LINELOOP:
	            	return nVertices;
	            case EPrimitiveTypes.TRIANGLELIST:
	                return nVertices / 3;
	            case EPrimitiveTypes.TRIANGLEFAN:
	            case EPrimitiveTypes.TRIANGLESTRIP:
	            	return nVertices - 2;
	        }

	        debug_error("unhandled case detected..");

	        return 0;
		}
	}
}

#endif