/// <reference path="../idl/IShaderInput.ts" />

/// <reference path="../render/Renderer.ts" />
/// <reference path="../render/Viewport.ts" />
/// <reference path="../config/config.ts" />

/// <reference path="webgl.ts" />
/// <reference path="WebGLCanvas.ts" />
/// <reference path="WebGLShaderProgram.ts" />
/// <reference path="WebGLInternalTextureStateManager.ts" />

module akra.webgl {
	interface IWebGLContextStates {
		blend: boolean;
		blend_color: Float32Array;
		blend_dst_alpha: uint;
		blend_dst_rgb: uint;
		blend_equation_alpha: uint;
		blend_equation_rgb: uint;
		blend_src_alpha: uint;
		blend_src_rgb: uint;

		color_clear_value: Float32Array;
		color_writemask: boolean[];

		cull_face: boolean;
		cull_face_mode: uint;

		depth_clear_value: float;
		depth_func: uint;
		depth_range: Float32Array;
		depth_test: boolean;
		depth_writemask: boolean;

		dither: boolean;

		front_face: uint;
		line_width: float;

		polygon_offset_factor: float;
		polygon_offset_fill: boolean;
		polygon_offset_units: float;

		sample_buffers: int;
		sample_coverage_invert: boolean;
		sample_coverage_value: float;
		samples: int;

		scissor_test: boolean;

		stencil_back_fail: uint;
		stencil_back_func: uint;
		stencil_back_pass_depth_fail: uint;
		stencil_back_pass_depth_pass: uint;
		stencil_back_ref: int;
		stencil_back_value_mask: uint;
		stencil_back_writemask: uint;
		stencil_clear_value: int;
		stencil_fail: uint;
		stencil_func: uint;
		stencil_pass_depth_fail: uint;
		stencil_pass_depth_pass: uint;
		stencil_ref: int;
		stencil_test: boolean;
		stencil_value_mask: uint;
		stencil_writemask: uint;

		pack_alignment: uint;
		unpack_alignment: uint;
	}

	export class WebGLRenderer extends render.Renderer {
		private _pCanvas: HTMLCanvasElement = null;

		private _pWebGLContext: WebGLRenderingContext;
		private _pWebGLFramebufferList: WebGLFramebuffer[];

		private _pDefaultCanvas: ICanvas3d;

		//real context, if debug context used
		private _pWebGLInternalContext: WebGLRenderingContext = null;

		private _nActiveAttributes: uint = 0;

		private _iSlot: uint = 0;
		private _iCurrentTextureSlot: uint = 0;
		private _iNextTextureSlot: uint = 0;
		private _pTextureSlotList: WebGLTexture[] = null;
		/**
		 * Need To reset texture states after render
		 */
		private _pTextureStateManager: WebGLInternalTextureStateManager = null;
		/**
		 * Need to impove speed
		 */
		private _pCurrentContextStates: IWebGLContextStates = WebGLRenderer.createWebGLContextStates();
		private _pRenderStatesPool: IObjectArray<IWebGLContextStates> = new util.ObjectArray<IWebGLContextStates>();
		private _pFreeRenderStatesPool: IObjectArray<IWebGLContextStates> = new util.ObjectArray<IWebGLContextStates>();

		static DEFAULT_OPTIONS: IRendererOptions = {
			depth: false,
			stencil: false,
			antialias: false,
			preserveDrawingBuffer: false,
			premultipliedAlpha: false,
			alpha: false
		};

		getType(): ERenderers {
			return ERenderers.WEBGL;
		}

		constructor(pEngine: IEngine);
		constructor(pEngine: IEngine, sCanvas: string);
		constructor(pEngine: IEngine, pOptions: IRendererOptions);
		constructor(pEngine: IEngine, pCanvas: HTMLCanvasElement);
		constructor(pEngine: IEngine, options?: any) {
			super(pEngine);

			var pOptions: IRendererOptions = null;

			if (isDefAndNotNull(arguments[1])) {

				//get HTMLCanvasElement by id
				if (isString(arguments[1])) {
					this._pCanvas = <HTMLCanvasElement>document.getElementById(arguments[1]);
				}
				else if (arguments[1] instanceof HTMLCanvasElement) {
					this._pCanvas = <HTMLCanvasElement>arguments[1];
				}
				else {
					pOptions = <IRendererOptions>arguments[1];

					if (pOptions.canvas instanceof HTMLCanvasElement) {
						this._pCanvas = pOptions.canvas;
					}
				}
			}

			if (isNull(this._pCanvas)) {
				this._pCanvas = <HTMLCanvasElement>document.createElement('canvas');
			}

			if (isNull(pOptions)) {
				pOptions = WebGLRenderer.DEFAULT_OPTIONS;
			}
			else {
				for (var i: int = 0, pOptList: string[] = Object.keys(WebGLRenderer.DEFAULT_OPTIONS); i < pOptList.length; ++i) {
					var sOpt: string = pOptList[i];

					if (!isDef(pOptions[sOpt])) {
						pOptions[sOpt] = WebGLRenderer.DEFAULT_OPTIONS[sOpt];
					}
				}
			}


			debug.log("webgl context attributes:", pOptions);

			this._pWebGLContext = createContext(this._pCanvas, pOptions);

			debug.assert(!isNull(this._pWebGLContext), "webgl context is NULL");

			this._pWebGLFramebufferList = new Array(config.webgl.preparedFramebuffersNum);


			for (var i: int = 0; i < this._pWebGLFramebufferList.length; ++i) {
				this._pWebGLFramebufferList[i] = this._pWebGLContext.createFramebuffer();
			}

			this._pDefaultCanvas = new WebGLCanvas(this);
			logger.assert(this._pDefaultCanvas.create("primary-target"), "could not create WebGL canvas");

			this.attachRenderTarget(this._pDefaultCanvas);

			this._pTextureSlotList = new Array(maxTextureImageUnits);

			for (var i: int = 0; i < this._pTextureSlotList.length; i++) {
				this._pTextureSlotList[i] = null;
			}

			for (var i: int = 0; i < 4; i++) {
				this._pFreeRenderStatesPool.push(WebGLRenderer.createWebGLContextStates());
			}

			this.forceUpdateContextRenderStates();

			this._pTextureStateManager = new WebGLInternalTextureStateManager(this);
		}

		debug(bValue: boolean = true, useApiTrace: boolean = false): boolean {
			var pWebGLInternalContext: WebGLRenderingContext = this._pWebGLContext;

			if (bValue) {
				if (isDef((<any>window).WebGLDebugUtils) && !isNull(pWebGLInternalContext)) {

					this._pWebGLContext = WebGLDebugUtils.makeDebugContext(pWebGLInternalContext,
						(err: int, funcName: string, args: IArguments): void => {
							throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
						},
						useApiTrace ?
						(funcName: string, args: IArguments): void => {
							logger.log("gl." + funcName + "(" + WebGLDebugUtils.glFunctionArgsToString(funcName, args) + ")");
						} : null);

					this._pWebGLInternalContext = pWebGLInternalContext;

					return true;
				}
			}
			else if (this.isDebug()) {
				this._pWebGLContext = this._pWebGLInternalContext;
				this._pWebGLInternalContext = null;

				return true;
			}

			return false;
		}

		blendColor(fRed: float, fGreen: float, fBlue: float, fAlpha: float): void {
			this._pWebGLContext.blendColor(fRed, fGreen, fBlue, fAlpha);
			this._pCurrentContextStates.blend_color[0] = fRed;
			this._pCurrentContextStates.blend_color[1] = fGreen;
			this._pCurrentContextStates.blend_color[2] = fBlue;
			this._pCurrentContextStates.blend_color[3] = fAlpha;
		}

		blendEquation(iWebGLMode: uint): void {
			this._pWebGLContext.blendEquation(iWebGLMode);
			this._pCurrentContextStates.blend_equation_rgb = iWebGLMode;
			this._pCurrentContextStates.blend_equation_alpha = iWebGLMode;
		}

		blendEquationSeparate(iWebGLModeRGB: uint, iWebGLModeAlpha: uint): void {
			this._pWebGLContext.blendEquationSeparate(iWebGLModeRGB, iWebGLModeAlpha);
			this._pCurrentContextStates.blend_equation_rgb = iWebGLModeRGB;
			this._pCurrentContextStates.blend_equation_alpha = iWebGLModeAlpha;
		}

		blendFunc(iWebGLSFactor: uint, iWebGLDFactor: uint): void {
			this._pWebGLContext.blendFunc(iWebGLSFactor, iWebGLDFactor);
			this._pCurrentContextStates.blend_src_rgb = iWebGLSFactor;
			this._pCurrentContextStates.blend_src_alpha = iWebGLSFactor;
			this._pCurrentContextStates.blend_dst_rgb = iWebGLDFactor;
			this._pCurrentContextStates.blend_dst_alpha = iWebGLDFactor;
		}

		blendFuncSeparate(iWebGLSFactorRGB: uint, iWebGLDFactorRGB: uint, iWebGLSFactorAlpha: uint, iWebGLDFactorAlpha: uint): void {
			this._pWebGLContext.blendFuncSeparate(iWebGLSFactorRGB, iWebGLDFactorRGB, iWebGLSFactorAlpha, iWebGLDFactorAlpha);
			this._pCurrentContextStates.blend_src_rgb = iWebGLSFactorRGB;
			this._pCurrentContextStates.blend_src_alpha = iWebGLSFactorAlpha;
			this._pCurrentContextStates.blend_dst_rgb = iWebGLDFactorRGB;
			this._pCurrentContextStates.blend_dst_alpha = iWebGLDFactorAlpha;
		}

		clearColor(fRed: float, fGreen: float, fBlue: float, fAlpha: float): void {
			this._pWebGLContext.clearColor(fRed, fGreen, fBlue, fAlpha);
			this._pCurrentContextStates.color_clear_value[0] = fRed;
			this._pCurrentContextStates.color_clear_value[1] = fGreen;
			this._pCurrentContextStates.color_clear_value[2] = fBlue;
			this._pCurrentContextStates.color_clear_value[3] = fAlpha;
		}

