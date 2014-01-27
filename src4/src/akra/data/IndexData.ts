/// <reference path="../idl/IBufferData.ts" />
/// <reference path="../idl/IIndexBuffer.ts" />
/// <reference path="../idl/EPrimitiveTypes.ts" />

/// <reference path="../debug.ts" />
/// <reference path="../types.ts" />

module akra.data {
	export class IndexData implements IIndexData {
		private _pIndexBuffer: IIndexBuffer;
		private _iOffset: uint;
		private _iLength: uint;
		private _ePrimitiveType: EPrimitiveTypes;
		private _eElementsType: EDataTypes;
		private _iId: int;

		getID(): uint {
			return this._iId;
		}

		getType(): EDataTypes {
			return this._eElementsType;
		}

		getLength(): uint {
			return this._iLength;
		}

		getBytesPerIndex(): uint {
			return sizeof(this._eElementsType);
		}

		getByteOffset(): uint {
			return this._iOffset;
		}

		getByteLength(): uint {
			return this._iLength * this.getBytesPerIndex();
		}

		getBuffer(): IIndexBuffer {
			return this._pIndexBuffer;
		}

		constructor(
			pIndexBuffer: IIndexBuffer,
			id: uint,
			iOffset: int,
			iCount: int,
			ePrimitiveType: EPrimitiveTypes = EPrimitiveTypes.TRIANGLELIST,
			eElementsType: EDataTypes = EDataTypes.UNSIGNED_SHORT) {

			logger.presume(
				eElementsType == EDataTypes.UNSIGNED_SHORT ||
				eElementsType == EDataTypes.UNSIGNED_BYTE ||
				eElementsType == EDataTypes.UNSIGNED_INT, "supported only short, byte, uint data types.");

			this._pIndexBuffer = pIndexBuffer;
			this._iOffset = iOffset;
			this._iLength = iCount;
			this._iId = id;

			this._ePrimitiveType = ePrimitiveType;
			this._eElementsType = eElementsType;

			logger.presume(pIndexBuffer.getByteLength() >= this.getByteLength() + this.getByteOffset(), "out of buffer limits.");
		}


		getData(iOffset: int, iSize: int): ArrayBuffer {
			logger.presume(iOffset + iSize <= this.getByteLength(), "out of buffer limits");
			var pBuffer: Uint8Array = new Uint8Array(iSize);

			if (this._pIndexBuffer.readData(this.getByteOffset() + iOffset, iSize, pBuffer)) {
				return pBuffer.buffer;
			}

			logger.presume(false, "cannot read data from index buffer");

			return null;
		}

		getTypedData(iStart: int, iCount: int): ArrayBufferView {
			logger.presume((iStart + iCount) <= this._iLength, "out of buffer limits");

			var iTypeSize: uint = sizeof(this._eElementsType);

			var iOffset: uint = iStart * iTypeSize;
			var iSize: uint = iCount * iTypeSize;

			var pBuffer: Uint8Array = new Uint8Array(iSize);

			if (this._pIndexBuffer.readData(this.getByteOffset() + iOffset, iSize, pBuffer)) {
				switch (this._eElementsType) {
					case EDataTypes.UNSIGNED_BYTE:
						return pBuffer;
					case EDataTypes.UNSIGNED_SHORT:
						return new Uint16Array(pBuffer.buffer);
					case EDataTypes.UNSIGNED_INT:
						return new Uint32Array(pBuffer.buffer);
					default:
						return null;
				}
			}

			return null;
		}

		setData(pData: ArrayBufferView, iOffset: int = 0, iCount: uint = pData.byteLength / this.getBytesPerIndex()): boolean {
			logger.presume((iOffset + iCount) * this.getBytesPerIndex() <= this.getByteLength(), "out of buffer limits.");

			return this._pIndexBuffer.writeData(
				pData,
				this.getByteOffset() + iOffset * this.getBytesPerIndex(),
				iCount * this.getBytesPerIndex());
		}

		destroy(): void {
			this._pIndexBuffer = null;
			this._iOffset = undefined;
			this._iLength = undefined;
			this._eElementsType = undefined;
			this._eElementsType = undefined;
		}

		getPrimitiveType(): EPrimitiveTypes {
			return this._ePrimitiveType;
		}

		getPrimitiveCount(iIndexCount: uint = this.getLength()): uint {
			return IndexData.getPrimitiveCount(this._ePrimitiveType, iIndexCount);
		}

		getBufferHandle(): int {
			return this._pIndexBuffer.getResourceHandle();
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

			debug.log("unhandled case detected..");

			return 0;
		}
	}
}

