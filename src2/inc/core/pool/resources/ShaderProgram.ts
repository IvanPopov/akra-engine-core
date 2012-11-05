#ifndef SHADERPROGRAM_TS
#define SHADERPROGRAM_TS

#include "IShaderProgram.ts"
#include "../ResourcePoolItem.ts"

module akra.core.pool.resources {
	export class ShaderProgram extends ResourcePoolItem implements IShaderProgram {
		inline getHardwareObject(): WebGLObject {
			return null;
		}
	}
}

#endif