		clearDepth(fDepth: float): void {
			this._pWebGLContext.clearDepth(fDepth);
			this._pCurrentContextStates.depth_clear_value = fDepth;
		}

		clearStencil(iS: int): void {
			this._pWebGLContext.clearStencil(iS);
			this._pCurrentContextStates.stencil_clear_value = iS;
		}

		colorMask(bRed: boolean, bGreen: boolean, bBlue: boolean, bAlpha: boolean): void {
			this._pWebGLContext.colorMask(bRed, bGreen, bBlue, bAlpha);
			this._pCurrentContextStates.color_writemask[0] = bRed;
			this._pCurrentContextStates.color_writemask[1] = bGreen;
			this._pCurrentContextStates.color_writemask[2] = bBlue;
			this._pCurrentContextStates.color_writemask[3] = bAlpha;
		}

		cullFace(iWebGLMode: uint): void {
			this._pWebGLContext.cullFace(iWebGLMode);
			this._pCurrentContextStates.cull_face_mode = iWebGLMode;
		}

		depthFunc(iWebGLMode: uint): void {
			this._pWebGLContext.depthFunc(iWebGLMode);
			this._pCurrentContextStates.depth_func = iWebGLMode;
		}

		depthMask(bWrite: boolean): void {
			this._pWebGLContext.depthMask(bWrite);
			this._pCurrentContextStates.depth_writemask = bWrite;
		}

		depthRange(fZNear: float, fZFar: float): void {
			this._pWebGLContext.depthRange(fZNear, fZFar);
			this._pCurrentContextStates.depth_range[0] = fZNear;
			this._pCurrentContextStates.depth_range[1] = fZFar;
		}

		disable(iWebGLCap: uint): void {
			this._pWebGLContext.disable(iWebGLCap);

			switch (iWebGLCap) {
				case gl.CULL_FACE:
					this._pCurrentContextStates.cull_face = false;
					return;
				case gl.BLEND:
					this._pCurrentContextStates.blend = false;
					return;
				case gl.DITHER:
					this._pCurrentContextStates.dither = false;
					return;
				case gl.STENCIL_TEST:
					this._pCurrentContextStates.stencil_test = false;
					return;
				case gl.DEPTH_TEST:
					this._pCurrentContextStates.depth_test = false;
					return;
				case gl.SCISSOR_TEST:
					this._pCurrentContextStates.scissor_test = false;
					return;
				case gl.POLYGON_OFFSET_FILL:
					this._pCurrentContextStates.polygon_offset_fill = false;
					return;
				// case gl.SAMPLE_ALPHA_TO_COVERAGE:
				// 	this._pCurrentContextStates.sample_alpha_to_coverage = false;
				// 	return;
				// case gl.SAMPLE_COVERAGE:
				// 	this._pCurrentContextStates.sample_coverage = false;
				// 	return;
			}
		}

		enable(iWebGLCap: uint): void {
			this._pWebGLContext.enable(iWebGLCap);

			switch (iWebGLCap) {
				case gl.CULL_FACE:
					this._pCurrentContextStates.cull_face = true;
					return;
				case gl.BLEND:
					this._pCurrentContextStates.blend = true;
					return;
				case gl.DITHER:
					this._pCurrentContextStates.dither = true;
					return;
				case gl.STENCIL_TEST:
					this._pCurrentContextStates.stencil_test = true;
					return;
				case gl.DEPTH_TEST:
					this._pCurrentContextStates.depth_test = true;
					return;
				case gl.SCISSOR_TEST:
					this._pCurrentContextStates.scissor_test = true;
					return;
				case gl.POLYGON_OFFSET_FILL:
					this._pCurrentContextStates.polygon_offset_fill = true;
					return;
				// case gl.SAMPLE_ALPHA_TO_COVERAGE:
				// 	this._pCurrentContextStates.sample_alpha_to_coverage = false;
				// 	return;
				// case gl.SAMPLE_COVERAGE:
				// 	this._pCurrentContextStates.sample_coverage = false;
				// 	return;
			}
		}

		frontFace(iWebGLMode: uint): void {
			this._pWebGLContext.frontFace(iWebGLMode);
			this._pCurrentContextStates.front_face = iWebGLMode;
		}

		getParameter(iWebGLName: uint): any {
			switch (iWebGLName) {
				case gl.BLEND:
					return this._pCurrentContextStates.blend;
				case gl.BLEND_COLOR:
					return this._pCurrentContextStates.blend_color;
				case gl.BLEND_DST_ALPHA:
					return this._pCurrentContextStates.blend_dst_alpha;
				case gl.BLEND_DST_RGB:
					return this._pCurrentContextStates.blend_dst_rgb;
				case gl.BLEND_EQUATION_ALPHA:
					return this._pCurrentContextStates.blend_equation_alpha;
				case gl.BLEND_EQUATION_RGB:
					return this._pCurrentContextStates.blend_equation_rgb;
				case gl.BLEND_SRC_ALPHA:
					return this._pCurrentContextStates.blend_src_alpha;
				case gl.BLEND_SRC_RGB:
					return this._pCurrentContextStates.blend_src_rgb;
				case gl.COLOR_CLEAR_VALUE:
					return this._pCurrentContextStates.color_clear_value;
				case gl.COLOR_WRITEMASK:
					return this._pCurrentContextStates.color_writemask;
				case gl.CULL_FACE:
					return this._pCurrentContextStates.cull_face;
				case gl.CULL_FACE_MODE:
					return this._pCurrentContextStates.cull_face_mode;
				case gl.DEPTH_CLEAR_VALUE:
					return this._pCurrentContextStates.depth_clear_value;
				case gl.DEPTH_FUNC:
					return this._pCurrentContextStates.depth_func;
				case gl.DEPTH_RANGE:
					return this._pCurrentContextStates.depth_range;
				case gl.DEPTH_TEST:
					return this._pCurrentContextStates.depth_test;
				case gl.DEPTH_WRITEMASK:
					return this._pCurrentContextStates.depth_writemask;
				case gl.DITHER:
					return this._pCurrentContextStates.dither;
				case gl.FRONT_FACE:
					return this._pCurrentContextStates.front_face;
				case gl.LINE_WIDTH:
					return this._pCurrentContextStates.line_width;
				case gl.POLYGON_OFFSET_FACTOR:
					return this._pCurrentContextStates.polygon_offset_factor;
				case gl.POLYGON_OFFSET_FILL:
					return this._pCurrentContextStates.polygon_offset_fill;
				case gl.POLYGON_OFFSET_UNITS:
					return this._pCurrentContextStates.polygon_offset_units;
				case gl.SAMPLE_BUFFERS:
					return this._pCurrentContextStates.sample_buffers;
				case gl.SAMPLE_COVERAGE_INVERT:
					return this._pCurrentContextStates.sample_coverage_invert;
				case gl.SAMPLE_COVERAGE_VALUE:
					return this._pCurrentContextStates.sample_coverage_value;
				case gl.SAMPLES:
					return this._pCurrentContextStates.samples;
				case gl.SCISSOR_TEST:
					return this._pCurrentContextStates.scissor_test;
				case gl.STENCIL_BACK_FAIL:
					return this._pCurrentContextStates.stencil_back_fail;
				case gl.STENCIL_BACK_FUNC:
					return this._pCurrentContextStates.stencil_back_func;
				case gl.STENCIL_BACK_PASS_DEPTH_FAIL:
					return this._pCurrentContextStates.stencil_back_pass_depth_fail;
				case gl.STENCIL_BACK_PASS_DEPTH_PASS:
					return this._pCurrentContextStates.stencil_back_pass_depth_pass;
				case gl.STENCIL_BACK_REF:
					return this._pCurrentContextStates.stencil_back_ref;
				case gl.STENCIL_BACK_VALUE_MASK:
					return this._pCurrentContextStates.stencil_back_value_mask;
				case gl.STENCIL_BACK_WRITEMASK:
					return this._pCurrentContextStates.stencil_back_writemask;
				case gl.STENCIL_CLEAR_VALUE:
					return this._pCurrentContextStates.stencil_clear_value;
				case gl.STENCIL_FAIL:
					return this._pCurrentContextStates.stencil_fail;
				case gl.STENCIL_FUNC:
					return this._pCurrentContextStates.stencil_func;
				case gl.STENCIL_PASS_DEPTH_FAIL:
					return this._pCurrentContextStates.stencil_pass_depth_fail;
				case gl.STENCIL_PASS_DEPTH_PASS:
					return this._pCurrentContextStates.stencil_pass_depth_pass;
				case gl.STENCIL_REF:
					return this._pCurrentContextStates.stencil_ref;
				case gl.STENCIL_TEST:
					return this._pCurrentContextStates.stencil_test;
				case gl.STENCIL_VALUE_MASK:
					return this._pCurrentContextStates.stencil_value_mask;
				case gl.STENCIL_WRITEMASK:
					return this._pCurrentContextStates.stencil_writemask;
				case gl.UNPACK_ALIGNMENT:
					return this._pCurrentContextStates.unpack_alignment;
				case gl.PACK_ALIGNMENT:
					return this._pCurrentContextStates.pack_alignment;
				default:
					return this._pWebGLContext.getParameter(iWebGLName);
			}
		}

		lineWidth(fWidth: float): void {
			this._pWebGLContext.lineWidth(fWidth);
			this._pCurrentContextStates.line_width = fWidth;
		}

		pixelStorei(iWebGLName: uint, iParam: int): void {
			this._pWebGLContext.pixelStorei(iWebGLName, iParam);

			if (iWebGLName === gl.UNPACK_ALIGNMENT) {
				this._pCurrentContextStates.unpack_alignment = iParam;
			}
			else {
				this._pCurrentContextStates.pack_alignment = iParam;
			}
		}

