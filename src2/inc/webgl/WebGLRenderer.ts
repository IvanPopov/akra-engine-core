#ifndef WEBGLRENDERER_TS
#define WEBGLRENDERER_TS

#include "WebGL.ts"
#include "render/Renderer.ts"
#include "WebGLCanvas.ts"
#include "render/Viewport.ts"
#include "WebGLShaderProgram.ts"
#include "IShaderInput.ts"

#define WEBGL_MAX_FRAMEBUFFER_NUM 32

module akra.webgl {
	export interface IWebGLContextStates {
		BLEND: bool;
		BLEND_COLOR: Float32Array;
		BLEND_DST_ALPHA: uint;
		BLEND_DST_RGB: uint;
		BLEND_EQUATION_ALPHA: uint;
		BLEND_EQUATION_RGB: uint;
		BLEND_SRC_ALPHA: uint;
		BLEND_SRC_RGB: uint;

		COLOR_CLEAR_VALUE: Float32Array;
		COLOR_WRITEMASK: bool[];

		CULL_FACE: bool;
		CULL_FACE_MODE: uint;

		DEPTH_CLEAR_VALUE: float;
		DEPTH_FUNC: uint;
		DEPTH_RANGE: Float32Array;
		DEPTH_TEST: bool;
		DEPTH_WRITEMASK: bool;

		DITHER: bool;

		FRONT_FACE: uint;
		LINE_WIDTH: float;

		POLYGON_OFFSET_FACTOR: float;
		POLYGON_OFFSET_FILL: bool;
		POLYGON_OFFSET_UNITS: float;

		SAMPLE_BUFFERS: int;
		SAMPLE_COVERAGE_INVERT: bool;
		SAMPLE_COVERAGE_VALUE: float;
		SAMPLES: int;

		SCISSOR_TEST: bool;

		STENCIL_BACK_FAIL: uint;
		STENCIL_BACK_FUNC: uint;
		STENCIL_BACK_PASS_DEPTH_FAIL: uint;
		STENCIL_BACK_PASS_DEPTH_PASS: uint;
		STENCIL_BACK_REF: int;
		STENCIL_BACK_VALUE_MASK: uint;
		STENCIL_BACK_WRITEMASK: uint;
		STENCIL_CLEAR_VALUE: int;
		STENCIL_FAIL: uint;
		STENCIL_FUNC: uint;
		STENCIL_PASS_DEPTH_FAIL: uint;
		STENCIL_PASS_DEPTH_PASS: uint;
		STENCIL_REF: int;
		STENCIL_TEST: bool;
		STENCIL_VALUE_MASK: uint;
		STENCIL_WRITEMASK: uint;

		PACK_ALIGNMENT: uint;
		UNPACK_ALIGNMENT: uint;
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
		 * Need to impove speed
		 */
		private _pCurrentContextStates: IWebGLContextStates = WebGLRenderer.createWebGLContextStates();
		private _pRenderStatesPool: IObjectArray = new util.ObjectArray();
		private _pFreeRenderStatesPool: IObjectArray = new util.ObjectArray();

		static DEFAULT_OPTIONS: IRendererOptions = {
			depth: false,
			stencil: false,
			antialias: false,
			preserveDrawingBuffer: false
		};

		constructor (pEngine: IEngine);
		constructor (pEngine: IEngine, sCanvas: string);
		constructor (pEngine: IEngine, pOptions: IRendererOptions);
		constructor (pEngine: IEngine, pCanvas: HTMLCanvasElement);
		constructor (pEngine: IEngine, options?: any) {
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
				for (var i: int = 0, pOptList: string[] = Object.keys(WebGLRenderer.DEFAULT_OPTIONS); i < pOptList.length; ++ i) {
					var sOpt: string = pOptList[i];

					if (!isDef(pOptions[sOpt])) {
						pOptions[sOpt] = WebGLRenderer.DEFAULT_OPTIONS[sOpt];
					}
				}
			}
			
			debug_print("webgl context attributes:", pOptions);

			this._pWebGLContext = createContext(this._pCanvas, pOptions);

			debug_assert(!isNull(this._pWebGLContext), "webgl context is NULL");

			this._pWebGLFramebufferList = new Array(WEBGL_MAX_FRAMEBUFFER_NUM);


			for (var i: int = 0; i < this._pWebGLFramebufferList.length; ++ i) {
				this._pWebGLFramebufferList[i] = this._pWebGLContext.createFramebuffer();
			}

			this._pDefaultCanvas = new WebGLCanvas(this);
			ASSERT(this._pDefaultCanvas.create("primary-target"), "could not create WebGL canvas");

			this.attachRenderTarget(this._pDefaultCanvas);

			this._pTextureSlotList = new Array(maxTextureImageUnits);

			for(var i: uint = 0; i < this._pTextureSlotList.length; i++){
				this._pTextureSlotList[i] = null;
			}

			for(var i: uint = 0; i < 4; i++){
				this._pFreeRenderStatesPool.push(WebGLRenderer.createWebGLContextStates());
			}

			this.forceUpdateContextRenderStates();
		}

