#ifndef VERTEXDATA_TS
#define VERTEXDATA_TS

#include "IVertexData.ts"
#include "IVertexBuffer.ts"
#include "IVertexDeclaration.ts"


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
    		debug_assert(iIndex % 1 == 0, "Вычислить значенеи индекса указывающего на первый элемен нельзя)");
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
	}
}

#endif