		polygonOffset(fFactor: float, fUnints: float): void {
			this._pWebGLContext.polygonOffset(fFactor, fUnints);
			this._pCurrentContextStates.polygon_offset_factor = fFactor;
			this._pCurrentContextStates.polygon_offset_units = fUnints;
		}

		sampleCoverage(fValue: float, bInvert: boolean): void {
			this._pWebGLContext.sampleCoverage(fValue, bInvert);
			this._pCurrentContextStates.sample_coverage_value = fValue;
			this._pCurrentContextStates.sample_coverage_invert = bInvert;
		}

		stencilFunc(iWebGLFunc: uint, iRef: int, iMask: uint): void {
			this._pWebGLContext.stencilFunc(iWebGLFunc, iRef, iMask);
			this._pCurrentContextStates.stencil_func = iWebGLFunc;
			this._pCurrentContextStates.stencil_ref = iRef;
			this._pCurrentContextStates.stencil_value_mask = iMask;
			this._pCurrentContextStates.stencil_back_func = iWebGLFunc;
			this._pCurrentContextStates.stencil_back_ref = iRef;
			this._pCurrentContextStates.stencil_back_value_mask = iMask;
		}

		stencilFuncSeparate(iWebGLFace: uint, iWebGLFunc: uint, iRef: int, iMask: uint): void {
			this._pWebGLContext.stencilFuncSeparate(iWebGLFace, iWebGLFunc, iRef, iMask);

			if (iWebGLFace === gl.FRONT_AND_BACK) {
				this._pCurrentContextStates.stencil_func = iWebGLFunc;
				this._pCurrentContextStates.stencil_ref = iRef;
				this._pCurrentContextStates.stencil_value_mask = iMask;
				this._pCurrentContextStates.stencil_back_func = iWebGLFunc;
				this._pCurrentContextStates.stencil_back_ref = iRef;
				this._pCurrentContextStates.stencil_back_value_mask = iMask;
			}
			else if (iWebGLFace === gl.FRONT) {
				this._pCurrentContextStates.stencil_func = iWebGLFunc;
				this._pCurrentContextStates.stencil_ref = iRef;
				this._pCurrentContextStates.stencil_value_mask = iMask;
			}
			else {
				this._pCurrentContextStates.stencil_back_func = iWebGLFunc;
				this._pCurrentContextStates.stencil_back_ref = iRef;
				this._pCurrentContextStates.stencil_back_value_mask = iMask;
			}
		}

		stencilMask(iMask: uint): void {
			this._pWebGLContext.stencilMask(iMask);
			this._pCurrentContextStates.stencil_writemask = iMask;
			this._pCurrentContextStates.stencil_back_writemask = iMask;
		}

		stencilMaskSeparate(iWebGLFace: uint, iMask: uint): void {
			this._pWebGLContext.stencilMaskSeparate(iWebGLFace, iMask);

			if (iWebGLFace === gl.FRONT_AND_BACK) {
				this._pCurrentContextStates.stencil_writemask = iMask;
				this._pCurrentContextStates.stencil_back_writemask = iMask;
			}
			else if (iWebGLFace === gl.FRONT) {
				this._pCurrentContextStates.stencil_writemask = iMask;
			}
			else {
				this._pCurrentContextStates.stencil_back_writemask = iMask;
			}
		}

		stencilOp(iFail: uint, iZFail: uint, iZPass: uint): void {
			this._pWebGLContext.stencilOp(iFail, iZFail, iZPass);

			this._pCurrentContextStates.stencil_fail = iFail;
			this._pCurrentContextStates.stencil_pass_depth_fail = iZFail;
			this._pCurrentContextStates.stencil_pass_depth_pass = iZPass;
			this._pCurrentContextStates.stencil_back_fail = iFail;
			this._pCurrentContextStates.stencil_back_pass_depth_fail = iZFail;
			this._pCurrentContextStates.stencil_back_pass_depth_pass = iZPass;
		}

		stencilOpSeparate(iWebGLFace: uint, iFail: uint, iZFail: uint, iZPass: uint): void {
			this._pWebGLContext.stencilOpSeparate(iWebGLFace, iFail, iZFail, iZPass);

			if (iWebGLFace === gl.FRONT_AND_BACK) {
				this._pCurrentContextStates.stencil_fail = iFail;
				this._pCurrentContextStates.stencil_pass_depth_fail = iZFail;
				this._pCurrentContextStates.stencil_pass_depth_pass = iZPass;
				this._pCurrentContextStates.stencil_back_fail = iFail;
				this._pCurrentContextStates.stencil_back_pass_depth_fail = iZFail;
				this._pCurrentContextStates.stencil_back_pass_depth_pass = iZPass;
			}
			else if (iWebGLFace === gl.FRONT) {
				this._pCurrentContextStates.stencil_fail = iFail;
				this._pCurrentContextStates.stencil_pass_depth_fail = iZFail;
				this._pCurrentContextStates.stencil_pass_depth_pass = iZPass;
			}
			else {
				this._pCurrentContextStates.stencil_back_fail = iFail;
				this._pCurrentContextStates.stencil_back_pass_depth_fail = iZFail;
				this._pCurrentContextStates.stencil_back_pass_depth_pass = iZPass;
			}
		}

		_getTextureStateManager(): WebGLInternalTextureStateManager {
			return this._pTextureStateManager;
		}

		_beginRender(): void {
			this.enable(gl.SCISSOR_TEST);
			this.disable(gl.BLEND);
		}

		private _time: uint[] = [0, 0, 0, 0, 0, 0, 0, 0];

		_printTime(): void {
			var _iTotalTime: uint = 0;
			for (var i: uint = 0; i < this._time.length; i++) {
				_iTotalTime += this._time[i];
			}

			var _pPrinted: string[] = new Array(this._time.length);

			for (var i: uint = 0; i < this._time.length; i++) {
				_pPrinted[i] = (this._time[i] / _iTotalTime).toFixed(2);
			}

			logger.log(_pPrinted.join("% "));
			logger.log(this._time.join("ms "));
		}

		_renderEntry(pEntry: IRenderEntry): void {
			var pViewport: render.Viewport = <render.Viewport>pEntry.viewport;
			if (isNull(pViewport)) {
				logger.log(pEntry);
			}
			var pRenderTarget: IRenderTarget = (<render.Viewport>pViewport).getTarget();
			var pInput: IShaderInput = pEntry.input;
			var pMaker: fx.Maker = <fx.Maker>pEntry.maker;

			if (config.__VIEW_INTERNALS__) {
				console.log(pEntry);
			}

			if (!isNull(pEntry.renderTarget)) {
				this._setRenderTarget(pEntry.renderTarget);
				this._lockRenderTarget();

				this._setViewportForRender(pViewport);

				this._unlockRenderTarget();
			}
			else {
				this._setViewportForRender(pViewport);
			}

			var isNeedPopRenderStates: boolean = this.applyInputRenderStates(pInput.renderStates);

			var pWebGLProgram: WebGLShaderProgram = <WebGLShaderProgram>(pMaker).getShaderProgram();

			this.useWebGLProgram(pWebGLProgram.getWebGLProgram());

			this.enableWebGLVertexAttribs(pWebGLProgram.getTotalAttributes());

			var pAttribLocations: IMap<int> = pWebGLProgram._getActiveAttribLocations();
			var pAttributeInfo: IAFXBaseAttrInfo[] = pMaker.getAttributeInfo();

			var pBufferMap: IBufferMap = pEntry.bufferMap;

			if (!isNull(pBufferMap.getIndex())) {
				this.bindWebGLBuffer(gl.ELEMENT_ARRAY_BUFFER, (<WebGLIndexBuffer>pBufferMap.getIndex().getBuffer()).getWebGLBuffer());
			}

			for (var i: uint = 0; i < pAttributeInfo.length; i++) {
				var sAttrName: string = pAttributeInfo[i].name;
				var sAttrSemantic: string = pAttributeInfo[i].semantic;
				var iLoc: int = pAttribLocations[sAttrName];
				var pFlow: IDataFlow = pInput.attrs[i];
				var pData: data.VertexData = null;
				var sSemantics: string = null;

				if (pFlow.type === EDataFlowTypes.MAPPABLE) {
					pData = <data.VertexData>pFlow.mapper.data;
					sSemantics = pFlow.mapper.semantics;
				}
				else {
					pData = <data.VertexData>pFlow.data;
					sSemantics = sAttrSemantic;
				}

				var pDecl: data.VertexDeclaration = <data.VertexDeclaration>pData.getVertexDeclaration();
				var pVertexElement: data.VertexElement = <data.VertexElement>pDecl.findElement(sSemantics);

				this.bindWebGLBuffer(gl.ARRAY_BUFFER, (<WebGLVertexBuffer>pData.getBuffer()).getWebGLBuffer());
				this._pWebGLContext.vertexAttribPointer(iLoc,
					pVertexElement.count,
					pVertexElement.type,
					false,
					pData.getStride(),
					pVertexElement.offset);
			}

			var pUniformNames: string[] = pMaker.getUniformNames();

			for (var i: uint = 0; i < pUniformNames.length; i++) {
				pMaker.setUniform(i, pInput.uniforms[i]);
			}

			pEntry.bufferMap._draw();

			if (isNeedPopRenderStates) {
				this._popRenderStates(false);
			}
		}

		_endRender(): void {
			this.disable(gl.SCISSOR_TEST);
			this._pTextureStateManager.reset();
		}

