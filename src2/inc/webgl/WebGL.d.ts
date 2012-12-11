// see: http://www.khronos.org/registry/webgl/specs/latest/

interface WebGLObject
{
};

interface WebGLBuffer extends WebGLObject
{
};

interface WebGLFramebuffer extends WebGLObject
{
};

interface WebGLProgram extends WebGLObject
{
};

interface WebGLRenderbuffer extends WebGLObject
{
};

interface WebGLShader extends WebGLObject
{
};

interface WebGLTexture extends WebGLObject
{
};

interface WebGLUniformLocation
{
};

interface WebGLActiveInfo
{
	size: number;
	type: number;
	name: string;
};

interface WebGLShaderPrecisionFormat
{
	rangeMin: number;
	rangeMax: number;
	precision: number;
};


interface WebGLContextAttributes
{
	alpha?: bool;
	depth?: bool;
	stencil?: bool;
	antialias?: bool;
	premultipliedAlpha?: bool;
	preserveDrawingBuffer?: bool;
};

interface WebGLRenderingContext
{
	/* ClearBufferMask */
	DEPTH_BUFFER_BIT: number;
	STENCIL_BUFFER_BIT: number;
	COLOR_BUFFER_BIT: number;

	/* BeginMode */
	POINTS: number;
	LINES: number;
	LINE_LOOP: number;
	LINE_STRIP: number;
	TRIANGLES: number;
	TRIANGLE_STRIP: number;
	TRIANGLE_FAN: number;

	/* AlphaFunction (not supported in ES20) */
	/*      NEVER */
	/*      LESS */
	/*      EQUAL */
	/*      LEQUAL */
	/*      GREATER */
	/*      NOTEQUAL */
	/*      GEQUAL */
	/*      ALWAYS */

	/* BlendingFactorDest */
	ZERO: number;
	ONE: number;
	SRC_COLOR: number;
	ONE_MINUS_SRC_COLOR: number;
	SRC_ALPHA: number;
	ONE_MINUS_SRC_ALPHA: number;
	DST_ALPHA: number;
	ONE_MINUS_DST_ALPHA: number;

	/* BlendingFactorSrc */
	/*      ZERO */
	/*      ONE */
	DST_COLOR: number;
	ONE_MINUS_DST_COLOR: number;
	SRC_ALPHA_SATURATE: number;
	/*      SRC_ALPHA */
	/*      ONE_MINUS_SRC_ALPHA */
	/*      DST_ALPHA */
	/*      ONE_MINUS_DST_ALPHA */

	/* BlendEquationSeparate */
	FUNC_ADD: number;
	BLEND_EQUATION: number;
	BLEND_EQUATION_RGB: number;
	BLEND_EQUATION_ALPHA: number;

	/* BlendSubtract */
	FUNC_SUBTRACT: number;
	FUNC_REVERSE_SUBTRACT: number;

	/* Separate Blend Functions */
	BLEND_DST_RGB: number;
	BLEND_SRC_RGB: number;
	BLEND_DST_ALPHA: number;
	BLEND_SRC_ALPHA: number;
	CONSTANT_COLOR: number;
	ONE_MINUS_CONSTANT_COLOR: number;
	CONSTANT_ALPHA: number;
	ONE_MINUS_CONSTANT_ALPHA: number;
	BLEND_COLOR: number;

	/* Buffer Objects */
	ARRAY_BUFFER: number;
	ELEMENT_ARRAY_BUFFER: number;
	ARRAY_BUFFER_BINDING: number;
	ELEMENT_ARRAY_BUFFER_BINDING: number;

	STREAM_DRAW: number;
	STATIC_DRAW: number;
	DYNAMIC_DRAW: number;

	BUFFER_SIZE: number;
	BUFFER_USAGE: number;

	CURRENT_VERTEX_ATTRIB: number;

	/* CullFaceMode */
	FRONT: number;
	BACK: number;
	FRONT_AND_BACK: number;

	/* DepthFunction */
	/*      NEVER */
	/*      LESS */
	/*      EQUAL */
	/*      LEQUAL */
	/*      GREATER */
	/*      NOTEQUAL */
	/*      GEQUAL */
	/*      ALWAYS */

	/* EnableCap */
	/* TEXTURE_2D */
	CULL_FACE: number;
	BLEND: number;
	DITHER: number;
	STENCIL_TEST: number;
	DEPTH_TEST: number;
	SCISSOR_TEST: number;
	POLYGON_OFFSET_FILL: number;
	SAMPLE_ALPHA_TO_COVERAGE: number;
	SAMPLE_COVERAGE: number;

	/* ErrorCode */
	NO_ERROR: number;
	INVALID_ENUM: number;
	INVALID_VALUE: number;
	INVALID_OPERATION: number;
	OUT_OF_MEMORY: number;

	/* FrontFaceDirection */
	CW: number;
	CCW: number;

	/* GetPName */
	LINE_WIDTH: number;
	ALIASED_POINT_SIZE_RANGE: number;
	ALIASED_LINE_WIDTH_RANGE: number;
	CULL_FACE_MODE: number;
	FRONT_FACE: number;
	DEPTH_RANGE: number;
	DEPTH_WRITEMASK: number;
	DEPTH_CLEAR_VALUE: number;
	DEPTH_FUNC: number;
	STENCIL_CLEAR_VALUE: number;
	STENCIL_FUNC: number;
	STENCIL_FAIL: number;
	STENCIL_PASS_DEPTH_FAIL: number;
	STENCIL_PASS_DEPTH_PASS: number;
	STENCIL_REF: number;
	STENCIL_VALUE_MASK: number;
	STENCIL_WRITEMASK: number;
	STENCIL_BACK_FUNC: number;
	STENCIL_BACK_FAIL: number;
	STENCIL_BACK_PASS_DEPTH_FAIL: number;
	STENCIL_BACK_PASS_DEPTH_PASS: number;
	STENCIL_BACK_REF: number;
	STENCIL_BACK_VALUE_MASK: number;
	STENCIL_BACK_WRITEMASK: number;
	VIEWPORT: number;
	SCISSOR_BOX: number;
	/*      SCISSOR_TEST */
	COLOR_CLEAR_VALUE: number;
	COLOR_WRITEMASK: number;
	UNPACK_ALIGNMENT: number;
	PACK_ALIGNMENT: number;
	MAX_TEXTURE_SIZE: number;
	MAX_VIEWPORT_DIMS: number;
	SUBPIXEL_BITS: number;
	RED_BITS: number;
	GREEN_BITS: number;
	BLUE_BITS: number;
	ALPHA_BITS: number;
	DEPTH_BITS: number;
	STENCIL_BITS: number;
	POLYGON_OFFSET_UNITS: number;
	/*      POLYGON_OFFSET_FILL */
	POLYGON_OFFSET_FACTOR: number;
	TEXTURE_BINDING_2D: number;
	SAMPLE_BUFFERS: number;
	SAMPLES: number;
	SAMPLE_COVERAGE_VALUE: number;
	SAMPLE_COVERAGE_INVERT: number;