		debug(bValue: bool = true, useApiTrace: bool = false): bool {
			var pWebGLInternalContext: WebGLRenderingContext = this._pWebGLContext;

			if (bValue) {
				if (isDef((<any>window).WebGLDebugUtils) && !isNull(pWebGLInternalContext)) {
		            
		            this._pWebGLContext = WebGLDebugUtils.makeDebugContext(pWebGLInternalContext, 
		                (err: int, funcName: string, args: IArguments): void => {
		                    throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
		                },
		                useApiTrace? 
		                (funcName: string, args: IArguments): void => {   
		                   LOG("gl." + funcName + "(" + WebGLDebugUtils.glFunctionArgsToString(funcName, args) + ")");   
		                }: null);

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
			this._pCurrentContextStates.BLEND_COLOR[0] = fRed;
			this._pCurrentContextStates.BLEND_COLOR[1] = fGreen;
			this._pCurrentContextStates.BLEND_COLOR[2] = fBlue;
			this._pCurrentContextStates.BLEND_COLOR[3] = fAlpha;
		}

		blendEquation(iWebGLMode: uint): void {
			this._pWebGLContext.blendEquation(iWebGLMode);
			this._pCurrentContextStates.BLEND_EQUATION_RGB = iWebGLMode;
			this._pCurrentContextStates.BLEND_EQUATION_ALPHA = iWebGLMode;
		}

		blendEquationSeparate(iWebGLModeRGB: uint, iWebGLModeAlpha: uint): void {
			this._pWebGLContext.blendEquationSeparate(iWebGLModeRGB, iWebGLModeAlpha);
			this._pCurrentContextStates.BLEND_EQUATION_RGB = iWebGLModeRGB;
			this._pCurrentContextStates.BLEND_EQUATION_ALPHA = iWebGLModeAlpha;
		}

		blendFunc(iWebGLSFactor: uint, iWebGLDFactor: uint): void {
			this._pWebGLContext.blendFunc(iWebGLSFactor, iWebGLDFactor);
			this._pCurrentContextStates.BLEND_SRC_RGB = iWebGLSFactor;
			this._pCurrentContextStates.BLEND_SRC_ALPHA = iWebGLSFactor;
			this._pCurrentContextStates.BLEND_DST_RGB = iWebGLDFactor;
			this._pCurrentContextStates.BLEND_DST_ALPHA = iWebGLDFactor;
		}

		blendFuncSeparate(iWebGLSFactorRGB: uint, iWebGLDFactorRGB: uint, iWebGLSFactorAlpha: uint, iWebGLDFactorAlpha: uint): void {
			this._pWebGLContext.blendFuncSeparate(iWebGLSFactorRGB, iWebGLDFactorRGB, iWebGLSFactorAlpha, iWebGLDFactorAlpha);
			this._pCurrentContextStates.BLEND_SRC_RGB = iWebGLSFactorRGB;
			this._pCurrentContextStates.BLEND_SRC_ALPHA = iWebGLSFactorAlpha;
			this._pCurrentContextStates.BLEND_DST_RGB = iWebGLDFactorRGB;
			this._pCurrentContextStates.BLEND_DST_ALPHA = iWebGLDFactorAlpha;
		}

		clearColor(fRed: float, fGreen: float, fBlue: float, fAlpha: float): void {
			this._pWebGLContext.clearColor(fRed, fGreen, fBlue, fAlpha);
			this._pCurrentContextStates.COLOR_CLEAR_VALUE[0] = fRed;
			this._pCurrentContextStates.COLOR_CLEAR_VALUE[1] = fGreen;
			this._pCurrentContextStates.COLOR_CLEAR_VALUE[2] = fBlue;
			this._pCurrentContextStates.COLOR_CLEAR_VALUE[3] = fAlpha;
		}

		clearDepth(fDepth: float): void {
			this._pWebGLContext.clearDepth(fDepth);
			this._pCurrentContextStates.DEPTH_CLEAR_VALUE = fDepth;
		}

		clearStencil(iS: int): void {
			this._pWebGLContext.clearStencil(iS);
			this._pCurrentContextStates.STENCIL_CLEAR_VALUE = iS;
		}

		colorMask(bRed: bool, bGreen: bool, bBlue: bool, bAlpha: bool): void {
			this._pWebGLContext.colorMask(bRed, bGreen, bBlue, bAlpha);
			this._pCurrentContextStates.COLOR_WRITEMASK[0] = bRed;
			this._pCurrentContextStates.COLOR_WRITEMASK[1] = bGreen;
			this._pCurrentContextStates.COLOR_WRITEMASK[2] = bBlue;
			this._pCurrentContextStates.COLOR_WRITEMASK[3] = bAlpha;
		}

		cullFace(iWebGLMode: uint): void {
			this._pWebGLContext.cullFace(iWebGLMode);
			this._pCurrentContextStates.CULL_FACE_MODE = iWebGLMode;
		}

		depthFunc(iWebGLMode: uint): void {
			this._pWebGLContext.depthFunc(iWebGLMode);
			this._pCurrentContextStates.DEPTH_FUNC = iWebGLMode;
		}

		depthMask(bWrite: bool): void {
			this._pWebGLContext.depthMask(bWrite);
			this._pCurrentContextStates.DEPTH_WRITEMASK = bWrite;
		}

		depthRange(fZNear: float, fZFar: float): void {
			this._pWebGLContext.depthRange(fZNear, fZFar);
			this._pCurrentContextStates.DEPTH_RANGE[0] = fZNear;
			this._pCurrentContextStates.DEPTH_RANGE[1] = fZFar;
		}

		disable(iWebGLCap: uint): void {
			this._pWebGLContext.disable(iWebGLCap);

			switch(iWebGLCap){
				case GL_CULL_FACE:
					this._pCurrentContextStates.CULL_FACE = false;
					return;
				case GL_BLEND:
					this._pCurrentContextStates.BLEND = false;
					return;
				case GL_DITHER:
					this._pCurrentContextStates.DITHER = false;
					return;
				case GL_STENCIL_TEST:
					this._pCurrentContextStates.STENCIL_TEST = false;
					return;
				case GL_DEPTH_TEST:
					this._pCurrentContextStates.DEPTH_TEST = false;
					return;
				case GL_SCISSOR_TEST:
					this._pCurrentContextStates.SCISSOR_TEST = false;
					return;
				case GL_POLYGON_OFFSET_FILL:
					this._pCurrentContextStates.POLYGON_OFFSET_FILL = false;
					return;
				// case GL_SAMPLE_ALPHA_TO_COVERAGE:
				// 	this._pCurrentContextStates.SAMPLE_ALPHA_TO_COVERAGE = false;
				// 	return;
				// case GL_SAMPLE_COVERAGE:
				// 	this._pCurrentContextStates.SAMPLE_COVERAGE = false;
				// 	return;
			}
		}

		enable(iWebGLCap: uint): void {
			this._pWebGLContext.enable(iWebGLCap);
			
			switch(iWebGLCap){
				case GL_CULL_FACE:
					this._pCurrentContextStates.CULL_FACE = true;
					return;
				case GL_BLEND:
					this._pCurrentContextStates.BLEND = true;
					return;
				case GL_DITHER:
					this._pCurrentContextStates.DITHER = true;
					return;
				case GL_STENCIL_TEST:
					this._pCurrentContextStates.STENCIL_TEST = true;
					return;
				case GL_DEPTH_TEST:
					this._pCurrentContextStates.DEPTH_TEST = true;
					return;
				case GL_SCISSOR_TEST:
					this._pCurrentContextStates.SCISSOR_TEST = true;
					return;
				case GL_POLYGON_OFFSET_FILL:
					this._pCurrentContextStates.POLYGON_OFFSET_FILL = true;
					return;
				// case GL_SAMPLE_ALPHA_TO_COVERAGE:
				// 	this._pCurrentContextStates.SAMPLE_ALPHA_TO_COVERAGE = false;
				// 	return;
				// case GL_SAMPLE_COVERAGE:
				// 	this._pCurrentContextStates.SAMPLE_COVERAGE = false;
				// 	return;
			}
		}

		frontFace(iWebGLMode: uint): void {
			this._pWebGLContext.frontFace(iWebGLMode);
			this._pCurrentContextStates.FRONT_FACE = iWebGLMode;
		}

		getParameter(iWebGLName: uint): any {
			switch(iWebGLName){
				case GL_BLEND:
					return this._pCurrentContextStates.BLEND;
				case GL_BLEND_COLOR:
					return this._pCurrentContextStates.BLEND_COLOR;
				case GL_BLEND_DST_ALPHA:
					return this._pCurrentContextStates.BLEND_DST_ALPHA;
				case GL_BLEND_DST_RGB:
					return this._pCurrentContextStates.BLEND_DST_RGB;
				case GL_BLEND_EQUATION_ALPHA:
					return this._pCurrentContextStates.BLEND_EQUATION_ALPHA;
				case GL_BLEND_EQUATION_RGB:
					return this._pCurrentContextStates.BLEND_EQUATION_RGB;
				case GL_BLEND_SRC_ALPHA:
					return this._pCurrentContextStates.BLEND_SRC_ALPHA;
				case GL_BLEND_SRC_RGB:
					return this._pCurrentContextStates.BLEND_SRC_RGB;
				case GL_COLOR_CLEAR_VALUE:
					return this._pCurrentContextStates.COLOR_CLEAR_VALUE;
				case GL_COLOR_WRITEMASK:
					return this._pCurrentContextStates.COLOR_WRITEMASK;
				case GL_CULL_FACE:
					return this._pCurrentContextStates.CULL_FACE;
				case GL_CULL_FACE_MODE:
					return this._pCurrentContextStates.CULL_FACE_MODE;
				case GL_DEPTH_CLEAR_VALUE:
					return this._pCurrentContextStates.DEPTH_CLEAR_VALUE;
				case GL_DEPTH_FUNC:
					return this._pCurrentContextStates.DEPTH_FUNC;
				case GL_DEPTH_RANGE:
					return this._pCurrentContextStates.DEPTH_RANGE;
				case GL_DEPTH_TEST:
					return this._pCurrentContextStates.DEPTH_TEST;
				case GL_DEPTH_WRITEMASK:
					return this._pCurrentContextStates.DEPTH_WRITEMASK;
				case GL_DITHER:
					return this._pCurrentContextStates.DITHER;
				case GL_FRONT_FACE:
					return this._pCurrentContextStates.FRONT_FACE;
				case GL_LINE_WIDTH:
					return this._pCurrentContextStates.LINE_WIDTH;
				case GL_POLYGON_OFFSET_FACTOR:
					return this._pCurrentContextStates.POLYGON_OFFSET_FACTOR;
				case GL_POLYGON_OFFSET_FILL:
					return this._pCurrentContextStates.POLYGON_OFFSET_FILL;
				case GL_POLYGON_OFFSET_UNITS:
					return this._pCurrentContextStates.POLYGON_OFFSET_UNITS;
				case GL_SAMPLE_BUFFERS:
					return this._pCurrentContextStates.SAMPLE_BUFFERS;
				case GL_SAMPLE_COVERAGE_INVERT:
					return this._pCurrentContextStates.SAMPLE_COVERAGE_INVERT;
				case GL_SAMPLE_COVERAGE_VALUE:
					return this._pCurrentContextStates.SAMPLE_COVERAGE_VALUE;
				case GL_SAMPLES:
					return this._pCurrentContextStates.SAMPLES;
				case GL_SCISSOR_TEST:
					return this._pCurrentContextStates.SCISSOR_TEST;
				case GL_STENCIL_BACK_FAIL:
					return this._pCurrentContextStates.STENCIL_BACK_FAIL;
				case GL_STENCIL_BACK_FUNC:
					return this._pCurrentContextStates.STENCIL_BACK_FUNC;
				case GL_STENCIL_BACK_PASS_DEPTH_FAIL:
					return this._pCurrentContextStates.STENCIL_BACK_PASS_DEPTH_FAIL;
				case GL_STENCIL_BACK_PASS_DEPTH_PASS:
					return this._pCurrentContextStates.STENCIL_BACK_PASS_DEPTH_PASS;
				case GL_STENCIL_BACK_REF:
					return this._pCurrentContextStates.STENCIL_BACK_REF;
				case GL_STENCIL_BACK_VALUE_MASK:
					return this._pCurrentContextStates.STENCIL_BACK_VALUE_MASK;
				case GL_STENCIL_BACK_WRITEMASK:
					return this._pCurrentContextStates.STENCIL_BACK_WRITEMASK;
				case GL_STENCIL_CLEAR_VALUE:
					return this._pCurrentContextStates.STENCIL_CLEAR_VALUE;
				case GL_STENCIL_FAIL:
					return this._pCurrentContextStates.STENCIL_FAIL;
				case GL_STENCIL_FUNC:
					return this._pCurrentContextStates.STENCIL_FUNC;
				case GL_STENCIL_PASS_DEPTH_FAIL:
					return this._pCurrentContextStates.STENCIL_PASS_DEPTH_FAIL;
				case GL_STENCIL_PASS_DEPTH_PASS:
					return this._pCurrentContextStates.STENCIL_PASS_DEPTH_PASS;
				case GL_STENCIL_REF:
					return this._pCurrentContextStates.STENCIL_REF;
				case GL_STENCIL_TEST:
					return this._pCurrentContextStates.STENCIL_TEST;
				case GL_STENCIL_VALUE_MASK:
					return this._pCurrentContextStates.STENCIL_VALUE_MASK;
				case GL_STENCIL_WRITEMASK:
					return this._pCurrentContextStates.STENCIL_WRITEMASK;
				case GL_UNPACK_ALIGNMENT:
					return this._pCurrentContextStates.UNPACK_ALIGNMENT;
				case GL_PACK_ALIGNMENT:
					return this._pCurrentContextStates.PACK_ALIGNMENT;
				default:
					return this._pWebGLContext.getParameter(iWebGLName);
			}
		}

		lineWidth(fWidth: float): void {
			this._pWebGLContext.lineWidth(fWidth);
			this._pCurrentContextStates.LINE_WIDTH = fWidth;
		}

		pixelStorei(iWebGLName: uint, iParam: int): void {
			this._pWebGLContext.pixelStorei(iWebGLName, iParam);

			if(iWebGLName === GL_UNPACK_ALIGNMENT){
				this._pCurrentContextStates.UNPACK_ALIGNMENT = iParam;
			}
			else {
				this._pCurrentContextStates.PACK_ALIGNMENT = iParam;
			}
		}

		polygonOffset(fFactor: float, fUnints: float): void {
			this._pWebGLContext.polygonOffset(fFactor, fUnints);
			this._pCurrentContextStates.POLYGON_OFFSET_FACTOR = fFactor;
			this._pCurrentContextStates.POLYGON_OFFSET_UNITS = fUnints;
		}

		sampleCoverage(fValue: float, bInvert: bool): void {
			this._pWebGLContext.sampleCoverage(fValue, bInvert);
			this._pCurrentContextStates.SAMPLE_COVERAGE_VALUE = fValue;
			this._pCurrentContextStates.SAMPLE_COVERAGE_INVERT = bInvert;
		}

		stencilFunc(iWebGLFunc: uint, iRef: int, iMask: uint): void {
			this._pWebGLContext.stencilFunc(iWebGLFunc, iRef, iMask);
			this._pCurrentContextStates.STENCIL_FUNC = iWebGLFunc;
			this._pCurrentContextStates.STENCIL_REF = iRef;
			this._pCurrentContextStates.STENCIL_VALUE_MASK = iMask;
			this._pCurrentContextStates.STENCIL_BACK_FUNC = iWebGLFunc;
			this._pCurrentContextStates.STENCIL_BACK_REF = iRef;
			this._pCurrentContextStates.STENCIL_BACK_VALUE_MASK = iMask;
		}

		stencilFuncSeparate(iWebGLFace: uint, iWebGLFunc: uint, iRef: int, iMask: uint): void {
			this._pWebGLContext.stencilFuncSeparate(iWebGLFace, iWebGLFunc, iRef, iMask);

			if(iWebGLFace === GL_FRONT_AND_BACK){
				this._pCurrentContextStates.STENCIL_FUNC = iWebGLFunc;
				this._pCurrentContextStates.STENCIL_REF = iRef;
				this._pCurrentContextStates.STENCIL_VALUE_MASK = iMask;
				this._pCurrentContextStates.STENCIL_BACK_FUNC = iWebGLFunc;
				this._pCurrentContextStates.STENCIL_BACK_REF = iRef;
				this._pCurrentContextStates.STENCIL_BACK_VALUE_MASK = iMask;
			}
			else if(iWebGLFace === GL_FRONT){
				this._pCurrentContextStates.STENCIL_FUNC = iWebGLFunc;
				this._pCurrentContextStates.STENCIL_REF = iRef;
				this._pCurrentContextStates.STENCIL_VALUE_MASK = iMask;
			}
			else {
				this._pCurrentContextStates.STENCIL_BACK_FUNC = iWebGLFunc;
				this._pCurrentContextStates.STENCIL_BACK_REF = iRef;
				this._pCurrentContextStates.STENCIL_BACK_VALUE_MASK = iMask;
			}
		}

		stencilMask(iMask: uint): void {
			this._pWebGLContext.stencilMask(iMask);
			this._pCurrentContextStates.STENCIL_WRITEMASK = iMask;
			this._pCurrentContextStates.STENCIL_BACK_WRITEMASK = iMask;
		}

		stencilMaskSeparate(iWebGLFace: uint, iMask: uint): void {
			this._pWebGLContext.stencilMaskSeparate(iWebGLFace, iMask);

			if(iWebGLFace === GL_FRONT_AND_BACK){
				this._pCurrentContextStates.STENCIL_WRITEMASK = iMask;
				this._pCurrentContextStates.STENCIL_BACK_WRITEMASK = iMask;
			}
			else if(iWebGLFace === GL_FRONT){
				this._pCurrentContextStates.STENCIL_WRITEMASK = iMask;
			}
			else {
				this._pCurrentContextStates.STENCIL_BACK_WRITEMASK = iMask;
			}
		}

		stencilOp(iFail: uint, iZFail: uint, iZPass: uint): void {
			this._pWebGLContext.stencilOp(iFail, iZFail, iZPass);

			this._pCurrentContextStates.STENCIL_FAIL = iFail;
			this._pCurrentContextStates.STENCIL_PASS_DEPTH_FAIL = iZFail;
			this._pCurrentContextStates.STENCIL_PASS_DEPTH_PASS = iZPass;
			this._pCurrentContextStates.STENCIL_BACK_FAIL = iFail;
			this._pCurrentContextStates.STENCIL_BACK_PASS_DEPTH_FAIL = iZFail;
			this._pCurrentContextStates.STENCIL_BACK_PASS_DEPTH_PASS = iZPass;
		}

		stencilOpSeparate(iWebGLFace: uint, iFail: uint, iZFail: uint, iZPass: uint): void {
			this._pWebGLContext.stencilOpSeparate(iWebGLFace, iFail, iZFail, iZPass);

			if(iWebGLFace === GL_FRONT_AND_BACK){
				this._pCurrentContextStates.STENCIL_FAIL = iFail;
				this._pCurrentContextStates.STENCIL_PASS_DEPTH_FAIL = iZFail;
				this._pCurrentContextStates.STENCIL_PASS_DEPTH_PASS = iZPass;
				this._pCurrentContextStates.STENCIL_BACK_FAIL = iFail;
				this._pCurrentContextStates.STENCIL_BACK_PASS_DEPTH_FAIL = iZFail;
				this._pCurrentContextStates.STENCIL_BACK_PASS_DEPTH_PASS = iZPass;
			}
			else if(iWebGLFace === GL_FRONT){
				this._pCurrentContextStates.STENCIL_FAIL = iFail;
				this._pCurrentContextStates.STENCIL_PASS_DEPTH_FAIL = iZFail;
				this._pCurrentContextStates.STENCIL_PASS_DEPTH_PASS = iZPass;
			}
			else {
				this._pCurrentContextStates.STENCIL_BACK_FAIL = iFail;
				this._pCurrentContextStates.STENCIL_BACK_PASS_DEPTH_FAIL = iZFail;
				this._pCurrentContextStates.STENCIL_BACK_PASS_DEPTH_PASS = iZPass;
			}
		}

		_beginRender(): void {
			this.enable(GL_SCISSOR_TEST);
			this.disable(GL_BLEND);
		}

		private _time: uint[] = [0, 0, 0, 0, 0, 0, 0, 0];

		_printTime(): void {
			var _iTotalTime: uint = 0;
			for(var i: uint = 0; i < this._time.length; i++){
				_iTotalTime += this._time[i];
			}

			var _pPrinted: string[] = new Array(this._time.length);

			for(var i: uint = 0; i < this._time.length; i++){
				_pPrinted[i] = (this._time[i]/ _iTotalTime).toFixed(2);
			}

			LOG(_pPrinted.join("% "));
			LOG(this._time.join("ms "))			
		}

		_renderEntry(pEntry: IRenderEntry): void {
			var deltaTime: uint = 0;

			// deltaTime = Date.now();

			var pViewport: render.Viewport = <render.Viewport>pEntry.viewport;
			var pRenderTarget: IRenderTarget = (<render.Viewport>pViewport).getTarget();
			var pInput: IShaderInput = pEntry.input;
			var pMaker: fx.Maker = <fx.Maker>pEntry.maker;

			// deltaTime = Date.now() - deltaTime;
			// this._time[0] += deltaTime;
#ifdef __VIEW_INTERNALS__
			console.log(pEntry);
			// console.log(pEntry.bufferMap.toString());
#endif
			
			//--------------------------

			// deltaTime = Date.now();
			if(!isNull(pEntry.renderTarget)){
				this._setRenderTarget(pEntry.renderTarget);
				this.lockRenderTarget();

				this._setViewportForRender(pViewport);

				this.unlockRenderTarget();
			}
			else {
				this._setViewportForRender(pViewport);
			}

			// this.forceUpdateContextRenderStates();
			var isNeedPopRenderStates: bool = this.applyInputRenderStates(pInput.renderStates);

			// if(isDef(pMaker["_pShaderUniformInfoMap"]["fKrESun"])){
			// 	// LOG("1");
			// 	this._pWebGLContext.depthMask(false);
			// }
			// deltaTime = Date.now() - deltaTime;
			// this._time[1] += deltaTime;

			//-----------------------

			// deltaTime = Date.now();

			var pWebGLProgram: WebGLShaderProgram = <WebGLShaderProgram>(pMaker).shaderProgram;

			this.useWebGLProgram(pWebGLProgram.getWebGLProgram());

			this.enableWebGLVertexAttribs(pWebGLProgram.totalAttributes);

			// deltaTime = Date.now() - deltaTime;
			// this._time[2] += deltaTime;

			//-----------------

			// deltaTime = Date.now();

			var pAttribLocations: IntMap = pWebGLProgram._getActiveAttribLocations();
			var pAttributeInfo: IAFXBaseAttrInfo[] = pMaker.attributeInfo;

			var pBufferMap: IBufferMap = pEntry.bufferMap;

			// deltaTime = Date.now() - deltaTime;
			// this._time[3] += deltaTime;

			//-----------------

			// deltaTime = Date.now();

			if(!isNull(pBufferMap.index)){
				this.bindWebGLBuffer(GL_ELEMENT_ARRAY_BUFFER, (<WebGLIndexBuffer>pBufferMap.index.buffer).getWebGLBuffer());
			}

			// deltaTime = Date.now() - deltaTime;
			// this._time[4] += deltaTime;

			//---------
			
			
			// deltaTime = Date.now();
			
			for(var i: uint = 0; i < pAttributeInfo.length; i++){
				var sAttrName: string = pAttributeInfo[i].name;
				var sAttrSemantic: string = pAttributeInfo[i].semantic;

				// if(isNull(sAttrSemantic)){
				// 	continue;
				// }

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

				this.bindWebGLBuffer(GL_ARRAY_BUFFER, (<WebGLVertexBuffer>pData.buffer).getWebGLBuffer());
				this._pWebGLContext.vertexAttribPointer(iLoc,
                                    pVertexElement.count,
                                    pVertexElement.type,
                                    false,
                                    pData.stride,
                                    pVertexElement.offset);
			}

			// deltaTime = Date.now() - deltaTime;
			// this._time[5] += deltaTime;

			//------------

			// deltaTime = Date.now();

			var pUniformNames: string[] = pMaker.uniformNames;

			for (var i: uint = 0; i < pUniformNames.length; i++) {
				pMaker.setUniform(i, pInput.uniforms[i]);
			}
			// deltaTime = Date.now() - deltaTime;
			// this._time[6] += deltaTime;

			//---------
			
			// deltaTime = Date.now();
			pEntry.bufferMap._draw();
			// deltaTime = Date.now() - deltaTime;
			// this._time[7] += deltaTime;
			// LOG(pEntry.bufferMap.toString())
			
			// if(isDef(pMaker["_pShaderUniformInfoMap"]["fKrESun"])){
			// 	this._pWebGLContext.depthMask(true);
			// }
			
			if(isNeedPopRenderStates){
				this._popRenderStates(false);
			}
		}

		_endRender(): void {
			this.disable(GL_SCISSOR_TEST);
		}

		_setViewport(pViewport: IViewport): void {
			// if(true){
			// 	return;
			// }

			if(isNull(pViewport)){
				this._pActiveViewport = null;
				this._setRenderTarget(null);
				return;
			}

			var isViewportUpdate: bool = pViewport !== this._pActiveViewport || pViewport.isUpdated();
			var isRenderTargetUpdate: bool = pViewport.getTarget() !== this._pActiveRenderTarget;

			if(isViewportUpdate || isRenderTargetUpdate) {
				var pTarget: IRenderTarget = pViewport.getTarget();

				this._setRenderTarget(pTarget);
				
				if(isViewportUpdate){
					this._pActiveViewport = pViewport;

					var x: uint = pViewport.actualLeft,
						y: uint = pViewport.actualTop,
						w: uint = pViewport.actualWidth,
						h: uint = pViewport.actualHeight;

					this._pWebGLContext.viewport(x, y, w, h);
					this._pWebGLContext.scissor(x, y, w, h);
					// if(w !== 2048){
					// 	LOG(x, y, w, h, pViewport.getGuid());
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
        	
        	if(this.isLockRenderTarget()){
        		return;
        	}

        	this._pActiveRenderTarget = pTarget;

        	if(!isNull(pTarget)){
        		var pFrameBuffer: WebGLInternalFrameBuffer = pTarget.getCustomAttribute("FBO");
        		if(!isNull(pFrameBuffer)){
        			pFrameBuffer._bind();
        		}
        		else {
        			this.bindWebGLFramebuffer(GL_FRAMEBUFFER, null);
        		}
        	}
        }

        _setCullingMode(eMode: ECullingMode): void {
        	// if(true){
        	// 	return;
        	// }
        	var iWebGLCullMode: uint = 0;

        	switch(eMode){
        		case ECullingMode.NONE:
        			this.disable(GL_CULL_FACE);
        			return;

        		default:
        		case ECullingMode.CLOCKWISE:
        			iWebGLCullMode = GL_FRONT;
        			break;

        		case ECullingMode.ANTICLOCKWISE:
        			iWebGLCullMode = GL_BACK;
        			break;
        	}

        	this.enable(GL_CULL_FACE);
        	this.cullFace(iWebGLCullMode);
        }

        _setDepthBufferParams(bDepthTest: bool, bDepthWrite: bool, 
        					  eDepthFunction: ECompareFunction, fClearDepth?: float = 1.): void {
        	// if(true){
        	// 	return;
        	// }
        	if(bDepthTest){
        		this.clearDepth(fClearDepth);
        		this.enable(GL_DEPTH_TEST);
        	}
        	else {
        		this.disable(GL_DEPTH_TEST);
        	}

        	var iWebGLDepthFunc: uint = this.convertCompareFunction(eDepthFunction);

        	this.depthMask(bDepthWrite); 
        	this.depthFunc(iWebGLDepthFunc);
        }
		
		isDebug(): bool {
			return !isNull(this._pWebGLInternalContext);
		}

		inline getHTMLCanvas(): HTMLCanvasElement {
			return this._pCanvas;
		}

		inline getWebGLContext(): WebGLRenderingContext {
			return this._pWebGLContext;
		}


		/** Buffer Objects. */
		inline bindWebGLBuffer(eTarget: uint, pBuffer: WebGLBuffer): void {
			this._pWebGLContext.bindBuffer(eTarget, pBuffer);
		}

		inline createWebGLBuffer(): WebGLBuffer {
			return this._pWebGLContext.createBuffer();
		}

		inline deleteWebGLBuffer(pBuffer: WebGLBuffer): void {
			this._pWebGLContext.deleteBuffer(pBuffer);
		}
		
		/** Texture Objects. */
		inline bindWebGLTexture(eTarget: uint, pTexture: WebGLTexture): void {
			//if(this._pTextureSlotList[this._iCurrentTextureSlot] !== pTexture){
				this._pWebGLContext.bindTexture(eTarget, pTexture);
				this._pTextureSlotList[this._iCurrentTextureSlot] = pTexture;
			//}
		}

		inline activateWebGLTexture(iWebGLSlot: int): void {
			this._pWebGLContext.activeTexture(iWebGLSlot);
			// this._iCurrentTextureSlot = iWebGLSlot - GL_TEXTURE0;
		}

		activateWebGLTextureInAutoSlot(eTarget: uint, pTexture: WebGLTexture): uint {

			// var iSlot: uint = this._pTextureSlotList.indexOf(pTexture);

			// if(iSlot === -1) {
				var iSlot = this._iNextTextureSlot;

				this._iNextTextureSlot++;

				if(this._iNextTextureSlot === maxTextureImageUnits){
					this._iNextTextureSlot = 0;
				}
				
				this.activateWebGLTexture(GL_TEXTURE0 + iSlot);
				this.bindWebGLTexture(eTarget, pTexture);
			// }
			// else {
			// 	this.activateWebGLTexture(GL_TEXTURE0 + iSlot);
			// }

			return iSlot;			
		}

		// inline getFreeWebGLTextureSlot(): int {
		// 	return this._getNextTextureSlot() + GL_TEXTURE0;
		// }

		// inline getNextTextureSlot(): int {
		// 	return this._iSlot === (maxTextureImageUnits - 1) ? (this._iSlot = 0) : (++this._iSlot);
		// }

		// inline getTextureSlot(): int {
		// 	return this._iSlot - 1;
		// }

		inline createWebGLTexture(): WebGLTexture {
			return this._pWebGLContext.createTexture();
		}

		inline deleteWebGLTexture(pTexture: WebGLTexture): void {
			this._pWebGLContext.deleteTexture(pTexture);
		}

		/** Framebuffer Objects */
		inline createWebGLFramebuffer(): WebGLFramebuffer {
			
			if (this._pWebGLFramebufferList.length === 0) {
				CRITICAL("WebGL framebuffer limit exidit");
			}

			return this._pWebGLFramebufferList.pop();
		}

		inline bindWebGLFramebuffer(eTarget: uint, pBuffer: WebGLFramebuffer): void {
			this._pWebGLContext.bindFramebuffer(eTarget, pBuffer);
			//this._pCurrentContextStates.framebuffer = pBuffer;
		}

		inline bindWebGLFramebufferTexture2D(eTarget: uint, eAttachment:uint,eTexTarget:uint, pTexture: WebGLTexture, iMipLevel?:uint=0): void {
			this._pWebGLContext.framebufferTexture2D(eTarget, eAttachment, eTexTarget, pTexture, iMipLevel)
		}

		inline deleteWebGLFramebuffer(pBuffer: WebGLFramebuffer): void {
			this._pWebGLFramebufferList.push(pBuffer);
		}

		/** Renderbuffer Objects */
		inline createWebGLRenderbuffer(): WebGLRenderbuffer {
			return this._pWebGLContext.createRenderbuffer();
		}

		inline bindWebGLRenderbuffer(eTarget: uint, pBuffer: WebGLRenderbuffer): void {
			this._pWebGLContext.bindRenderbuffer(eTarget, pBuffer);
		}

		inline deleteWebGLRenderbuffer(pBuffer: WebGLRenderbuffer): void {
			this._pWebGLContext.deleteRenderbuffer(pBuffer);
		}


		inline createWebGLProgram(): WebGLProgram {
			return this._pWebGLContext.createProgram();
		}

		inline deleteWebGLProgram(pProgram: WebGLProgram): void {
			this._pWebGLContext.deleteProgram(pProgram);
		}

		inline useWebGLProgram(pProgram: WebGLProgram): void {
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
			var i:uint = 0;
			for(i = 0; i < this._nActiveAttributes; i++) {
				this._pWebGLContext.disableVertexAttribArray(i);	
			}

			this._nActiveAttributes = 0;		
		}

		getDefaultCanvas(): ICanvas3d {
			return this._pDefaultCanvas;
		}


		clearFrameBuffer(iBuffers: int, cColor: IColor, fDepth: float, iStencil: uint): void {
			var bScissorTestEnable: bool = this.getParameter(GL_SCISSOR_TEST);

			this.enable(GL_SCISSOR_TEST);

			var iWebGLFlag: int = 0;
			var bOldDepthWrite: bool = this.getParameter(GL_DEPTH_WRITEMASK);

			if(iBuffers & EFrameBufferTypes.COLOR){
				iWebGLFlag |= GL_COLOR_BUFFER_BIT;
				this._pWebGLContext.clearColor(cColor.r, cColor.g, cColor.b, cColor.a);
			}

			if(iBuffers & EFrameBufferTypes.DEPTH){
				iWebGLFlag |= GL_DEPTH_BUFFER_BIT;

				if(!bOldDepthWrite){
					this._pWebGLContext.depthMask(true);
				}

				this._pWebGLContext.clearDepth(fDepth);
			}

			if(iBuffers & EFrameBufferTypes.STENCIL){
				iWebGLFlag |= GL_STENCIL_BUFFER_BIT;

				this._pWebGLContext.stencilMask(0xFFFFFFFF);
				this._pWebGLContext.clearStencil(iStencil);
			}

			this._pWebGLContext.clear(iWebGLFlag);

			if (!bOldDepthWrite && (iBuffers & EFrameBufferTypes.DEPTH)) {
	            this._pWebGLContext.depthMask(false);
        	}

        	if(!bScissorTestEnable){
        		this.disable(GL_SCISSOR_TEST);
        	}
		}

		inline _disableTextureUnitsFrom(iUnit: uint): void {
			for(var i: int = iUnit; i < this._pTextureSlotList.length; i++) {
				this._pTextureSlotList[i] = null;				
			}
		}

		_pushRenderStates(): void {
			this._pRenderStatesPool.push(this._pCurrentContextStates);

			this._pCurrentContextStates = WebGLRenderer.copyWebGLContextStates(this.getFreeRenderStates(), this._pCurrentContextStates);
		}

		_popRenderStates(isForce: bool): void {
			if(this._pRenderStatesPool.length === 0) {
				debug_warning("Can not pop context render states. Pool of context is empty.");
			}

			this._pFreeRenderStatesPool.push(this._pCurrentContextStates);

			if(isForce){
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

			if (pRestoreStates.BLEND !== pStatesFrom.BLEND){
				if(pRestoreStates.BLEND) {
					this._pWebGLContext.enable(GL_BLEND);
				}
				else {
					this._pWebGLContext.disable(GL_BLEND);
				}
			}

			if (pRestoreStates.BLEND_EQUATION_RGB !== pStatesFrom.BLEND_EQUATION_RGB ||
				pRestoreStates.BLEND_EQUATION_ALPHA !== pStatesFrom.BLEND_EQUATION_ALPHA) {

				if(pRestoreStates.BLEND_EQUATION_RGB === pRestoreStates.BLEND_EQUATION_ALPHA) {
					this._pWebGLContext.blendEquation(pRestoreStates.BLEND_EQUATION_RGB);
				}
				else {
					this._pWebGLContext.blendEquationSeparate(pRestoreStates.BLEND_EQUATION_RGB, 
															  pRestoreStates.BLEND_EQUATION_ALPHA);
				}
			}

			if (pRestoreStates.BLEND_DST_RGB !== pStatesFrom.BLEND_DST_RGB ||
				pRestoreStates.BLEND_DST_ALPHA !== pStatesFrom.BLEND_DST_ALPHA ||
				pRestoreStates.BLEND_SRC_RGB !== pStatesFrom.BLEND_SRC_RGB ||
				pRestoreStates.BLEND_SRC_ALPHA !== pStatesFrom.BLEND_SRC_ALPHA) {

				if (pRestoreStates.BLEND_DST_RGB === pRestoreStates.BLEND_DST_ALPHA &&
					pRestoreStates.BLEND_SRC_RGB === pRestoreStates.BLEND_SRC_ALPHA) {

					this._pWebGLContext.blendFunc(pRestoreStates.BLEND_SRC_RGB, pRestoreStates.BLEND_DST_RGB);
				}
				else {
					this._pWebGLContext.blendFuncSeparate(pRestoreStates.BLEND_SRC_RGB, pRestoreStates.BLEND_DST_RGB,
														  pRestoreStates.BLEND_SRC_ALPHA, pRestoreStates.BLEND_DST_ALPHA);
				}
			}
		}

		private restoreCullStates(pStatesFrom: IWebGLContextStates): void {
			var pRestoreStates: IWebGLContextStates = this._pCurrentContextStates;

			if (pRestoreStates.CULL_FACE !== pStatesFrom.CULL_FACE){
				if(pRestoreStates.CULL_FACE) {
					this._pWebGLContext.enable(GL_CULL_FACE);
				}
				else {
					this._pWebGLContext.disable(GL_CULL_FACE);
				}
			}

			if (pRestoreStates.CULL_FACE_MODE !== pStatesFrom.CULL_FACE_MODE){
				this._pWebGLContext.cullFace(pRestoreStates.CULL_FACE_MODE);
			}
		}

		private restoreColorStates(pStatesFrom: IWebGLContextStates): void {
			var pRestoreStates: IWebGLContextStates = this._pCurrentContextStates;

			if (pRestoreStates.COLOR_CLEAR_VALUE[0] !== pStatesFrom.COLOR_CLEAR_VALUE[0] ||
				pRestoreStates.COLOR_CLEAR_VALUE[1] !== pStatesFrom.COLOR_CLEAR_VALUE[1] ||
				pRestoreStates.COLOR_CLEAR_VALUE[2] !== pStatesFrom.COLOR_CLEAR_VALUE[2] ||
				pRestoreStates.COLOR_CLEAR_VALUE[3] !== pStatesFrom.COLOR_CLEAR_VALUE[3]){

				this._pWebGLContext.clearColor(pRestoreStates.COLOR_CLEAR_VALUE[0],
											   pRestoreStates.COLOR_CLEAR_VALUE[1],
											   pRestoreStates.COLOR_CLEAR_VALUE[2],
											   pRestoreStates.COLOR_CLEAR_VALUE[3]);
			}

			if (pRestoreStates.COLOR_WRITEMASK[0] !== pStatesFrom.COLOR_WRITEMASK[0] ||
				pRestoreStates.COLOR_WRITEMASK[1] !== pStatesFrom.COLOR_WRITEMASK[1] ||
				pRestoreStates.COLOR_WRITEMASK[2] !== pStatesFrom.COLOR_WRITEMASK[2] ||
				pRestoreStates.COLOR_WRITEMASK[3] !== pStatesFrom.COLOR_WRITEMASK[3]){
				
				this._pWebGLContext.colorMask(pRestoreStates.COLOR_WRITEMASK[0],
											  pRestoreStates.COLOR_WRITEMASK[1],
											  pRestoreStates.COLOR_WRITEMASK[2],
											  pRestoreStates.COLOR_WRITEMASK[3]);
			}
		}

		private restoreDepthStates(pStatesFrom: IWebGLContextStates): void {
			var pRestoreStates: IWebGLContextStates = this._pCurrentContextStates;

			if (pRestoreStates.DEPTH_TEST !== pStatesFrom.DEPTH_TEST){
				if(pRestoreStates.DEPTH_TEST) {
					this._pWebGLContext.enable(GL_DEPTH_TEST);
				}
				else {
					this._pWebGLContext.disable(GL_DEPTH_TEST);
				}
			}

			if (pRestoreStates.DEPTH_CLEAR_VALUE !== pStatesFrom.DEPTH_CLEAR_VALUE){
				this._pWebGLContext.clearDepth(pRestoreStates.DEPTH_CLEAR_VALUE);
			}

			if (pRestoreStates.DEPTH_FUNC !== pStatesFrom.DEPTH_FUNC){
				this._pWebGLContext.depthFunc(pRestoreStates.DEPTH_FUNC);
			}

			if (pRestoreStates.DEPTH_WRITEMASK !== pStatesFrom.DEPTH_WRITEMASK){
				this._pWebGLContext.depthMask(pRestoreStates.DEPTH_WRITEMASK);
			}

			if (pRestoreStates.DEPTH_RANGE[0] !== pStatesFrom.DEPTH_RANGE[0] ||
				pRestoreStates.DEPTH_RANGE[1] !== pStatesFrom.DEPTH_RANGE[1]){
				this._pWebGLContext.depthRange(pRestoreStates.DEPTH_RANGE[0], pRestoreStates.DEPTH_RANGE[1]);
			}
		}

		private restoreDitherStates(pStatesFrom: IWebGLContextStates): void {
			var pRestoreStates: IWebGLContextStates = this._pCurrentContextStates;

			if (pRestoreStates.DITHER !== pStatesFrom.DITHER){
				if(pRestoreStates.DITHER) {
					this._pWebGLContext.enable(GL_DITHER);
				}
				else {
					this._pWebGLContext.disable(GL_DITHER);
				}
			}
		}

		private restoreFrontFaceStates(pStatesFrom: IWebGLContextStates): void {
			var pRestoreStates: IWebGLContextStates = this._pCurrentContextStates;

			if (pRestoreStates.FRONT_FACE !== pStatesFrom.FRONT_FACE){
				this._pWebGLContext.frontFace(pRestoreStates.FRONT_FACE);
			}
		}

		private restorePolygonStates(pStatesFrom: IWebGLContextStates): void {
			var pRestoreStates: IWebGLContextStates = this._pCurrentContextStates;

			if (pRestoreStates.POLYGON_OFFSET_FILL !== pStatesFrom.POLYGON_OFFSET_FILL){
				if(pRestoreStates.POLYGON_OFFSET_FILL) {
					this._pWebGLContext.enable(GL_POLYGON_OFFSET_FILL);
				}
				else {
					this._pWebGLContext.disable(GL_POLYGON_OFFSET_FILL);
				}
			}

			if (pRestoreStates.POLYGON_OFFSET_FACTOR !== pStatesFrom.POLYGON_OFFSET_FACTOR ||
				pRestoreStates.POLYGON_OFFSET_UNITS !== pStatesFrom.POLYGON_OFFSET_UNITS){

				this._pWebGLContext.polygonOffset(pRestoreStates.POLYGON_OFFSET_FACTOR, pRestoreStates.POLYGON_OFFSET_UNITS);
			}

		}

		private restoreSampleStates(pStatesFrom: IWebGLContextStates): void {
			var pRestoreStates: IWebGLContextStates = this._pCurrentContextStates;

			if (pRestoreStates.SAMPLE_COVERAGE_VALUE !== pStatesFrom.SAMPLE_COVERAGE_VALUE ||
				pRestoreStates.SAMPLE_COVERAGE_INVERT !== pStatesFrom.SAMPLE_COVERAGE_INVERT){

				this._pWebGLContext.sampleCoverage(pRestoreStates.SAMPLE_COVERAGE_VALUE, pRestoreStates.SAMPLE_COVERAGE_INVERT);
			}
		}

		private restoreScissorStates(pStatesFrom: IWebGLContextStates): void {
			var pRestoreStates: IWebGLContextStates = this._pCurrentContextStates;

			if (pRestoreStates.SCISSOR_TEST !== pStatesFrom.SCISSOR_TEST){
				if(pRestoreStates.SCISSOR_TEST) {
					this._pWebGLContext.enable(GL_SCISSOR_TEST);
				}
				else {
					this._pWebGLContext.disable(GL_SCISSOR_TEST);
				}
			}
		}

		private restoreStencilStates(pStatesFrom: IWebGLContextStates): void {
			var pRestoreStates: IWebGLContextStates = this._pCurrentContextStates;

			if (pRestoreStates.STENCIL_TEST !== pStatesFrom.STENCIL_TEST){
				if(pRestoreStates.STENCIL_TEST) {
					this._pWebGLContext.enable(GL_STENCIL_TEST);
				}
				else {
					this._pWebGLContext.disable(GL_STENCIL_TEST);
				}
			}

			if(pRestoreStates.STENCIL_CLEAR_VALUE !== pStatesFrom.STENCIL_CLEAR_VALUE){
				this._pWebGLContext.clearStencil(pRestoreStates.STENCIL_CLEAR_VALUE)
			}

			if (pRestoreStates.STENCIL_FUNC !== pStatesFrom.STENCIL_FUNC ||
				pRestoreStates.STENCIL_REF !== pStatesFrom.STENCIL_REF ||
				pRestoreStates.STENCIL_VALUE_MASK !== pStatesFrom.STENCIL_VALUE_MASK ||
				pRestoreStates.STENCIL_BACK_FUNC !== pStatesFrom.STENCIL_BACK_FUNC ||
				pRestoreStates.STENCIL_BACK_REF !== pStatesFrom.STENCIL_BACK_REF ||
				pRestoreStates.STENCIL_BACK_VALUE_MASK !== pStatesFrom.STENCIL_BACK_VALUE_MASK) {

				if (pRestoreStates.STENCIL_FUNC === pRestoreStates.STENCIL_BACK_FUNC ||
					pRestoreStates.STENCIL_REF === pRestoreStates.STENCIL_BACK_REF ||
					pRestoreStates.STENCIL_VALUE_MASK === pRestoreStates.STENCIL_BACK_VALUE_MASK) {

					this._pWebGLContext.stencilFunc(pRestoreStates.STENCIL_FUNC, pRestoreStates.STENCIL_REF, pRestoreStates.STENCIL_VALUE_MASK);
				}
				else {
					this._pWebGLContext.stencilFuncSeparate(GL_FRONT, 
							pRestoreStates.STENCIL_FUNC, pRestoreStates.STENCIL_REF, pRestoreStates.STENCIL_VALUE_MASK);

					this._pWebGLContext.stencilFuncSeparate(GL_BACK, 
							pRestoreStates.STENCIL_BACK_FUNC, pRestoreStates.STENCIL_BACK_REF, pRestoreStates.STENCIL_BACK_VALUE_MASK);
				}
			}

			if (pRestoreStates.STENCIL_WRITEMASK !== pStatesFrom.STENCIL_WRITEMASK ||
				pRestoreStates.STENCIL_BACK_WRITEMASK !== pStatesFrom.STENCIL_BACK_WRITEMASK){

				if(pRestoreStates.STENCIL_WRITEMASK === pRestoreStates.STENCIL_BACK_WRITEMASK){
					this._pWebGLContext.stencilMask(pRestoreStates.STENCIL_WRITEMASK);
				}
				else {
					this._pWebGLContext.stencilMaskSeparate(GL_FRONT, pRestoreStates.STENCIL_WRITEMASK);
					this._pWebGLContext.stencilMaskSeparate(GL_BACK, pRestoreStates.STENCIL_WRITEMASK);
				}
			}

			if (pRestoreStates.STENCIL_FAIL !== pStatesFrom.STENCIL_FAIL ||
				pRestoreStates.STENCIL_PASS_DEPTH_FAIL !== pStatesFrom.STENCIL_PASS_DEPTH_FAIL ||
				pRestoreStates.STENCIL_PASS_DEPTH_PASS !== pStatesFrom.STENCIL_PASS_DEPTH_PASS ||
				pRestoreStates.STENCIL_BACK_FAIL !== pStatesFrom.STENCIL_BACK_FAIL ||
				pRestoreStates.STENCIL_BACK_PASS_DEPTH_FAIL !== pStatesFrom.STENCIL_BACK_PASS_DEPTH_FAIL ||
				pRestoreStates.STENCIL_BACK_PASS_DEPTH_PASS !== pStatesFrom.STENCIL_BACK_PASS_DEPTH_PASS) {

				if (pRestoreStates.STENCIL_FAIL === pRestoreStates.STENCIL_BACK_FAIL ||
					pRestoreStates.STENCIL_PASS_DEPTH_FAIL === pRestoreStates.STENCIL_BACK_PASS_DEPTH_FAIL ||
					pRestoreStates.STENCIL_PASS_DEPTH_PASS === pRestoreStates.STENCIL_BACK_PASS_DEPTH_PASS) {

					this._pWebGLContext.stencilOp(pRestoreStates.STENCIL_FAIL, pRestoreStates.STENCIL_PASS_DEPTH_FAIL, pRestoreStates.STENCIL_PASS_DEPTH_PASS);
				}
				else {
					this._pWebGLContext.stencilOpSeparate(GL_FRONT,
							pRestoreStates.STENCIL_FAIL, pRestoreStates.STENCIL_PASS_DEPTH_FAIL, pRestoreStates.STENCIL_PASS_DEPTH_PASS);

					this._pWebGLContext.stencilOpSeparate(GL_BACK,
							pRestoreStates.STENCIL_BACK_FAIL, pRestoreStates.STENCIL_BACK_PASS_DEPTH_FAIL, pRestoreStates.STENCIL_BACK_PASS_DEPTH_PASS);
				}
			}

		}

		private restorePackStates(pStatesFrom: IWebGLContextStates): void {
			var pRestoreStates: IWebGLContextStates = this._pCurrentContextStates;

			if(pRestoreStates.UNPACK_ALIGNMENT !== pStatesFrom.UNPACK_ALIGNMENT){
				this._pWebGLContext.pixelStorei(GL_UNPACK_ALIGNMENT, pRestoreStates.UNPACK_ALIGNMENT);
			}

			if(pRestoreStates.PACK_ALIGNMENT !== pStatesFrom.PACK_ALIGNMENT){
				this._pWebGLContext.pixelStorei(GL_PACK_ALIGNMENT, pRestoreStates.PACK_ALIGNMENT);
			}
		}

		private inline forceUpdateContextRenderStates(): void {
			WebGLRenderer.initStatesFromWebGLContext(this._pCurrentContextStates, this._pWebGLContext);
		}

		private getFreeRenderStates(): IWebGLContextStates {
			if(this._pFreeRenderStatesPool.length > 0){
				return this._pFreeRenderStatesPool.pop();
			}
			else {
				return WebGLRenderer.createWebGLContextStates();
			}
		}

		private applyInputRenderStates(pStates: IRenderStateMap): bool {
			var isStatesChanged: bool = false;
			var iWebGLValue: uint = 0;

			if (pStates[ERenderStates.BLENDENABLE] !== ERenderStateValues.UNDEF){
				
				iWebGLValue = this.convertRenderStateValue(pStates[ERenderStates.BLENDENABLE]);
				if(this._pCurrentContextStates.BLEND !== !!iWebGLValue){
					
					!isStatesChanged && this._pushRenderStates();				
					isStatesChanged = true;
					this._pCurrentContextStates.BLEND = !!iWebGLValue;

					if(this._pCurrentContextStates.BLEND){
						this._pWebGLContext.enable(GL_BLEND);
					}
					else {
						this._pWebGLContext.disable(GL_BLEND);
					}
				}

			}

			if (pStates[ERenderStates.CULLFACEENABLE] !== ERenderStateValues.UNDEF){
				
				iWebGLValue = this.convertRenderStateValue(pStates[ERenderStates.CULLFACEENABLE]);
				if(this._pCurrentContextStates.CULL_FACE !== !!iWebGLValue){
					
					!isStatesChanged && this._pushRenderStates();				
					isStatesChanged = true;
					this._pCurrentContextStates.CULL_FACE = !!iWebGLValue;

					if(this._pCurrentContextStates.CULL_FACE){
						this._pWebGLContext.enable(GL_CULL_FACE);
					}
					else {
						this._pWebGLContext.disable(GL_CULL_FACE);
					}
				}
			}

			if (pStates[ERenderStates.ZENABLE] !== ERenderStateValues.UNDEF){
				
				iWebGLValue = this.convertRenderStateValue(pStates[ERenderStates.ZENABLE]);
				if(this._pCurrentContextStates.DEPTH_TEST !== !!iWebGLValue){
					
					!isStatesChanged && this._pushRenderStates();				
					isStatesChanged = true;
					this._pCurrentContextStates.DEPTH_TEST = !!iWebGLValue;

					if(this._pCurrentContextStates.DEPTH_TEST){
						this._pWebGLContext.enable(GL_DEPTH_TEST);
					}
					else {
						this._pWebGLContext.disable(GL_DEPTH_TEST);
					}
				}
			}

			if (pStates[ERenderStates.DITHERENABLE] !== ERenderStateValues.UNDEF){
				
				iWebGLValue = this.convertRenderStateValue(pStates[ERenderStates.DITHERENABLE]);
				if(this._pCurrentContextStates.DITHER !== !!iWebGLValue){
					
					!isStatesChanged && this._pushRenderStates();				
					isStatesChanged = true;
					this._pCurrentContextStates.DITHER = !!iWebGLValue;

					if(this._pCurrentContextStates.DITHER){
						this._pWebGLContext.enable(GL_DITHER);
					}
					else {
						this._pWebGLContext.disable(GL_DITHER);
					}
				}
			}

			if (pStates[ERenderStates.ZWRITEENABLE] !== ERenderStateValues.UNDEF){

				!isStatesChanged && this._pushRenderStates();				
				isStatesChanged = true;
				this._pCurrentContextStates.DEPTH_WRITEMASK = this.convertRenderStateValue(pStates[ERenderStates.ZWRITEENABLE]);

				this._pWebGLContext.depthMask(this._pCurrentContextStates.DEPTH_WRITEMASK);
			}

			if (pStates[ERenderStates.SCISSORTESTENABLE] !== ERenderStateValues.UNDEF){
				
				iWebGLValue = this.convertRenderStateValue(pStates[ERenderStates.SCISSORTESTENABLE]);
				if(this._pCurrentContextStates.SCISSOR_TEST !== !!iWebGLValue){
					
					!isStatesChanged && this._pushRenderStates();				
					isStatesChanged = true;
					this._pCurrentContextStates.SCISSOR_TEST = !!iWebGLValue;

					if(this._pCurrentContextStates.SCISSOR_TEST){
						this._pWebGLContext.enable(GL_SCISSOR_TEST);
					}
					else {
						this._pWebGLContext.disable(GL_SCISSOR_TEST);
					}
				}
			}

			if (pStates[ERenderStates.STENCILTESTENABLE] !== ERenderStateValues.UNDEF){
				
				iWebGLValue = this.convertRenderStateValue(pStates[ERenderStates.STENCILTESTENABLE]);
				if(this._pCurrentContextStates.STENCIL_TEST !== !!iWebGLValue){
					
					!isStatesChanged && this._pushRenderStates();				
					isStatesChanged = true;
					this._pCurrentContextStates.STENCIL_TEST = !!iWebGLValue;

					if(this._pCurrentContextStates.STENCIL_TEST){
						this._pWebGLContext.enable(GL_STENCIL_TEST);
					}
					else {
						this._pWebGLContext.disable(GL_STENCIL_TEST);
					}
				}
			}

			if (pStates[ERenderStates.POLYGONOFFSETFILLENABLE] !== ERenderStateValues.UNDEF){
				
				iWebGLValue = this.convertRenderStateValue(pStates[ERenderStates.POLYGONOFFSETFILLENABLE]);
				if(this._pCurrentContextStates.POLYGON_OFFSET_FILL !== !!iWebGLValue){
					
					!isStatesChanged && this._pushRenderStates();				
					isStatesChanged = true;
					this._pCurrentContextStates.POLYGON_OFFSET_FILL = !!iWebGLValue;

					if(this._pCurrentContextStates.POLYGON_OFFSET_FILL){
						this._pWebGLContext.enable(GL_POLYGON_OFFSET_FILL);
					}
					else {
						this._pWebGLContext.disable(GL_POLYGON_OFFSET_FILL);
					}
				}
			}

			if(pStates[ERenderStates.CULLFACE] !== ERenderStateValues.UNDEF) {
				
				iWebGLValue = this.convertRenderStateValue(pStates[ERenderStates.CULLFACE]);
				if(this._pCurrentContextStates.CULL_FACE_MODE !== iWebGLValue){

					!isStatesChanged && this._pushRenderStates();				
					isStatesChanged = true;
					this._pCurrentContextStates.CULL_FACE_MODE = iWebGLValue;

					this._pWebGLContext.cullFace(this._pCurrentContextStates.CULL_FACE_MODE);
				}
			}

			if(pStates[ERenderStates.FRONTFACE] !== ERenderStateValues.UNDEF) {
				
				iWebGLValue = this.convertRenderStateValue(pStates[ERenderStates.FRONTFACE]);
				if(this._pCurrentContextStates.FRONT_FACE !== iWebGLValue){

					!isStatesChanged && this._pushRenderStates();				
					isStatesChanged = true;
					this._pCurrentContextStates.FRONT_FACE = iWebGLValue;

					this._pWebGLContext.frontFace(this._pCurrentContextStates.FRONT_FACE);
				}
			}

			if(pStates[ERenderStates.ZFUNC] !== ERenderStateValues.UNDEF) {
				
				iWebGLValue = this.convertRenderStateValue(pStates[ERenderStates.ZFUNC]);
				if(this._pCurrentContextStates.DEPTH_FUNC !== iWebGLValue){

					!isStatesChanged && this._pushRenderStates();				
					isStatesChanged = true;
					this._pCurrentContextStates.DEPTH_FUNC = iWebGLValue;

					this._pWebGLContext.depthFunc(this._pCurrentContextStates.DEPTH_FUNC);
				}
			}

			if (pStates[ERenderStates.SRCBLEND] !== ERenderStateValues.UNDEF || 
				pStates[ERenderStates.DESTBLEND] !== ERenderStateValues.UNDEF) {
				
				var iWebGLValue1: uint = this.convertRenderStateValue(pStates[ERenderStates.SRCBLEND]);
				var iWebGLValue2: uint = this.convertRenderStateValue(pStates[ERenderStates.DESTBLEND]);

				!isStatesChanged && this._pushRenderStates();				
				isStatesChanged = true;

				this._pCurrentContextStates.BLEND_SRC_RGB = iWebGLValue1;
				this._pCurrentContextStates.BLEND_SRC_ALPHA = iWebGLValue1;
				this._pCurrentContextStates.BLEND_DST_RGB = iWebGLValue2;
				this._pCurrentContextStates.BLEND_DST_ALPHA = iWebGLValue2;

				this._pWebGLContext.blendFunc(iWebGLValue1, iWebGLValue2);
			}

			return isStatesChanged;
		}

		private convertRenderStateValue(eStateValue: ERenderStateValues): any {
			switch(eStateValue){
        		case ERenderStateValues.TRUE:
        			return 1;
        		case ERenderStateValues.FALSE:
        			return 0;
        		case ERenderStateValues.ZERO:
        			return GL_ZERO;
        		case ERenderStateValues.ONE:
        			return GL_ONE;
        		case ERenderStateValues.SRCCOLOR:
        			return GL_SRC_COLOR;
        		case ERenderStateValues.INVSRCCOLOR:
        			return GL_ONE_MINUS_SRC_COLOR;
        		case ERenderStateValues.SRCALPHA:
        			return GL_SRC_ALPHA;
        		case ERenderStateValues.INVSRCALPHA:
        			return GL_ONE_MINUS_SRC_ALPHA;
        		case ERenderStateValues.DESTALPHA:
        			return GL_DST_ALPHA;
        		case ERenderStateValues.INVDESTALPHA:
        			return GL_ONE_MINUS_DST_ALPHA;
        		case ERenderStateValues.DESTCOLOR:
        			return GL_DST_COLOR;
        		case ERenderStateValues.INVDESTCOLOR:
        			return GL_ONE_MINUS_DST_COLOR;
        		case ERenderStateValues.SRCALPHASAT:
        			return GL_SRC_ALPHA_SATURATE;
        		case ERenderStateValues.NONE:
        			return GL_NONE;
        		case ERenderStateValues.CW:
        			return GL_CW;
        		case ERenderStateValues.CCW:
        			return GL_CCW;
        		case ERenderStateValues.FRONT:
        			return GL_FRONT;
        		case ERenderStateValues.BACK:
        			return GL_BACK;
        		case ERenderStateValues.FRONT_AND_BACK:
        			return GL_FRONT_AND_BACK;
        		case ERenderStateValues.NEVER:
        			return GL_NEVER;
        		case ERenderStateValues.LESS:
        			return GL_LESS;
        		case ERenderStateValues.EQUAL:
        			return GL_EQUAL;
        		case ERenderStateValues.LESSEQUAL:
        			return GL_LEQUAL;
        		case ERenderStateValues.GREATER:
        			return GL_GREATER;
        		case ERenderStateValues.NOTEQUAL:
        			return GL_NOTEQUAL;
        		case ERenderStateValues.GREATEREQUAL:
        			return GL_GEQUAL;
        		case ERenderStateValues.ALWAYS:
        			return GL_ALWAYS;			
			}
		}

		private convertCompareFunction(eFunc: ECompareFunction): uint {
	        switch(eFunc) {
	            case ECompareFunction.ALWAYS_FAIL:
	                return GL_NEVER;
	            case ECompareFunction.ALWAYS_PASS:
	                return GL_ALWAYS;
	            case ECompareFunction.LESS:
	                return GL_LESS;
	            case ECompareFunction.LESS_EQUAL:
	                return GL_LEQUAL;
	            case ECompareFunction.EQUAL:
	                return GL_EQUAL;
	            case ECompareFunction.NOT_EQUAL:
	                return GL_NOTEQUAL;
	            case ECompareFunction.GREATER_EQUAL:
	                return GL_GEQUAL;
	            case ECompareFunction.GREATER:
	                return GL_GREATER;
	        }

	        return GL_ALWAYS;
    	}


    	static createWebGLContextStates(pStates?: IWebGLContextStates = null): IWebGLContextStates {
			return {
				BLEND: isNull(pStates) ? false : pStates.BLEND,
				BLEND_COLOR: isNull(pStates) ? new Float32Array(4) : new Float32Array(pStates.BLEND_COLOR),
				BLEND_DST_ALPHA: isNull(pStates) ? 0 : pStates.BLEND_DST_ALPHA,
				BLEND_DST_RGB: isNull(pStates) ? 0 : pStates.BLEND_DST_RGB,
				BLEND_EQUATION_ALPHA: isNull(pStates) ? 0 : pStates.BLEND_EQUATION_ALPHA,
				BLEND_EQUATION_RGB: isNull(pStates) ? 0 : pStates.BLEND_EQUATION_RGB,
				BLEND_SRC_ALPHA: isNull(pStates) ? 0 : pStates.BLEND_SRC_ALPHA,
				BLEND_SRC_RGB: isNull(pStates) ? 0 : pStates.BLEND_SRC_RGB,

				COLOR_CLEAR_VALUE: isNull(pStates) ? new Float32Array(4) : new Float32Array(pStates.COLOR_CLEAR_VALUE),
				COLOR_WRITEMASK: isNull(pStates) ? [false, false, false, false] : pStates.COLOR_WRITEMASK.slice(0),

				CULL_FACE: isNull(pStates) ? false : pStates.CULL_FACE,
				CULL_FACE_MODE: isNull(pStates) ? 0 : pStates.CULL_FACE_MODE,

				DEPTH_CLEAR_VALUE: isNull(pStates) ? 0. : pStates.DEPTH_CLEAR_VALUE,
				DEPTH_FUNC: isNull(pStates) ? 0 : pStates.DEPTH_FUNC,
				DEPTH_RANGE: isNull(pStates) ? new Float32Array(2) : new Float32Array(pStates.DEPTH_RANGE),
				DEPTH_TEST: isNull(pStates) ? false : pStates.DEPTH_TEST,
				DEPTH_WRITEMASK: isNull(pStates) ? false : pStates.DEPTH_WRITEMASK,
				DITHER: isNull(pStates) ? false : pStates.DITHER,

				FRONT_FACE: isNull(pStates) ? 0 : pStates.FRONT_FACE,
				LINE_WIDTH: isNull(pStates) ? 0. : pStates.LINE_WIDTH,

				POLYGON_OFFSET_FACTOR: isNull(pStates) ? 0. : pStates.POLYGON_OFFSET_FACTOR,
				POLYGON_OFFSET_FILL: isNull(pStates) ? false : pStates.POLYGON_OFFSET_FILL,
				POLYGON_OFFSET_UNITS: isNull(pStates) ? 0. : pStates.POLYGON_OFFSET_UNITS,

				SAMPLE_BUFFERS: isNull(pStates) ? 0 : pStates.SAMPLE_BUFFERS,
				SAMPLE_COVERAGE_INVERT: isNull(pStates) ? false : pStates.SAMPLE_COVERAGE_INVERT,
				SAMPLE_COVERAGE_VALUE: isNull(pStates) ? 0. : pStates.SAMPLE_COVERAGE_VALUE,
				SAMPLES: isNull(pStates) ? 0 : pStates.SAMPLES,

				SCISSOR_TEST: isNull(pStates) ? false : pStates.SCISSOR_TEST,

				STENCIL_BACK_FAIL: isNull(pStates) ? 0 : pStates.STENCIL_BACK_FAIL,
				STENCIL_BACK_FUNC: isNull(pStates) ? 0 : pStates.STENCIL_BACK_FUNC,
				STENCIL_BACK_PASS_DEPTH_FAIL: isNull(pStates) ? 0 : pStates.STENCIL_BACK_PASS_DEPTH_FAIL,
				STENCIL_BACK_PASS_DEPTH_PASS: isNull(pStates) ? 0 : pStates.STENCIL_BACK_PASS_DEPTH_PASS,
				STENCIL_BACK_REF: isNull(pStates) ? 0 : pStates.STENCIL_BACK_REF,
				STENCIL_BACK_VALUE_MASK: isNull(pStates) ? 0 : pStates.STENCIL_BACK_VALUE_MASK,
				STENCIL_BACK_WRITEMASK: isNull(pStates) ? 0 : pStates.STENCIL_BACK_WRITEMASK,
				STENCIL_CLEAR_VALUE: isNull(pStates) ? 0 : pStates.STENCIL_CLEAR_VALUE,
				STENCIL_FAIL: isNull(pStates) ? 0 : pStates.STENCIL_FAIL,
				STENCIL_FUNC: isNull(pStates) ? 0 : pStates.STENCIL_FUNC,
				STENCIL_PASS_DEPTH_FAIL: isNull(pStates) ? 0 : pStates.STENCIL_PASS_DEPTH_FAIL,
				STENCIL_PASS_DEPTH_PASS: isNull(pStates) ? 0 : pStates.STENCIL_PASS_DEPTH_PASS,
				STENCIL_REF: isNull(pStates) ? 0 : pStates.STENCIL_REF,
				STENCIL_TEST: isNull(pStates) ? false : pStates.STENCIL_TEST,
				STENCIL_VALUE_MASK: isNull(pStates) ? 0 : pStates.STENCIL_VALUE_MASK,
				STENCIL_WRITEMASK: isNull(pStates) ? 0 : pStates.STENCIL_WRITEMASK,
				PACK_ALIGNMENT: isNull(pStates) ? 0 : pStates.PACK_ALIGNMENT,
				UNPACK_ALIGNMENT: isNull(pStates) ? 0 : pStates.UNPACK_ALIGNMENT
			};
		}

		static copyWebGLContextStates(pStatesTo: IWebGLContextStates, pStatesFrom: IWebGLContextStates): IWebGLContextStates {
			pStatesTo.BLEND = pStatesFrom.BLEND;
			pStatesTo.BLEND_COLOR.set(pStatesFrom.BLEND_COLOR);
			pStatesTo.BLEND_DST_ALPHA = pStatesFrom.BLEND_DST_ALPHA;
			pStatesTo.BLEND_DST_RGB = pStatesFrom.BLEND_DST_RGB;
			pStatesTo.BLEND_EQUATION_ALPHA = pStatesFrom.BLEND_EQUATION_ALPHA;
			pStatesTo.BLEND_EQUATION_RGB = pStatesFrom.BLEND_EQUATION_RGB;
			pStatesTo.BLEND_SRC_ALPHA = pStatesFrom.BLEND_SRC_ALPHA;
			pStatesTo.BLEND_SRC_RGB = pStatesFrom.BLEND_SRC_RGB;

			pStatesTo.COLOR_CLEAR_VALUE.set(pStatesFrom.COLOR_CLEAR_VALUE);
			pStatesTo.COLOR_WRITEMASK[0] = pStatesFrom.COLOR_WRITEMASK[0];
			pStatesTo.COLOR_WRITEMASK[1] = pStatesFrom.COLOR_WRITEMASK[1];
			pStatesTo.COLOR_WRITEMASK[2] = pStatesFrom.COLOR_WRITEMASK[2];
			pStatesTo.COLOR_WRITEMASK[3] = pStatesFrom.COLOR_WRITEMASK[3];

			pStatesTo.CULL_FACE = pStatesFrom.CULL_FACE;
			pStatesTo.CULL_FACE_MODE = pStatesFrom.CULL_FACE_MODE;

			pStatesTo.DEPTH_CLEAR_VALUE = pStatesFrom.DEPTH_CLEAR_VALUE;
			pStatesTo.DEPTH_FUNC = pStatesFrom.DEPTH_FUNC;
			pStatesTo.DEPTH_RANGE.set(pStatesFrom.DEPTH_RANGE);
			pStatesTo.DEPTH_TEST = pStatesFrom.DEPTH_TEST;
			pStatesTo.DEPTH_WRITEMASK = pStatesFrom.DEPTH_WRITEMASK;
			pStatesTo.DITHER = pStatesFrom.DITHER;

			pStatesTo.FRONT_FACE = pStatesFrom.FRONT_FACE;
			pStatesTo.LINE_WIDTH = pStatesFrom.LINE_WIDTH;

			pStatesTo.POLYGON_OFFSET_FACTOR = pStatesFrom.POLYGON_OFFSET_FACTOR;
			pStatesTo.POLYGON_OFFSET_FILL = pStatesFrom.POLYGON_OFFSET_FILL;
			pStatesTo.POLYGON_OFFSET_UNITS = pStatesFrom.POLYGON_OFFSET_UNITS;

			pStatesTo.SAMPLE_BUFFERS = pStatesFrom.SAMPLE_BUFFERS;
			pStatesTo.SAMPLE_COVERAGE_INVERT = pStatesFrom.SAMPLE_COVERAGE_INVERT;
			pStatesTo.SAMPLE_COVERAGE_VALUE = pStatesFrom.SAMPLE_COVERAGE_VALUE;
			pStatesTo.SAMPLES = pStatesFrom.SAMPLES;

			pStatesTo.SCISSOR_TEST = pStatesFrom.SCISSOR_TEST;

			pStatesTo.STENCIL_BACK_FAIL = pStatesFrom.STENCIL_BACK_FAIL;
			pStatesTo.STENCIL_BACK_FUNC = pStatesFrom.STENCIL_BACK_FUNC;
			pStatesTo.STENCIL_BACK_PASS_DEPTH_FAIL = pStatesFrom.STENCIL_BACK_PASS_DEPTH_FAIL;
			pStatesTo.STENCIL_BACK_PASS_DEPTH_PASS = pStatesFrom.STENCIL_BACK_PASS_DEPTH_PASS;
			pStatesTo.STENCIL_BACK_REF = pStatesFrom.STENCIL_BACK_REF;
			pStatesTo.STENCIL_BACK_VALUE_MASK = pStatesFrom.STENCIL_BACK_VALUE_MASK;
			pStatesTo.STENCIL_BACK_WRITEMASK = pStatesFrom.STENCIL_BACK_WRITEMASK;
			pStatesTo.STENCIL_CLEAR_VALUE = pStatesFrom.STENCIL_CLEAR_VALUE;
			pStatesTo.STENCIL_FAIL = pStatesFrom.STENCIL_FAIL;
			pStatesTo.STENCIL_FUNC = pStatesFrom.STENCIL_FUNC;
			pStatesTo.STENCIL_PASS_DEPTH_FAIL = pStatesFrom.STENCIL_PASS_DEPTH_FAIL;
			pStatesTo.STENCIL_PASS_DEPTH_PASS = pStatesFrom.STENCIL_PASS_DEPTH_PASS;
			pStatesTo.STENCIL_REF = pStatesFrom.STENCIL_REF;
			pStatesTo.STENCIL_TEST = pStatesFrom.STENCIL_TEST;
			pStatesTo.STENCIL_VALUE_MASK = pStatesFrom.STENCIL_VALUE_MASK;
			pStatesTo.STENCIL_WRITEMASK = pStatesFrom.STENCIL_WRITEMASK;


			pStatesTo.PACK_ALIGNMENT = pStatesFrom.PACK_ALIGNMENT;
			pStatesTo.UNPACK_ALIGNMENT = pStatesFrom.UNPACK_ALIGNMENT;

			return pStatesTo;
		}

		static initStatesFromWebGLContext(pStatesTo: IWebGLContextStates, pWebGLContext: WebGLRenderingContext): IWebGLContextStates {
			pStatesTo.BLEND = pWebGLContext.getParameter(GL_BLEND);
			pStatesTo.BLEND_COLOR = pWebGLContext.getParameter(GL_BLEND_COLOR);
			pStatesTo.BLEND_DST_ALPHA = pWebGLContext.getParameter(GL_BLEND_DST_ALPHA);
			pStatesTo.BLEND_DST_RGB = pWebGLContext.getParameter(GL_BLEND_DST_RGB);
			pStatesTo.BLEND_EQUATION_ALPHA = pWebGLContext.getParameter(GL_BLEND_EQUATION_ALPHA);
			pStatesTo.BLEND_EQUATION_RGB = pWebGLContext.getParameter(GL_BLEND_EQUATION_RGB);
			pStatesTo.BLEND_SRC_ALPHA = pWebGLContext.getParameter(GL_BLEND_SRC_ALPHA);
			pStatesTo.BLEND_SRC_RGB = pWebGLContext.getParameter(GL_BLEND_SRC_RGB);

			pStatesTo.COLOR_CLEAR_VALUE = pWebGLContext.getParameter(GL_COLOR_CLEAR_VALUE);
			pStatesTo.COLOR_WRITEMASK = pWebGLContext.getParameter(GL_COLOR_WRITEMASK);

			pStatesTo.CULL_FACE = pWebGLContext.getParameter(GL_CULL_FACE);
			pStatesTo.CULL_FACE_MODE = pWebGLContext.getParameter(GL_CULL_FACE_MODE);

			pStatesTo.DEPTH_CLEAR_VALUE = pWebGLContext.getParameter(GL_DEPTH_CLEAR_VALUE);
			pStatesTo.DEPTH_FUNC = pWebGLContext.getParameter(GL_DEPTH_FUNC);
			pStatesTo.DEPTH_RANGE = pWebGLContext.getParameter(GL_DEPTH_RANGE);
			pStatesTo.DEPTH_TEST = pWebGLContext.getParameter(GL_DEPTH_TEST);
			pStatesTo.DEPTH_WRITEMASK = pWebGLContext.getParameter(GL_DEPTH_WRITEMASK);
			pStatesTo.DITHER = pWebGLContext.getParameter(GL_DITHER);

			pStatesTo.FRONT_FACE = pWebGLContext.getParameter(GL_FRONT_FACE);
			pStatesTo.LINE_WIDTH = pWebGLContext.getParameter(GL_LINE_WIDTH);

			pStatesTo.POLYGON_OFFSET_FACTOR = pWebGLContext.getParameter(GL_POLYGON_OFFSET_FACTOR);
			pStatesTo.POLYGON_OFFSET_FILL = pWebGLContext.getParameter(GL_POLYGON_OFFSET_FILL);
			pStatesTo.POLYGON_OFFSET_UNITS = pWebGLContext.getParameter(GL_POLYGON_OFFSET_UNITS);

			pStatesTo.SAMPLE_BUFFERS = pWebGLContext.getParameter(GL_SAMPLE_BUFFERS);
			pStatesTo.SAMPLE_COVERAGE_INVERT = pWebGLContext.getParameter(GL_SAMPLE_COVERAGE_INVERT);
			pStatesTo.SAMPLE_COVERAGE_VALUE = pWebGLContext.getParameter(GL_SAMPLE_COVERAGE_VALUE);
			pStatesTo.SAMPLES = pWebGLContext.getParameter(GL_SAMPLES);

			pStatesTo.SCISSOR_TEST = pWebGLContext.getParameter(GL_SCISSOR_TEST);

			pStatesTo.STENCIL_BACK_FAIL = pWebGLContext.getParameter(GL_STENCIL_BACK_FAIL);
			pStatesTo.STENCIL_BACK_FUNC = pWebGLContext.getParameter(GL_STENCIL_BACK_FUNC);
			pStatesTo.STENCIL_BACK_PASS_DEPTH_FAIL = pWebGLContext.getParameter(GL_STENCIL_BACK_PASS_DEPTH_FAIL);
			pStatesTo.STENCIL_BACK_PASS_DEPTH_PASS = pWebGLContext.getParameter(GL_STENCIL_BACK_PASS_DEPTH_PASS);
			pStatesTo.STENCIL_BACK_REF = pWebGLContext.getParameter(GL_STENCIL_BACK_REF);
			pStatesTo.STENCIL_BACK_VALUE_MASK = pWebGLContext.getParameter(GL_STENCIL_BACK_VALUE_MASK);
			pStatesTo.STENCIL_BACK_WRITEMASK = pWebGLContext.getParameter(GL_STENCIL_BACK_WRITEMASK);
			pStatesTo.STENCIL_CLEAR_VALUE = pWebGLContext.getParameter(GL_STENCIL_CLEAR_VALUE);
			pStatesTo.STENCIL_FAIL = pWebGLContext.getParameter(GL_STENCIL_FAIL);
			pStatesTo.STENCIL_FUNC = pWebGLContext.getParameter(GL_STENCIL_FUNC);
			pStatesTo.STENCIL_PASS_DEPTH_FAIL = pWebGLContext.getParameter(GL_STENCIL_PASS_DEPTH_FAIL);
			pStatesTo.STENCIL_PASS_DEPTH_PASS = pWebGLContext.getParameter(GL_STENCIL_PASS_DEPTH_PASS);
			pStatesTo.STENCIL_REF = pWebGLContext.getParameter(GL_STENCIL_REF);
			pStatesTo.STENCIL_TEST = pWebGLContext.getParameter(GL_STENCIL_TEST);
			pStatesTo.STENCIL_VALUE_MASK = pWebGLContext.getParameter(GL_STENCIL_VALUE_MASK);
			pStatesTo.STENCIL_WRITEMASK = pWebGLContext.getParameter(GL_STENCIL_WRITEMASK);

			pStatesTo.PACK_ALIGNMENT = pWebGLContext.getParameter(GL_PACK_ALIGNMENT);
			pStatesTo.UNPACK_ALIGNMENT = pWebGLContext.getParameter(GL_UNPACK_ALIGNMENT);

			return pStatesTo;
		}
	}
}

#endif