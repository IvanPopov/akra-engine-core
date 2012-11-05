#ifndef VERTEXDATA_TS
#define VERTEXDATA_TS

#include "IVertexData.ts"
#include "IVertexBuffer.ts"
#include "IVertexDeclaration.ts"
#include "IBufferDataModifier.ts"
#include "events/events.ts"

module akra.data {

	export enum EVertexDataLimits {
		k_MaxElementsSize = 256
	};

	export class VertexData implements IVertexData {
		private _pVertexBuffer: IVertexBuffer;
		private _iOffset: uint;
		private _iStride: uint;
		private _iLength: uint;
		private _pVertexDeclaration: IVertexDeclaration;
		private _iId: uint;

		inline get length(): uint { return this._iLength; };
		inline get offset(): uint { return this._iOffset; };
		inline get byteLength(): uint { return this._iLength * this._iStride; };
		inline get buffer(): IVertexBuffer { return this._pVertexBuffer; };
		inline get stride(): uint { return this._iStride; };
		inline get startIndex(): uint {  
			var iIndex: uint = this.offset / this.stride;
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
				this.setVertexDeclaration(pDecl);	
			}

			debug_assert(pVertexBuffer.byteLength >= this.byteLength + this.offset, "vertex data out of array linits");
		}



		getVertexDeclaration(): IVertexDeclaration {
			return this._pVertexDeclaration;
		}

		setVertexDeclaration(pDecl: IVertexDeclaration): bool {
			if (this._pVertexDeclaration) {
				debug_error("vertex declaration already exists");

				return false;
			}	

			var iStride: uint = pDecl.stride;

		    this._pVertexDeclaration = pDecl.clone();


		    debug_assert(iStride < <number>EVertexDataLimits.k_MaxElementsSize, "stride max is 255 bytes");
		    debug_assert(iStride <= this.stride, "stride in VertexDeclaration grather than stride in construtor");

		    return true;
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
		    var pDataPrev: Uint8Array = new Uint8Array(this.getData());
		    var pDataNext: Uint8Array = new Uint8Array(nTotalSize);

		    for (var i: int = 0, iOffset: int; i < nCount; ++i) {
		        iOffset = i * nStrideNext;
		        pDataNext.set(pDataPrev.subarray(i * nStridePrev, (i + 1) * nStridePrev), iOffset);
		        pDataNext.set(pData.subarray(i * nStrideNew, (i + 1) * nStrideNew), iOffset + nStridePrev);
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
		    var iOldOffset: uint = this.offset;
		    var pOldVertexBuffer: IVertexBuffer;
		    var pOldVertexDeclaration: IVertexDeclaration;
		    var iOldStride: uint

		    if (arguments.length == 2) {
		        if (isInt(pDecl)) {
		            iStride = <uint>pDecl;
		        }
		        else {
		            iStride = (<IVertexDeclaration>pDecl).stride;
		        }

		        if (nCount * iStride <= this.size) {
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

		            if (this.offset != iOldOffset) {
		                warning('vertex data moved from ' + iOldOffset + ' ---> ' + this.offset);
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

		            if (this.offset != iOldOffset) {
		                warning('vertex data moved from ' + iOldOffset + ' ---> ' + this.offset);
		            }

		            return true;
		        }
		    }

		    return false;
		}

		applyModifier(sUsage: string, fnModifier: IBufferDataModifier): bool {


			return false;
		}

		
		BEGIN_EVENT_TABLE(VertexData);
			EVENT(BROADCAST(relocation, CALL(iFrom, iTo)));
		END_EVENT_TABLE();

	}

}

#endif