		_setViewport(pViewport: IViewport): void {
			if (isNull(pViewport)) {
				this._pActiveViewport = null;
				this._setRenderTarget(null);
				return;
			}

			var isViewportUpdate: boolean = pViewport !== this._pActiveViewport || pViewport.isUpdated();
			var isRenderTargetUpdate: boolean = pViewport.getTarget() !== this._pActiveRenderTarget;

			if (isViewportUpdate || isRenderTargetUpdate) {
				var pTarget: IRenderTarget = pViewport.getTarget();

				this._setRenderTarget(pTarget);

				if (isViewportUpdate) {
					this._pActiveViewport = pViewport;

					var x: uint = pViewport.getActualLeft(),
						y: uint = pViewport.getActualTop(),
						w: uint = pViewport.getActualWidth(),
						h: uint = pViewport.getActualHeight();

					this._pWebGLContext.viewport(x, y, w, h);
					this._pWebGLContext.scissor(x, y, w, h);
					// if(w !== 2048){
					// 	logger.log(x, y, w, h, pViewport.getGuid());
					// }

					pViewport._clearUpdatedFlag();
				}
			}
		}

		_setRenderTarget(pTarget: IRenderTarget): void {
			// if(true){
			// 	return;
			// }
			//May be unbind()

			if (this._isLockRenderTarget()) {
				return;
			}

			this._pActiveRenderTarget = pTarget;

			if (!isNull(pTarget)) {
				var pFrameBuffer: WebGLInternalFrameBuffer = pTarget.getCustomAttribute("FBO");
				if (!isNull(pFrameBuffer)) {
					pFrameBuffer._bind();
				}
				else {
					this.bindWebGLFramebuffer(gl.FRAMEBUFFER, null);
				}
			}
		}

		_setCullingMode(eMode: ECullingMode): void {
			var iWebGLCullMode: uint = 0;

			switch (eMode) {
				case ECullingMode.NONE:
					this.disable(gl.CULL_FACE);
					return;

				default:
				case ECullingMode.CLOCKWISE:
					iWebGLCullMode = gl.FRONT;
					break;

				case ECullingMode.ANTICLOCKWISE:
					iWebGLCullMode = gl.BACK;
					break;
			}

			this.enable(gl.CULL_FACE);
			this.cullFace(iWebGLCullMode);
		}

		_setDepthBufferParams(bDepthTest: boolean, bDepthWrite: boolean,
			eDepthFunction: ECompareFunction, fClearDepth: float = 1.): void {
			if (bDepthTest) {
				this.clearDepth(fClearDepth);
				this.enable(gl.DEPTH_TEST);
			}
			else {
				this.disable(gl.DEPTH_TEST);
			}

			var iWebGLDepthFunc: uint = this.convertCompareFunction(eDepthFunction);

			this.depthMask(bDepthWrite);
			this.depthFunc(iWebGLDepthFunc);
		}

		isDebug(): boolean {
			return !isNull(this._pWebGLInternalContext);
		}

		getHTMLCanvas(): HTMLCanvasElement {
			return this._pCanvas;
		}

		getWebGLContext(): WebGLRenderingContext {
			return this._pWebGLContext;
		}


		/** Buffer Objects. */
		bindWebGLBuffer(eTarget: uint, pBuffer: WebGLBuffer): void {
			this._pWebGLContext.bindBuffer(eTarget, pBuffer);
		}

		createWebGLBuffer(): WebGLBuffer {
			return this._pWebGLContext.createBuffer();
		}

		deleteWebGLBuffer(pBuffer: WebGLBuffer): void {
			this._pWebGLContext.deleteBuffer(pBuffer);
		}

		/** Texture Objects. */
		bindWebGLTexture(eTarget: uint, pTexture: WebGLTexture): void {
			//if(this._pTextureSlotList[this._iCurrentTextureSlot] !== pTexture){
			this._pWebGLContext.bindTexture(eTarget, pTexture);
			this._pTextureSlotList[this._iCurrentTextureSlot] = pTexture;
			//}
		}

		activateWebGLTexture(iWebGLSlot: int): void {
			this._pWebGLContext.activeTexture(iWebGLSlot);
			// this._iCurrentTextureSlot = iWebGLSlot - gl.TEXTURE0;
		}

		activateWebGLTextureInAutoSlot(eTarget: uint, pTexture: WebGLTexture): uint {

			// var iSlot: uint = this._pTextureSlotList.indexOf(pTexture);

			// if(iSlot === -1) {
			var iSlot = this._iNextTextureSlot;

			this._iNextTextureSlot++;

			if (this._iNextTextureSlot === maxTextureImageUnits) {
				this._iNextTextureSlot = 0;
			}

			this.activateWebGLTexture(gl.TEXTURE0 + iSlot);
			this.bindWebGLTexture(eTarget, pTexture);
			// }
			// else {
			// 	this.activateWebGLTexture(gl.TEXTURE0 + iSlot);
			// }

			return iSlot;
		}

		createWebGLTexture(): WebGLTexture {
			return this._pWebGLContext.createTexture();
		}

		deleteWebGLTexture(pTexture: WebGLTexture): void {
			this._pWebGLContext.deleteTexture(pTexture);
		}

		/** Framebuffer Objects */
		createWebGLFramebuffer(): WebGLFramebuffer {

			if (this._pWebGLFramebufferList.length === 0) {
				logger.critical("WebGL framebuffer limit exidit");
			}

			return this._pWebGLFramebufferList.pop();
		}

		bindWebGLFramebuffer(eTarget: uint, pBuffer: WebGLFramebuffer): void {
			this._pWebGLContext.bindFramebuffer(eTarget, pBuffer);
			//this._pCurrentContextStates.framebuffer = pBuffer;
		}

		bindWebGLFramebufferTexture2D(eTarget: uint, eAttachment: uint, eTexTarget: uint, pTexture: WebGLTexture, iMipLevel: uint = 0): void {
			this._pWebGLContext.framebufferTexture2D(eTarget, eAttachment, eTexTarget, pTexture, iMipLevel)
		}

		deleteWebGLFramebuffer(pBuffer: WebGLFramebuffer): void {
			this._pWebGLFramebufferList.push(pBuffer);
		}

		/** Renderbuffer Objects */
		createWebGLRenderbuffer(): WebGLRenderbuffer {
			return this._pWebGLContext.createRenderbuffer();
		}

		bindWebGLRenderbuffer(eTarget: uint, pBuffer: WebGLRenderbuffer): void {
			this._pWebGLContext.bindRenderbuffer(eTarget, pBuffer);
		}

		deleteWebGLRenderbuffer(pBuffer: WebGLRenderbuffer): void {
			this._pWebGLContext.deleteRenderbuffer(pBuffer);
		}


		createWebGLProgram(): WebGLProgram {
			return this._pWebGLContext.createProgram();
		}

		deleteWebGLProgram(pProgram: WebGLProgram): void {
			this._pWebGLContext.deleteProgram(pProgram);
		}

		useWebGLProgram(pProgram: WebGLProgram): void {
			this._pWebGLContext.useProgram(pProgram);
		}

		enableWebGLVertexAttribs(iTotal: uint): void {
			if (this._nActiveAttributes > iTotal) {
				for (var i: int = iTotal; i < this._nActiveAttributes; i++) {
					this._pWebGLContext.disableVertexAttribArray(i);
				}
			}
			else {
				for (var i: int = this._nActiveAttributes; i < iTotal; i++) {
					this._pWebGLContext.enableVertexAttribArray(i);
				}
			}

			this._nActiveAttributes = iTotal;
		}

		disableAllWebGLVertexAttribs(): void {
			var i: uint = 0;
			for (i = 0; i < this._nActiveAttributes; i++) {
				this._pWebGLContext.disableVertexAttribArray(i);
			}

			this._nActiveAttributes = 0;
		}

		getDefaultCanvas(): ICanvas3d {
			return this._pDefaultCanvas;
		}


		clearFrameBuffer(iBuffers: int, cColor: IColor, fDepth: float, iStencil: uint): void {
			var bScissorTestEnable: boolean = this.getParameter(gl.SCISSOR_TEST);

			this.enable(gl.SCISSOR_TEST);

			var iWebGLFlag: int = 0;
			var bOldDepthWrite: boolean = this.getParameter(gl.DEPTH_WRITEMASK);

			if (iBuffers & EFrameBufferTypes.COLOR) {
				iWebGLFlag |= gl.COLOR_BUFFER_BIT;
				this._pWebGLContext.clearColor(cColor.r, cColor.g, cColor.b, cColor.a);
			}

			if (iBuffers & EFrameBufferTypes.DEPTH) {
				iWebGLFlag |= gl.DEPTH_BUFFER_BIT;

				if (!bOldDepthWrite) {
					this._pWebGLContext.depthMask(true);
				}

				this._pWebGLContext.clearDepth(fDepth);
			}

			if (iBuffers & EFrameBufferTypes.STENCIL) {
				iWebGLFlag |= gl.STENCIL_BUFFER_BIT;

				this._pWebGLContext.stencilMask(0xFFFFFFFF);
				this._pWebGLContext.clearStencil(iStencil);
			}

			this._pWebGLContext.clear(iWebGLFlag);

			if (!bOldDepthWrite && (iBuffers & EFrameBufferTypes.DEPTH)) {
				this._pWebGLContext.depthMask(false);
			}

			if (!bScissorTestEnable) {
				this.disable(gl.SCISSOR_TEST);
			}
		}

		_disableTextureUnitsFrom(iUnit: uint): void {
			for (var i: int = iUnit; i < this._pTextureSlotList.length; i++) {
				this._pTextureSlotList[i] = null;
			}
		}

		_pushRenderStates(): void {
			this._pRenderStatesPool.push(this._pCurrentContextStates);

			this._pCurrentContextStates = WebGLRenderer.copyWebGLContextStates(this.getFreeRenderStates(), this._pCurrentContextStates);
		}

		_popRenderStates(isForce: boolean): void {
			if (this._pRenderStatesPool.getLength() === 0) {
				debug.warn("Can not pop context render states. Pool of context is empty.");
			}

			this._pFreeRenderStatesPool.push(this._pCurrentContextStates);

			if (isForce) {
				this.forceUpdateContextRenderStates();
			}

			var pCurreentStates: IWebGLContextStates = this._pCurrentContextStates;
			this._pCurrentContextStates = this._pRenderStatesPool.pop();

			this.restoreWebGLContextRenderStates(pCurreentStates);
		}

