// see: http://www.khronos.org/registry/webgl/specs/latest/

interface WebGLObject {
}

interface WebGLBuffer extends WebGLObject {
}

interface WebGLFramebuffer extends WebGLObject {
}

interface WebGLProgram extends WebGLObject {
}

interface WebGLRenderbuffer extends WebGLObject {
}

interface WebGLShader extends WebGLObject {
}

interface WebGLTexture extends WebGLObject {
}

interface WebGLUniformLocation {
}

interface WebGLActiveInfo {
	size: number;
	type: number;
	name: string;
}

interface WebGLShaderPrecisionFormat {
	rangeMin: number;
	rangeMax: number;
	precision: number;
}


interface WebGLContextAttributes {
	alpha?: boolean;
	depth?: boolean;
	stencil?: boolean;
	antialias?: boolean;
	premultipliedAlpha?: boolean;
	preserveDrawingBuffer?: boolean;
}

interface WebGLRenderingContext {
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
	isContextLost(): boolean;

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
	colorMask(red: boolean, green: boolean, blue: boolean, alpha: boolean): void;
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
	depthMask(flag: boolean): void;
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
	getTranslatedShaderSource(shader: WebGLShader): string;
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
	isBuffer(buffer: WebGLBuffer): boolean;
	isEnabled(cap: number): boolean;
	isFramebuffer(framebuffer: WebGLFramebuffer): boolean;
	isProgram(program: WebGLProgram): boolean;
	isRenderbuffer(renderbuffer: WebGLRenderbuffer): boolean;
	isShader(shader: WebGLShader): boolean;
	isTexture(texture: WebGLTexture): boolean;
	lineWidth(width: number): void;
	linkProgram(program: WebGLProgram): void;
	pixelStorei(pname: number, param: number): void;
	polygonOffset(factor: number, units: number): void;

	readPixels(x: number, y: number, width: number, height: number, format: number, type: number, pixels: ArrayBufferView): void;

	renderbufferStorage(target: number, internalformat: number, width: number, height: number): void;
	sampleCoverage(value: number, invert: boolean): void;
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
	texImage2D(target: number, level: number, internalformat: number, format: number, type: number, image: HTMLImageElement): void; /* May throw DOMException*/
	texImage2D(target: number, level: number, internalformat: number, format: number, type: number, canvas: HTMLCanvasElement): void; /* May throw DOMException*/
	texImage2D(target: number, level: number, internalformat: number, format: number, type: number, video: HTMLVideoElement): void; /* May throw DOMException*/

	texParameterf(target: number, pname: number, param: number): void;
	texParameteri(target: number, pname: number, param: number): void;

	texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, width: number, height: number, format: number, type: number, pixels: ArrayBufferView): void;
	texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, format: number, type: number, pixels: ImageData): void;
	texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, format: number, type: number, image: HTMLImageElement): void; /* May throw DOMException*/
	texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, format: number, type: number, canvas: HTMLCanvasElement): void; /* May throw DOMException*/
	texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, format: number, type: number, video: HTMLVideoElement): void; /* May throw DOMException*/

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

	uniformMatrix2fv(location: WebGLUniformLocation, transpose: boolean, value: Float32Array): void;
	uniformMatrix2fv(location: WebGLUniformLocation, transpose: boolean, value: number[]): void;
	uniformMatrix3fv(location: WebGLUniformLocation, transpose: boolean, value: Float32Array): void;
	uniformMatrix3fv(location: WebGLUniformLocation, transpose: boolean, value: number[]): void;
	uniformMatrix4fv(location: WebGLUniformLocation, transpose: boolean, value: Float32Array): void;
	uniformMatrix4fv(location: WebGLUniformLocation, transpose: boolean, value: number[]): void;

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
	vertexAttribPointer(indx: number, size: number, type: number, normalized: boolean, stride: number, offset: number): void;

	viewport(x: number, y: number, width: number, height: number): void;
}

interface CanvasRenderingContext {

}

