/// <reference path="../idl/IRenderEntry.ts" />
/// <reference path="../idl/IShaderInput.ts" />

module akra.render {
	export class RenderEntry implements IRenderEntry {
		//target of rendering
		viewport: IViewport = null;
		renderTarget: IRenderTarget = null;
		//wraper for shader program
		maker: IAFXMaker = null;
		//complex info of native shader data
		// + buffers
		// + uniforms
		// + samplers
		input: IShaderInput = null;
		//needed for call direct render with index
		bufferMap: IBufferMap = null;

		surfaceMaterial: ISurfaceMaterial = null;

		clear(): void {
			this.maker._releaseShaderInput(this.input);
			this.viewport = null;
			this.renderTarget = null;
			this.bufferMap = null;
			this.input = null;
			this.maker = null;
			this.surfaceMaterial = null;
		}
	}
}