		private restoreWebGLContextRenderStates(pStatesFrom: IWebGLContextStates): void {
			this.restoreBlendStates(pStatesFrom);
			this.restoreCullStates(pStatesFrom);
			this.restoreColorStates(pStatesFrom);
			this.restoreDepthStates(pStatesFrom);
			this.restoreDitherStates(pStatesFrom);
			this.restoreFrontFaceStates(pStatesFrom);
			this.restorePolygonStates(pStatesFrom);
			this.restoreSampleStates(pStatesFrom);
			this.restoreScissorStates(pStatesFrom);
			this.restoreStencilStates(pStatesFrom);
			this.restorePackStates(pStatesFrom);
		}

		private restoreBlendStates(pStatesFrom: IWebGLContextStates): void {
			var pRestoreStates: IWebGLContextStates = this._pCurrentContextStates;

			if (pRestoreStates.blend !== pStatesFrom.blend) {
				if (pRestoreStates.blend) {
					this._pWebGLContext.enable(gl.BLEND);
				}
				else {
					this._pWebGLContext.disable(gl.BLEND);
				}
			}

			if (pRestoreStates.blend_equation_rgb !== pStatesFrom.blend_equation_rgb ||
				pRestoreStates.blend_equation_alpha !== pStatesFrom.blend_equation_alpha) {

				if (pRestoreStates.blend_equation_rgb === pRestoreStates.blend_equation_alpha) {
					this._pWebGLContext.blendEquation(pRestoreStates.blend_equation_rgb);
				}
				else {
					this._pWebGLContext.blendEquationSeparate(pRestoreStates.blend_equation_rgb,
						pRestoreStates.blend_equation_alpha);
				}
			}

			if (pRestoreStates.blend_dst_rgb !== pStatesFrom.blend_dst_rgb ||
				pRestoreStates.blend_dst_alpha !== pStatesFrom.blend_dst_alpha ||
				pRestoreStates.blend_src_rgb !== pStatesFrom.blend_src_rgb ||
				pRestoreStates.blend_src_alpha !== pStatesFrom.blend_src_alpha) {

				if (pRestoreStates.blend_dst_rgb === pRestoreStates.blend_dst_alpha &&
					pRestoreStates.blend_src_rgb === pRestoreStates.blend_src_alpha) {

					this._pWebGLContext.blendFunc(pRestoreStates.blend_src_rgb, pRestoreStates.blend_dst_rgb);
				}
				else {
					this._pWebGLContext.blendFuncSeparate(pRestoreStates.blend_src_rgb, pRestoreStates.blend_dst_rgb,
						pRestoreStates.blend_src_alpha, pRestoreStates.blend_dst_alpha);
				}
			}
		}

		private restoreCullStates(pStatesFrom: IWebGLContextStates): void {
			var pRestoreStates: IWebGLContextStates = this._pCurrentContextStates;

			if (pRestoreStates.cull_face !== pStatesFrom.cull_face) {
				if (pRestoreStates.cull_face) {
					this._pWebGLContext.enable(gl.CULL_FACE);
				}
				else {
					this._pWebGLContext.disable(gl.CULL_FACE);
				}
			}

			if (pRestoreStates.cull_face_mode !== pStatesFrom.cull_face_mode) {
				this._pWebGLContext.cullFace(pRestoreStates.cull_face_mode);
			}
		}

		private restoreColorStates(pStatesFrom: IWebGLContextStates): void {
			var pRestoreStates: IWebGLContextStates = this._pCurrentContextStates;

			if (pRestoreStates.color_clear_value[0] !== pStatesFrom.color_clear_value[0] ||
				pRestoreStates.color_clear_value[1] !== pStatesFrom.color_clear_value[1] ||
				pRestoreStates.color_clear_value[2] !== pStatesFrom.color_clear_value[2] ||
				pRestoreStates.color_clear_value[3] !== pStatesFrom.color_clear_value[3]) {

				this._pWebGLContext.clearColor(pRestoreStates.color_clear_value[0],
					pRestoreStates.color_clear_value[1],
					pRestoreStates.color_clear_value[2],
					pRestoreStates.color_clear_value[3]);
			}

			if (pRestoreStates.color_writemask[0] !== pStatesFrom.color_writemask[0] ||
				pRestoreStates.color_writemask[1] !== pStatesFrom.color_writemask[1] ||
				pRestoreStates.color_writemask[2] !== pStatesFrom.color_writemask[2] ||
				pRestoreStates.color_writemask[3] !== pStatesFrom.color_writemask[3]) {

				this._pWebGLContext.colorMask(pRestoreStates.color_writemask[0],
					pRestoreStates.color_writemask[1],
					pRestoreStates.color_writemask[2],
					pRestoreStates.color_writemask[3]);
			}
		}

		private restoreDepthStates(pStatesFrom: IWebGLContextStates): void {
			var pRestoreStates: IWebGLContextStates = this._pCurrentContextStates;

			if (pRestoreStates.depth_test !== pStatesFrom.depth_test) {
				if (pRestoreStates.depth_test) {
					this._pWebGLContext.enable(gl.DEPTH_TEST);
				}
				else {
					this._pWebGLContext.disable(gl.DEPTH_TEST);
				}
			}

			if (pRestoreStates.depth_clear_value !== pStatesFrom.depth_clear_value) {
				this._pWebGLContext.clearDepth(pRestoreStates.depth_clear_value);
			}

			if (pRestoreStates.depth_func !== pStatesFrom.depth_func) {
				this._pWebGLContext.depthFunc(pRestoreStates.depth_func);
			}

			if (pRestoreStates.depth_writemask !== pStatesFrom.depth_writemask) {
				this._pWebGLContext.depthMask(pRestoreStates.depth_writemask);
			}

			if (pRestoreStates.depth_range[0] !== pStatesFrom.depth_range[0] ||
				pRestoreStates.depth_range[1] !== pStatesFrom.depth_range[1]) {
				this._pWebGLContext.depthRange(pRestoreStates.depth_range[0], pRestoreStates.depth_range[1]);
			}
		}

		private restoreDitherStates(pStatesFrom: IWebGLContextStates): void {
			var pRestoreStates: IWebGLContextStates = this._pCurrentContextStates;

			if (pRestoreStates.dither !== pStatesFrom.dither) {
				if (pRestoreStates.dither) {
					this._pWebGLContext.enable(gl.DITHER);
				}
				else {
					this._pWebGLContext.disable(gl.DITHER);
				}
			}
		}

		private restoreFrontFaceStates(pStatesFrom: IWebGLContextStates): void {
			var pRestoreStates: IWebGLContextStates = this._pCurrentContextStates;

			if (pRestoreStates.front_face !== pStatesFrom.front_face) {
				this._pWebGLContext.frontFace(pRestoreStates.front_face);
			}
		}

		private restorePolygonStates(pStatesFrom: IWebGLContextStates): void {
			var pRestoreStates: IWebGLContextStates = this._pCurrentContextStates;

			if (pRestoreStates.polygon_offset_fill !== pStatesFrom.polygon_offset_fill) {
				if (pRestoreStates.polygon_offset_fill) {
					this._pWebGLContext.enable(gl.POLYGON_OFFSET_FILL);
				}
				else {
					this._pWebGLContext.disable(gl.POLYGON_OFFSET_FILL);
				}
			}

			if (pRestoreStates.polygon_offset_factor !== pStatesFrom.polygon_offset_factor ||
				pRestoreStates.polygon_offset_units !== pStatesFrom.polygon_offset_units) {

				this._pWebGLContext.polygonOffset(pRestoreStates.polygon_offset_factor, pRestoreStates.polygon_offset_units);
			}

		}

		private restoreSampleStates(pStatesFrom: IWebGLContextStates): void {
			var pRestoreStates: IWebGLContextStates = this._pCurrentContextStates;

			if (pRestoreStates.sample_coverage_value !== pStatesFrom.sample_coverage_value ||
				pRestoreStates.sample_coverage_invert !== pStatesFrom.sample_coverage_invert) {

				this._pWebGLContext.sampleCoverage(pRestoreStates.sample_coverage_value, pRestoreStates.sample_coverage_invert);
			}
		}

		private restoreScissorStates(pStatesFrom: IWebGLContextStates): void {
			var pRestoreStates: IWebGLContextStates = this._pCurrentContextStates;

			if (pRestoreStates.scissor_test !== pStatesFrom.scissor_test) {
				if (pRestoreStates.scissor_test) {
					this._pWebGLContext.enable(gl.SCISSOR_TEST);
				}
				else {
					this._pWebGLContext.disable(gl.SCISSOR_TEST);
				}
			}
		}