	/* GetTextureParameter */
	/*      TEXTURE_MAG_FILTER */
	/*      TEXTURE_MIN_FILTER */
	/*      TEXTURE_WRAP_S */
	/*      TEXTURE_WRAP_T */

	COMPRESSED_TEXTURE_FORMATS: number;

	/* HintMode */
	DONT_CARE: number;
	FASTEST: number;
	NICEST: number;

	/* HintTarget */
	GENERATE_MIPMAP_HINT: number;

	/* DataType */
	BYTE: number;
	UNSIGNED_BYTE: number;
	SHORT: number;
	UNSIGNED_SHORT: number;
	INT: number;
	UNSIGNED_INT: number;
	FLOAT: number;

	/* PixelFormat */
	DEPTH_COMPONENT: number;
	ALPHA: number;
	RGB: number;
	RGBA: number;
	LUMINANCE: number;
	LUMINANCE_ALPHA: number;

	/* PixelType */
	/*      UNSIGNED_BYTE */
	UNSIGNED_SHORT_4_4_4_4: number;
	UNSIGNED_SHORT_5_5_5_1: number;
	UNSIGNED_SHORT_5_6_5: number;

	/* Shaders */
	FRAGMENT_SHADER: number;
	VERTEX_SHADER: number;
	MAX_VERTEX_ATTRIBS: number;
	MAX_VERTEX_UNIFORM_VECTORS: number;
	MAX_VARYING_VECTORS: number;
	MAX_COMBINED_TEXTURE_IMAGE_UNITS: number;
	MAX_VERTEX_TEXTURE_IMAGE_UNITS: number;
	MAX_TEXTURE_IMAGE_UNITS: number;
	MAX_FRAGMENT_UNIFORM_VECTORS: number;
	SHADER_TYPE: number;
	DELETE_STATUS: number;
	LINK_STATUS: number;
	VALIDATE_STATUS: number;
	ATTACHED_SHADERS: number;
	ACTIVE_UNIFORMS: number;
	ACTIVE_ATTRIBUTES: number;
	SHADING_LANGUAGE_VERSION: number;
	CURRENT_PROGRAM: number;

	/* StencilFunction */
	NEVER: number;
	LESS: number;
	EQUAL: number;
	LEQUAL: number;
	GREATER: number;
	NOTEQUAL: number;
	GEQUAL: number;
	ALWAYS: number;

	/* StencilOp */
	/*      ZERO */
	KEEP: number;
	REPLACE: number;
	INCR: number;
	DECR: number;
	INVERT: number;
	INCR_WRAP: number;
	DECR_WRAP: number;

	/* StringName */
	VENDOR: number;
	RENDERER: number;
	VERSION: number;

	/* TextureMagFilter */
	NEAREST: number;
	LINEAR: number;

	/* TextureMinFilter */
	/*      NEAREST */
	/*      LINEAR */
	NEAREST_MIPMAP_NEAREST: number;
	LINEAR_MIPMAP_NEAREST: number;
	NEAREST_MIPMAP_LINEAR: number;
	LINEAR_MIPMAP_LINEAR: number;

	/* TextureParameterName */
	TEXTURE_MAG_FILTER: number;
	TEXTURE_MIN_FILTER: number;
	TEXTURE_WRAP_S: number;
	TEXTURE_WRAP_T: number;

	/* TextureTarget */
	TEXTURE_2D: number;
	TEXTURE: number;

	TEXTURE_CUBE_MAP: number;
	TEXTURE_BINDING_CUBE_MAP: number;
	TEXTURE_CUBE_MAP_POSITIVE_X: number;
	TEXTURE_CUBE_MAP_NEGATIVE_X: number;
	TEXTURE_CUBE_MAP_POSITIVE_Y: number;
	TEXTURE_CUBE_MAP_NEGATIVE_Y: number;
	TEXTURE_CUBE_MAP_POSITIVE_Z: number;
	TEXTURE_CUBE_MAP_NEGATIVE_Z: number;
	MAX_CUBE_MAP_TEXTURE_SIZE: number;

	/* TextureUnit */
	TEXTURE0: number;
	TEXTURE1: number;
	TEXTURE2: number;
	TEXTURE3: number;
	TEXTURE4: number;
	TEXTURE5: number;
	TEXTURE6: number;
	TEXTURE7: number;
	TEXTURE8: number;
	TEXTURE9: number;
	TEXTURE10: number;
	TEXTURE11: number;
	TEXTURE12: number;
	TEXTURE13: number;
	TEXTURE14: number;
	TEXTURE15: number;
	TEXTURE16: number;
	TEXTURE17: number;
	TEXTURE18: number;
	TEXTURE19: number;
	TEXTURE20: number;
	TEXTURE21: number;
	TEXTURE22: number;
	TEXTURE23: number;
	TEXTURE24: number;
	TEXTURE25: number;
	TEXTURE26: number;
	TEXTURE27: number;
	TEXTURE28: number;
	TEXTURE29: number;
	TEXTURE30: number;
	TEXTURE31: number;
	ACTIVE_TEXTURE: number;

	/* TextureWrapMode */
	REPEAT: number;
	CLAMP_TO_EDGE: number;
	MIRRORED_REPEAT: number;

	/* Uniform Types */
	FLOAT_VEC2: number;
	FLOAT_VEC3: number;
	FLOAT_VEC4: number;
	INT_VEC2: number;
	INT_VEC3: number;
	INT_VEC4: number;
	BOOL: number;
	BOOL_VEC2: number;
	BOOL_VEC3: number;
	BOOL_VEC4: number;
	FLOAT_MAT2: number;
	FLOAT_MAT3: number;
	FLOAT_MAT4: number;
	SAMPLER_2D: number;
	SAMPLER_CUBE: number;

	/* Vertex Arrays */
	VERTEX_ATTRIB_ARRAY_ENABLED: number;
	VERTEX_ATTRIB_ARRAY_SIZE: number;
	VERTEX_ATTRIB_ARRAY_STRIDE: number;
	VERTEX_ATTRIB_ARRAY_TYPE: number;
	VERTEX_ATTRIB_ARRAY_NORMALIZED: number;
	VERTEX_ATTRIB_ARRAY_POINTER: number;
	VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: number;

	/* Shader Source */
	COMPILE_STATUS: number;

	/* Shader Precision-Specified Types */
	LOW_FLOAT: number;
	MEDIUM_FLOAT: number;
	HIGH_FLOAT: number;
	LOW_INT: number;
	MEDIUM_INT: number;
	HIGH_INT: number;

