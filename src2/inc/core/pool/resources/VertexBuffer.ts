#ifndef VERTEXBUFFER_TS
#define VERTEXBUFFER_TS

#include "IVertexBuffer.ts"
#include "data/VertexData.ts"
#include "../ResourcePoolItem.ts"

module akra.core.pool.resources {
	interface IBufferHole {
		start: uint;
		end: uint;
	}

	export class VertexBuffer extends ResourcePoolItem implements IVertexBuffer {
		protected _pBackupCopy: ArrayBuffer = null;
		protected _iFlags: int = 0;
		protected _pVertexDataArray: IVertexData[] = [];
		protected _iDataCounter: uint = 0;

		inline get type(): EVertexBufferTypes { return EVertexBufferTypes.TYPE_UNKNOWN; }

		inline get byteLength(): uint {
			return 0;
		}

		inline get length(): uint {
			return 0;
		}

		constructor (pManager: IResourcePoolManager) {
			super(pManager);

		}

		clone(pSrc: IGPUBuffer): bool {
			var pBuffer: IVertexBuffer = <IVertexBuffer> pSrc;
			
			// destroy any local data
			this.destroy();

			return this.create(pBuffer.byteLength, pBuffer.getFlags(), pBuffer.getData());
		}

		isValid(): bool {
			return false;
		}

		isDynamic(): bool {
			return (TEST_BIT(this._iFlags, EGPUBufferFlags.MANY_UPDATES) && 
    	   		TEST_BIT(this._iFlags, EGPUBufferFlags.MANY_DRAWS));
		}

		isStatic(): bool {
			return ((!TEST_BIT(this._iFlags, EGPUBufferFlags.MANY_UPDATES)) && 
				TEST_BIT(this._iFlags, EGPUBufferFlags.MANY_DRAWS));
		}

		isStream(): bool {
			return (!TEST_BIT(this._iFlags, EGPUBufferFlags.MANY_UPDATES)) && 
					(!TEST_BIT(this._iFlags, EGPUBufferFlags.MANY_DRAWS));
		}

		isReadable(): bool {
			//Вроде как на данный момент нельхзя в вебЖл считывать буферы из видио памяти
    		//(но нужно ли это вообще и есть ли смысл просто обратиться к локальной копии)
			return TEST_BIT(this._iFlags, EGPUBufferFlags.READABLE);
		}

		isRAMBufferPresent(): bool {
			return this._pBackupCopy != null;
		}

		isSoftware(): bool {
			//на данный момент у нас нету понятия софтварной обработки и рендеренга
    		return TEST_BIT(this._iFlags, EGPUBufferFlags.SOFTWARE);
		}

		isAlignment(): bool {
			return TEST_BIT(this._iFlags, EGPUBufferFlags.ALIGNMENT);
		}

		getData(): ArrayBuffer;
		getData(iOffset?: uint, iSize?: uint): ArrayBuffer {
			return null;
		}

		setData(pData: ArrayBuffer, iOffset: uint, iSize: uint): bool {
			return false;
		}

		inline getFlags(): int {
			return this._iFlags;
		}

		
		getVertexData(iOffset: uint, iCount: uint, pElements: IVertexElement[]): IVertexData;
		getVertexData(iOffset: uint, iCount: uint, pDecl: IVertexDeclaration): IVertexData;
		getVertexData(iOffset: uint, iCount: uint, pData: any): IVertexData {
			var pDecl: IVertexDeclaration = createVertexDeclaration(pData);
			var pVertexData: IVertexData = new data.VertexData(this, this._iDataCounter ++, iOffset, iCount, pDecl);

			this._pVertexDataArray.push(pVertexData);
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
						if(pVertexData.offset > pHole[i].start && 
							pVertexData.offset + pVertexData.byteLength < pHole[i].end) {
							iTemp = pHole[i].end;
							pHole[i].end=pVertexData.offset;
							pHole.splice(i + 1, 0, {start: pVertexData.offset + pVertexData.byteLength, end: iTemp});
							i--;
						}
						else if(pVertexData.offset == pHole[i].start && 
							pVertexData.offset + pVertexData.byteLength < pHole[i].end) {
							pHole[i].start = pVertexData.offset + pVertexData.byteLength;
						}
						else if(pVertexData.offset > pHole[i].start && 
							pVertexData.offset + pVertexData.byteLength == pHole[i].end) {
							
						}
						else if(pVertexData.offset == pHole[i].start && 
							pVertexData.byteLength == (pHole[i].end - pHole[i].start)) {
							pHole.splice(i, 1);		
							i--;
						}
						//Перекрывает снизу
						else if(pVertexData.offset < pHole[i].start &&
							pVertexData.offset + pVertexData.byteLength > pHole[i].start && 
							pVertexData.offset + pVertexData.byteLength < pHole[i].end) {
							pHole[i].start = pVertexData.offset + pVertexData.byteLength;
						}
						else if(pVertexData.offset < pHole[i].start &&
							pVertexData.offset + pVertexData.byteLength > pHole[i].start && 
							pVertexData.offset + pVertexData.byteLength == pHole[i].end) {
							pHole.splice(i,1);
							i--;
						}
						//Перекрывается сверху
						else if(pVertexData.offset + pVertexData.byteLength > pHole[i].end &&
							pVertexData.offset > pHole[i].start && pVertexData.offset < pHole[i].end) {
							pHole[i].end=pVertexData.offset;
						}
						else if(pVertexData.offset + pVertexData.byteLength > pHole[i].end &&
							pVertexData.offset == pHole[i].start && pVertexData.offset < pHole[i].end) {
							pHole.splice(i,1);
							i--;
						}
						//полнстью перекрывает
						else if(pVertexData.offset < pHole[i].start && 
							pVertexData.offset + pVertexData.byteLength > pHole[i].end) {
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
					iAligStart = this.isAlignment() ?
						math.alignUp(pHole[i].start, math.nok(iStride,4)):
						math.alignUp(pHole[i].start, iStride);

					if((pHole[i].end - iAligStart) >= iCount * iStride) {
						if(arguments.length == 2) {
							pVertexData = new data.VertexData(this, this._iDataCounter ++, iAligStart, iCount, pDeclData);
							this._pVertexDataArray.push(pVertexData);
							
							return pVertexData;
						}
						else if(arguments.length == 3) {
							((<any>ppVertexDataIn).constructor).call(ppVertexDataIn, this, iAligStart, iCount, pDeclData);
							this._pVertexDataArray.push(ppVertexDataIn);
							
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

		
		freeVertexData(pVertexData: IVertexData): bool {
			if(arguments.length == 0) {
				for(var i: uint = 0; i < this._pVertexDataArray.length; i ++) {
					this._pVertexDataArray[Number(i)].destroy();
				}	

				this._pVertexDataArray = null;
			}
			else {
				for(var i: uint = 0; i < this._pVertexDataArray.length; i ++) {
					if(this._pVertexDataArray[i] == pVertexData) {
						this._pVertexDataArray.splice(i, 1);
						return true;
					}
				}

				pVertexData.destroy();

				return false;
			}
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

		destroy(): void {}
		create(iByteSize: uint, iFlags: int, pData: ArrayBuffer): bool { return false; }
		resize(iSize: uint): bool { return false; }
	}
}

#endif