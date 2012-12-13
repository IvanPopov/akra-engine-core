#ifndef VERTEXBUFFER_TS
#define VERTEXBUFFER_TS

#include "IVertexBuffer.ts"
#include "data/VertexData.ts"
#include "HardwareBuffer.ts"
#include "MemoryBuffer.ts"

module akra.core.pool.resources {
	interface IBufferHole {
		start: uint;
		end: uint;
	}

	export class VertexBuffer extends HardwareBuffer implements IVertexBuffer {
		protected _pVertexDataArray: IVertexData[] = [];
		protected _iDataCounter: uint = 0;

		inline get type(): EVertexBufferTypes { return EVertexBufferTypes.UNKNOWN; }
		inline get length(): uint { return this._pVertexDataArray.length; }

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

		destroy(): void {
			super.destroy();
			
			this._pBackupCopy.destroy();
			this.freeVertexData();

			this._iDataCounter = 0;
		}

		getVertexData(iOffset: uint, iCount: uint, pElements: IVertexElement[]): IVertexData;
		getVertexData(iOffset: uint, iCount: uint, pDecl: IVertexDeclaration): IVertexData;
		getVertexData(iOffset: uint, iCount: uint, pData: any): IVertexData {
			var pDecl: IVertexDeclaration = createVertexDeclaration(pData);
			var pVertexData: IVertexData = new data.VertexData(this, this._iDataCounter ++, iOffset, iCount, pDecl);

			this._pVertexDataArray.push(pVertexData);
			this.notifyAltered();

			return pVertexData;
		}

		
		getEmptyVertexData(iCount: uint, pElements: IVertexElement[], ppVertexDataIn?: IVertexData): IVertexData;
		getEmptyVertexData(iCount: uint, pDecl: IVertexDeclaration, ppVertexDataIn?: IVertexData): IVertexData;
		getEmptyVertexData(iCount: uint, pSize: uint, ppVertexDataIn?: IVertexData): IVertexData;
		getEmptyVertexData(iCount: uint, pDeclData: any, ppVertexDataIn?: IVertexData): IVertexData {
			var pDecl: IVertexDeclaration;
			var pHole: IBufferHole[] = [];
			var i: int;
			var pVertexData: IVertexData;	
			var iTemp: int;
			var iStride: int = 0;
			var iAligStart: int;
			
			while(true) {
				
				pHole[0] = {start:0, end: this.byteLength};		
				
				for(var k: uint = 0; k < this._pVertexDataArray.length; ++ k) {
					pVertexData = this._pVertexDataArray[k];
					
					for(i = 0; i < pHole.length; i++) {
						//Полностью попадает внутрь
						if(pVertexData.byteOffset > pHole[i].start && 
							pVertexData.byteOffset + pVertexData.byteLength < pHole[i].end) {
							iTemp = pHole[i].end;
							pHole[i].end=pVertexData.byteOffset;
							pHole.splice(i + 1, 0, {start: pVertexData.byteOffset + pVertexData.byteLength, end: iTemp});
							i--;
						}
						else if(pVertexData.byteOffset == pHole[i].start && 
							pVertexData.byteOffset + pVertexData.byteLength < pHole[i].end) {
							pHole[i].start = pVertexData.byteOffset + pVertexData.byteLength;
						}
						else if(pVertexData.byteOffset > pHole[i].start && 
							pVertexData.byteOffset + pVertexData.byteLength == pHole[i].end) {
							
						}
						else if(pVertexData.byteOffset == pHole[i].start && 
							pVertexData.byteLength == (pHole[i].end - pHole[i].start)) {
							pHole.splice(i, 1);		
							i--;
						}
						//Перекрывает снизу
						else if(pVertexData.byteOffset < pHole[i].start &&
							pVertexData.byteOffset + pVertexData.byteLength > pHole[i].start && 
							pVertexData.byteOffset + pVertexData.byteLength < pHole[i].end) {
							pHole[i].start = pVertexData.byteOffset + pVertexData.byteLength;
						}
						else if(pVertexData.byteOffset < pHole[i].start &&
							pVertexData.byteOffset + pVertexData.byteLength > pHole[i].start && 
							pVertexData.byteOffset + pVertexData.byteLength == pHole[i].end) {
							pHole.splice(i,1);
							i--;
						}
						//Перекрывается сверху
						else if(pVertexData.byteOffset + pVertexData.byteLength > pHole[i].end &&
							pVertexData.byteOffset > pHole[i].start && pVertexData.byteOffset < pHole[i].end) {
							pHole[i].end=pVertexData.byteOffset;
						}
						else if(pVertexData.byteOffset + pVertexData.byteLength > pHole[i].end &&
							pVertexData.byteOffset == pHole[i].start && pVertexData.byteOffset < pHole[i].end) {
							pHole.splice(i,1);
							i--;
						}
						//полнстью перекрывает
						else if(pVertexData.byteOffset < pHole[i].start && 
							pVertexData.byteOffset + pVertexData.byteLength > pHole[i].end) {
							i--;
						}			
					}
				}
				
				
				pHole.sort((a: IBufferHole, b: IBufferHole): number => ((a.end - a.start) - (b.end - b.start))); 
				
				
				
				if(isInt(pDeclData)) {
					pDecl = createVertexDeclaration(pDeclData);
					iStride = pDecl.stride;	
				}
				else {
					iStride = pDeclData;
				}
				
				for (i = 0; i < pHole.length; i++) {		
					iAligStart = this.isAligned() ?
						math.alignUp(pHole[i].start, math.nok(iStride,4)):
						math.alignUp(pHole[i].start, iStride);

					if((pHole[i].end - iAligStart) >= iCount * iStride) {
						if(arguments.length == 2) {
							pVertexData = new data.VertexData(this, this._iDataCounter ++, iAligStart, iCount, pDeclData);
							this._pVertexDataArray.push(pVertexData);
							
							this.notifyAltered();
							return pVertexData;
						}
						else if(arguments.length == 3) {
							((<any>ppVertexDataIn).constructor).call(ppVertexDataIn, this, iAligStart, iCount, pDeclData);
							this._pVertexDataArray.push(ppVertexDataIn);
							
							this.notifyAltered();
							return ppVertexDataIn;
						}

						return null;
					}
				}		

				if (this.resize(math.max(this.byteLength * 2, this.byteLength + iCount * iStride)) == false) {
					break;
				}
			}

			return null;
		}

		
		freeVertexData(): bool;
		freeVertexData(pVertexData?: IVertexData): bool {
			if(arguments.length == 0) {
				for(var i: uint = 0; i < this._pVertexDataArray.length; i ++) {
					this._pVertexDataArray[Number(i)].destroy();
				}	

				this._pVertexDataArray = null;
			}
			else {
				for(var i: uint = 0; i < this._pVertexDataArray.length; i ++) {
					if(this._pVertexDataArray[i] == pVertexData) {
						pVertexData.destroy();
						
						this._pVertexDataArray.splice(i, 1);
						this.notifyAltered();
						return true;
					}
				}

				return false;
			}

			this.notifyAltered();
			return true;
		}

		allocateData(pElements: IVertexElement[], pData: ArrayBufferView): IVertexData;
		allocateData(pDecl: IVertexDeclaration, pData: ArrayBufferView): IVertexData;
		allocateData(pDeclData: any, pData: ArrayBufferView): IVertexData {
			var pDecl: IVertexDeclaration = createVertexDeclaration(pDeclData);

			var pVertexData: IVertexData;
		    var iCount: uint = pData.byteLength / pDecl.stride;

		    debug_assert(iCount === math.floor(iCount), 'Data size should be a multiple of the vertex declaration.');

		    pVertexData = this.getEmptyVertexData(iCount, pDecl);
		    pVertexData.setData(pData, 0, pDecl.stride);

		    return pVertexData;
		}

	}
}

#endif