	/* Framebuffer Object. */
	FRAMEBUFFER: number;
	RENDERBUFFER: number;

	RGBA4: number;
	RGB5_A1: number;
	RGB565: number;
	DEPTH_COMPONENT16: number;
	STENCIL_INDEX: number;
	STENCIL_INDEX8: number;
	DEPTH_STENCIL: number;

	RENDERBUFFER_WIDTH: number;
	RENDERBUFFER_HEIGHT: number;
	RENDERBUFFER_INTERNAL_FORMAT: number;
	RENDERBUFFER_RED_SIZE: number;
	RENDERBUFFER_GREEN_SIZE: number;
	RENDERBUFFER_BLUE_SIZE: number;
	RENDERBUFFER_ALPHA_SIZE: number;
	RENDERBUFFER_DEPTH_SIZE: number;
	RENDERBUFFER_STENCIL_SIZE: number;

	FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: number;
	FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: number;
	FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: number;
	FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: number;

	COLOR_ATTACHMENT0: number;
	DEPTH_ATTACHMENT: number;
	STENCIL_ATTACHMENT: number;
	DEPTH_STENCIL_ATTACHMENT: number;

	NONE: number;

	FRAMEBUFFER_COMPLETE: number;
	FRAMEBUFFER_INCOMPLETE_ATTACHMENT: number;
	FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: number;
	FRAMEBUFFER_INCOMPLETE_DIMENSIONS: number;
	FRAMEBUFFER_UNSUPPORTED: number;

	FRAMEBUFFER_BINDING: number;
	RENDERBUFFER_BINDING: number;
	MAX_RENDERBUFFER_SIZE: number;

	INVALID_FRAMEBUFFER_OPERATION: number;

	/* WebGL-specific enums */
	UNPACK_FLIP_Y_WEBGL: number;
	UNPACK_PREMULTIPLY_ALPHA_WEBGL: number;
	CONTEXT_LOST_WEBGL: number;
	UNPACK_COLORSPACE_CONVERSION_WEBGL: number;
	BROWSER_DEFAULT_WEBGL: number;




	canvas: HTMLCanvasElement;
	drawingBufferWidth: number;
	drawingBufferHeight: number;

	getContextAttributes(): WebGLContextAttributes;
	isContextLost(): bool;

	getSupportedExtensions(): string[];
	getExtension(name: string): any;

	activeTexture(texture: number): void;
	attachShader(program: WebGLProgram, shader: WebGLShader): void;
	bindAttribLocation(program: WebGLProgram, index: number, name: string): void;
	bindBuffer(target: number, buffer: WebGLBuffer): void;
	bindFramebuffer(target: number, framebuffer: WebGLFramebuffer): void;
	bindRenderbuffer(target: number, renderbuffer: WebGLRenderbuffer): void;
	bindTexture(target: number, texture: WebGLTexture): void;
	blendColor(red: number, green: number, blue: number, alpha: number): void;
	blendEquation(mode: number): void;
	blendEquationSeparate(modeRGB: number, modeAlpha: number): void;
	blendFunc(sfactor: number, dfactor: number): void;
	blendFuncSeparate(srcRGB: number, dstRGB: number, srcAlpha: number, dstAlpha: number): void;

	bufferData(target: number, size: number, usage: number): void;
	bufferData(target: number, data: ArrayBufferView, usage: number): void;
	bufferData(target: number, data: ArrayBuffer, usage: number): void;
	bufferSubData(target: number, offset: number, data: ArrayBufferView): void;
	bufferSubData(target: number, offset: number, data: ArrayBuffer): void;

	checkFramebufferStatus(target: number): number;
	clear(mask: number): void;
	clearColor(red: number, green: number, blue: number, alpha: number): void;
	clearDepth(depth: number): void;
	clearStencil(s: number): void;
	colorMask(red: bool, green: bool, blue: bool, alpha: bool): void;
	compileShader(shader: WebGLShader): void;

	compressedTexImage2D(target: number, level: number, internalformat: number, width: number, height: number, border: number, data: ArrayBufferView): void;
	compressedTexSubImage2D(target: number, level: number, xoffset: number, yoffset: number, width: number, height: number, format: number, data: ArrayBufferView): void;

	copyTexImage2D(target: number, level: number, internalformat: number, x: number, y: number, width: number, height: number, border: number): void;
	copyTexSubImage2D(target: number, level: number, xoffset: number, yoffset: number, x: number, y: number, width: number, height: number): void;

	createBuffer(): WebGLBuffer;
	createFramebuffer(): WebGLFramebuffer;
	createProgram(): WebGLProgram;
	createRenderbuffer(): WebGLRenderbuffer;
	createShader(type: number): WebGLShader;
	createTexture(): WebGLTexture;

	cullFace(mode: number): void;

	deleteBuffer(buffer: WebGLBuffer): void;
	deleteFramebuffer(framebuffer: WebGLFramebuffer): void;
	deleteProgram(program: WebGLProgram): void;
	deleteRenderbuffer(renderbuffer: WebGLRenderbuffer): void;
	deleteShader(shader: WebGLShader): void;
	deleteTexture(texture: WebGLTexture): void;

	depthFunc(func: number): void;
	depthMask(flag: bool): void;
	depthRange(zNear: number, zFar: number): void;
	detachShader(program: WebGLProgram, shader: WebGLShader): void;
	disable(cap: number): void;
	disableVertexAttribArray(index: number): void;
	drawArrays(mode: number, first: number, count: number): void;
	drawElements(mode: number, count: number, type: number, offset: number): void;

	enable(cap: number): void;
	enableVertexAttribArray(index: number): void;
	finish(): void;
	flush(): void;
	framebufferRenderbuffer(target: number, attachment: number, renderbuffertarget: number, renderbuffer: WebGLRenderbuffer): void;
	framebufferTexture2D(target: number, attachment: number, textarget: number, texture: WebGLTexture, level: number): void;
	frontFace(mode: number): void;

	generateMipmap(target: number): void;

	getActiveAttrib(program: WebGLProgram, index: number): WebGLActiveInfo;
	getActiveUniform(program: WebGLProgram, index: number): WebGLActiveInfo;
	getAttachedShaders(program: WebGLProgram): WebGLShader[];

	getAttribLocation(program: WebGLProgram, name: string): number;

	getBufferParameter(target: number, pname: number): any;
	getParameter(pname: number): any;

	getError(): number;

	getFramebufferAttachmentParameter(target: number, attachment: number, pname: number): any;
	getProgramParameter(program: WebGLProgram, pname: number): any;
	getProgramInfoLog(program: WebGLProgram): string;
	getRenderbufferParameter(target: number, pname: number): any;
	getShaderParameter(shader: WebGLShader, pname: number): any;
	getShaderPrecisionFormat(shadertype: number, precisiontype: number): WebGLShaderPrecisionFormat;
	getShaderInfoLog(shader: WebGLShader): string;

