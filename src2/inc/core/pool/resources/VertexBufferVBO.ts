#ifndef VERTEXBUFFERVBO_TS
#define VERTEXBUFFERVBO_TS

#include "IVertexData.ts"
#include "IVertexBufferVBO.ts"
#include "IVertexDeclaration.ts"
#include "VertexBuffer.ts"

module akra.core.pool.resources {
	export class VertexBufferVBO extends VertexBuffer implements IVertexBufferVBO {
		inline get type(): EVertexBufferTypes { return EVertexBufferTypes.TYPE_VBO; }
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