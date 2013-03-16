#ifndef VERTEXDATA_TS
#define VERTEXDATA_TS

#include "IVertexData.ts"
#include "IVertexBuffer.ts"
#include "IVertexElement.ts"
#include "IVertexDeclaration.ts"
#include "IBufferDataModifier.ts"
#include "events/events.ts"
#include "util/util.ts"

module akra.data {

	enum EVertexDataLimits {
		k_MaxElementsSize = 256
	};

	export class VertexData implements IVertexData {
		private _pVertexBuffer: IVertexBuffer;
		private _iOffset: uint;
		private _iStride: uint;
		private _iLength: uint;
		private _pVertexDeclaration: VertexDeclaration;
		private _iId: uint;

		inline get id(): uint { return this._iId; }
		inline get length(): uint { return this._iLength; };
		inline get byteOffset(): uint { return this._iOffset; };
		inline get byteLength(): uint { return this._iLength * this._iStride; };
		inline get buffer(): IVertexBuffer { return this._pVertexBuffer; };
		inline get stride(): uint { return this._iStride; };
		inline get startIndex(): uint {  
			var iIndex: uint = this.byteOffset / this.stride;
    		debug_assert(iIndex % 1 == 0, "cannot calc first element index");
   			return iIndex; 
   		};


		constructor (pVertexBuffer: IVertexBuffer, id: uint, iOffset: uint, iCount: uint, nSize: uint);
		constructor (pVertexBuffer: IVertexBuffer, id: uint, iOffset: uint, iCount: uint, pDecl: IVertexDeclaration);
		constructor (pVertexBuffer: IVertexBuffer, id: uint, iOffset: uint, iCount: uint, pDecl: any) {

			this._pVertexBuffer = pVertexBuffer;
			this._iOffset = iOffset;
			this._iLength = iCount;
			this._iId = id;
			this._pVertexDeclaration = null;
			this._iStride = 0;

			if (isInt(pDecl)) {
				this._iStride = <uint>pDecl;
			}
			else {
				this._iStride = pDecl.stride;
				this.setVertexDeclaration(pDecl);	
			}

			debug_assert(pVertexBuffer.byteLength >= this.byteLength + this.byteOffset, 
				"vertex data out of array linits");
		}
		

		getVertexDeclaration(): VertexDeclaration {
			return this._pVertexDeclaration;
		}

		setVertexDeclaration(pDecl: IVertexDeclaration): bool {
			if (this._pVertexDeclaration) {
				debug_error("vertex declaration already exists");

				return false;
			}	

			var iStride: uint = pDecl.stride;

		    this._pVertexDeclaration = <VertexDeclaration>pDecl.clone();


		    debug_assert(iStride < <number>EVertexDataLimits.k_MaxElementsSize, 
		    	"stride max is 255 bytes");
		    debug_assert(iStride <= this.stride, 
		    	"stride in VertexDeclaration grather than stride in construtor");

		    return true;
		}

		inline getVertexElementCount(): uint {
			return this._pVertexDeclaration.length;
		}

		hasSemantics(sUsage: string): bool {
			if (this._pVertexDeclaration != null) {
		        return this._pVertexDeclaration.hasSemantics(sUsage);
		    }

		    return false;
		}

		destroy(): void {
			this._pVertexDeclaration = null;
    		this._iLength = 0;
		}

		extend(pDecl: IVertexDeclaration, pData: ArrayBufferView = null): bool {
			pDecl = createVertexDeclaration(pDecl);

			if (isNull(pData)) {
				pData = new Uint8Array(this.length * pDecl.stride);
			}
			else {
				pData = new Uint8Array(pData.buffer);
			}

		    debug_assert(this.length === pData.byteLength / pDecl.stride, 'invalid data size for extending');

		    var nCount: uint = this._iLength;
		    //strides modifications
		    var nStrideNew: uint = pDecl.stride;
		    var nStridePrev: uint = this.stride;
		    var nStrideNext: uint = nStridePrev + nStrideNew;
		    //total bytes after extending
		    var nTotalSize: uint = nStrideNext * this.length;
		    var pDeclNew: IVertexDeclaration = this.getVertexDeclaration().clone();

		    //data migration
		    var pDataPrev: Uint8Array = new Uint8Array(<ArrayBuffer>this.getData());
		    var pDataNext: Uint8Array = new Uint8Array(nTotalSize);

		    for (var i: int = 0, iOffset: int; i < nCount; ++i) {
		        iOffset = i * nStrideNext;
		        pDataNext.set(pDataPrev.subarray(i * nStridePrev, (i + 1) * nStridePrev), iOffset);
		        pDataNext.set((<Uint8Array>pData).subarray(i * nStrideNew, (i + 1) * nStrideNew), iOffset + nStridePrev);
		    }

		    if (!pDeclNew.extend(pDecl)) {
		        return false;
		    }

		    if (!this.resize(nCount, pDeclNew)) {
		        return false;
		    }

		    return this.setData(pDataNext, 0, nStrideNext);
		}