	getShaderSource(shader: WebGLShader): string;

	getTexParameter(target: number, pname: number): any;

	getUniform(program: WebGLProgram, location: WebGLUniformLocation): any;

	getUniformLocation(program: WebGLProgram, name: string): WebGLUniformLocation;

	getVertexAttrib(index: number, pname: number): any;

	getVertexAttribOffset(index: number, pname: number): number;

	hint(target: number, mode: number): void;
	isBuffer(buffer: WebGLBuffer): bool;
	isEnabled(cap: number): bool;
	isFramebuffer(framebuffer: WebGLFramebuffer): bool;
	isProgram(program: WebGLProgram): bool;
	isRenderbuffer(renderbuffer: WebGLRenderbuffer): bool;
	isShader(shader: WebGLShader): bool;
	isTexture(texture: WebGLTexture): bool;
	lineWidth(width: number): void;
	linkProgram(program: WebGLProgram): void;
	pixelStorei(pname: number, param: number): void;
	polygonOffset(factor: number, units: number): void;

	readPixels(x: number, y: number, width: number, height: number, format: number, type: number, pixels: ArrayBufferView): void;

	renderbufferStorage(target: number, internalformat: number, width: number, height: number): void;
	sampleCoverage(value: number, invert: bool): void;
	scissor(x: number, y: number, width: number, height: number): void;

	shaderSource(shader: WebGLShader, source: string): void;

	stencilFunc(func: number, ref: number, mask: number): void;
	stencilFuncSeparate(face: number, func: number, ref: number, mask: number): void;
	stencilMask(mask: number): void;
	stencilMaskSeparate(face: number, mask: number): void;
	stencilOp(fail: number, zfail: number, zpass: number): void;
	stencilOpSeparate(face: number, fail: number, zfail: number, zpass: number): void;

	texImage2D(target: number, level: number, internalformat: number, width: number, height: number, border: number, format: number, type: number, pixels: ArrayBufferView): void;
	texImage2D(target: number, level: number, internalformat: number, format: number, type: number, pixels: ImageData): void;
	texImage2D(target: number, level: number, internalformat: number, format: number, type: number, image: HTMLImageElement): void; // May throw DOMException
	texImage2D(target: number, level: number, internalformat: number, format: number, type: number, canvas: HTMLCanvasElement): void; // May throw DOMException
	texImage2D(target: number, level: number, internalformat: number, format: number, type: number, video: HTMLVideoElement): void; // May throw DOMException

	texParameterf(target: number, pname: number, param: number): void;
	texParameteri(target: number, pname: number, param: number): void;

	texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, width: number, height: number, format: number, type: number, pixels: ArrayBufferView): void;
	texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, format: number, type: number, pixels: ImageData): void;
	texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, format: number, type: number, image: HTMLImageElement): void; // May throw DOMException
	texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, format: number, type: number, canvas: HTMLCanvasElement): void; // May throw DOMException
	texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, format: number, type: number, video: HTMLVideoElement): void; // May throw DOMException

	uniform1f(location: WebGLUniformLocation, x: number): void;
	uniform1fv(location: WebGLUniformLocation, v: Float32Array): void;
	uniform1fv(location: WebGLUniformLocation, v: number[]): void;
	uniform1i(location: WebGLUniformLocation, x: number): void;
	uniform1iv(location: WebGLUniformLocation, v: Int32Array): void;
	uniform1iv(location: WebGLUniformLocation, v: number[]): void;
	uniform2f(location: WebGLUniformLocation, x: number, y: number): void;
	uniform2fv(location: WebGLUniformLocation, v: Float32Array): void;
	uniform2fv(location: WebGLUniformLocation, v: number[]): void;
	uniform2i(location: WebGLUniformLocation, x: number, y: number): void;
	uniform2iv(location: WebGLUniformLocation, v: Int32Array): void;
	uniform2iv(location: WebGLUniformLocation, v: number[]): void;
	uniform3f(location: WebGLUniformLocation, x: number, y: number, z: number): void;
	uniform3fv(location: WebGLUniformLocation, v: Float32Array): void;
	uniform3fv(location: WebGLUniformLocation, v: number[]): void;
	uniform3i(location: WebGLUniformLocation, x: number, y: number, z: number): void;
	uniform3iv(location: WebGLUniformLocation, v: Int32Array): void;
	uniform3iv(location: WebGLUniformLocation, v: number[]): void;
	uniform4f(location: WebGLUniformLocation, x: number, y: number, z: number, w: number): void;
	uniform4fv(location: WebGLUniformLocation, v: Float32Array): void;
	uniform4fv(location: WebGLUniformLocation, v: number[]): void;
	uniform4i(location: WebGLUniformLocation, x: number, y: number, z: number, w: number): void;
	uniform4iv(location: WebGLUniformLocation, v: Int32Array): void;
	uniform4iv(location: WebGLUniformLocation, v: number[]): void;

	uniformMatrix2fv(location: WebGLUniformLocation, transpose: bool, value: Float32Array): void;
	uniformMatrix2fv(location: WebGLUniformLocation, transpose: bool, value: number[]): void;
	uniformMatrix3fv(location: WebGLUniformLocation, transpose: bool, value: Float32Array): void;
	uniformMatrix3fv(location: WebGLUniformLocation, transpose: bool, value: number[]): void;
	uniformMatrix4fv(location: WebGLUniformLocation, transpose: bool, value: Float32Array): void;
	uniformMatrix4fv(location: WebGLUniformLocation, transpose: bool, value: number[]): void;

	useProgram(program: WebGLProgram): void;
	validateProgram(program: WebGLProgram): void;

	vertexAttrib1f(indx: number, x: number): void;
	vertexAttrib1fv(indx: number, values: Float32Array): void;
	vertexAttrib1fv(indx: number, value: number[]): void;
	vertexAttrib2f(indx: number, x: number, y: number): void;
	vertexAttrib2fv(indx: number, values: Float32Array): void;
	vertexAttrib2fv(indx: number, value: number[]): void;
	vertexAttrib3f(indx: number, x: number, y: number, z: number): void;
	vertexAttrib3fv(indx: number, values: Float32Array): void;
	vertexAttrib3fv(indx: number, value: number[]): void;
	vertexAttrib4f(indx: number, x: number, y: number, z: number, w: number): void;
	vertexAttrib4fv(indx: number, values: Float32Array): void;
	vertexAttrib4fv(indx: number, value: number[]): void;
	vertexAttribPointer(indx: number, size: number, type: number, normalized: bool, stride: number, offset: number): void;

	viewport(x: number, y: number, width: number, height: number): void;
};

interface CanvasRenderingContext {

}

interface WebGLRenderingContext extends CanvasRenderingContext {

}