interface WebGLRenderingContext extends CanvasRenderingContext {

}



declare var WebGLRenderingContext: {
	prototype: WebGLRenderingContext;
	new (): WebGLRenderingContext;
}

interface HTMLCanvasElement extends HTMLElement {
	getContext(contextId: string, args: WebGLContextAttributes): WebGLRenderingContext;
}

interface WEBGL_debug_shaders {
	getTranslatedShaderSource(shader: WebGLShader): string;
}

interface WEBGL_debug_renderer_info {
	UNMASKED_VENDOR_WEBGL: number;
	UNMASKED_RENDERER_WEBGL: number;
}

interface WEBGL_compressed_texture_pvrtc {
	/* Compressed Texture Formats */
	COMPRESSED_RGB_PVRTC_4BPPV1_IMG: number;
	COMPRESSED_RGB_PVRTC_2BPPV1_IMG: number;
	COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: number;
	COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: number;
}

interface WEBGL_compressed_texture_atc {
	/* Compressed Texture Formats */
	COMPRESSED_RGB_ATC_WEBGL: number;
	COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL: number;
	COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL: number;
}

interface WEBGL_compressed_texture_s3tc {
	/* Compressed Texture Formats */
	COMPRESSED_RGB_S3TC_DXT1_EXT: number;
	COMPRESSED_RGBA_S3TC_DXT1_EXT: number;
	COMPRESSED_RGBA_S3TC_DXT3_EXT: number;
	COMPRESSED_RGBA_S3TC_DXT5_EXT: number;
}

interface WEBGL_depth_texture {
	UNSIGNED_INT_24_8_WEBGL: number;
}

interface OES_element_index_uint {
}

interface WebGLVertexArrayObjectOES extends WebGLObject {
}

interface OES_vertex_array_object {
	VERTEX_ARRAY_BINDING_OES: number;

	createVertexArrayOES(): WebGLVertexArrayObjectOES;
	deleteVertexArrayOES(arrayObject: WebGLVertexArrayObjectOES): void;
	isVertexArrayOES(arrayObject: WebGLVertexArrayObjectOES): boolean;
	bindVertexArrayOES(arrayObject: WebGLVertexArrayObjectOES): void;
}

interface OES_standard_derivatives {
	FRAGMENT_SHADER_DERIVATIVE_HINT_OES: number;
}

interface OES_texture_half_float {
	HALF_FLOAT_OES: number;
}

interface OES_texture_float {
}

interface WEBGL_lose_context {
	loseContext(): void;
	restoreContext(): void;
}

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
}

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
}

// debug


