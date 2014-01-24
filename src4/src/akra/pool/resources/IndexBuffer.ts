/// <reference path="../../idl/IIndexBuffer.ts" />
/// <reference path="../../idl/IIndexData.ts" />
/// <reference path="HardwareBuffer.ts" />
/// <reference path="../../data/IndexData.ts" />

module akra.pool.resources {
	
	interface IBufferHole {
		start: uint;
		end: uint;
	}

	export class IndexBuffer extends HardwareBuffer implements IIndexBuffer {
		protected _pIndexDataArray: IIndexData[] = [];
		protected _iDataCounter: uint = 0;


		geLength(): uint {
			return this._pIndexDataArray.length;
		}

		constructor (/*pManager: IResourcePoolManager*/) {
			super(/*pManager*/);

		}

		//create(iByteSize: uint, iFlags?: uint, pData?: Uint8Array): boolean;
		create(iByteSize: uint, iFlags?: uint, pData?: ArrayBufferView): boolean{
		//create(iByteSize: uint, iFlags?: uint, pData?: ArrayBufferView): boolean {
			super.create(0, iFlags || 0);

			if (bf.testAny(iFlags, EHardwareBufferFlags.BACKUP_COPY)) {
				this._pBackupCopy = new MemoryBuffer();
				this._pBackupCopy.create(iByteSize);
				this._pBackupCopy.writeData(pData, 0, iByteSize);
			}

			return true;
		}

		destroy(): void {
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

			pHole[0] = {start: 0, end: this.getByteLength()};
			
			//console.log(pHole[0].end);
			for(var k: int = 0; k < this._pIndexDataArray.length; ++ k) {

				pIndexData = this._pIndexDataArray[k];
				
				for (i = 0; i < pHole.length; i ++) {
					//console.log("pHole:",pHole[i].start,pHole[i].end);
					//Полностью попадает внутрь
					if (pIndexData.getByteOffset() > pHole[i].start && pIndexData.getByteOffset() + pIndexData.getByteLength() < pHole[i].end) {
						var iTemp: int = pHole[i].end;

						pHole[i].end = pIndexData.getByteOffset();
						pHole.splice(i + 1, 0, {start: pIndexData.getByteOffset() + pIndexData.getByteLength(), end: iTemp});
						
						i--;
					}
					else if(pIndexData.getByteOffset() == pHole[i].start && pIndexData.getByteOffset() + pIndexData.getByteLength() < pHole[i].end) {
						pHole[i].start = pIndexData.getByteOffset() + pIndexData.getByteLength();
					}
					else if(pIndexData.getByteOffset() > pHole[i].start && pIndexData.getByteOffset() + pIndexData.getByteLength() == pHole[i].end) {
						
					}
					else if(pIndexData.getByteOffset() == pHole[i].start && pIndexData.getByteLength() == (pHole[i].end - pHole[i].start)) {
						pHole.splice(i, 1);		
						i--;
					}
					//Перекрывает снизу
					else if(pIndexData.getByteOffset()<pHole[i].start &&
						pIndexData.getByteOffset() + pIndexData.getByteLength() > pHole[i].start && pIndexData.getByteOffset() + pIndexData.getByteLength() < pHole[i].end) {
						pHole[i].start = pIndexData.getByteOffset() + pIndexData.getByteLength();
					}
					else if(pIndexData.getByteOffset() < pHole[i].start &&
						pIndexData.getByteOffset() + pIndexData.getByteLength() > pHole[i].start && pIndexData.getByteOffset() + pIndexData.getByteLength() == pHole[i].end) {
						pHole.splice(i, 1);
						i--;
					}
					//Перекрывается сверху
					else if(pIndexData.getByteOffset() + pIndexData.getByteLength()>pHole[i].end &&
						pIndexData.getByteOffset() > pHole[i].start && pIndexData.getByteOffset() < pHole[i].end) {
						pHole[i].end = pIndexData.getByteOffset();
					}
					else if(pIndexData.getByteOffset() + pIndexData.getByteLength() > pHole[i].end &&
						pIndexData.getByteOffset() == pHole[i].start && pIndexData.getByteOffset() < pHole[i].end) {
						pHole.splice(i, 1);
						i--;
					}
					//полнстью перекрывает
					else if(pIndexData.getByteOffset() < pHole[i].start && pIndexData.getByteOffset() + pIndexData.getByteLength() > pHole[i].end) {
						i--;
					}			
				}
			}
			
			pHole.sort((a: IBufferHole, b: IBufferHole): number => ((a.end - a.start) - (b.end - b.start))); 
			
			for (i = 0; i < pHole.length; i ++) {		
				if((pHole[i].end - pHole[i].start) >= iCount * sizeof(eElementsType)) {
					pIndexData = new data.IndexData(this, this._iDataCounter ++, pHole[i].start, iCount, ePrimitiveType, eElementsType);
					
					this._pIndexDataArray.push(pIndexData);
					
					return pIndexData;
				}
			}

			return null;
		}

		freeIndexData(): boolean;
		freeIndexData(pIndexData?: IIndexData): boolean {
			if(arguments.length == 0) {
				for(var i: uint = 0; i < this._pIndexDataArray.length; i ++) {
					this._pIndexDataArray[Number(i)].destroy();
				}	

				this._pIndexDataArray = null;
			}
			else {
				for (var i: int = 0; i < this._pIndexDataArray.length; i ++) {
					if(this._pIndexDataArray[i] == pIndexData) {
						pIndexData.destroy();

						this._pIndexDataArray.splice(i,1);
						this.notifyAltered();
						return true;
					}
				}

				return false;
			}

			this.notifyAltered();
			return true;
		}

		allocateData(ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes, pData: ArrayBufferView): IIndexData {
			var pIndexData: IIndexData;
		    var iCount: uint = pData.byteLength / sizeof(eElementsType);

		    debug.assert(iCount === math.floor(iCount), "data size should be a multiple of the vertex declaration");

		    pIndexData = this.getEmptyIndexData(iCount, ePrimitiveType, eElementsType);
		    pIndexData.setData(pData);

		    return pIndexData;
		}

	}
}