declare var WebGLRenderingContext: {
    prototype: WebGLRenderingContext;
    new(): WebGLRenderingContext;
}

interface HTMLCanvasElement extends HTMLElement {
    getContext(contextId: string, args?: WebGLContextAttributes): WebGLRenderingContext;
}

interface WEBGL_debug_shaders {
      getTranslatedShaderSource(shader: WebGLShader): DOMString;
};

interface WEBGL_debug_renderer_info {
    UNMASKED_VENDOR_WEBGL: number;
    UNMASKED_RENDERER_WEBGL: number;
};

interface WEBGL_compressed_texture_pvrtc {
    /* Compressed Texture Formats */
    COMPRESSED_RGB_PVRTC_4BPPV1_IMG: number;
    COMPRESSED_RGB_PVRTC_2BPPV1_IMG: number;
    COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: number;
    COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: number;
};

interface WEBGL_compressed_texture_atc {
    /* Compressed Texture Formats */
    COMPRESSED_RGB_ATC_WEBGL: number;
    COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL: number;
    COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL: number;
};

interface WEBGL_compressed_texture_s3tc {
    /* Compressed Texture Formats */
    COMPRESSED_RGB_S3TC_DXT1_EXT : number;
    COMPRESSED_RGBA_S3TC_DXT1_EXT: number;
    COMPRESSED_RGBA_S3TC_DXT3_EXT: number;
    COMPRESSED_RGBA_S3TC_DXT5_EXT: number;
};

interface WEBGL_depth_texture {
  UNSIGNED_INT_24_8_WEBGL: number;
};

interface OES_element_index_uint {
};

interface WebGLVertexArrayObjectOES extends WebGLObject {
};

interface OES_vertex_array_object {
    VERTEX_ARRAY_BINDING_OES: number;

    createVertexArrayOES(): WebGLVertexArrayObjectOES;
    deleteVertexArrayOES(arrayObject: WebGLVertexArrayObjectOES): void;
    isVertexArrayOES(arrayObject: WebGLVertexArrayObjectOES): bool;
    bindVertexArrayOES(arrayObject: WebGLVertexArrayObjectOES): void;
};
  
interface OES_standard_derivatives {
    FRAGMENT_SHADER_DERIVATIVE_HINT_OES: number;
};

interface OES_texture_half_float {
 	HALF_FLOAT_OES: number;
};

interface OES_texture_float {
};

interface WEBGL_lose_context {
      loseContext(): void;
      restoreContext(): void;
};
  
interface WEBGL_multiple_render_targets {
    COLOR_ATTACHMENT0_WEBGL: number;
    COLOR_ATTACHMENT1_WEBGL: number;
    COLOR_ATTACHMENT2_WEBGL: number;
    COLOR_ATTACHMENT3_WEBGL: number;
    COLOR_ATTACHMENT4_WEBGL: number;
    COLOR_ATTACHMENT5_WEBGL: number;
    COLOR_ATTACHMENT6_WEBGL: number;
    COLOR_ATTACHMENT7_WEBGL: number;
    COLOR_ATTACHMENT8_WEBGL: number;
    COLOR_ATTACHMENT9_WEBGL: number;
    COLOR_ATTACHMENT10_WEBGL: number;
    COLOR_ATTACHMENT11_WEBGL: number;
    COLOR_ATTACHMENT12_WEBGL: number;
    COLOR_ATTACHMENT13_WEBGL: number;
    COLOR_ATTACHMENT14_WEBGL: number;
    COLOR_ATTACHMENT15_WEBGL: number;

    DRAW_BUFFER0_WEBGL: number;
    DRAW_BUFFER1_WEBGL: number;
    DRAW_BUFFER2_WEBGL: number;
    DRAW_BUFFER3_WEBGL: number;
    DRAW_BUFFER4_WEBGL: number;
    DRAW_BUFFER5_WEBGL: number;
    DRAW_BUFFER6_WEBGL: number;
    DRAW_BUFFER7_WEBGL: number;
    DRAW_BUFFER8_WEBGL: number;
    DRAW_BUFFER9_WEBGL: number;
    DRAW_BUFFER10_WEBGL: number;
    DRAW_BUFFER11_WEBGL: number;
    DRAW_BUFFER12_WEBGL: number;
    DRAW_BUFFER13_WEBGL: number;
    DRAW_BUFFER14_WEBGL: number;
    DRAW_BUFFER15_WEBGL: number;

    MAX_COLOR_ATTACHMENTS_WEBGL: number;
    MAX_DRAW_BUFFERS_WEBGL: number;

    drawBuffersWEBGL(buffers: number[]): void;
};

interface WEBGL_fbo_color_attachments {
    COLOR_ATTACHMENT0: number;
    COLOR_ATTACHMENT1: number;
    COLOR_ATTACHMENT2: number;
    COLOR_ATTACHMENT3: number;
    COLOR_ATTACHMENT4: number;
    COLOR_ATTACHMENT5: number;
    COLOR_ATTACHMENT6: number;
    COLOR_ATTACHMENT7: number;
    COLOR_ATTACHMENT8: number;
    COLOR_ATTACHMENT9: number;
    COLOR_ATTACHMENT10: number;
    COLOR_ATTACHMENT11: number;
    COLOR_ATTACHMENT12: number;
    COLOR_ATTACHMENT13: number;
    COLOR_ATTACHMENT14: number;
    COLOR_ATTACHMENT15: number;

    MAX_COLOR_ATTACHMENTS: number;
};

/* ClearBufferMask */
#define GL_DEPTH_BUFFER_BIT               0x00000100
#define GL_STENCIL_BUFFER_BIT             0x00000400
#define GL_COLOR_BUFFER_BIT               0x00004000

/* BeginMode */
#define GL_POINTS                         0x0000
#define GL_LINES                          0x0001
#define GL_LINE_LOOP                      0x0002
#define GL_LINE_STRIP                     0x0003
#define GL_TRIANGLES                      0x0004
#define GL_TRIANGLE_STRIP                 0x0005
#define GL_TRIANGLE_FAN                   0x0006

/* AlphaFunction (not supported in ES20) */
/*      NEVER */
/*      LESS */
/*      EQUAL */
/*      LEQUAL */
/*      GREATER */
/*      NOTEQUAL */
/*      GEQUAL */
/*      ALWAYS */

/* BlendingFactorDest */
#define GL_ZERO                           0
#define GL_ONE                            1
#define GL_SRC_COLOR                      0x0300
#define GL_ONE_MINUS_SRC_COLOR            0x0301
#define GL_SRC_ALPHA                      0x0302
#define GL_ONE_MINUS_SRC_ALPHA            0x0303
#define GL_DST_ALPHA                      0x0304
#define GL_ONE_MINUS_DST_ALPHA            0x0305

