// AIRenderEntry interface
// [write description here...]

/// <reference path="AIAFXMaker.ts" />
/// <reference path="AIShaderInput.ts" />
/// <reference path="AIBufferMap.ts" />
/// <reference path="AIViewport.ts" />

interface AIRenderEntry {
	viewport: AIViewport;
	renderTarget: AIRenderTarget;
	maker: AIAFXMaker;
	input: AIShaderInput;
	bufferMap: AIBufferMap;

	clear(): void;
}