		resize(nCount: uint, pDecl?: IVertexDeclaration): bool;
		resize(nCount: uint, iStride?: uint): bool;
		resize(nCount: uint, pDecl?: any) {
			var iStride: uint = 0;
		    var iOldOffset: uint = this.byteOffset;
		    var pOldVertexBuffer: IVertexBuffer;
		    var pOldVertexDeclaration: IVertexDeclaration;
		    var iOldStride: uint

		    //debug_print("VertexData (offset: " + this.byteOffset + ") resized from " + this.byteLength + " to ", arguments);

		    if (arguments.length == 2) {
		        if (isInt(pDecl)) {
		            iStride = <uint>pDecl;
		        }
		        else {
		            iStride = (<IVertexDeclaration>pDecl).stride;
		        }

		        if (nCount * iStride <= this.byteLength) {
		            this._iLength = nCount;
		            this._iStride = iStride;
		            this._pVertexDeclaration = null;

		            if (!isInt(pDecl)) {
		                this.setVertexDeclaration(pDecl);
		            }

		            return true;
		        }
		        else {
		            pOldVertexBuffer = this.buffer;

		            pOldVertexBuffer.freeVertexData(this);

		            if (pOldVertexBuffer.getEmptyVertexData(nCount, pDecl, this) !== this) {
		                return false;
		            }

		            if (this.byteOffset != iOldOffset) {
		                WARNING("vertex data moved from " + iOldOffset + " ---> " + this.byteOffset);
		                this.relocation(this, iOldOffset, this.byteOffset);
		            }

		            return true;
		        }
		    }
		    else if (arguments.length == 1) {
		        if (nCount <= this.length) {
		            this._iLength = nCount;
		            return true;
		        }
		        else {
		            pOldVertexBuffer = this.buffer;
		            pOldVertexDeclaration = this.getVertexDeclaration();
		            iOldStride = this.stride;

		            pOldVertexBuffer.freeVertexData(this);

		            if (pOldVertexBuffer.getEmptyVertexData(nCount, iOldStride, this) == null) {
		                return false;
		            }

		            this.setVertexDeclaration(pOldVertexDeclaration);

		            if (this.byteOffset != iOldOffset) {
		                WARNING("vertex data moved from " + iOldOffset + " ---> " + this.byteOffset);
		                this.relocation(this, iOldOffset, this.byteOffset);
		            }

		            return true;
		        }
		    }

		    return false;
		}

		applyModifier(sUsage: string, fnModifier: IBufferDataModifier): bool {
			var pData = this.getTypedData(sUsage);
		    fnModifier(pData);
		    return this.setData(pData, sUsage);
		}

		//FIX ME:
		//если известно sUsage, зачем нужет iSize?
		setData(pData: ArrayBufferView, iOffset: int, iSize?: uint, nCountStart?: uint, nCount?: uint): bool;
		setData(pData: ArrayBufferView, sUsage?: string, iSize?: uint, nCountStart?: uint, nCount?: uint): bool;
		setData(pData: ArrayBufferView, iOffset?: any, iSize?: uint, nCountStart?: uint, nCount?: uint): bool {
			var iStride: uint;
			var pVertexBuffer: IVertexBuffer = this._pVertexBuffer;
			var pBackupBuf: Uint8Array;
			var pDataU8: Uint8Array;
			var k: uint;
			var iOffsetBuffer: uint;
			var pDeclaration: IVertexDeclaration = this._pVertexDeclaration;
			var pElement: IVertexElement;

			switch (arguments.length) {
		        case 5:
		        	if(isString(arguments[1])){
		        		iOffset = this._pVertexDeclaration.findElement(arguments[1]).offset;
		        	}

		            iStride = this.stride;
		            pDataU8 = new Uint8Array(pData.buffer);
		            if (iStride != iSize) {
		                //FIXME: очень тормознутое место, крайне медленно работает...
						if(pVertexBuffer.isBackupPresent() && nCount > 1) {
							// console.log(pVertexBuffer.byteLength);
							pBackupBuf = new Uint8Array(pVertexBuffer.byteLength);
							pVertexBuffer.readData(pBackupBuf);

							iOffsetBuffer = this.byteOffset;

							for (var i = nCountStart; i < nCount + nCountStart; i++) {
								for(k = 0; k < iSize; k++) {
									pBackupBuf[iStride * i + iOffset + iOffsetBuffer + k] = 
										pDataU8[iSize * (i - nCountStart) + k];
								}
							}

							pVertexBuffer.writeData(pBackupBuf, 0, pVertexBuffer.byteLength);
						}
						else {
							for (var i: uint = 0; i < nCount; i++) {
								var iCurrent: uint = i + nCountStart;

								pVertexBuffer.writeData(
										/*pData.buffer.slice*/
										pDataU8.subarray( iSize * i, iSize * (i + 1)),
										iStride * iCurrent + iOffset + this.byteOffset,
										iSize);
							}
						}
		            }
		            else {

		                pVertexBuffer.writeData(
		                	/*pData.buffer.slice*/
		                	//stride == size => iOffset = 0;
		                	pDataU8.subarray(0 , 
		                		iStride * nCount), 
		                	/*iOffset + */this.byteOffset + iStride * nCountStart,
		                    iStride * nCount); 
		            }
		            return true;
		        case 4:
		            pElement = null;

		            if (isString(arguments[1])) {
		                pElement = pDeclaration.findElement(arguments[1]);

		                if (pElement) {
		                    return this.setData(
		                        pData,
		                        pElement.offset,
		                        pElement.size,
		                        arguments[2], 
		                        arguments[3]);
		                }

		                return false;
		            }
		       
		            nCountStart = nCountStart || 0;
		            
		            if (!nCount) {
		                nCount = pData.byteLength / iSize;
		            }

		            return this.setData(pData, iOffset, iSize, nCountStart, nCount);
		            

		        case 2:
		        case 3:
		            var pDeclaration: VertexDeclaration = this._pVertexDeclaration,
		                pElement: VertexElement = null;

		            if (isString(arguments[1])) {
		                pElement = pDeclaration.findElement(arguments[1]);

		                if (pElement) {
		                    arguments[2] = arguments[2] || 0;
		                    
		                    if (!arguments[3]) {
		                        arguments[3] = pData.buffer.byteLength / pElement.size;
		                    }

		                    return this.setData(
		                    	pData,
		                        pElement.offset,
		                        pElement.size, 
		                        arguments[2], 
		                        arguments[3]);
		                }
		                return false
		            }
		            else if (arguments.length === 3) {

		                nCountStart = nCountStart || 0;

		                if (!nCount) {
		                    nCount = pData.byteLength / iSize;
		                }

		                return this.setData(pData, iOffset, iSize, nCountStart, nCount);
		            }

		            return false;
		        case 1:
		            return this.setData(pData, this._pVertexDeclaration.element(0).usage);
		        default:
		            return false;
		    }
		}