/* BlendingFactorSrc */
/*      ZERO */
/*      ONE */
#define GL_DST_COLOR                      0x0306
#define GL_ONE_MINUS_DST_COLOR            0x0307
#define GL_SRC_ALPHA_SATURATE             0x0308
/*      SRC_ALPHA */
/*      ONE_MINUS_SRC_ALPHA */
/*      DST_ALPHA */
/*      ONE_MINUS_DST_ALPHA */

/* BlendEquationSeparate */
#define GL_FUNC_ADD                       0x8006
#define GL_BLEND_EQUATION                 0x8009
#define GL_BLEND_EQUATION_RGB             0x8009   /* same as BLEND_EQUATION */
#define GL_BLEND_EQUATION_ALPHA           0x883D

/* BlendSubtract */
#define GL_FUNC_SUBTRACT                  0x800A
#define GL_FUNC_REVERSE_SUBTRACT          0x800B

/* Separate Blend Functions */
#define GL_BLEND_DST_RGB                  0x80C8
#define GL_BLEND_SRC_RGB                  0x80C9
#define GL_BLEND_DST_ALPHA                0x80CA
#define GL_BLEND_SRC_ALPHA                0x80CB
#define GL_CONSTANT_COLOR                 0x8001
#define GL_ONE_MINUS_CONSTANT_COLOR       0x8002
#define GL_CONSTANT_ALPHA                 0x8003
#define GL_ONE_MINUS_CONSTANT_ALPHA       0x8004
#define GL_BLEND_COLOR                    0x8005

/* Buffer Objects */
#define GL_ARRAY_BUFFER                   0x8892
#define GL_ELEMENT_ARRAY_BUFFER           0x8893
#define GL_ARRAY_BUFFER_BINDING           0x8894
#define GL_ELEMENT_ARRAY_BUFFER_BINDING   0x8895

#define GL_STREAM_DRAW                    0x88E0
#define GL_STATIC_DRAW                    0x88E4
#define GL_DYNAMIC_DRAW                   0x88E8

#define GL_BUFFER_SIZE                    0x8764
#define GL_BUFFER_USAGE                   0x8765

#define GL_CURRENT_VERTEX_ATTRIB          0x8626

/* CullFaceMode */
#define GL_FRONT                          0x0404
#define GL_BACK                           0x0405
#define GL_FRONT_AND_BACK                 0x0408

/* DepthFunction */
/*      NEVER */
/*      LESS */
/*      EQUAL */
/*      LEQUAL */
/*      GREATER */
/*      NOTEQUAL */
/*      GEQUAL */
/*      ALWAYS */

/* EnableCap */
/* TEXTURE_2D */
#define GL_CULL_FACE                      0x0B44
#define GL_BLEND                          0x0BE2
#define GL_DITHER                         0x0BD0
#define GL_STENCIL_TEST                   0x0B90
#define GL_DEPTH_TEST                     0x0B71
#define GL_SCISSOR_TEST                   0x0C11
#define GL_POLYGON_OFFSET_FILL            0x8037
#define GL_SAMPLE_ALPHA_TO_COVERAGE       0x809E
#define GL_SAMPLE_COVERAGE                0x80A0

/* ErrorCode */
#define GL_NO_ERROR                       0
#define GL_INVALID_ENUM                   0x0500
#define GL_INVALID_VALUE                  0x0501
#define GL_INVALID_OPERATION              0x0502
#define GL_OUT_OF_MEMORY                  0x0505

/* FrontFaceDirection */
#define GL_CW                             0x0900
#define GL_CCW                            0x0901

/* GetPName */
#define GL_LINE_WIDTH                     0x0B21
#define GL_ALIASED_POINT_SIZE_RANGE       0x846D
#define GL_ALIASED_LINE_WIDTH_RANGE       0x846E
#define GL_CULL_FACE_MODE                 0x0B45
#define GL_FRONT_FACE                     0x0B46
#define GL_DEPTH_RANGE                    0x0B70
#define GL_DEPTH_WRITEMASK                0x0B72
#define GL_DEPTH_CLEAR_VALUE              0x0B73
#define GL_DEPTH_FUNC                     0x0B74
#define GL_STENCIL_CLEAR_VALUE            0x0B91
#define GL_STENCIL_FUNC                   0x0B92
#define GL_STENCIL_FAIL                   0x0B94
#define GL_STENCIL_PASS_DEPTH_FAIL        0x0B95
#define GL_STENCIL_PASS_DEPTH_PASS        0x0B96
#define GL_STENCIL_REF                    0x0B97
#define GL_STENCIL_VALUE_MASK             0x0B93
#define GL_STENCIL_WRITEMASK              0x0B98
#define GL_STENCIL_BACK_FUNC              0x8800
#define GL_STENCIL_BACK_FAIL              0x8801
#define GL_STENCIL_BACK_PASS_DEPTH_FAIL   0x8802
#define GL_STENCIL_BACK_PASS_DEPTH_PASS   0x8803
#define GL_STENCIL_BACK_REF               0x8CA3
#define GL_STENCIL_BACK_VALUE_MASK        0x8CA4
#define GL_STENCIL_BACK_WRITEMASK         0x8CA5
#define GL_VIEWPORT                       0x0BA2
#define GL_SCISSOR_BOX                    0x0C10
/*      SCISSOR_TEST */
#define GL_COLOR_CLEAR_VALUE              0x0C22
#define GL_COLOR_WRITEMASK                0x0C23
#define GL_UNPACK_ALIGNMENT               0x0CF5
#define GL_PACK_ALIGNMENT                 0x0D05
#define GL_MAX_TEXTURE_SIZE               0x0D33
#define GL_MAX_VIEWPORT_DIMS              0x0D3A
#define GL_SUBPIXEL_BITS                  0x0D50
#define GL_RED_BITS                       0x0D52
#define GL_GREEN_BITS                     0x0D53
#define GL_BLUE_BITS                      0x0D54
#define GL_ALPHA_BITS                     0x0D55
#define GL_DEPTH_BITS                     0x0D56
#define GL_STENCIL_BITS                   0x0D57
#define GL_POLYGON_OFFSET_UNITS           0x2A00
/*      POLYGON_OFFSET_FILL */
#define GL_POLYGON_OFFSET_FACTOR          0x8038
#define GL_TEXTURE_BINDING_2D             0x8069
#define GL_SAMPLE_BUFFERS                 0x80A8
#define GL_SAMPLES                        0x80A9
#define GL_SAMPLE_COVERAGE_VALUE          0x80AA
#define GL_SAMPLE_COVERAGE_INVERT         0x80AB

/* GetTextureParameter */
/*      TEXTURE_MAG_FILTER */
/*      TEXTURE_MIN_FILTER */
/*      TEXTURE_WRAP_S */
/*      TEXTURE_WRAP_T */

#define GL_COMPRESSED_TEXTURE_FORMATS     0x86A3