declare var WebGLDebugUtils: {
	/**
	 * Initializes this module. Safe to call more than once.
	 *    you have more than one context it doesn't matter which one
	 *    you pass in, it is only used to pull out constants.
	 */
	init: (ctx: WebGLRenderingContext) => void;
	/**
	 * Returns true or false if value matches any WebGL enum
	 */
	mightBeEnum: (value: any) => boolean;
	/**
	 * Gets an string version of an WebGL enum.
	 *
	 * Example:
	 *   WebGLDebugUtil.init(ctx);
	 *   var str = WebGLDebugUtil.glEnumToString(ctx.getError());
	 *
	 */
	glEnumToString: (value: number) => string;
	/**
	 * Converts the argument of a WebGL function to a string.
	 * Attempts to convert enum arguments to strings.
	 *
	 * Example:
	 *   WebGLDebugUtil.init(ctx);
	 *   var str = WebGLDebugUtil.glFunctionArgToString('bindTexture', 0, gl.TEXTURE_2D);
	 *
	 * would return 'TEXTURE_2D'
	 */
	glFunctionArgToString: (functionName: string, argumentIndex: int, value: any) => string;
	/**
	 * Converts the arguments of a WebGL function to a string.
	 * Attempts to convert enum arguments to strings.
	 */
	glFunctionArgsToString: (functionName: string, args: IArguments) => string;
	/**
	 * Given a WebGL context returns a wrapped context that calls
	 * gl.getError after every command and calls a function if the
	 * result is not NO_ERROR.
	 *
	 * You can supply your own function if you want. For example, if you'd like
	 * an exception thrown on any GL error you could do this
	 *
	 *    function throwOnGLError(err, funcName, args) {
	 *      throw WebGLDebugUtils.glEnumToString(err) +
	 *            " was caused by call to " + funcName;
	 *    };
	 *
	 *    ctx = WebGLDebugUtils.makeDebugContext(
	 *        canvas.getContext("webgl"), throwOnGLError);
	 */
	makeDebugContext: (
	ctx: WebGLRenderingContext,
	onErrorFunc?: (err: int, funcName: string, args: IArguments) => void,
	onFunc?: (funcName: string, args: IArguments) => void) => WebGLRenderingContext;

	/**
	 * Given a canvas element returns a wrapped canvas element that will
	 * simulate lost context. The canvas returned adds the following functions.
	 *
	 * loseContext:
	 *   simulates a lost context event.
	 *
	 * restoreContext:
	 *   simulates the context being restored.
	 *
	 * lostContextInNCalls:
	 *   loses the context after N gl calls.
	 *
	 * getNumCalls:
	 *   tells you how many gl calls there have been so far.
	 *
	 * setRestoreTimeout:
	 *   sets the number of milliseconds until the context is restored
	 *   after it has been lost. Defaults to 0. Pass -1 to prevent
	 *   automatic restoring.
	 */
	makeLostContextSimulatingCanvas: (canvas: HTMLCanvasElement) => HTMLCanvasElement;
	/**
	 * Resets a context to the initial state.
	 */
	resetToInitialState: (ctx: WebGLRenderingContext) => void;

}

declare enum gl {
	/* ClearBufferMask */
	DEPTH_BUFFER_BIT = 0x00000100,
	STENCIL_BUFFER_BIT = 0x00000400,
	COLOR_BUFFER_BIT = 0x00004000,

	/* BeginMode */
	POINTS = 0x0000,
	LINES = 0x0001,
	LINE_LOOP = 0x0002,
	LINE_STRIP = 0x0003,
	TRIANGLES = 0x0004,
	TRIANGLE_STRIP = 0x0005,
	TRIANGLE_FAN = 0x0006,

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
	ZERO = 0,
	ONE = 1,
	SRC_COLOR = 0x0300,
	ONE_MINUS_SRC_COLOR = 0x0301,
	SRC_ALPHA = 0x0302,
	ONE_MINUS_SRC_ALPHA = 0x0303,
	DST_ALPHA = 0x0304,
	ONE_MINUS_DST_ALPHA = 0x0305,

	/* BlendingFactorSrc */
	/*      ZERO */
	/*      ONE */
	DST_COLOR = 0x0306,
	ONE_MINUS_DST_COLOR = 0x0307,
	SRC_ALPHA_SATURATE = 0x0308,
	/*      SRC_ALPHA */
	/*      ONE_MINUS_SRC_ALPHA */
	/*      DST_ALPHA */
	/*      ONE_MINUS_DST_ALPHA */

	/* BlendEquationSeparate */
	FUNC_ADD = 0x8006,
	BLEND_EQUATION = 0x8009,
	BLEND_EQUATION_RGB = 0x8009   /* same as BLEND_EQUATION */,
	BLEND_EQUATION_ALPHA = 0x883D,

	/* BlendSubtract */
	FUNC_SUBTRACT = 0x800A,
	FUNC_REVERSE_SUBTRACT = 0x800B,

	/* Separate Blend Functions */
	BLEND_DST_RGB = 0x80C8,
	BLEND_SRC_RGB = 0x80C9,
	BLEND_DST_ALPHA = 0x80CA,
	BLEND_SRC_ALPHA = 0x80CB,
	CONSTANT_COLOR = 0x8001,
	ONE_MINUS_CONSTANT_COLOR = 0x8002,
	CONSTANT_ALPHA = 0x8003,
	ONE_MINUS_CONSTANT_ALPHA = 0x8004,
	BLEND_COLOR = 0x8005,

