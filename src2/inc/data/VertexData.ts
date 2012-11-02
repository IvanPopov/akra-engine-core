#ifndef VERTEXDATA_TS
#define VERTEXDATA_TS

#include "IBufferData.ts"
#include "IVertexBuffer.ts"
#include "IVertexDeclaration.ts"


module akra.data {

	export enum EVertexDataLimits {
		k_MaxElementsSize = 256
	};

	export class VertexData implements IBufferData {
		private _pVertexBuffer: IVertexBuffer;
		private _iOffset: uint;
		private _iStride: uint;
		private _nMemberCount: uint;
		private _pVertexDeclaration: IVertexDeclaration;
		private _iId: uint;


		/** @inline */
		get count(): uint { return this._nMemberCount; };
		/** @inline */
		get offset(): uint { return this._iOffset; };
		/** @inline */
		get byteLength(): uint { return this._nMemberCount * this._iStride; };
		/** @inline */
		get buffer(): IIndexBuffer { return this._pVertexBuffer; };

		constructor (pVertexBuffer: IVertexBuffer, iOffset: uint, iCount: uint, nSize: uint);
		constructor (pVertexBuffer: IVertexBuffer, iOffset: uint, iCount: uint, pDecl: IVertexDeclaration);
		constructor (pVertexBuffer: IVertexBuffer, iOffset: uint, iCount: uint, pDecl: any) {
			this._pVertexBuffer = pVertexBuffer;
			this._iOffset = iOffset;
			this._nMemberCount = iCount;
			this._iId = pVertexBuffer.getNextId();

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

			var iStride: uint = pVertexDeclaration.stride;

		    this._pVertexDeclaration = pVertexDeclaration.clone();


		    debug_assert(iStride < EVertexDataLimits.k_MaxElementsSize, "stride max is 255 bytes");
		    debug_assert(iStride <= this.stride, "stride in VertexDeclaration grather than stride in construtor");

		    return true;
		}
	}
}

#endif