/* HintMode */
#define GL_DONT_CARE                      0x1100
#define GL_FASTEST                        0x1101
#define GL_NICEST                         0x1102

/* HintTarget */
#define GL_GENERATE_MIPMAP_HINT            0x8192

/* DataType */
#define GL_BYTE                           0x1400
#define GL_UNSIGNED_BYTE                  0x1401
#define GL_SHORT                          0x1402
#define GL_UNSIGNED_SHORT                 0x1403
#define GL_INT                            0x1404
#define GL_UNSIGNED_INT                   0x1405
#define GL_FLOAT                          0x1406

/* PixelFormat */
#define GL_DEPTH_COMPONENT                0x1902
#define GL_ALPHA                          0x1906
#define GL_RGB                            0x1907
#define GL_RGBA                           0x1908
#define GL_BGR 							  0x80E0 
#define GL_BGRA 						  0x80E1
#define GL_LUMINANCE                      0x1909
#define GL_LUMINANCE_ALPHA                0x190A

/* PixelType */
/*      UNSIGNED_BYTE */
#define GL_UNSIGNED_SHORT_4_4_4_4         0x8033
#define GL_UNSIGNED_SHORT_5_5_5_1         0x8034
#define GL_UNSIGNED_SHORT_5_6_5           0x8363

/* Shaders */
#define GL_FRAGMENT_SHADER                  0x8B30
#define GL_VERTEX_SHADER                    0x8B31
#define GL_MAX_VERTEX_ATTRIBS               0x8869
#define GL_MAX_VERTEX_UNIFORM_VECTORS       0x8DFB
#define GL_MAX_VARYING_VECTORS              0x8DFC
#define GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS 0x8B4D
#define GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS   0x8B4C
#define GL_MAX_TEXTURE_IMAGE_UNITS          0x8872
#define GL_MAX_FRAGMENT_UNIFORM_VECTORS     0x8DFD
#define GL_SHADER_TYPE                      0x8B4F
#define GL_DELETE_STATUS                    0x8B80
#define GL_LINK_STATUS                      0x8B82
#define GL_VALIDATE_STATUS                  0x8B83
#define GL_ATTACHED_SHADERS                 0x8B85
#define GL_ACTIVE_UNIFORMS                  0x8B86
#define GL_ACTIVE_ATTRIBUTES                0x8B89
#define GL_SHADING_LANGUAGE_VERSION         0x8B8C
#define GL_CURRENT_PROGRAM                  0x8B8D

/* StencilFunction */
#define GL_NEVER                          0x0200
#define GL_LESS                           0x0201
#define GL_EQUAL                          0x0202
#define GL_LEQUAL                         0x0203
#define GL_GREATER                        0x0204
#define GL_NOTEQUAL                       0x0205
#define GL_GEQUAL                         0x0206
#define GL_ALWAYS                         0x0207

/* StencilOp */
/*      ZERO */
#define GL_KEEP                           0x1E00
#define GL_REPLACE                        0x1E01
#define GL_INCR                           0x1E02
#define GL_DECR                           0x1E03
#define GL_INVERT                         0x150A
#define GL_INCR_WRAP                      0x8507
#define GL_DECR_WRAP                      0x8508

/* StringName */
#define GL_VENDOR                         0x1F00
#define GL_RENDERER                       0x1F01
#define GL_VERSION                        0x1F02

/* TextureMagFilter */
#define GL_NEAREST                        0x2600
#define GL_LINEAR                         0x2601

/* TextureMinFilter */
/*      NEAREST */
/*      LINEAR */
#define GL_NEAREST_MIPMAP_NEAREST         0x2700
#define GL_LINEAR_MIPMAP_NEAREST          0x2701
#define GL_NEAREST_MIPMAP_LINEAR          0x2702
#define GL_LINEAR_MIPMAP_LINEAR           0x2703

/* TextureParameterName */
#define GL_TEXTURE_MAG_FILTER             0x2800
#define GL_TEXTURE_MIN_FILTER             0x2801
#define GL_TEXTURE_WRAP_S                 0x2802
#define GL_TEXTURE_WRAP_T                 0x2803

/* TextureTarget */
#define GL_TEXTURE_2D                     0x0DE1
#define GL_TEXTURE                        0x1702

#define GL_TEXTURE_CUBE_MAP               0x8513
#define GL_TEXTURE_BINDING_CUBE_MAP       0x8514
#define GL_TEXTURE_CUBE_MAP_POSITIVE_X    0x8515
#define GL_TEXTURE_CUBE_MAP_NEGATIVE_X    0x8516
#define GL_TEXTURE_CUBE_MAP_POSITIVE_Y    0x8517
#define GL_TEXTURE_CUBE_MAP_NEGATIVE_Y    0x8518
#define GL_TEXTURE_CUBE_MAP_POSITIVE_Z    0x8519
#define GL_TEXTURE_CUBE_MAP_NEGATIVE_Z    0x851A
#define GL_MAX_CUBE_MAP_TEXTURE_SIZE      0x851C

/* TextureUnit */
#define GL_TEXTURE0                       0x84C0
#define GL_TEXTURE1                       0x84C1
#define GL_TEXTURE2                       0x84C2
#define GL_TEXTURE3                       0x84C3
#define GL_TEXTURE4                       0x84C4
#define GL_TEXTURE5                       0x84C5
#define GL_TEXTURE6                       0x84C6
#define GL_TEXTURE7                       0x84C7
#define GL_TEXTURE8                       0x84C8
#define GL_TEXTURE9                       0x84C9
#define GL_TEXTURE10                      0x84CA
#define GL_TEXTURE11                      0x84CB
#define GL_TEXTURE12                      0x84CC
#define GL_TEXTURE13                      0x84CD
#define GL_TEXTURE14                      0x84CE
#define GL_TEXTURE15                      0x84CF
#define GL_TEXTURE16                      0x84D0
#define GL_TEXTURE17                      0x84D1
#define GL_TEXTURE18                      0x84D2
#define GL_TEXTURE19                      0x84D3
#define GL_TEXTURE20                      0x84D4
#define GL_TEXTURE21                      0x84D5
#define GL_TEXTURE22                      0x84D6
#define GL_TEXTURE23                      0x84D7
#define GL_TEXTURE24                      0x84D8
#define GL_TEXTURE25                      0x84D9
#define GL_TEXTURE26                      0x84DA
#define GL_TEXTURE27                      0x84DB
#define GL_TEXTURE28                      0x84DC
#define GL_TEXTURE29                      0x84DD
#define GL_TEXTURE30                      0x84DE
#define GL_TEXTURE31                      0x84DF
#define GL_ACTIVE_TEXTURE                 0x84E0

/* TextureWrapMode */
#define GL_REPEAT                         0x2901
#define GL_CLAMP_TO_EDGE                  0x812F
#define GL_MIRRORED_REPEAT                0x8370

