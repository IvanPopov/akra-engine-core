#ifndef UTIL_CALCULATE_SKIN
#define UTIL_CALCULATE_SKIN

#include "render/RenderData.ts"
#include "webgl/WebGLRenderer.ts"

module akra.util{
	#ifdef WEBGL
	export function calculateSkin(pRenderData: IRenderData): bool{
		var pEngine: IEngine = pRenderData.buffer.getEngine();
		var pResourceManager: IResourcePoolManager = pEngine.getResourceManager();
		var pWebGLRenderer: webgl.WebGLRenderer = <webgl.WebGLRenderer>pEngine.getRenderer();

		/*update skinned position program*/

		var pProgram: IShaderProgram = <IShaderProgram>pResourceManager.shaderProgramPool.findResource(".WEBGL_skinning_update");
		if (isNull(pProgram)) {
        	pProgram = <IShaderProgram>this.getManager().shaderProgramPool.createResource(".WEBGL_skinning_update");
        	pProgram.create(

        		"
				attribute float positionIndex;\n\
				attribute float normalIndex;\n\
				\n\
				uniform sampler2D videoBuffer;\n\
				uniform vec2 frameBufferSize;\n\
				uniform int type;\n\
				uniform bind_matrix;\n\
				\n\
				varying vec4 data;
				\n\
				void main(void){\n\
					\n\
				};\n\


        		"
        		);
        }

		return false;
	};
	#else
	export function calculateSkin(pRenderData: IRenderData): bool{
		return false;
	};
	#endif

}

#endif