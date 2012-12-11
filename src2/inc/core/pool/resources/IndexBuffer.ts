#ifndef INDEXBUFFER_TS
#define INDEXBUFFER_TS

#include "IIndexBuffer.ts"
#include "HardwareBuffer.ts"
#include "data/IndexData.ts"

module akra.core.pool.resources {
	
	interface IBufferHole {
		start: uint;
		end: uint;
	}

	export class IndexBuffer extends HardwareBuffer implements IIndexBuffer {
		protected _pIndexDataArray: IIndexData[] = [];
		protected _iDataCounter: uint = 0;

		inline get length(): uint {
			return this._pIndexDataArray.length;
		}

		constructor (/*pManager: IResourcePoolManager*/) {
			super(/*pManager*/);

		}

		create(iByteSize: uint, iFlags?: uint, pData?: Uint8Array): bool;
		create(iByteSize: uint, iFlags?: uint, pData?: ArrayBufferView): bool;
		create(iByteSize: uint, iFlags?: uint, pData?: any): bool {
			super.create(iFlags || 0);

			if (TEST_ANY(iFlags, EHardwareBufferFlags.BACKUP_COPY)) {
				this._pBackupCopy = new MemoryBuffer();
				this._pBackupCopy.create(iByteSize);
				this._pBackupCopy.writeData(pData, 0, iByteSize);
			}

			return true;
		}

		destroy(): bool {
			super.destroy();
			
			this._pBackupCopy.destroy();
			this.freeIndexData();

			this._iDataCounter = 0;
		}

		getIndexData(iOffset: uint, iCount: uint, ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes): IIndexData {
			var pIndexData: IIndexData = new data.IndexData(this, this._iDataCounter ++, iOffset, iCount, ePrimitiveType, eElementsType);
			this._pIndexDataArray.push(pIndexData);
			return pIndexData;
		}

		getEmptyIndexData(iCount: uint, ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes): IIndexData {
			var pHole: IBufferHole[] = new Array();
			var i: int;
			var pIndexData: IIndexData;

			pHole[0] = {start: 0, end: this.byteLength};
			
			//console.log(pHole[0].end);
			for(var k: int = 0; k < this._pIndexDataArray.length; ++ k) {

				pIndexData: IIndexData = this._pIndexDataArray[k];
				
				for (i = 0; i < pHole.length; i ++) {
					//console.log("pHole:",pHole[i].start,pHole[i].end);
					//Полностью попадает внутрь
					if (pIndexData.byteOffset > pHole[i].start && pIndexData.byteOffset + pIndexData.byteLength < pHole[i].end) {
						var iTemp: int = pHole[i].end;

						pHole[i].end = pIndexData.byteOffset;
						pHole.splice(i + 1, 0, {start: pIndexData.byteOffset + pIndexData.byteLength, end: iTemp});
						
						i--;
					}
					else if(pIndexData.byteOffset == pHole[i].start && pIndexData.byteOffset + pIndexData.byteLength < pHole[i].end) {
						pHole[i].start = pIndexData.byteOffset + pIndexData.byteLength;
					}
					else if(pIndexData.byteOffset > pHole[i].start && pIndexData.byteOffset + pIndexData.byteLength == pHole[i].end) {
						
					}
					else if(pIndexData.byteOffset == pHole[i].start && pIndexData.byteLength == pHole[i].size) {
						pHole.splice(i, 1);		
						i--;
					}
					//Перекрывает снизу
					else if(pIndexData.byteOffset<pHole[i].start &&
						pIndexData.byteOffset + pIndexData.byteLength > pHole[i].start && pIndexData.byteOffset + pIndexData.byteLength < pHole[i].end) {
						pHole.start = pIndexData.byteOffset + pIndexData.byteLength;
					}
					else if(pIndexData.byteOffset < pHole[i].start &&
						pIndexData.byteOffset + pIndexData.byteLength > pHole[i].start && pIndexData.byteOffset + pIndexData.byteLength == pHole[i].end) {
						pHole.splice(i, 1);
						i--;
					}
					//Перекрывается сверху
					else if(pIndexData.byteOffset + pIndexData.byteLength>pHole[i].end &&
						pIndexData.byteOffset > pHole[i].start && pIndexData.byteOffset < pHole[i].end) {
						pHole.end = pIndexData.byteOffset;
					}
					else if(pIndexData.byteOffset + pIndexData.byteLength > pHole[i].end &&
						pIndexData.byteOffset == pHole[i].start && pIndexData.byteOffset < pHole[i].end) {
						pHole.splice(i, 1);
						i--;
					}
					//полнстью перекрывает
					else if(pIndexData.byteOffset < pHole[i].start && pIndexData.byteOffset + pIndexData.byteLength > pHole[i].end) {
						i--;
					}			
				}
			}
			
			pHole.sort((a: IBufferHole, b: IBufferHole): number => ((a.end - a.start) - (b.end - b.start))); 
			
			for (i = 0; i < pHole.length; i ++) {		
				if((pHole[i].end - pHole[i].start) >= iCount * getTypeSize(eElementsType)) {
					pIndexData = new data.IndexData(this, this._iDataCounter ++, pHole[i].start, iCount, ePrimitiveType, eElementsType);
					
					this._pIndexDataArray.push(pIndexData);
					
					return pIndexData;
				}
			}

			return null;
		}

		freeIndexData(pIndexData: IIndexData): bool {
			for (var i: int = 0; i < this._pIndexDataArray.length; i ++) {
				if(this._pIndexDataArray[i] == pIndexData) {
					this._pIndexDataArray.splice(i,1);
					return true;
				}
			}

			pIndexData.destroy();
			
			return false;
		}

		allocateData(ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes, pData: ArrayBufferView): IIndexData {
			var pIndexData: IIndexData;
		    var iCount: uint = pData.byteLength / getTypeSize(eElementsType);

		    debug_assert(iCount === math.floor(iCount), "data size should be a multiple of the vertex declaration");

		    pIndexData = this.getEmptyIndexData(iCount, ePrimitiveType, eElementsType);
		    pIndexData.writeData(pData);

		    return pIndexData;
		}

	}
}

#endif