	/* Buffer Objects */
	ARRAY_BUFFER = 0x8892,
	ELEMENT_ARRAY_BUFFER = 0x8893,
	ARRAY_BUFFER_BINDING = 0x8894,
	ELEMENT_ARRAY_BUFFER_BINDING = 0x8895,

	STREAM_DRAW = 0x88E0,
	STATIC_DRAW = 0x88E4,
	DYNAMIC_DRAW = 0x88E8,

	BUFFER_SIZE = 0x8764,
	BUFFER_USAGE = 0x8765,

	CURRENT_VERTEX_ATTRIB = 0x8626,

	/* CullFaceMode */
	FRONT = 0x0404,
	BACK = 0x0405,
	FRONT_AND_BACK = 0x0408,

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
	CULL_FACE = 0x0B44,
	BLEND = 0x0BE2,
	DITHER = 0x0BD0,
	STENCIL_TEST = 0x0B90,
	DEPTH_TEST = 0x0B71,
	SCISSOR_TEST = 0x0C11,
	POLYGON_OFFSET_FILL = 0x8037,
	SAMPLE_ALPHA_TO_COVERAGE = 0x809E,
	SAMPLE_COVERAGE = 0x80A0,

	/* ErrorCode */
	NO_ERROR = 0,
	INVALID_ENUM = 0x0500,
	INVALID_VALUE = 0x0501,
	INVALID_OPERATION = 0x0502,
	OUT_OF_MEMORY = 0x0505,

	/* FrontFaceDirection */
	CW = 0x0900,
	CCW = 0x0901,

	/* GetPName */
	LINE_WIDTH = 0x0B21,
	ALIASED_POINT_SIZE_RANGE = 0x846D,
	ALIASED_LINE_WIDTH_RANGE = 0x846E,
	CULL_FACE_MODE = 0x0B45,
	FRONT_FACE = 0x0B46,
	DEPTH_RANGE = 0x0B70,
	DEPTH_WRITEMASK = 0x0B72,
	DEPTH_CLEAR_VALUE = 0x0B73,
	DEPTH_FUNC = 0x0B74,
	STENCIL_CLEAR_VALUE = 0x0B91,
	STENCIL_FUNC = 0x0B92,
	STENCIL_FAIL = 0x0B94,
	STENCIL_PASS_DEPTH_FAIL = 0x0B95,
	STENCIL_PASS_DEPTH_PASS = 0x0B96,
	STENCIL_REF = 0x0B97,
	STENCIL_VALUE_MASK = 0x0B93,
	STENCIL_WRITEMASK = 0x0B98,
	STENCIL_BACK_FUNC = 0x8800,
	STENCIL_BACK_FAIL = 0x8801,
	STENCIL_BACK_PASS_DEPTH_FAIL = 0x8802,
	STENCIL_BACK_PASS_DEPTH_PASS = 0x8803,
	STENCIL_BACK_REF = 0x8CA3,
	STENCIL_BACK_VALUE_MASK = 0x8CA4,
	STENCIL_BACK_WRITEMASK = 0x8CA5,
	VIEWPORT = 0x0BA2,
	SCISSOR_BOX = 0x0C10,
	/*      SCISSOR_TEST */
	COLOR_CLEAR_VALUE = 0x0C22,
	COLOR_WRITEMASK = 0x0C23,
	UNPACK_ALIGNMENT = 0x0CF5,
	PACK_ALIGNMENT = 0x0D05,
	MAX_TEXTURE_SIZE = 0x0D33,
	MAX_VIEWPORT_DIMS = 0x0D3A,
	SUBPIXEL_BITS = 0x0D50,
	RED_BITS = 0x0D52,
	GREEN_BITS = 0x0D53,
	BLUE_BITS = 0x0D54,
	ALPHA_BITS = 0x0D55,
	DEPTH_BITS = 0x0D56,
	STENCIL_BITS = 0x0D57,
	POLYGON_OFFSET_UNITS = 0x2A00,
	/*      POLYGON_OFFSET_FILL */
	POLYGON_OFFSET_FACTOR = 0x8038,
	TEXTURE_BINDING_2D = 0x8069,
	SAMPLE_BUFFERS = 0x80A8,
	SAMPLES = 0x80A9,
	SAMPLE_COVERAGE_VALUE = 0x80AA,
	SAMPLE_COVERAGE_INVERT = 0x80AB,

