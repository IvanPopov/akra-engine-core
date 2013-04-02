#ifndef RENDERRENDERENTRY_TS
#define RENDERRENDERENTRY_TS

#include "IRenderEntry.ts"
#include "IShaderInput.ts"

module akra.render {
	export class RenderEntry implements IRenderEntry {
		//target of rendering
		viewport: IViewport = null;
		//wraper for shader program
		maker: IAFXMaker = null;
		//complex info of native shader data
		// + buffers
		// + uniforms
		// + samplers
		input: IShaderInput = null;
		//needed for call direct render with index
		bufferMap: IBufferMap = null;


		clear(): void {
			this.maker._releaseShaderInput(this.input);
			this.viewport = null;
			this.bufferMap = null;
			this.input = null;
			this.maker = null;
		}
	}
}

#endif
