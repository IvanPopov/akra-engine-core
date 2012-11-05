#ifndef VERTEXBUFFERTBO_TS
#define VERTEXBUFFERTBO_TS

#include "IVertexData.ts"
#include "IVertexBufferTBO.ts"
#include "IVertexDeclaration.ts"
#include "VertexBuffer.ts"

module akra.core.pool.resources {
	export class VertexBufferTBO extends VertexBuffer implements IVertexBufferTBO {
		inline get type(): EVertexBufferTypes { return EVertexBufferTypes.TYPE_TBO; }
		inline get byteLength(): uint { return 0; }
		inline get length(): uint { return 0; }

		

		inline getHardwareObject(): WebGLObject {
			return null;
		}

		constructor (pManager: IResourcePoolManager) {
			super(pManager);
		}
	}

	
}

#endif