		private restoreStencilStates(pStatesFrom: IWebGLContextStates): void {
			var pRestoreStates: IWebGLContextStates = this._pCurrentContextStates;

			if (pRestoreStates.stencil_test !== pStatesFrom.stencil_test) {
				if (pRestoreStates.stencil_test) {
					this._pWebGLContext.enable(gl.STENCIL_TEST);
				}
				else {
					this._pWebGLContext.disable(gl.STENCIL_TEST);
				}
			}

			if (pRestoreStates.stencil_clear_value !== pStatesFrom.stencil_clear_value) {
				this._pWebGLContext.clearStencil(pRestoreStates.stencil_clear_value)
			}

			if (pRestoreStates.stencil_func !== pStatesFrom.stencil_func ||
				pRestoreStates.stencil_ref !== pStatesFrom.stencil_ref ||
				pRestoreStates.stencil_value_mask !== pStatesFrom.stencil_value_mask ||
				pRestoreStates.stencil_back_func !== pStatesFrom.stencil_back_func ||
				pRestoreStates.stencil_back_ref !== pStatesFrom.stencil_back_ref ||
				pRestoreStates.stencil_back_value_mask !== pStatesFrom.stencil_back_value_mask) {

				if (pRestoreStates.stencil_func === pRestoreStates.stencil_back_func ||
					pRestoreStates.stencil_ref === pRestoreStates.stencil_back_ref ||
					pRestoreStates.stencil_value_mask === pRestoreStates.stencil_back_value_mask) {

					this._pWebGLContext.stencilFunc(pRestoreStates.stencil_func, pRestoreStates.stencil_ref, pRestoreStates.stencil_value_mask);
				}
				else {
					this._pWebGLContext.stencilFuncSeparate(gl.FRONT,
						pRestoreStates.stencil_func, pRestoreStates.stencil_ref, pRestoreStates.stencil_value_mask);

					this._pWebGLContext.stencilFuncSeparate(gl.BACK,
						pRestoreStates.stencil_back_func, pRestoreStates.stencil_back_ref, pRestoreStates.stencil_back_value_mask);
				}
			}

			if (pRestoreStates.stencil_writemask !== pStatesFrom.stencil_writemask ||
				pRestoreStates.stencil_back_writemask !== pStatesFrom.stencil_back_writemask) {

				if (pRestoreStates.stencil_writemask === pRestoreStates.stencil_back_writemask) {
					this._pWebGLContext.stencilMask(pRestoreStates.stencil_writemask);
				}
				else {
					this._pWebGLContext.stencilMaskSeparate(gl.FRONT, pRestoreStates.stencil_writemask);
					this._pWebGLContext.stencilMaskSeparate(gl.BACK, pRestoreStates.stencil_writemask);
				}
			}

			if (pRestoreStates.stencil_fail !== pStatesFrom.stencil_fail ||
				pRestoreStates.stencil_pass_depth_fail !== pStatesFrom.stencil_pass_depth_fail ||
				pRestoreStates.stencil_pass_depth_pass !== pStatesFrom.stencil_pass_depth_pass ||
				pRestoreStates.stencil_back_fail !== pStatesFrom.stencil_back_fail ||
				pRestoreStates.stencil_back_pass_depth_fail !== pStatesFrom.stencil_back_pass_depth_fail ||
				pRestoreStates.stencil_back_pass_depth_pass !== pStatesFrom.stencil_back_pass_depth_pass) {

				if (pRestoreStates.stencil_fail === pRestoreStates.stencil_back_fail ||
					pRestoreStates.stencil_pass_depth_fail === pRestoreStates.stencil_back_pass_depth_fail ||
					pRestoreStates.stencil_pass_depth_pass === pRestoreStates.stencil_back_pass_depth_pass) {

					this._pWebGLContext.stencilOp(pRestoreStates.stencil_fail, pRestoreStates.stencil_pass_depth_fail, pRestoreStates.stencil_pass_depth_pass);
				}
				else {
					this._pWebGLContext.stencilOpSeparate(gl.FRONT,
						pRestoreStates.stencil_fail, pRestoreStates.stencil_pass_depth_fail, pRestoreStates.stencil_pass_depth_pass);

					this._pWebGLContext.stencilOpSeparate(gl.BACK,
						pRestoreStates.stencil_back_fail, pRestoreStates.stencil_back_pass_depth_fail, pRestoreStates.stencil_back_pass_depth_pass);
				}
			}

		}

		private restorePackStates(pStatesFrom: IWebGLContextStates): void {
			var pRestoreStates: IWebGLContextStates = this._pCurrentContextStates;

			if (pRestoreStates.unpack_alignment !== pStatesFrom.unpack_alignment) {
				this._pWebGLContext.pixelStorei(gl.UNPACK_ALIGNMENT, pRestoreStates.unpack_alignment);
			}

			if (pRestoreStates.pack_alignment !== pStatesFrom.pack_alignment) {
				this._pWebGLContext.pixelStorei(gl.PACK_ALIGNMENT, pRestoreStates.pack_alignment);
			}
		}

		private forceUpdateContextRenderStates(): void {
			WebGLRenderer.initStatesFromWebGLContext(this._pCurrentContextStates, this._pWebGLContext);
		}

		private getFreeRenderStates(): IWebGLContextStates {
			if (this._pFreeRenderStatesPool.getLength() > 0) {
				return this._pFreeRenderStatesPool.pop();
			}
			else {
				return WebGLRenderer.createWebGLContextStates();
			}
		}

		private applyInputRenderStates(pStates: IMap<ERenderStateValues>): boolean {
			var isStatesChanged: boolean = false;
			var iWebGLValue: uint = 0;

			if (pStates[ERenderStates.BLENDENABLE] !== ERenderStateValues.UNDEF) {

				iWebGLValue = this.convertRenderStateValue(pStates[ERenderStates.BLENDENABLE]);
				if (this._pCurrentContextStates.blend !== !!iWebGLValue) {

					!isStatesChanged && this._pushRenderStates();
					isStatesChanged = true;
					this._pCurrentContextStates.blend = !!iWebGLValue;

					if (this._pCurrentContextStates.blend) {
						this._pWebGLContext.enable(gl.BLEND);
					}
					else {
						this._pWebGLContext.disable(gl.BLEND);
					}
				}

			}

			if (pStates[ERenderStates.CULLFACEENABLE] !== ERenderStateValues.UNDEF) {

				iWebGLValue = this.convertRenderStateValue(pStates[ERenderStates.CULLFACEENABLE]);
				if (this._pCurrentContextStates.cull_face !== !!iWebGLValue) {

					!isStatesChanged && this._pushRenderStates();
					isStatesChanged = true;
					this._pCurrentContextStates.cull_face = !!iWebGLValue;

					if (this._pCurrentContextStates.cull_face) {
						this._pWebGLContext.enable(gl.CULL_FACE);
					}
					else {
						this._pWebGLContext.disable(gl.CULL_FACE);
					}
				}
			}

			if (pStates[ERenderStates.ZENABLE] !== ERenderStateValues.UNDEF) {

				iWebGLValue = this.convertRenderStateValue(pStates[ERenderStates.ZENABLE]);
				if (this._pCurrentContextStates.depth_test !== !!iWebGLValue) {

					!isStatesChanged && this._pushRenderStates();
					isStatesChanged = true;
					this._pCurrentContextStates.depth_test = !!iWebGLValue;

					if (this._pCurrentContextStates.depth_test) {
						this._pWebGLContext.enable(gl.DEPTH_TEST);
					}
					else {
						this._pWebGLContext.disable(gl.DEPTH_TEST);
					}
				}
			}

			if (pStates[ERenderStates.DITHERENABLE] !== ERenderStateValues.UNDEF) {

				iWebGLValue = this.convertRenderStateValue(pStates[ERenderStates.DITHERENABLE]);
				if (this._pCurrentContextStates.dither !== !!iWebGLValue) {

					!isStatesChanged && this._pushRenderStates();
					isStatesChanged = true;
					this._pCurrentContextStates.dither = !!iWebGLValue;

					if (this._pCurrentContextStates.dither) {
						this._pWebGLContext.enable(gl.DITHER);
					}
					else {
						this._pWebGLContext.disable(gl.DITHER);
					}
				}
			}

			if (pStates[ERenderStates.ZWRITEENABLE] !== ERenderStateValues.UNDEF) {

				!isStatesChanged && this._pushRenderStates();
				isStatesChanged = true;
				this._pCurrentContextStates.depth_writemask = this.convertRenderStateValue(pStates[ERenderStates.ZWRITEENABLE]);

				this._pWebGLContext.depthMask(this._pCurrentContextStates.depth_writemask);
			}

			if (pStates[ERenderStates.SCISSORTESTENABLE] !== ERenderStateValues.UNDEF) {

				iWebGLValue = this.convertRenderStateValue(pStates[ERenderStates.SCISSORTESTENABLE]);
				if (this._pCurrentContextStates.scissor_test !== !!iWebGLValue) {

					!isStatesChanged && this._pushRenderStates();
					isStatesChanged = true;
					this._pCurrentContextStates.scissor_test = !!iWebGLValue;

					if (this._pCurrentContextStates.scissor_test) {
						this._pWebGLContext.enable(gl.SCISSOR_TEST);
					}
					else {
						this._pWebGLContext.disable(gl.SCISSOR_TEST);
					}
				}
			}

			if (pStates[ERenderStates.STENCILTESTENABLE] !== ERenderStateValues.UNDEF) {

				iWebGLValue = this.convertRenderStateValue(pStates[ERenderStates.STENCILTESTENABLE]);
				if (this._pCurrentContextStates.stencil_test !== !!iWebGLValue) {

					!isStatesChanged && this._pushRenderStates();
					isStatesChanged = true;
					this._pCurrentContextStates.stencil_test = !!iWebGLValue;

					if (this._pCurrentContextStates.stencil_test) {
						this._pWebGLContext.enable(gl.STENCIL_TEST);
					}
					else {
						this._pWebGLContext.disable(gl.STENCIL_TEST);
					}
				}
			}

			if (pStates[ERenderStates.POLYGONOFFSETFILLENABLE] !== ERenderStateValues.UNDEF) {

				iWebGLValue = this.convertRenderStateValue(pStates[ERenderStates.POLYGONOFFSETFILLENABLE]);
				if (this._pCurrentContextStates.polygon_offset_fill !== !!iWebGLValue) {

					!isStatesChanged && this._pushRenderStates();
					isStatesChanged = true;
					this._pCurrentContextStates.polygon_offset_fill = !!iWebGLValue;

					if (this._pCurrentContextStates.polygon_offset_fill) {
						this._pWebGLContext.enable(gl.POLYGON_OFFSET_FILL);
					}
					else {
						this._pWebGLContext.disable(gl.POLYGON_OFFSET_FILL);
					}
				}
			}

			if (pStates[ERenderStates.CULLFACE] !== ERenderStateValues.UNDEF) {

				iWebGLValue = this.convertRenderStateValue(pStates[ERenderStates.CULLFACE]);
				if (this._pCurrentContextStates.cull_face_mode !== iWebGLValue) {

					!isStatesChanged && this._pushRenderStates();
					isStatesChanged = true;
					this._pCurrentContextStates.cull_face_mode = iWebGLValue;

					this._pWebGLContext.cullFace(this._pCurrentContextStates.cull_face_mode);
				}
			}

			if (pStates[ERenderStates.FRONTFACE] !== ERenderStateValues.UNDEF) {

				iWebGLValue = this.convertRenderStateValue(pStates[ERenderStates.FRONTFACE]);
				if (this._pCurrentContextStates.front_face !== iWebGLValue) {

					!isStatesChanged && this._pushRenderStates();
					isStatesChanged = true;
					this._pCurrentContextStates.front_face = iWebGLValue;

					this._pWebGLContext.frontFace(this._pCurrentContextStates.front_face);
				}
			}

			if (pStates[ERenderStates.ZFUNC] !== ERenderStateValues.UNDEF) {

				iWebGLValue = this.convertRenderStateValue(pStates[ERenderStates.ZFUNC]);
				if (this._pCurrentContextStates.depth_func !== iWebGLValue) {

					!isStatesChanged && this._pushRenderStates();
					isStatesChanged = true;
					this._pCurrentContextStates.depth_func = iWebGLValue;

					this._pWebGLContext.depthFunc(this._pCurrentContextStates.depth_func);
				}
			}

			if (pStates[ERenderStates.SRCBLEND] !== ERenderStateValues.UNDEF ||
				pStates[ERenderStates.DESTBLEND] !== ERenderStateValues.UNDEF) {

				var iWebGLValue1: uint = this.convertRenderStateValue(pStates[ERenderStates.SRCBLEND]);
				var iWebGLValue2: uint = this.convertRenderStateValue(pStates[ERenderStates.DESTBLEND]);

				!isStatesChanged && this._pushRenderStates();
				isStatesChanged = true;

				this._pCurrentContextStates.blend_src_rgb = iWebGLValue1;
				this._pCurrentContextStates.blend_src_alpha = iWebGLValue1;
				this._pCurrentContextStates.blend_dst_rgb = iWebGLValue2;
				this._pCurrentContextStates.blend_dst_alpha = iWebGLValue2;

				this._pWebGLContext.blendFunc(iWebGLValue1, iWebGLValue2);
			}

			return isStatesChanged;
		}

