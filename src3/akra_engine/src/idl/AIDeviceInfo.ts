// AIDeviceInfo interface
// [write description here...]

module akra {
interface AIDeviceInfo {
	maxTextureSize: uint;
	maxCubeMapTextureSize: uint;
	maxViewPortSize: uint;

	maxTextureImageUnits: uint;
	maxVertexAttributes: uint;
	maxVertexTextureImageUnits: uint;
	maxCombinedTextureImageUnits: uint;

	stencilBits: uint;
	colorBits: uint[];
	alphaBits: uint;
	multisampleType: float;

	shaderVersion: float;

	getExtention(pDevice: WebGLRenderingContext, csExtension: string);
	//checkFormat(pDevice: WebGLRenderingContext, eFormat: EImageFormats);
}
}

#endif