	/* GetTextureParameter */
	/*      TEXTURE_MAG_FILTER */
	/*      TEXTURE_MIN_FILTER */
	/*      TEXTURE_WRAP_S */
	/*      TEXTURE_WRAP_T */

	COMPRESSED_TEXTURE_FORMATS = 0x86A3,

	/* HintMode */
	DONT_CARE = 0x1100,
	FASTEST = 0x1101,
	NICEST = 0x1102,

	/* HintTarget */
	GENERATE_MIPMAP_HINT = 0x8192,

	/* DataType */
	BYTE = 0x1400,
	UNSIGNED_BYTE = 0x1401,
	SHORT = 0x1402,
	UNSIGNED_SHORT = 0x1403,
	INT = 0x1404,
	UNSIGNED_INT = 0x1405,
	FLOAT = 0x1406,
	UNSIGNED_INT_8_8_8_8_REV = 0x8367,
	UNSIGNED_INT_24_8_WEBGL = 0x8367,

	/* PixelFormat */
	DEPTH_COMPONENT = 0x1902,
	ALPHA = 0x1906,
	RGB = 0x1907,
	RGBA = 0x1908,
	BGR = 0x80E0,
	BGRA = 0x80E1,
	LUMINANCE = 0x1909,
	LUMINANCE_ALPHA = 0x190A,

	/* PixelType */
	/*      UNSIGNED_BYTE */
	UNSIGNED_SHORT_4_4_4_4 = 0x8033,
	UNSIGNED_SHORT_5_5_5_1 = 0x8034,
	UNSIGNED_SHORT_5_6_5 = 0x8363,

	/* Shaders */
	FRAGMENT_SHADER = 0x8B30,
	VERTEX_SHADER = 0x8B31,
	MAX_VERTEX_ATTRIBS = 0x8869,
	MAX_VERTEX_UNIFORM_VECTORS = 0x8DFB,
	MAX_VARYING_VECTORS = 0x8DFC,
	MAX_COMBINED_TEXTURE_IMAGE_UNITS = 0x8B4D,
	MAX_VERTEX_TEXTURE_IMAGE_UNITS = 0x8B4C,
	MAX_TEXTURE_IMAGE_UNITS = 0x8872,
	MAX_FRAGMENT_UNIFORM_VECTORS = 0x8DFD,
	SHADER_TYPE = 0x8B4F,
	DELETE_STATUS = 0x8B80,
	LINK_STATUS = 0x8B82,
	VALIDATE_STATUS = 0x8B83,
	ATTACHED_SHADERS = 0x8B85,
	ACTIVE_UNIFORMS = 0x8B86,
	ACTIVE_ATTRIBUTES = 0x8B89,
	SHADING_LANGUAGE_VERSION = 0x8B8C,
	CURRENT_PROGRAM = 0x8B8D,

	/* StencilFunction */
	NEVER = 0x0200,
	LESS = 0x0201,
	EQUAL = 0x0202,
	LEQUAL = 0x0203,
	GREATER = 0x0204,
	NOTEQUAL = 0x0205,
	GEQUAL = 0x0206,
	ALWAYS = 0x0207,

	/* StencilOp */
	/*      ZERO */
	KEEP = 0x1E00,
	REPLACE = 0x1E01,
	INCR = 0x1E02,
	DECR = 0x1E03,
	INVERT = 0x150A,
	INCR_WRAP = 0x8507,
	DECR_WRAP = 0x8508,