/* Uniform Types */
#define GL_FLOAT_VEC2                     0x8B50
#define GL_FLOAT_VEC3                     0x8B51
#define GL_FLOAT_VEC4                     0x8B52
#define GL_INT_VEC2                       0x8B53
#define GL_INT_VEC3                       0x8B54
#define GL_INT_VEC4                       0x8B55
#define GL_BOOL                           0x8B56
#define GL_BOOL_VEC2                      0x8B57
#define GL_BOOL_VEC3                      0x8B58
#define GL_BOOL_VEC4                      0x8B59
#define GL_FLOAT_MAT2                     0x8B5A
#define GL_FLOAT_MAT3                     0x8B5B
#define GL_FLOAT_MAT4                     0x8B5C
#define GL_SAMPLER_2D                     0x8B5E
#define GL_SAMPLER_CUBE                   0x8B60

/* Vertex Arrays */
#define GL_VERTEX_ATTRIB_ARRAY_ENABLED        0x8622
#define GL_VERTEX_ATTRIB_ARRAY_SIZE           0x8623
#define GL_VERTEX_ATTRIB_ARRAY_STRIDE         0x8624
#define GL_VERTEX_ATTRIB_ARRAY_TYPE           0x8625
#define GL_VERTEX_ATTRIB_ARRAY_NORMALIZED     0x886A
#define GL_VERTEX_ATTRIB_ARRAY_POINTER        0x8645
#define GL_VERTEX_ATTRIB_ARRAY_BUFFER_BINDING 0x889F

/* Shader Source */
#define GL_COMPILE_STATUS                 0x8B81

/* Shader Precision-Specified Types */
#define GL_LOW_FLOAT                      0x8DF0
#define GL_MEDIUM_FLOAT                   0x8DF1
#define GL_HIGH_FLOAT                     0x8DF2
#define GL_LOW_INT                        0x8DF3
#define GL_MEDIUM_INT                     0x8DF4
#define GL_HIGH_INT                       0x8DF5

/* Framebuffer Object. */
#define GL_FRAMEBUFFER                    0x8D40
#define GL_RENDERBUFFER                   0x8D41

#define GL_RGBA4                          0x8056
#define GL_RGB5_A1                        0x8057
#define GL_RGB565                         0x8D62
#define GL_DEPTH_COMPONENT16              0x81A5
#define GL_STENCIL_INDEX                  0x1901
#define GL_STENCIL_INDEX8                 0x8D48
#define GL_DEPTH_STENCIL                  0x84F9

#define GL_RENDERBUFFER_WIDTH             0x8D42
#define GL_RENDERBUFFER_HEIGHT            0x8D43
#define GL_RENDERBUFFER_INTERNAL_FORMAT   0x8D44
#define GL_RENDERBUFFER_RED_SIZE          0x8D50
#define GL_RENDERBUFFER_GREEN_SIZE        0x8D51
#define GL_RENDERBUFFER_BLUE_SIZE         0x8D52
#define GL_RENDERBUFFER_ALPHA_SIZE        0x8D53
#define GL_RENDERBUFFER_DEPTH_SIZE        0x8D54
#define GL_RENDERBUFFER_STENCIL_SIZE      0x8D55

#define GL_FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE           0x8CD0
#define GL_FRAMEBUFFER_ATTACHMENT_OBJECT_NAME           0x8CD1
#define GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL         0x8CD2
#define GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE 0x8CD3

#define GL_COLOR_ATTACHMENT0              0x8CE0
#define GL_DEPTH_ATTACHMENT               0x8D00
#define GL_STENCIL_ATTACHMENT             0x8D20
#define GL_DEPTH_STENCIL_ATTACHMENT       0x821A

#define GL_NONE                           0

#define GL_FRAMEBUFFER_COMPLETE                      0x8CD5
#define GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT         0x8CD6
#define GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT 0x8CD7
#define GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS         0x8CD9
#define GL_FRAMEBUFFER_UNSUPPORTED                   0x8CDD

#define GL_FRAMEBUFFER_BINDING            0x8CA6
#define GL_RENDERBUFFER_BINDING           0x8CA7
#define GL_MAX_RENDERBUFFER_SIZE          0x84E8

#define GL_INVALID_FRAMEBUFFER_OPERATION  0x0506

/* WebGL-specific enums */
#define GL_UNPACK_FLIP_Y_WEBGL            0x9240
#define GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL 0x9241
#define GL_CONTEXT_LOST_WEBGL             0x9242
#define GL_UNPACK_COLORSPACE_CONVERSION_WEBGL 0x9243
#define GL_BROWSER_DEFAULT_WEBGL          0x9244

#define GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG      0x8C00
#define GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG      0x8C01
#define GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG     0x8C02
#define GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG     0x8C03
#define GL_COMPRESSED_RGB_S3TC_DXT1_EXT         0x83F0
#define GL_COMPRESSED_RGBA_S3TC_DXT1_EXT        0x83F1
#define GL_COMPRESSED_RGBA_S3TC_DXT3_EXT        0x83F2
#define GL_COMPRESSED_RGBA_S3TC_DXT5_EXT        0x83F3
#define GL_RED_EXT                 				0x1903
#define GL_RG_EXT                  				0x8227


//WebGL Extensions 

#define OES_TEXTURE_FLOAT "OES_texture_float"
#define OES_TEXTURE_HALF_FLOAT "OES_texture_half_float"
#define OES_STANDARD_DERIVATIVES "OES_standard_derivatives"
#define OES_VERTEX_ARRAY_OBJECT "OES_vertex_array_object"
#define OES_ELEMENT_INDEX_UINT "OES_element_index_uint"
#define WEBGL_DEBUG_RENDERER_INFO "WEBGL_debug_renderer_info"
#define WEBGL_DEBUG_SHADERS "WEBGL_debug_shaders"
#define EXT_TEXTURE_FILTER_ANISOTROPIC "EXT_texture_filter_anisotropic"

//draft

#define WEBGL_LOSE_CONTEXT "WEBGL_lose_context"
#define WEBGL_DEPTH_TEXTURE "WEBGL_depth_texture"
#define WEBGL_COMPRESSED_TEXTURE_S3TC "WEBGL_compressed_texture_s3tc"
#define WEBGL_COMPRESSED_TEXTURE_ATC "WEBGL_compressed_texture_atc"
#define WEBGL_COMPRESSED_TEXTURE_PVRTC "WEBGL_compressed_texture_pvrtc"
#define WEBGL_COLOR_BUFFER_FLOAT "WEBGL_color_buffer_float"
#define EXT_COLOR_BUFFER_HALF_FLOAT "EXT_color_buffer_half_float"

//Future
#define EXT_TEXTURE_RG "EXT_texture_rg"