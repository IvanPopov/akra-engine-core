///<reference path="../akra.ts" />

module akra.data {

	export enum EVertexDataLimits {
		k_MaxElementsSize = 256
	};

	export class VertexData implements IBufferData {
		private _pVertexBuffer: IVertexBuffer;
		private _iOffset: uint;
		private _iStride: uint;
		private _nMemberCount: uint;
		private _pVertexDeclaration: IVertexDeclaration = null;
		private _iID: uint;

		constructor (pVertexBuffer: IVertexBuffer, iOffset: uint, iCount: uint, pDecl: IVertexDeclaration) {
			this._pVertexBuffer = pVertexBuffer;
			this._iOffset = iOffset;
			this._nMemberCount = iCount;
			

			this.setVertexDeclaration(pDecl);

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