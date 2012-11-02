#ifndef VIDEOBUFFER_TS
#define VIDEOBUFFER_TS

#include "IVideoBuffer.ts"
#include "IVertexDeclaration.ts"
#include "IVertexData.ts"
#include "Texture.ts"

module akra.core.pool.resources {
	export class VideoBuffer extends Texture implements IVideoBuffer {
		inline get byteLength(): uint {
			return 0;
		}

		inline get length(): uint {
			return 0;
		}

		clone(pSrc: IGPUBuffer): bool {
			return false;
		}

		isValid(): bool {
			return false;
		}

		isDynamic(): bool {
			return false;
		}

		isStatic(): bool {
			return false;
		}

		isStream(): bool {
			return false;
		}

		isReadable(): bool {
			return false;
		}

		isRAMBufferPresent(): bool {
			return false;
		}

		isSoftware(): bool {
			return false;
		}

		isAlignment(): bool {
			return false;
		}

		getData(iOffset: uint, iSize: uint): ArrayBuffer {
			return null;
		}

		setData(pData: ArrayBuffer, iOffset: uint, iSize: uint): bool {
			return false;
		}

		inline getFlags(): int {
			return 0;
		}

		
		getVertexData(iOffset: uint, iCount: uint, pElements: IVertexElement[]): IVertexData;
		getVertexData(iOffset: uint, iCount: uint, pDecl: IVertexDeclaration): IVertexData;
		getVertexData(iOffset: uint, iCount: uint, pDecl: any): IVertexData {
			return null;
		}

		
		getEmptyVertexData(iCount: uint, pElements: IVertexElement[], ppVertexDataIn?: IVertexData): IVertexData;
		getEmptyVertexData(iCount: uint, pDecl: IVertexDeclaration, ppVertexDataIn?: IVertexData): IVertexData;
		getEmptyVertexData(iCount: uint, pDecl: any, ppVertexDataIn?: IVertexData): IVertexData {
			return null;
		}

		
		freeVertexData(pVertexData: IVertexData): bool {
			return false;
		}


		allocateData(pElements: IVertexElement[], pData: ArrayBufferView): IVertexData;
		allocateData(pDecl: IVertexDeclaration, pData: ArrayBufferView): IVertexData;
		allocateData(pDecl: any, pData: ArrayBufferView): IVertexData {
			return null;
		}

		inline getHardwareBuffer(): WebGLObject {
			return null;
		}
	}

	
}

#endif