		private convertRenderStateValue(eStateValue: ERenderStateValues): any {
			switch (eStateValue) {
				case ERenderStateValues.TRUE:
					return 1;
				case ERenderStateValues.FALSE:
					return 0;
				case ERenderStateValues.ZERO:
					return gl.ZERO;
				case ERenderStateValues.ONE:
					return gl.ONE;
				case ERenderStateValues.SRCCOLOR:
					return gl.SRC_COLOR;
				case ERenderStateValues.INVSRCCOLOR:
					return gl.ONE_MINUS_SRC_COLOR;
				case ERenderStateValues.SRCALPHA:
					return gl.SRC_ALPHA;
				case ERenderStateValues.INVSRCALPHA:
					return gl.ONE_MINUS_SRC_ALPHA;
				case ERenderStateValues.DESTALPHA:
					return gl.DST_ALPHA;
				case ERenderStateValues.INVDESTALPHA:
					return gl.ONE_MINUS_DST_ALPHA;
				case ERenderStateValues.DESTCOLOR:
					return gl.DST_COLOR;
				case ERenderStateValues.INVDESTCOLOR:
					return gl.ONE_MINUS_DST_COLOR;
				case ERenderStateValues.SRCALPHASAT:
					return gl.SRC_ALPHA_SATURATE;
				case ERenderStateValues.NONE:
					return gl.NONE;
				case ERenderStateValues.CW:
					return gl.CW;
				case ERenderStateValues.CCW:
					return gl.CCW;
				case ERenderStateValues.FRONT:
					return gl.FRONT;
				case ERenderStateValues.BACK:
					return gl.BACK;
				case ERenderStateValues.FRONT_AND_BACK:
					return gl.FRONT_AND_BACK;
				case ERenderStateValues.NEVER:
					return gl.NEVER;
				case ERenderStateValues.LESS:
					return gl.LESS;
				case ERenderStateValues.EQUAL:
					return gl.EQUAL;
				case ERenderStateValues.LESSEQUAL:
					return gl.LEQUAL;
				case ERenderStateValues.GREATER:
					return gl.GREATER;
				case ERenderStateValues.NOTEQUAL:
					return gl.NOTEQUAL;
				case ERenderStateValues.GREATEREQUAL:
					return gl.GEQUAL;
				case ERenderStateValues.ALWAYS:
					return gl.ALWAYS;
			}
		}

		private convertCompareFunction(eFunc: ECompareFunction): uint {
			switch (eFunc) {
				case ECompareFunction.ALWAYS_FAIL:
					return gl.NEVER;
				case ECompareFunction.ALWAYS_PASS:
					return gl.ALWAYS;
				case ECompareFunction.LESS:
					return gl.LESS;
				case ECompareFunction.LESS_EQUAL:
					return gl.LEQUAL;
				case ECompareFunction.EQUAL:
					return gl.EQUAL;
				case ECompareFunction.NOT_EQUAL:
					return gl.NOTEQUAL;
				case ECompareFunction.GREATER_EQUAL:
					return gl.GEQUAL;
				case ECompareFunction.GREATER:
					return gl.GREATER;
			}

			return gl.ALWAYS;
		}


		private static createWebGLContextStates(pStates: IWebGLContextStates = null): IWebGLContextStates {
			return <IWebGLContextStates>{
				blend: isNull(pStates) ? false : pStates.blend,
				blend_color: isNull(pStates) ? new Float32Array(4) : new Float32Array(pStates.blend_color),
				blend_dst_alpha: isNull(pStates) ? 0 : pStates.blend_dst_alpha,
				blend_dst_rgb: isNull(pStates) ? 0 : pStates.blend_dst_rgb,
				blend_equation_alpha: isNull(pStates) ? 0 : pStates.blend_equation_alpha,
				blend_equation_rgb: isNull(pStates) ? 0 : pStates.blend_equation_rgb,
				blend_src_alpha: isNull(pStates) ? 0 : pStates.blend_src_alpha,
				blend_src_rgb: isNull(pStates) ? 0 : pStates.blend_src_rgb,

				color_clear_value: isNull(pStates) ? new Float32Array(4) : new Float32Array(pStates.color_clear_value),
				color_writemask: isNull(pStates) ? [false, false, false, false] : pStates.color_writemask.slice(0),

				cull_face: isNull(pStates) ? false : pStates.cull_face,
				cull_face_mode: isNull(pStates) ? 0 : pStates.cull_face_mode,

				depth_clear_value: isNull(pStates) ? 0. : pStates.depth_clear_value,
				depth_func: isNull(pStates) ? 0 : pStates.depth_func,
				depth_range: isNull(pStates) ? new Float32Array(2) : new Float32Array(pStates.depth_range),
				depth_test: isNull(pStates) ? false : pStates.depth_test,
				depth_writemask: isNull(pStates) ? false : pStates.depth_writemask,
				dither: isNull(pStates) ? false : pStates.dither,

				front_face: isNull(pStates) ? 0 : pStates.front_face,
				line_width: isNull(pStates) ? 0. : pStates.line_width,

				polygon_offset_factor: isNull(pStates) ? 0. : pStates.polygon_offset_factor,
				polygon_offset_fill: isNull(pStates) ? false : pStates.polygon_offset_fill,
				polygon_offset_units: isNull(pStates) ? 0. : pStates.polygon_offset_units,

				sample_buffers: isNull(pStates) ? 0 : pStates.sample_buffers,
				sample_coverage_invert: isNull(pStates) ? false : pStates.sample_coverage_invert,
				sample_coverage_value: isNull(pStates) ? 0. : pStates.sample_coverage_value,
				samples: isNull(pStates) ? 0 : pStates.samples,

				scissor_test: isNull(pStates) ? false : pStates.scissor_test,

				stencil_back_fail: isNull(pStates) ? 0 : pStates.stencil_back_fail,
				stencil_back_func: isNull(pStates) ? 0 : pStates.stencil_back_func,
				stencil_back_pass_depth_fail: isNull(pStates) ? 0 : pStates.stencil_back_pass_depth_fail,
				stencil_back_pass_depth_pass: isNull(pStates) ? 0 : pStates.stencil_back_pass_depth_pass,
				stencil_back_ref: isNull(pStates) ? 0 : pStates.stencil_back_ref,
				stencil_back_value_mask: isNull(pStates) ? 0 : pStates.stencil_back_value_mask,
				stencil_back_writemask: isNull(pStates) ? 0 : pStates.stencil_back_writemask,
				stencil_clear_value: isNull(pStates) ? 0 : pStates.stencil_clear_value,
				stencil_fail: isNull(pStates) ? 0 : pStates.stencil_fail,
				stencil_func: isNull(pStates) ? 0 : pStates.stencil_func,
				stencil_pass_depth_fail: isNull(pStates) ? 0 : pStates.stencil_pass_depth_fail,
				stencil_pass_depth_pass: isNull(pStates) ? 0 : pStates.stencil_pass_depth_pass,
				stencil_ref: isNull(pStates) ? 0 : pStates.stencil_ref,
				stencil_test: isNull(pStates) ? false : pStates.stencil_test,
				stencil_value_mask: isNull(pStates) ? 0 : pStates.stencil_value_mask,
				stencil_writemask: isNull(pStates) ? 0 : pStates.stencil_writemask,
				pack_alignment: isNull(pStates) ? 0 : pStates.pack_alignment,
				unpack_alignment: isNull(pStates) ? 0 : pStates.unpack_alignment
			};
		}

