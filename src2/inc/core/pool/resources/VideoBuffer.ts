///<reference path="../../../akra.ts" />

module akra.core.pool.resources {
	export class VideoBuffer extends Texture implements IVideoBuffer {
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


		getHardwareBuffer(): WebGLObject {
			return null;
		}

		getOptions(): int {
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
	}

	
}