	/* StringName */
	VENDOR = 0x1F00,
	RENDERER = 0x1F01,
	VERSION = 0x1F02,

	/* TextureMagFilter */
	NEAREST = 0x2600,
	LINEAR = 0x2601,

	/* TextureMinFilter */
	/*      NEAREST */
	/*      LINEAR */
	NEAREST_MIPMAP_NEAREST = 0x2700,
	LINEAR_MIPMAP_NEAREST = 0x2701,
	NEAREST_MIPMAP_LINEAR = 0x2702,
	LINEAR_MIPMAP_LINEAR = 0x2703,

	/* TextureParameterName */
	TEXTURE_MAG_FILTER = 0x2800,
	TEXTURE_MIN_FILTER = 0x2801,
	TEXTURE_WRAP_S = 0x2802,
	TEXTURE_WRAP_T = 0x2803,

	/* TextureTarget */
	TEXTURE_2D = 0x0DE1,
	TEXTURE = 0x1702,

	TEXTURE_CUBE_MAP = 0x8513,
	TEXTURE_BINDING_CUBE_MAP = 0x8514,
	TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515,
	TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516,
	TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517,
	TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518,
	TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519,
	TEXTURE_CUBE_MAP_NEGATIVE_Z = 0x851A,
	MAX_CUBE_MAP_TEXTURE_SIZE = 0x851C,

	/* TextureUnit */
	TEXTURE0 = 0x84C0,
	TEXTURE1 = 0x84C1,
	TEXTURE2 = 0x84C2,
	TEXTURE3 = 0x84C3,
	TEXTURE4 = 0x84C4,
	TEXTURE5 = 0x84C5,
	TEXTURE6 = 0x84C6,
	TEXTURE7 = 0x84C7,
	TEXTURE8 = 0x84C8,
	TEXTURE9 = 0x84C9,
	TEXTURE10 = 0x84CA,
	TEXTURE11 = 0x84CB,
	TEXTURE12 = 0x84CC,
	TEXTURE13 = 0x84CD,
	TEXTURE14 = 0x84CE,
	TEXTURE15 = 0x84CF,
	TEXTURE16 = 0x84D0,
	TEXTURE17 = 0x84D1,
	TEXTURE18 = 0x84D2,
	TEXTURE19 = 0x84D3,
	TEXTURE20 = 0x84D4,
	TEXTURE21 = 0x84D5,
	TEXTURE22 = 0x84D6,
	TEXTURE23 = 0x84D7,
	TEXTURE24 = 0x84D8,
	TEXTURE25 = 0x84D9,
	TEXTURE26 = 0x84DA,
	TEXTURE27 = 0x84DB,
	TEXTURE28 = 0x84DC,
	TEXTURE29 = 0x84DD,
	TEXTURE30 = 0x84DE,
	TEXTURE31 = 0x84DF,
	ACTIVE_TEXTURE = 0x84E0,

	/* TextureWrapMode */
	REPEAT = 0x2901,
	CLAMP_TO_EDGE = 0x812F,
	MIRRORED_REPEAT = 0x8370,

	/* Uniform Types */
	FLOAT_VEC2 = 0x8B50,
	FLOAT_VEC3 = 0x8B51,
	FLOAT_VEC4 = 0x8B52,
	INT_VEC2 = 0x8B53,
	INT_VEC3 = 0x8B54,
	INT_VEC4 = 0x8B55,
	BOOL = 0x8B56,
	BOOL_VEC2 = 0x8B57,
	BOOL_VEC3 = 0x8B58,
	BOOL_VEC4 = 0x8B59,
	FLOAT_MAT2 = 0x8B5A,
	FLOAT_MAT3 = 0x8B5B,
	FLOAT_MAT4 = 0x8B5C,
	SAMPLER_2D = 0x8B5E,
	SAMPLER_CUBE = 0x8B60,