		private static copyWebGLContextStates(pStatesTo: IWebGLContextStates, pStatesFrom: IWebGLContextStates): IWebGLContextStates {
			pStatesTo.blend = pStatesFrom.blend;
			pStatesTo.blend_color.set(pStatesFrom.blend_color);
			pStatesTo.blend_dst_alpha = pStatesFrom.blend_dst_alpha;
			pStatesTo.blend_dst_rgb = pStatesFrom.blend_dst_rgb;
			pStatesTo.blend_equation_alpha = pStatesFrom.blend_equation_alpha;
			pStatesTo.blend_equation_rgb = pStatesFrom.blend_equation_rgb;
			pStatesTo.blend_src_alpha = pStatesFrom.blend_src_alpha;
			pStatesTo.blend_src_rgb = pStatesFrom.blend_src_rgb;

			pStatesTo.color_clear_value.set(pStatesFrom.color_clear_value);
			pStatesTo.color_writemask[0] = pStatesFrom.color_writemask[0];
			pStatesTo.color_writemask[1] = pStatesFrom.color_writemask[1];
			pStatesTo.color_writemask[2] = pStatesFrom.color_writemask[2];
			pStatesTo.color_writemask[3] = pStatesFrom.color_writemask[3];

			pStatesTo.cull_face = pStatesFrom.cull_face;
			pStatesTo.cull_face_mode = pStatesFrom.cull_face_mode;

			pStatesTo.depth_clear_value = pStatesFrom.depth_clear_value;
			pStatesTo.depth_func = pStatesFrom.depth_func;
			pStatesTo.depth_range.set(pStatesFrom.depth_range);
			pStatesTo.depth_test = pStatesFrom.depth_test;
			pStatesTo.depth_writemask = pStatesFrom.depth_writemask;
			pStatesTo.dither = pStatesFrom.dither;

			pStatesTo.front_face = pStatesFrom.front_face;
			pStatesTo.line_width = pStatesFrom.line_width;

			pStatesTo.polygon_offset_factor = pStatesFrom.polygon_offset_factor;
			pStatesTo.polygon_offset_fill = pStatesFrom.polygon_offset_fill;
			pStatesTo.polygon_offset_units = pStatesFrom.polygon_offset_units;

			pStatesTo.sample_buffers = pStatesFrom.sample_buffers;
			pStatesTo.sample_coverage_invert = pStatesFrom.sample_coverage_invert;
			pStatesTo.sample_coverage_value = pStatesFrom.sample_coverage_value;
			pStatesTo.samples = pStatesFrom.samples;

			pStatesTo.scissor_test = pStatesFrom.scissor_test;

			pStatesTo.stencil_back_fail = pStatesFrom.stencil_back_fail;
			pStatesTo.stencil_back_func = pStatesFrom.stencil_back_func;
			pStatesTo.stencil_back_pass_depth_fail = pStatesFrom.stencil_back_pass_depth_fail;
			pStatesTo.stencil_back_pass_depth_pass = pStatesFrom.stencil_back_pass_depth_pass;
			pStatesTo.stencil_back_ref = pStatesFrom.stencil_back_ref;
			pStatesTo.stencil_back_value_mask = pStatesFrom.stencil_back_value_mask;
			pStatesTo.stencil_back_writemask = pStatesFrom.stencil_back_writemask;
			pStatesTo.stencil_clear_value = pStatesFrom.stencil_clear_value;
			pStatesTo.stencil_fail = pStatesFrom.stencil_fail;
			pStatesTo.stencil_func = pStatesFrom.stencil_func;
			pStatesTo.stencil_pass_depth_fail = pStatesFrom.stencil_pass_depth_fail;
			pStatesTo.stencil_pass_depth_pass = pStatesFrom.stencil_pass_depth_pass;
			pStatesTo.stencil_ref = pStatesFrom.stencil_ref;
			pStatesTo.stencil_test = pStatesFrom.stencil_test;
			pStatesTo.stencil_value_mask = pStatesFrom.stencil_value_mask;
			pStatesTo.stencil_writemask = pStatesFrom.stencil_writemask;


			pStatesTo.pack_alignment = pStatesFrom.pack_alignment;
			pStatesTo.unpack_alignment = pStatesFrom.unpack_alignment;

			return pStatesTo;
		}

		private static initStatesFromWebGLContext(pStatesTo: IWebGLContextStates, pWebGLContext: WebGLRenderingContext): IWebGLContextStates {
			pStatesTo.blend = pWebGLContext.getParameter(gl.BLEND);
			pStatesTo.blend_color = pWebGLContext.getParameter(gl.BLEND_COLOR);
			pStatesTo.blend_dst_alpha = pWebGLContext.getParameter(gl.BLEND_DST_ALPHA);
			pStatesTo.blend_dst_rgb = pWebGLContext.getParameter(gl.BLEND_DST_RGB);
			pStatesTo.blend_equation_alpha = pWebGLContext.getParameter(gl.BLEND_EQUATION_ALPHA);
			pStatesTo.blend_equation_rgb = pWebGLContext.getParameter(gl.BLEND_EQUATION_RGB);
			pStatesTo.blend_src_alpha = pWebGLContext.getParameter(gl.BLEND_SRC_ALPHA);
			pStatesTo.blend_src_rgb = pWebGLContext.getParameter(gl.BLEND_SRC_RGB);

			pStatesTo.color_clear_value = pWebGLContext.getParameter(gl.COLOR_CLEAR_VALUE);
			pStatesTo.color_writemask = pWebGLContext.getParameter(gl.COLOR_WRITEMASK);

			pStatesTo.cull_face = pWebGLContext.getParameter(gl.CULL_FACE);
			pStatesTo.cull_face_mode = pWebGLContext.getParameter(gl.CULL_FACE_MODE);

			pStatesTo.depth_clear_value = pWebGLContext.getParameter(gl.DEPTH_CLEAR_VALUE);
			pStatesTo.depth_func = pWebGLContext.getParameter(gl.DEPTH_FUNC);
			pStatesTo.depth_range = pWebGLContext.getParameter(gl.DEPTH_RANGE);
			pStatesTo.depth_test = pWebGLContext.getParameter(gl.DEPTH_TEST);
			pStatesTo.depth_writemask = pWebGLContext.getParameter(gl.DEPTH_WRITEMASK);
			pStatesTo.dither = pWebGLContext.getParameter(gl.DITHER);

			pStatesTo.front_face = pWebGLContext.getParameter(gl.FRONT_FACE);
			pStatesTo.line_width = pWebGLContext.getParameter(gl.LINE_WIDTH);

			pStatesTo.polygon_offset_factor = pWebGLContext.getParameter(gl.POLYGON_OFFSET_FACTOR);
			pStatesTo.polygon_offset_fill = pWebGLContext.getParameter(gl.POLYGON_OFFSET_FILL);
			pStatesTo.polygon_offset_units = pWebGLContext.getParameter(gl.POLYGON_OFFSET_UNITS);

			pStatesTo.sample_buffers = pWebGLContext.getParameter(gl.SAMPLE_BUFFERS);
			pStatesTo.sample_coverage_invert = pWebGLContext.getParameter(gl.SAMPLE_COVERAGE_INVERT);
			pStatesTo.sample_coverage_value = pWebGLContext.getParameter(gl.SAMPLE_COVERAGE_VALUE);
			pStatesTo.samples = pWebGLContext.getParameter(gl.SAMPLES);

			pStatesTo.scissor_test = pWebGLContext.getParameter(gl.SCISSOR_TEST);

			pStatesTo.stencil_back_fail = pWebGLContext.getParameter(gl.STENCIL_BACK_FAIL);
			pStatesTo.stencil_back_func = pWebGLContext.getParameter(gl.STENCIL_BACK_FUNC);
			pStatesTo.stencil_back_pass_depth_fail = pWebGLContext.getParameter(gl.STENCIL_BACK_PASS_DEPTH_FAIL);
			pStatesTo.stencil_back_pass_depth_pass = pWebGLContext.getParameter(gl.STENCIL_BACK_PASS_DEPTH_PASS);
			pStatesTo.stencil_back_ref = pWebGLContext.getParameter(gl.STENCIL_BACK_REF);
			pStatesTo.stencil_back_value_mask = pWebGLContext.getParameter(gl.STENCIL_BACK_VALUE_MASK);
			pStatesTo.stencil_back_writemask = pWebGLContext.getParameter(gl.STENCIL_BACK_WRITEMASK);
			pStatesTo.stencil_clear_value = pWebGLContext.getParameter(gl.STENCIL_CLEAR_VALUE);
			pStatesTo.stencil_fail = pWebGLContext.getParameter(gl.STENCIL_FAIL);
			pStatesTo.stencil_func = pWebGLContext.getParameter(gl.STENCIL_FUNC);
			pStatesTo.stencil_pass_depth_fail = pWebGLContext.getParameter(gl.STENCIL_PASS_DEPTH_FAIL);
			pStatesTo.stencil_pass_depth_pass = pWebGLContext.getParameter(gl.STENCIL_PASS_DEPTH_PASS);
			pStatesTo.stencil_ref = pWebGLContext.getParameter(gl.STENCIL_REF);
			pStatesTo.stencil_test = pWebGLContext.getParameter(gl.STENCIL_TEST);
			pStatesTo.stencil_value_mask = pWebGLContext.getParameter(gl.STENCIL_VALUE_MASK);
			pStatesTo.stencil_writemask = pWebGLContext.getParameter(gl.STENCIL_WRITEMASK);

			pStatesTo.pack_alignment = pWebGLContext.getParameter(gl.PACK_ALIGNMENT);
			pStatesTo.unpack_alignment = pWebGLContext.getParameter(gl.UNPACK_ALIGNMENT);

			return pStatesTo;
		}
	}
}