		getData(): ArrayBuffer;
		getData(iOffset: int, iSize: uint, iFrom?: uint, iCount?: uint): ArrayBuffer;
		getData(sUsage: string): ArrayBuffer;
		getData(sUsage: string, iFrom: uint, iCount: uint): ArrayBuffer;
		getData(iOffset?: any, iSize?: any, iFrom?: any, iCount?: any): ArrayBuffer {
			switch (arguments.length) {
		        case 4:
		        case 2:
		            if (isString(arguments[0])) {
						return null;
		            }

		            iFrom = iFrom || 0;
		            iCount = iCount || this._iLength;
		            iCount = math.min(iCount, this._iLength);

		            var iStride: uint = this.stride;
		            var pBufferData: Uint8Array = new Uint8Array(iSize * iCount);
	            	for (var i: int = 0; i < iCount; i++) {
	            		var iCurrent: uint = iFrom + i;
		            	this._pVertexBuffer.readData(iStride * iCurrent + iOffset + this.byteOffset, iSize, 
		            		pBufferData.subarray(i * iSize, (i + 1) * iSize));
		                //pBufferData.set(new Uint8Array(), i * iSize);
		            }

		            return pBufferData.buffer;
		        case 3:
		        case 1:
		            var pDeclaration: IVertexDeclaration = this._pVertexDeclaration,
		                pElement: IVertexElement = null;

		            if (isString("string")) {
		                pElement = pDeclaration.findElement(arguments[0]);

		                if (isDefAndNotNull(pElement)) {

		                    return this.getData(
		                        pElement.offset,
		                        pElement.size, 
		                        arguments[1], 
		                        arguments[2]
		                        );
		                }
		                return null;
		            }

		            return null;

		        case 0:
		            return this.getData(0, this._pVertexDeclaration.stride);
		        default:
		            return null;
		    }
		}

		getTypedData(sUsage: string, iFrom?: int, iCount?: uint): ArrayBufferView {
		    var pVertexElement: IVertexElement = this._pVertexDeclaration.findElement(sUsage);

		    if (pVertexElement) {
		        return util.abtota(this.getData(sUsage, iFrom, iCount), pVertexElement.type);
		    }

		    return null;
		}

		inline getBufferHandle(): int {
			return this._pVertexBuffer.resourceHandle;
		}

		toString(): string {
		    if (DEBUG) {

			    var s: string = "";
			    
			    s += "          VERTEX DATA  #" + this.id + "\n";
			    s += "---------------+-----------------------\n";
			    s += "        BUFFER : " + this.getBufferHandle() + "\n";
			    s += "          SIZE : " + this.byteLength + " b.\n";
			    s += "        OFFSET : " + this.byteOffset + " b.\n";
			    s += "---------------+-----------------------\n";
			    s += " MEMBERS COUNT : " + this.length + " \n";
			    s += "        STRIDE : " + this.stride + " \n";
			    s += "---------------+-----------------------\n";
			    s += this.getVertexDeclaration().toString();

			    return s;
		    }

		    return null;
		}



		CREATE_EVENT_TABLE(VertexData);
		BROADCAST(relocation, CALL(pTarget, iFrom, iTo));
	}

}

#endif