	/* Vertex Arrays */
	VERTEX_ATTRIB_ARRAY_ENABLED = 0x8622,
	VERTEX_ATTRIB_ARRAY_SIZE = 0x8623,
	VERTEX_ATTRIB_ARRAY_STRIDE = 0x8624,
	VERTEX_ATTRIB_ARRAY_TYPE = 0x8625,
	VERTEX_ATTRIB_ARRAY_NORMALIZED = 0x886A,
	VERTEX_ATTRIB_ARRAY_POINTER = 0x8645,
	VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = 0x889F,

	/* Shader Source */
	COMPILE_STATUS = 0x8B81,

	/* Shader Precision-Specified Types */
	LOW_FLOAT = 0x8DF0,
	MEDIUM_FLOAT = 0x8DF1,
	HIGH_FLOAT = 0x8DF2,
	LOW_INT = 0x8DF3,
	MEDIUM_INT = 0x8DF4,
	HIGH_INT = 0x8DF5,

	/* Framebuffer Object. */
	FRAMEBUFFER = 0x8D40,
	RENDERBUFFER = 0x8D41,

	RGBA4 = 0x8056,
	RGB5_A1 = 0x8057,
	RGB565 = 0x8D62,
	DEPTH_COMPONENT16 = 0x81A5,
	STENCIL_INDEX = 0x1901,
	STENCIL_INDEX8 = 0x8D48,
	DEPTH_STENCIL = 0x84F9,

	RENDERBUFFER_WIDTH = 0x8D42,
	RENDERBUFFER_HEIGHT = 0x8D43,
	RENDERBUFFER_INTERNAL_FORMAT = 0x8D44,
	RENDERBUFFER_RED_SIZE = 0x8D50,
	RENDERBUFFER_GREEN_SIZE = 0x8D51,
	RENDERBUFFER_BLUE_SIZE = 0x8D52,
	RENDERBUFFER_ALPHA_SIZE = 0x8D53,
	RENDERBUFFER_DEPTH_SIZE = 0x8D54,
	RENDERBUFFER_STENCIL_SIZE = 0x8D55,

	FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE = 0x8CD0,
	FRAMEBUFFER_ATTACHMENT_OBJECT_NAME = 0x8CD1,
	FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL = 0x8CD2,
	FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = 0x8CD3,

	COLOR_ATTACHMENT0 = 0x8CE0,
	DEPTH_ATTACHMENT = 0x8D00,
	STENCIL_ATTACHMENT = 0x8D20,
	DEPTH_STENCIL_ATTACHMENT = 0x821A,

	NONE = 0,

	FRAMEBUFFER_COMPLETE = 0x8CD5,
	FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 0x8CD6,
	FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8CD7,
	FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 0x8CD9,
	FRAMEBUFFER_UNSUPPORTED = 0x8CDD,

	FRAMEBUFFER_BINDING = 0x8CA6,
	RENDERBUFFER_BINDING = 0x8CA7,
	MAX_RENDERBUFFER_SIZE = 0x84E8,

	INVALID_FRAMEBUFFER_OPERATION = 0x0506,

	/* WebGL-specific enums */
	UNPACK_FLIP_Y_WEBGL = 0x9240,
	UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241,
	CONTEXT_LOST_WEBGL = 0x9242,
	UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243,
	BROWSER_DEFAULT_WEBGL = 0x9244,

	COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8C00,
	COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8C01,
	COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02,
	COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03,
	COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83F0,
	COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83F1,
	COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83F2,
	COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83F3,
	RED_EXT = 0x1903,
	RG_EXT = 0x8227,
	R8_EXT = 0x8229,
	RG8_EXT = 0x822B,

	HALF_FLOAT_OES = 0x8D61,
	DEPTH_COMPONENT24_OES = 0x81A6,
	DEPTH_COMPONENT32_OES = 0x81A7,
	DEPTH24_STENCIL8_OES = 0x88F0,
}
