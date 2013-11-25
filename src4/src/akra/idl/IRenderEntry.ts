
/// <reference path="IAFXMaker.ts" />
/// <reference path="IShaderInput.ts" />
/// <reference path="IBufferMap.ts" />
/// <reference path="IViewport.ts" />

module akra {
	interface IRenderEntry {
		viewport: IViewport;
		renderTarget: IRenderTarget;
		maker: IAFXMaker;
		input: IShaderInput;
		bufferMap: IBufferMap;
	
		clear(): void;
	}
	
}
