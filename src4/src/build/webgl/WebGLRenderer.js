/// <reference path="../idl/IShaderInput.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../render/Renderer.ts" />
    /// <reference path="../render/Viewport.ts" />
    /// <reference path="../config/config.ts" />
    /// <reference path="webgl.ts" />
    /// <reference path="WebGLCanvas.ts" />
    /// <reference path="WebGLShaderProgram.ts" />
    /// <reference path="WebGLInternalTextureStateManager.ts" />
    (function (webgl) {
        var WebGLRenderer = (function (_super) {
            __extends(WebGLRenderer, _super);
            function WebGLRenderer(pEngine, options) {
                _super.call(this, pEngine);
                this._pCanvas = null;
                //real context, if debug context used
                this._pWebGLInternalContext = null;
                this._nActiveAttributes = 0;
                this._iSlot = 0;
                this._iCurrentTextureSlot = 0;
                this._iNextTextureSlot = 0;
                this._pTextureSlotList = null;
                /**
                * Need To reset texture states after render
                */
                this._pTextureStateManager = null;
                /**
                * Need to impove speed
                */
                this._pCurrentContextStates = WebGLRenderer.createWebGLContextStates();
                this._pRenderStatesPool = new akra.util.ObjectArray();
                this._pFreeRenderStatesPool = new akra.util.ObjectArray();
                this._time = [0, 0, 0, 0, 0, 0, 0, 0];

                var pOptions = null;

                if (akra.isDefAndNotNull(arguments[1])) {
                    //get HTMLCanvasElement by id
                    if (akra.isString(arguments[1])) {
                        this._pCanvas = document.getElementById(arguments[1]);
                    } else if (arguments[1] instanceof HTMLCanvasElement) {
                        this._pCanvas = arguments[1];
                    } else {
                        pOptions = arguments[1];

                        if (pOptions.canvas instanceof HTMLCanvasElement) {
                            this._pCanvas = pOptions.canvas;
                        }
                    }
                }

                if (akra.isNull(this._pCanvas)) {
                    this._pCanvas = document.createElement('canvas');
                }

                if (akra.isNull(pOptions)) {
                    pOptions = WebGLRenderer.DEFAULT_OPTIONS;
                } else {
                    for (var i = 0, pOptList = Object.keys(WebGLRenderer.DEFAULT_OPTIONS); i < pOptList.length; ++i) {
                        var sOpt = pOptList[i];

                        if (!akra.isDef(pOptions[sOpt])) {
                            pOptions[sOpt] = WebGLRenderer.DEFAULT_OPTIONS[sOpt];
                        }
                    }
                }

                akra.debug.log("WebGL context attributes:", JSON.stringify(pOptions));

                this._pWebGLContext = akra.webgl.createContext(this._pCanvas, pOptions);

                akra.debug.assert(!akra.isNull(this._pWebGLContext), "webgl context is NULL");

                this._pWebGLFramebufferList = new Array(akra.config.webgl.preparedFramebuffersNum);

                for (var i = 0; i < this._pWebGLFramebufferList.length; ++i) {
                    this._pWebGLFramebufferList[i] = this._pWebGLContext.createFramebuffer();
                }

                this._pDefaultCanvas = new akra.webgl.WebGLCanvas(this);
                akra.logger.assert(this._pDefaultCanvas.create("primary-target"), "could not create WebGL canvas");

                this.attachRenderTarget(this._pDefaultCanvas);

                this._pTextureSlotList = new Array(akra.webgl.maxTextureImageUnits);

                for (var i = 0; i < this._pTextureSlotList.length; i++) {
                    this._pTextureSlotList[i] = null;
                }

                for (var i = 0; i < 4; i++) {
                    this._pFreeRenderStatesPool.push(WebGLRenderer.createWebGLContextStates());
                }

                this.forceUpdateContextRenderStates();

                this._pTextureStateManager = new akra.webgl.WebGLInternalTextureStateManager(this);
            }
            WebGLRenderer.prototype.getType = function () {
                return 1 /* WEBGL */;
            };

            WebGLRenderer.prototype.debug = function (bValue, useApiTrace) {
                if (typeof bValue === "undefined") { bValue = true; }
                if (typeof useApiTrace === "undefined") { useApiTrace = false; }
                var pWebGLInternalContext = this._pWebGLContext;

                if (bValue) {
                    if (akra.isDef(window.WebGLDebugUtils) && !akra.isNull(pWebGLInternalContext)) {
                        this._pWebGLContext = WebGLDebugUtils.makeDebugContext(pWebGLInternalContext, function (err, funcName, args) {
                            throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
                        }, useApiTrace ? function (funcName, args) {
                            akra.logger.log("gl." + funcName + "(" + WebGLDebugUtils.glFunctionArgsToString(funcName, args) + ")");
                        } : null);

                        this._pWebGLInternalContext = pWebGLInternalContext;

                        return true;
                    }
                } else if (this.isDebug()) {
                    this._pWebGLContext = this._pWebGLInternalContext;
                    this._pWebGLInternalContext = null;

                    return true;
                }

                return false;
            };

            WebGLRenderer.prototype.blendColor = function (fRed, fGreen, fBlue, fAlpha) {
                this._pWebGLContext.blendColor(fRed, fGreen, fBlue, fAlpha);
                this._pCurrentContextStates.BLEND_COLOR[0] = fRed;
                this._pCurrentContextStates.BLEND_COLOR[1] = fGreen;
                this._pCurrentContextStates.BLEND_COLOR[2] = fBlue;
                this._pCurrentContextStates.BLEND_COLOR[3] = fAlpha;
            };

            WebGLRenderer.prototype.blendEquation = function (iWebGLMode) {
                this._pWebGLContext.blendEquation(iWebGLMode);
                this._pCurrentContextStates.BLEND_EQUATION_RGB = iWebGLMode;
                this._pCurrentContextStates.BLEND_EQUATION_ALPHA = iWebGLMode;
            };

            WebGLRenderer.prototype.blendEquationSeparate = function (iWebGLModeRGB, iWebGLModeAlpha) {
                this._pWebGLContext.blendEquationSeparate(iWebGLModeRGB, iWebGLModeAlpha);
                this._pCurrentContextStates.BLEND_EQUATION_RGB = iWebGLModeRGB;
                this._pCurrentContextStates.BLEND_EQUATION_ALPHA = iWebGLModeAlpha;
            };

            WebGLRenderer.prototype.blendFunc = function (iWebGLSFactor, iWebGLDFactor) {
                this._pWebGLContext.blendFunc(iWebGLSFactor, iWebGLDFactor);
                this._pCurrentContextStates.BLEND_SRC_RGB = iWebGLSFactor;
                this._pCurrentContextStates.BLEND_SRC_ALPHA = iWebGLSFactor;
                this._pCurrentContextStates.BLEND_DST_RGB = iWebGLDFactor;
                this._pCurrentContextStates.BLEND_DST_ALPHA = iWebGLDFactor;
            };

            WebGLRenderer.prototype.blendFuncSeparate = function (iWebGLSFactorRGB, iWebGLDFactorRGB, iWebGLSFactorAlpha, iWebGLDFactorAlpha) {
                this._pWebGLContext.blendFuncSeparate(iWebGLSFactorRGB, iWebGLDFactorRGB, iWebGLSFactorAlpha, iWebGLDFactorAlpha);
                this._pCurrentContextStates.BLEND_SRC_RGB = iWebGLSFactorRGB;
                this._pCurrentContextStates.BLEND_SRC_ALPHA = iWebGLSFactorAlpha;
                this._pCurrentContextStates.BLEND_DST_RGB = iWebGLDFactorRGB;
                this._pCurrentContextStates.BLEND_DST_ALPHA = iWebGLDFactorAlpha;
            };

            WebGLRenderer.prototype.clearColor = function (fRed, fGreen, fBlue, fAlpha) {
                this._pWebGLContext.clearColor(fRed, fGreen, fBlue, fAlpha);
                this._pCurrentContextStates.COLOR_CLEAR_VALUE[0] = fRed;
                this._pCurrentContextStates.COLOR_CLEAR_VALUE[1] = fGreen;
                this._pCurrentContextStates.COLOR_CLEAR_VALUE[2] = fBlue;
                this._pCurrentContextStates.COLOR_CLEAR_VALUE[3] = fAlpha;
            };

            WebGLRenderer.prototype.clearDepth = function (fDepth) {
                this._pWebGLContext.clearDepth(fDepth);
                this._pCurrentContextStates.DEPTH_CLEAR_VALUE = fDepth;
            };

            WebGLRenderer.prototype.clearStencil = function (iS) {
                this._pWebGLContext.clearStencil(iS);
                this._pCurrentContextStates.STENCIL_CLEAR_VALUE = iS;
            };

            WebGLRenderer.prototype.colorMask = function (bRed, bGreen, bBlue, bAlpha) {
                this._pWebGLContext.colorMask(bRed, bGreen, bBlue, bAlpha);
                this._pCurrentContextStates.COLOR_WRITEMASK[0] = bRed;
                this._pCurrentContextStates.COLOR_WRITEMASK[1] = bGreen;
                this._pCurrentContextStates.COLOR_WRITEMASK[2] = bBlue;
                this._pCurrentContextStates.COLOR_WRITEMASK[3] = bAlpha;
            };

            WebGLRenderer.prototype.cullFace = function (iWebGLMode) {
                this._pWebGLContext.cullFace(iWebGLMode);
                this._pCurrentContextStates.CULL_FACE_MODE = iWebGLMode;
            };

            WebGLRenderer.prototype.depthFunc = function (iWebGLMode) {
                this._pWebGLContext.depthFunc(iWebGLMode);
                this._pCurrentContextStates.DEPTH_FUNC = iWebGLMode;
            };

            WebGLRenderer.prototype.depthMask = function (bWrite) {
                this._pWebGLContext.depthMask(bWrite);
                this._pCurrentContextStates.DEPTH_WRITEMASK = bWrite;
            };

            WebGLRenderer.prototype.depthRange = function (fZNear, fZFar) {
                this._pWebGLContext.depthRange(fZNear, fZFar);
                this._pCurrentContextStates.DEPTH_RANGE[0] = fZNear;
                this._pCurrentContextStates.DEPTH_RANGE[1] = fZFar;
            };

            WebGLRenderer.prototype.disable = function (iWebGLCap) {
                this._pWebGLContext.disable(iWebGLCap);

                switch (iWebGLCap) {
                    case 2884 /* CULL_FACE */:
                        this._pCurrentContextStates.CULL_FACE = false;
                        return;
                    case 3042 /* BLEND */:
                        this._pCurrentContextStates.BLEND = false;
                        return;
                    case 3024 /* DITHER */:
                        this._pCurrentContextStates.DITHER = false;
                        return;
                    case 2960 /* STENCIL_TEST */:
                        this._pCurrentContextStates.STENCIL_TEST = false;
                        return;
                    case 2929 /* DEPTH_TEST */:
                        this._pCurrentContextStates.DEPTH_TEST = false;
                        return;
                    case 3089 /* SCISSOR_TEST */:
                        this._pCurrentContextStates.SCISSOR_TEST = false;
                        return;
                    case 32823 /* POLYGON_OFFSET_FILL */:
                        this._pCurrentContextStates.POLYGON_OFFSET_FILL = false;
                        return;
                }
            };

            WebGLRenderer.prototype.enable = function (iWebGLCap) {
                this._pWebGLContext.enable(iWebGLCap);

                switch (iWebGLCap) {
                    case 2884 /* CULL_FACE */:
                        this._pCurrentContextStates.CULL_FACE = true;
                        return;
                    case 3042 /* BLEND */:
                        this._pCurrentContextStates.BLEND = true;
                        return;
                    case 3024 /* DITHER */:
                        this._pCurrentContextStates.DITHER = true;
                        return;
                    case 2960 /* STENCIL_TEST */:
                        this._pCurrentContextStates.STENCIL_TEST = true;
                        return;
                    case 2929 /* DEPTH_TEST */:
                        this._pCurrentContextStates.DEPTH_TEST = true;
                        return;
                    case 3089 /* SCISSOR_TEST */:
                        this._pCurrentContextStates.SCISSOR_TEST = true;
                        return;
                    case 32823 /* POLYGON_OFFSET_FILL */:
                        this._pCurrentContextStates.POLYGON_OFFSET_FILL = true;
                        return;
                }
            };

            WebGLRenderer.prototype.frontFace = function (iWebGLMode) {
                this._pWebGLContext.frontFace(iWebGLMode);
                this._pCurrentContextStates.FRONT_FACE = iWebGLMode;
            };

            WebGLRenderer.prototype.getParameter = function (iWebGLName) {
                switch (iWebGLName) {
                    case 3042 /* BLEND */:
                        return this._pCurrentContextStates.BLEND;
                    case 32773 /* BLEND_COLOR */:
                        return this._pCurrentContextStates.BLEND_COLOR;
                    case 32970 /* BLEND_DST_ALPHA */:
                        return this._pCurrentContextStates.BLEND_DST_ALPHA;
                    case 32968 /* BLEND_DST_RGB */:
                        return this._pCurrentContextStates.BLEND_DST_RGB;
                    case 34877 /* BLEND_EQUATION_ALPHA */:
                        return this._pCurrentContextStates.BLEND_EQUATION_ALPHA;
                    case 32777 /* BLEND_EQUATION_RGB */:
                        return this._pCurrentContextStates.BLEND_EQUATION_RGB;
                    case 32971 /* BLEND_SRC_ALPHA */:
                        return this._pCurrentContextStates.BLEND_SRC_ALPHA;
                    case 32969 /* BLEND_SRC_RGB */:
                        return this._pCurrentContextStates.BLEND_SRC_RGB;
                    case 3106 /* COLOR_CLEAR_VALUE */:
                        return this._pCurrentContextStates.COLOR_CLEAR_VALUE;
                    case 3107 /* COLOR_WRITEMASK */:
                        return this._pCurrentContextStates.COLOR_WRITEMASK;
                    case 2884 /* CULL_FACE */:
                        return this._pCurrentContextStates.CULL_FACE;
                    case 2885 /* CULL_FACE_MODE */:
                        return this._pCurrentContextStates.CULL_FACE_MODE;
                    case 2931 /* DEPTH_CLEAR_VALUE */:
                        return this._pCurrentContextStates.DEPTH_CLEAR_VALUE;
                    case 2932 /* DEPTH_FUNC */:
                        return this._pCurrentContextStates.DEPTH_FUNC;
                    case 2928 /* DEPTH_RANGE */:
                        return this._pCurrentContextStates.DEPTH_RANGE;
                    case 2929 /* DEPTH_TEST */:
                        return this._pCurrentContextStates.DEPTH_TEST;
                    case 2930 /* DEPTH_WRITEMASK */:
                        return this._pCurrentContextStates.DEPTH_WRITEMASK;
                    case 3024 /* DITHER */:
                        return this._pCurrentContextStates.DITHER;
                    case 2886 /* FRONT_FACE */:
                        return this._pCurrentContextStates.FRONT_FACE;
                    case 2849 /* LINE_WIDTH */:
                        return this._pCurrentContextStates.LINE_WIDTH;
                    case 32824 /* POLYGON_OFFSET_FACTOR */:
                        return this._pCurrentContextStates.POLYGON_OFFSET_FACTOR;
                    case 32823 /* POLYGON_OFFSET_FILL */:
                        return this._pCurrentContextStates.POLYGON_OFFSET_FILL;
                    case 10752 /* POLYGON_OFFSET_UNITS */:
                        return this._pCurrentContextStates.POLYGON_OFFSET_UNITS;
                    case 32936 /* SAMPLE_BUFFERS */:
                        return this._pCurrentContextStates.SAMPLE_BUFFERS;
                    case 32939 /* SAMPLE_COVERAGE_INVERT */:
                        return this._pCurrentContextStates.SAMPLE_COVERAGE_INVERT;
                    case 32938 /* SAMPLE_COVERAGE_VALUE */:
                        return this._pCurrentContextStates.SAMPLE_COVERAGE_VALUE;
                    case 32937 /* SAMPLES */:
                        return this._pCurrentContextStates.SAMPLES;
                    case 3089 /* SCISSOR_TEST */:
                        return this._pCurrentContextStates.SCISSOR_TEST;
                    case 34817 /* STENCIL_BACK_FAIL */:
                        return this._pCurrentContextStates.STENCIL_BACK_FAIL;
                    case 34816 /* STENCIL_BACK_FUNC */:
                        return this._pCurrentContextStates.STENCIL_BACK_FUNC;
                    case 34818 /* STENCIL_BACK_PASS_DEPTH_FAIL */:
                        return this._pCurrentContextStates.STENCIL_BACK_PASS_DEPTH_FAIL;
                    case 34819 /* STENCIL_BACK_PASS_DEPTH_PASS */:
                        return this._pCurrentContextStates.STENCIL_BACK_PASS_DEPTH_PASS;
                    case 36003 /* STENCIL_BACK_REF */:
                        return this._pCurrentContextStates.STENCIL_BACK_REF;
                    case 36004 /* STENCIL_BACK_VALUE_MASK */:
                        return this._pCurrentContextStates.STENCIL_BACK_VALUE_MASK;
                    case 36005 /* STENCIL_BACK_WRITEMASK */:
                        return this._pCurrentContextStates.STENCIL_BACK_WRITEMASK;
                    case 2961 /* STENCIL_CLEAR_VALUE */:
                        return this._pCurrentContextStates.STENCIL_CLEAR_VALUE;
                    case 2964 /* STENCIL_FAIL */:
                        return this._pCurrentContextStates.STENCIL_FAIL;
                    case 2962 /* STENCIL_FUNC */:
                        return this._pCurrentContextStates.STENCIL_FUNC;
                    case 2965 /* STENCIL_PASS_DEPTH_FAIL */:
                        return this._pCurrentContextStates.STENCIL_PASS_DEPTH_FAIL;
                    case 2966 /* STENCIL_PASS_DEPTH_PASS */:
                        return this._pCurrentContextStates.STENCIL_PASS_DEPTH_PASS;
                    case 2967 /* STENCIL_REF */:
                        return this._pCurrentContextStates.STENCIL_REF;
                    case 2960 /* STENCIL_TEST */:
                        return this._pCurrentContextStates.STENCIL_TEST;
                    case 2963 /* STENCIL_VALUE_MASK */:
                        return this._pCurrentContextStates.STENCIL_VALUE_MASK;
                    case 2968 /* STENCIL_WRITEMASK */:
                        return this._pCurrentContextStates.STENCIL_WRITEMASK;
                    case 3317 /* UNPACK_ALIGNMENT */:
                        return this._pCurrentContextStates.UNPACK_ALIGNMENT;
                    case 3333 /* PACK_ALIGNMENT */:
                        return this._pCurrentContextStates.PACK_ALIGNMENT;
                    default:
                        return this._pWebGLContext.getParameter(iWebGLName);
                }
            };

            WebGLRenderer.prototype.lineWidth = function (fWidth) {
                this._pWebGLContext.lineWidth(fWidth);
                this._pCurrentContextStates.LINE_WIDTH = fWidth;
            };

            WebGLRenderer.prototype.pixelStorei = function (iWebGLName, iParam) {
                this._pWebGLContext.pixelStorei(iWebGLName, iParam);

                if (iWebGLName === 3317 /* UNPACK_ALIGNMENT */) {
                    this._pCurrentContextStates.UNPACK_ALIGNMENT = iParam;
                } else {
                    this._pCurrentContextStates.PACK_ALIGNMENT = iParam;
                }
            };

            WebGLRenderer.prototype.polygonOffset = function (fFactor, fUnints) {
                this._pWebGLContext.polygonOffset(fFactor, fUnints);
                this._pCurrentContextStates.POLYGON_OFFSET_FACTOR = fFactor;
                this._pCurrentContextStates.POLYGON_OFFSET_UNITS = fUnints;
            };

            WebGLRenderer.prototype.sampleCoverage = function (fValue, bInvert) {
                this._pWebGLContext.sampleCoverage(fValue, bInvert);
                this._pCurrentContextStates.SAMPLE_COVERAGE_VALUE = fValue;
                this._pCurrentContextStates.SAMPLE_COVERAGE_INVERT = bInvert;
            };

            WebGLRenderer.prototype.stencilFunc = function (iWebGLFunc, iRef, iMask) {
                this._pWebGLContext.stencilFunc(iWebGLFunc, iRef, iMask);
                this._pCurrentContextStates.STENCIL_FUNC = iWebGLFunc;
                this._pCurrentContextStates.STENCIL_REF = iRef;
                this._pCurrentContextStates.STENCIL_VALUE_MASK = iMask;
                this._pCurrentContextStates.STENCIL_BACK_FUNC = iWebGLFunc;
                this._pCurrentContextStates.STENCIL_BACK_REF = iRef;
                this._pCurrentContextStates.STENCIL_BACK_VALUE_MASK = iMask;
            };

            WebGLRenderer.prototype.stencilFuncSeparate = function (iWebGLFace, iWebGLFunc, iRef, iMask) {
                this._pWebGLContext.stencilFuncSeparate(iWebGLFace, iWebGLFunc, iRef, iMask);

                if (iWebGLFace === 1032 /* FRONT_AND_BACK */) {
                    this._pCurrentContextStates.STENCIL_FUNC = iWebGLFunc;
                    this._pCurrentContextStates.STENCIL_REF = iRef;
                    this._pCurrentContextStates.STENCIL_VALUE_MASK = iMask;
                    this._pCurrentContextStates.STENCIL_BACK_FUNC = iWebGLFunc;
                    this._pCurrentContextStates.STENCIL_BACK_REF = iRef;
                    this._pCurrentContextStates.STENCIL_BACK_VALUE_MASK = iMask;
                } else if (iWebGLFace === 1028 /* FRONT */) {
                    this._pCurrentContextStates.STENCIL_FUNC = iWebGLFunc;
                    this._pCurrentContextStates.STENCIL_REF = iRef;
                    this._pCurrentContextStates.STENCIL_VALUE_MASK = iMask;
                } else {
                    this._pCurrentContextStates.STENCIL_BACK_FUNC = iWebGLFunc;
                    this._pCurrentContextStates.STENCIL_BACK_REF = iRef;
                    this._pCurrentContextStates.STENCIL_BACK_VALUE_MASK = iMask;
                }
            };

            WebGLRenderer.prototype.stencilMask = function (iMask) {
                this._pWebGLContext.stencilMask(iMask);
                this._pCurrentContextStates.STENCIL_WRITEMASK = iMask;
                this._pCurrentContextStates.STENCIL_BACK_WRITEMASK = iMask;
            };

            WebGLRenderer.prototype.stencilMaskSeparate = function (iWebGLFace, iMask) {
                this._pWebGLContext.stencilMaskSeparate(iWebGLFace, iMask);

                if (iWebGLFace === 1032 /* FRONT_AND_BACK */) {
                    this._pCurrentContextStates.STENCIL_WRITEMASK = iMask;
                    this._pCurrentContextStates.STENCIL_BACK_WRITEMASK = iMask;
                } else if (iWebGLFace === 1028 /* FRONT */) {
                    this._pCurrentContextStates.STENCIL_WRITEMASK = iMask;
                } else {
                    this._pCurrentContextStates.STENCIL_BACK_WRITEMASK = iMask;
                }
            };

            WebGLRenderer.prototype.stencilOp = function (iFail, iZFail, iZPass) {
                this._pWebGLContext.stencilOp(iFail, iZFail, iZPass);

                this._pCurrentContextStates.STENCIL_FAIL = iFail;
                this._pCurrentContextStates.STENCIL_PASS_DEPTH_FAIL = iZFail;
                this._pCurrentContextStates.STENCIL_PASS_DEPTH_PASS = iZPass;
                this._pCurrentContextStates.STENCIL_BACK_FAIL = iFail;
                this._pCurrentContextStates.STENCIL_BACK_PASS_DEPTH_FAIL = iZFail;
                this._pCurrentContextStates.STENCIL_BACK_PASS_DEPTH_PASS = iZPass;
            };

            WebGLRenderer.prototype.stencilOpSeparate = function (iWebGLFace, iFail, iZFail, iZPass) {
                this._pWebGLContext.stencilOpSeparate(iWebGLFace, iFail, iZFail, iZPass);

                if (iWebGLFace === 1032 /* FRONT_AND_BACK */) {
                    this._pCurrentContextStates.STENCIL_FAIL = iFail;
                    this._pCurrentContextStates.STENCIL_PASS_DEPTH_FAIL = iZFail;
                    this._pCurrentContextStates.STENCIL_PASS_DEPTH_PASS = iZPass;
                    this._pCurrentContextStates.STENCIL_BACK_FAIL = iFail;
                    this._pCurrentContextStates.STENCIL_BACK_PASS_DEPTH_FAIL = iZFail;
                    this._pCurrentContextStates.STENCIL_BACK_PASS_DEPTH_PASS = iZPass;
                } else if (iWebGLFace === 1028 /* FRONT */) {
                    this._pCurrentContextStates.STENCIL_FAIL = iFail;
                    this._pCurrentContextStates.STENCIL_PASS_DEPTH_FAIL = iZFail;
                    this._pCurrentContextStates.STENCIL_PASS_DEPTH_PASS = iZPass;
                } else {
                    this._pCurrentContextStates.STENCIL_BACK_FAIL = iFail;
                    this._pCurrentContextStates.STENCIL_BACK_PASS_DEPTH_FAIL = iZFail;
                    this._pCurrentContextStates.STENCIL_BACK_PASS_DEPTH_PASS = iZPass;
                }
            };

            WebGLRenderer.prototype._getTextureStateManager = function () {
                return this._pTextureStateManager;
            };

            WebGLRenderer.prototype._beginRender = function () {
                this.enable(3089 /* SCISSOR_TEST */);
                this.disable(3042 /* BLEND */);
            };

            WebGLRenderer.prototype._printTime = function () {
                var _iTotalTime = 0;
                for (var i = 0; i < this._time.length; i++) {
                    _iTotalTime += this._time[i];
                }

                var _pPrinted = new Array(this._time.length);

                for (var i = 0; i < this._time.length; i++) {
                    _pPrinted[i] = (this._time[i] / _iTotalTime).toFixed(2);
                }

                akra.logger.log(_pPrinted.join("% "));
                akra.logger.log(this._time.join("ms "));
            };

            WebGLRenderer.prototype._renderEntry = function (pEntry) {
                var pViewport = pEntry.viewport;
                if (akra.isNull(pViewport)) {
                    akra.logger.log(pEntry);
                }
                var pRenderTarget = pViewport.getTarget();
                var pInput = pEntry.input;
                var pMaker = pEntry.maker;

                if (akra.config.__VIEW_INTERNALS__) {
                    console.log(pEntry);
                }

                if (!akra.isNull(pEntry.renderTarget)) {
                    this._setRenderTarget(pEntry.renderTarget);
                    this._lockRenderTarget();

                    this._setViewportForRender(pViewport);

                    this._unlockRenderTarget();
                } else {
                    this._setViewportForRender(pViewport);
                }

                var isNeedPopRenderStates = this.applyInputRenderStates(pInput.renderStates);

                var pWebGLProgram = (pMaker).getShaderProgram();

                this.useWebGLProgram(pWebGLProgram.getWebGLProgram());

                this.enableWebGLVertexAttribs(pWebGLProgram.getTotalAttributes());

                var pAttribLocations = pWebGLProgram._getActiveAttribLocations();
                var pAttributeInfo = pMaker.getAttributeInfo();

                var pBufferMap = pEntry.bufferMap;

                if (!akra.isNull(pBufferMap.getIndex())) {
                    this.bindWebGLBuffer(34963 /* ELEMENT_ARRAY_BUFFER */, pBufferMap.getIndex().getBuffer().getWebGLBuffer());
                }

                for (var i = 0; i < pAttributeInfo.length; i++) {
                    var sAttrName = pAttributeInfo[i].name;
                    var sAttrSemantic = pAttributeInfo[i].semantic;
                    var iLoc = pAttribLocations[sAttrName];
                    var pFlow = pInput.attrs[i];
                    var pData = null;
                    var sSemantics = null;

                    if (pFlow.type === 1 /* MAPPABLE */) {
                        pData = pFlow.mapper.data;
                        sSemantics = pFlow.mapper.semantics;
                    } else {
                        pData = pFlow.data;
                        sSemantics = sAttrSemantic;
                    }

                    var pDecl = pData.getVertexDeclaration();
                    var pVertexElement = pDecl.findElement(sSemantics);

                    this.bindWebGLBuffer(34962 /* ARRAY_BUFFER */, pData.getBuffer().getWebGLBuffer());
                    this._pWebGLContext.vertexAttribPointer(iLoc, pVertexElement.count, pVertexElement.type, false, pData.getStride(), pVertexElement.offset);
                }

                var pUniformNames = pMaker.getUniformNames();

                for (var i = 0; i < pUniformNames.length; i++) {
                    pMaker.setUniform(i, pInput.uniforms[i]);
                }

                pEntry.bufferMap._draw();

                if (isNeedPopRenderStates) {
                    this._popRenderStates(false);
                }
            };

            WebGLRenderer.prototype._endRender = function () {
                this.disable(3089 /* SCISSOR_TEST */);
                this._pTextureStateManager.reset();
            };

            WebGLRenderer.prototype._setViewport = function (pViewport) {
                if (akra.isNull(pViewport)) {
                    this._pActiveViewport = null;
                    this._setRenderTarget(null);
                    return;
                }

                var isViewportUpdate = pViewport !== this._pActiveViewport || pViewport.isUpdated();
                var isRenderTargetUpdate = pViewport.getTarget() !== this._pActiveRenderTarget;

                if (isViewportUpdate || isRenderTargetUpdate) {
                    var pTarget = pViewport.getTarget();

                    this._setRenderTarget(pTarget);

                    if (isViewportUpdate) {
                        this._pActiveViewport = pViewport;

                        var x = pViewport.getActualLeft(), y = pViewport.getActualTop(), w = pViewport.getActualWidth(), h = pViewport.getActualHeight();

                        this._pWebGLContext.viewport(x, y, w, h);
                        this._pWebGLContext.scissor(x, y, w, h);

                        // if(w !== 2048){
                        // 	logger.log(x, y, w, h, pViewport.getGuid());
                        // }
                        pViewport._clearUpdatedFlag();
                    }
                }
            };

            WebGLRenderer.prototype._setRenderTarget = function (pTarget) {
                // if(true){
                // 	return;
                // }
                //May be unbind()
                if (this._isLockRenderTarget()) {
                    return;
                }

                this._pActiveRenderTarget = pTarget;

                if (!akra.isNull(pTarget)) {
                    var pFrameBuffer = pTarget.getCustomAttribute("FBO");
                    if (!akra.isNull(pFrameBuffer)) {
                        pFrameBuffer._bind();
                    } else {
                        this.bindWebGLFramebuffer(36160 /* FRAMEBUFFER */, null);
                    }
                }
            };

            WebGLRenderer.prototype._setCullingMode = function (eMode) {
                var iWebGLCullMode = 0;

                switch (eMode) {
                    case 1 /* NONE */:
                        this.disable(2884 /* CULL_FACE */);
                        return;

                    default:
                    case 2 /* CLOCKWISE */:
                        iWebGLCullMode = 1028 /* FRONT */;
                        break;

                    case 3 /* ANTICLOCKWISE */:
                        iWebGLCullMode = 1029 /* BACK */;
                        break;
                }

                this.enable(2884 /* CULL_FACE */);
                this.cullFace(iWebGLCullMode);
            };

            WebGLRenderer.prototype._setDepthBufferParams = function (bDepthTest, bDepthWrite, eDepthFunction, fClearDepth) {
                if (typeof fClearDepth === "undefined") { fClearDepth = 1.; }
                if (bDepthTest) {
                    this.clearDepth(fClearDepth);
                    this.enable(2929 /* DEPTH_TEST */);
                } else {
                    this.disable(2929 /* DEPTH_TEST */);
                }

                var iWebGLDepthFunc = this.convertCompareFunction(eDepthFunction);

                this.depthMask(bDepthWrite);
                this.depthFunc(iWebGLDepthFunc);
            };

            WebGLRenderer.prototype.isDebug = function () {
                return !akra.isNull(this._pWebGLInternalContext);
            };

            WebGLRenderer.prototype.getHTMLCanvas = function () {
                return this._pCanvas;
            };

            WebGLRenderer.prototype.getWebGLContext = function () {
                return this._pWebGLContext;
            };

            /** Buffer Objects. */
            WebGLRenderer.prototype.bindWebGLBuffer = function (eTarget, pBuffer) {
                this._pWebGLContext.bindBuffer(eTarget, pBuffer);
            };

            WebGLRenderer.prototype.createWebGLBuffer = function () {
                return this._pWebGLContext.createBuffer();
            };

            WebGLRenderer.prototype.deleteWebGLBuffer = function (pBuffer) {
                this._pWebGLContext.deleteBuffer(pBuffer);
            };

            /** Texture Objects. */
            WebGLRenderer.prototype.bindWebGLTexture = function (eTarget, pTexture) {
                //if(this._pTextureSlotList[this._iCurrentTextureSlot] !== pTexture){
                this._pWebGLContext.bindTexture(eTarget, pTexture);
                this._pTextureSlotList[this._iCurrentTextureSlot] = pTexture;
                //}
            };

            WebGLRenderer.prototype.activateWebGLTexture = function (iWebGLSlot) {
                this._pWebGLContext.activeTexture(iWebGLSlot);
                // this._iCurrentTextureSlot = iWebGLSlot - gl.TEXTURE0;
            };

            WebGLRenderer.prototype.activateWebGLTextureInAutoSlot = function (eTarget, pTexture) {
                // var iSlot: uint = this._pTextureSlotList.indexOf(pTexture);
                // if(iSlot === -1) {
                var iSlot = this._iNextTextureSlot;

                this._iNextTextureSlot++;

                if (this._iNextTextureSlot === akra.webgl.maxTextureImageUnits) {
                    this._iNextTextureSlot = 0;
                }

                this.activateWebGLTexture(33984 /* TEXTURE0 */ + iSlot);
                this.bindWebGLTexture(eTarget, pTexture);

                // }
                // else {
                // 	this.activateWebGLTexture(gl.TEXTURE0 + iSlot);
                // }
                return iSlot;
            };

            WebGLRenderer.prototype.createWebGLTexture = function () {
                return this._pWebGLContext.createTexture();
            };

            WebGLRenderer.prototype.deleteWebGLTexture = function (pTexture) {
                this._pWebGLContext.deleteTexture(pTexture);
            };

            /** Framebuffer Objects */
            WebGLRenderer.prototype.createWebGLFramebuffer = function () {
                if (this._pWebGLFramebufferList.length === 0) {
                    akra.logger.critical("WebGL framebuffer limit exidit");
                }

                return this._pWebGLFramebufferList.pop();
            };

            WebGLRenderer.prototype.bindWebGLFramebuffer = function (eTarget, pBuffer) {
                this._pWebGLContext.bindFramebuffer(eTarget, pBuffer);
                //this._pCurrentContextStates.framebuffer = pBuffer;
            };

            WebGLRenderer.prototype.bindWebGLFramebufferTexture2D = function (eTarget, eAttachment, eTexTarget, pTexture, iMipLevel) {
                if (typeof iMipLevel === "undefined") { iMipLevel = 0; }
                this._pWebGLContext.framebufferTexture2D(eTarget, eAttachment, eTexTarget, pTexture, iMipLevel);
            };

            WebGLRenderer.prototype.deleteWebGLFramebuffer = function (pBuffer) {
                this._pWebGLFramebufferList.push(pBuffer);
            };

            /** Renderbuffer Objects */
            WebGLRenderer.prototype.createWebGLRenderbuffer = function () {
                return this._pWebGLContext.createRenderbuffer();
            };

            WebGLRenderer.prototype.bindWebGLRenderbuffer = function (eTarget, pBuffer) {
                this._pWebGLContext.bindRenderbuffer(eTarget, pBuffer);
            };

            WebGLRenderer.prototype.deleteWebGLRenderbuffer = function (pBuffer) {
                this._pWebGLContext.deleteRenderbuffer(pBuffer);
            };

            WebGLRenderer.prototype.createWebGLProgram = function () {
                return this._pWebGLContext.createProgram();
            };

            WebGLRenderer.prototype.deleteWebGLProgram = function (pProgram) {
                this._pWebGLContext.deleteProgram(pProgram);
            };

            WebGLRenderer.prototype.useWebGLProgram = function (pProgram) {
                this._pWebGLContext.useProgram(pProgram);
            };

            WebGLRenderer.prototype.enableWebGLVertexAttribs = function (iTotal) {
                if (this._nActiveAttributes > iTotal) {
                    for (var i = iTotal; i < this._nActiveAttributes; i++) {
                        this._pWebGLContext.disableVertexAttribArray(i);
                    }
                } else {
                    for (var i = this._nActiveAttributes; i < iTotal; i++) {
                        this._pWebGLContext.enableVertexAttribArray(i);
                    }
                }

                this._nActiveAttributes = iTotal;
            };

            WebGLRenderer.prototype.disableAllWebGLVertexAttribs = function () {
                var i = 0;
                for (i = 0; i < this._nActiveAttributes; i++) {
                    this._pWebGLContext.disableVertexAttribArray(i);
                }

                this._nActiveAttributes = 0;
            };

            WebGLRenderer.prototype.getDefaultCanvas = function () {
                return this._pDefaultCanvas;
            };

            WebGLRenderer.prototype.clearFrameBuffer = function (iBuffers, cColor, fDepth, iStencil) {
                var bScissorTestEnable = this.getParameter(3089 /* SCISSOR_TEST */);

                this.enable(3089 /* SCISSOR_TEST */);

                var iWebGLFlag = 0;
                var bOldDepthWrite = this.getParameter(2930 /* DEPTH_WRITEMASK */);

                if (iBuffers & 1 /* COLOR */) {
                    iWebGLFlag |= 16384 /* COLOR_BUFFER_BIT */;
                    this._pWebGLContext.clearColor(cColor.r, cColor.g, cColor.b, cColor.a);
                }

                if (iBuffers & 2 /* DEPTH */) {
                    iWebGLFlag |= 256 /* DEPTH_BUFFER_BIT */;

                    if (!bOldDepthWrite) {
                        this._pWebGLContext.depthMask(true);
                    }

                    this._pWebGLContext.clearDepth(fDepth);
                }

                if (iBuffers & 4 /* STENCIL */) {
                    iWebGLFlag |= 1024 /* STENCIL_BUFFER_BIT */;

                    this._pWebGLContext.stencilMask(0xFFFFFFFF);
                    this._pWebGLContext.clearStencil(iStencil);
                }

                this._pWebGLContext.clear(iWebGLFlag);

                if (!bOldDepthWrite && (iBuffers & 2 /* DEPTH */)) {
                    this._pWebGLContext.depthMask(false);
                }

                if (!bScissorTestEnable) {
                    this.disable(3089 /* SCISSOR_TEST */);
                }
            };

            WebGLRenderer.prototype._disableTextureUnitsFrom = function (iUnit) {
                for (var i = iUnit; i < this._pTextureSlotList.length; i++) {
                    this._pTextureSlotList[i] = null;
                }
            };

            WebGLRenderer.prototype._pushRenderStates = function () {
                this._pRenderStatesPool.push(this._pCurrentContextStates);

                this._pCurrentContextStates = WebGLRenderer.copyWebGLContextStates(this.getFreeRenderStates(), this._pCurrentContextStates);
            };

            WebGLRenderer.prototype._popRenderStates = function (isForce) {
                if (this._pRenderStatesPool.getLength() === 0) {
                    akra.debug.warn("Can not pop context render states. Pool of context is empty.");
                }

                this._pFreeRenderStatesPool.push(this._pCurrentContextStates);

                if (isForce) {
                    this.forceUpdateContextRenderStates();
                }

                var pCurreentStates = this._pCurrentContextStates;
                this._pCurrentContextStates = this._pRenderStatesPool.pop();

                this.restoreWebGLContextRenderStates(pCurreentStates);
            };

            WebGLRenderer.prototype.restoreWebGLContextRenderStates = function (pStatesFrom) {
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
            };

            WebGLRenderer.prototype.restoreBlendStates = function (pStatesFrom) {
                var pRestoreStates = this._pCurrentContextStates;

                if (pRestoreStates.BLEND !== pStatesFrom.BLEND) {
                    if (pRestoreStates.BLEND) {
                        this._pWebGLContext.enable(3042 /* BLEND */);
                    } else {
                        this._pWebGLContext.disable(3042 /* BLEND */);
                    }
                }

                if (pRestoreStates.BLEND_EQUATION_RGB !== pStatesFrom.BLEND_EQUATION_RGB || pRestoreStates.BLEND_EQUATION_ALPHA !== pStatesFrom.BLEND_EQUATION_ALPHA) {
                    if (pRestoreStates.BLEND_EQUATION_RGB === pRestoreStates.BLEND_EQUATION_ALPHA) {
                        this._pWebGLContext.blendEquation(pRestoreStates.BLEND_EQUATION_RGB);
                    } else {
                        this._pWebGLContext.blendEquationSeparate(pRestoreStates.BLEND_EQUATION_RGB, pRestoreStates.BLEND_EQUATION_ALPHA);
                    }
                }

                if (pRestoreStates.BLEND_DST_RGB !== pStatesFrom.BLEND_DST_RGB || pRestoreStates.BLEND_DST_ALPHA !== pStatesFrom.BLEND_DST_ALPHA || pRestoreStates.BLEND_SRC_RGB !== pStatesFrom.BLEND_SRC_RGB || pRestoreStates.BLEND_SRC_ALPHA !== pStatesFrom.BLEND_SRC_ALPHA) {
                    if (pRestoreStates.BLEND_DST_RGB === pRestoreStates.BLEND_DST_ALPHA && pRestoreStates.BLEND_SRC_RGB === pRestoreStates.BLEND_SRC_ALPHA) {
                        this._pWebGLContext.blendFunc(pRestoreStates.BLEND_SRC_RGB, pRestoreStates.BLEND_DST_RGB);
                    } else {
                        this._pWebGLContext.blendFuncSeparate(pRestoreStates.BLEND_SRC_RGB, pRestoreStates.BLEND_DST_RGB, pRestoreStates.BLEND_SRC_ALPHA, pRestoreStates.BLEND_DST_ALPHA);
                    }
                }
            };

            WebGLRenderer.prototype.restoreCullStates = function (pStatesFrom) {
                var pRestoreStates = this._pCurrentContextStates;

                if (pRestoreStates.CULL_FACE !== pStatesFrom.CULL_FACE) {
                    if (pRestoreStates.CULL_FACE) {
                        this._pWebGLContext.enable(2884 /* CULL_FACE */);
                    } else {
                        this._pWebGLContext.disable(2884 /* CULL_FACE */);
                    }
                }

                if (pRestoreStates.CULL_FACE_MODE !== pStatesFrom.CULL_FACE_MODE) {
                    this._pWebGLContext.cullFace(pRestoreStates.CULL_FACE_MODE);
                }
            };

            WebGLRenderer.prototype.restoreColorStates = function (pStatesFrom) {
                var pRestoreStates = this._pCurrentContextStates;

                if (pRestoreStates.COLOR_CLEAR_VALUE[0] !== pStatesFrom.COLOR_CLEAR_VALUE[0] || pRestoreStates.COLOR_CLEAR_VALUE[1] !== pStatesFrom.COLOR_CLEAR_VALUE[1] || pRestoreStates.COLOR_CLEAR_VALUE[2] !== pStatesFrom.COLOR_CLEAR_VALUE[2] || pRestoreStates.COLOR_CLEAR_VALUE[3] !== pStatesFrom.COLOR_CLEAR_VALUE[3]) {
                    this._pWebGLContext.clearColor(pRestoreStates.COLOR_CLEAR_VALUE[0], pRestoreStates.COLOR_CLEAR_VALUE[1], pRestoreStates.COLOR_CLEAR_VALUE[2], pRestoreStates.COLOR_CLEAR_VALUE[3]);
                }

                if (pRestoreStates.COLOR_WRITEMASK[0] !== pStatesFrom.COLOR_WRITEMASK[0] || pRestoreStates.COLOR_WRITEMASK[1] !== pStatesFrom.COLOR_WRITEMASK[1] || pRestoreStates.COLOR_WRITEMASK[2] !== pStatesFrom.COLOR_WRITEMASK[2] || pRestoreStates.COLOR_WRITEMASK[3] !== pStatesFrom.COLOR_WRITEMASK[3]) {
                    this._pWebGLContext.colorMask(pRestoreStates.COLOR_WRITEMASK[0], pRestoreStates.COLOR_WRITEMASK[1], pRestoreStates.COLOR_WRITEMASK[2], pRestoreStates.COLOR_WRITEMASK[3]);
                }
            };

            WebGLRenderer.prototype.restoreDepthStates = function (pStatesFrom) {
                var pRestoreStates = this._pCurrentContextStates;

                if (pRestoreStates.DEPTH_TEST !== pStatesFrom.DEPTH_TEST) {
                    if (pRestoreStates.DEPTH_TEST) {
                        this._pWebGLContext.enable(2929 /* DEPTH_TEST */);
                    } else {
                        this._pWebGLContext.disable(2929 /* DEPTH_TEST */);
                    }
                }

                if (pRestoreStates.DEPTH_CLEAR_VALUE !== pStatesFrom.DEPTH_CLEAR_VALUE) {
                    this._pWebGLContext.clearDepth(pRestoreStates.DEPTH_CLEAR_VALUE);
                }

                if (pRestoreStates.DEPTH_FUNC !== pStatesFrom.DEPTH_FUNC) {
                    this._pWebGLContext.depthFunc(pRestoreStates.DEPTH_FUNC);
                }

                if (pRestoreStates.DEPTH_WRITEMASK !== pStatesFrom.DEPTH_WRITEMASK) {
                    this._pWebGLContext.depthMask(pRestoreStates.DEPTH_WRITEMASK);
                }

                if (pRestoreStates.DEPTH_RANGE[0] !== pStatesFrom.DEPTH_RANGE[0] || pRestoreStates.DEPTH_RANGE[1] !== pStatesFrom.DEPTH_RANGE[1]) {
                    this._pWebGLContext.depthRange(pRestoreStates.DEPTH_RANGE[0], pRestoreStates.DEPTH_RANGE[1]);
                }
            };

            WebGLRenderer.prototype.restoreDitherStates = function (pStatesFrom) {
                var pRestoreStates = this._pCurrentContextStates;

                if (pRestoreStates.DITHER !== pStatesFrom.DITHER) {
                    if (pRestoreStates.DITHER) {
                        this._pWebGLContext.enable(3024 /* DITHER */);
                    } else {
                        this._pWebGLContext.disable(3024 /* DITHER */);
                    }
                }
            };

            WebGLRenderer.prototype.restoreFrontFaceStates = function (pStatesFrom) {
                var pRestoreStates = this._pCurrentContextStates;

                if (pRestoreStates.FRONT_FACE !== pStatesFrom.FRONT_FACE) {
                    this._pWebGLContext.frontFace(pRestoreStates.FRONT_FACE);
                }
            };

            WebGLRenderer.prototype.restorePolygonStates = function (pStatesFrom) {
                var pRestoreStates = this._pCurrentContextStates;

                if (pRestoreStates.POLYGON_OFFSET_FILL !== pStatesFrom.POLYGON_OFFSET_FILL) {
                    if (pRestoreStates.POLYGON_OFFSET_FILL) {
                        this._pWebGLContext.enable(32823 /* POLYGON_OFFSET_FILL */);
                    } else {
                        this._pWebGLContext.disable(32823 /* POLYGON_OFFSET_FILL */);
                    }
                }

                if (pRestoreStates.POLYGON_OFFSET_FACTOR !== pStatesFrom.POLYGON_OFFSET_FACTOR || pRestoreStates.POLYGON_OFFSET_UNITS !== pStatesFrom.POLYGON_OFFSET_UNITS) {
                    this._pWebGLContext.polygonOffset(pRestoreStates.POLYGON_OFFSET_FACTOR, pRestoreStates.POLYGON_OFFSET_UNITS);
                }
            };

            WebGLRenderer.prototype.restoreSampleStates = function (pStatesFrom) {
                var pRestoreStates = this._pCurrentContextStates;

                if (pRestoreStates.SAMPLE_COVERAGE_VALUE !== pStatesFrom.SAMPLE_COVERAGE_VALUE || pRestoreStates.SAMPLE_COVERAGE_INVERT !== pStatesFrom.SAMPLE_COVERAGE_INVERT) {
                    this._pWebGLContext.sampleCoverage(pRestoreStates.SAMPLE_COVERAGE_VALUE, pRestoreStates.SAMPLE_COVERAGE_INVERT);
                }
            };

            WebGLRenderer.prototype.restoreScissorStates = function (pStatesFrom) {
                var pRestoreStates = this._pCurrentContextStates;

                if (pRestoreStates.SCISSOR_TEST !== pStatesFrom.SCISSOR_TEST) {
                    if (pRestoreStates.SCISSOR_TEST) {
                        this._pWebGLContext.enable(3089 /* SCISSOR_TEST */);
                    } else {
                        this._pWebGLContext.disable(3089 /* SCISSOR_TEST */);
                    }
                }
            };

            WebGLRenderer.prototype.restoreStencilStates = function (pStatesFrom) {
                var pRestoreStates = this._pCurrentContextStates;

                if (pRestoreStates.STENCIL_TEST !== pStatesFrom.STENCIL_TEST) {
                    if (pRestoreStates.STENCIL_TEST) {
                        this._pWebGLContext.enable(2960 /* STENCIL_TEST */);
                    } else {
                        this._pWebGLContext.disable(2960 /* STENCIL_TEST */);
                    }
                }

                if (pRestoreStates.STENCIL_CLEAR_VALUE !== pStatesFrom.STENCIL_CLEAR_VALUE) {
                    this._pWebGLContext.clearStencil(pRestoreStates.STENCIL_CLEAR_VALUE);
                }

                if (pRestoreStates.STENCIL_FUNC !== pStatesFrom.STENCIL_FUNC || pRestoreStates.STENCIL_REF !== pStatesFrom.STENCIL_REF || pRestoreStates.STENCIL_VALUE_MASK !== pStatesFrom.STENCIL_VALUE_MASK || pRestoreStates.STENCIL_BACK_FUNC !== pStatesFrom.STENCIL_BACK_FUNC || pRestoreStates.STENCIL_BACK_REF !== pStatesFrom.STENCIL_BACK_REF || pRestoreStates.STENCIL_BACK_VALUE_MASK !== pStatesFrom.STENCIL_BACK_VALUE_MASK) {
                    if (pRestoreStates.STENCIL_FUNC === pRestoreStates.STENCIL_BACK_FUNC || pRestoreStates.STENCIL_REF === pRestoreStates.STENCIL_BACK_REF || pRestoreStates.STENCIL_VALUE_MASK === pRestoreStates.STENCIL_BACK_VALUE_MASK) {
                        this._pWebGLContext.stencilFunc(pRestoreStates.STENCIL_FUNC, pRestoreStates.STENCIL_REF, pRestoreStates.STENCIL_VALUE_MASK);
                    } else {
                        this._pWebGLContext.stencilFuncSeparate(1028 /* FRONT */, pRestoreStates.STENCIL_FUNC, pRestoreStates.STENCIL_REF, pRestoreStates.STENCIL_VALUE_MASK);

                        this._pWebGLContext.stencilFuncSeparate(1029 /* BACK */, pRestoreStates.STENCIL_BACK_FUNC, pRestoreStates.STENCIL_BACK_REF, pRestoreStates.STENCIL_BACK_VALUE_MASK);
                    }
                }

                if (pRestoreStates.STENCIL_WRITEMASK !== pStatesFrom.STENCIL_WRITEMASK || pRestoreStates.STENCIL_BACK_WRITEMASK !== pStatesFrom.STENCIL_BACK_WRITEMASK) {
                    if (pRestoreStates.STENCIL_WRITEMASK === pRestoreStates.STENCIL_BACK_WRITEMASK) {
                        this._pWebGLContext.stencilMask(pRestoreStates.STENCIL_WRITEMASK);
                    } else {
                        this._pWebGLContext.stencilMaskSeparate(1028 /* FRONT */, pRestoreStates.STENCIL_WRITEMASK);
                        this._pWebGLContext.stencilMaskSeparate(1029 /* BACK */, pRestoreStates.STENCIL_WRITEMASK);
                    }
                }

                if (pRestoreStates.STENCIL_FAIL !== pStatesFrom.STENCIL_FAIL || pRestoreStates.STENCIL_PASS_DEPTH_FAIL !== pStatesFrom.STENCIL_PASS_DEPTH_FAIL || pRestoreStates.STENCIL_PASS_DEPTH_PASS !== pStatesFrom.STENCIL_PASS_DEPTH_PASS || pRestoreStates.STENCIL_BACK_FAIL !== pStatesFrom.STENCIL_BACK_FAIL || pRestoreStates.STENCIL_BACK_PASS_DEPTH_FAIL !== pStatesFrom.STENCIL_BACK_PASS_DEPTH_FAIL || pRestoreStates.STENCIL_BACK_PASS_DEPTH_PASS !== pStatesFrom.STENCIL_BACK_PASS_DEPTH_PASS) {
                    if (pRestoreStates.STENCIL_FAIL === pRestoreStates.STENCIL_BACK_FAIL || pRestoreStates.STENCIL_PASS_DEPTH_FAIL === pRestoreStates.STENCIL_BACK_PASS_DEPTH_FAIL || pRestoreStates.STENCIL_PASS_DEPTH_PASS === pRestoreStates.STENCIL_BACK_PASS_DEPTH_PASS) {
                        this._pWebGLContext.stencilOp(pRestoreStates.STENCIL_FAIL, pRestoreStates.STENCIL_PASS_DEPTH_FAIL, pRestoreStates.STENCIL_PASS_DEPTH_PASS);
                    } else {
                        this._pWebGLContext.stencilOpSeparate(1028 /* FRONT */, pRestoreStates.STENCIL_FAIL, pRestoreStates.STENCIL_PASS_DEPTH_FAIL, pRestoreStates.STENCIL_PASS_DEPTH_PASS);

                        this._pWebGLContext.stencilOpSeparate(1029 /* BACK */, pRestoreStates.STENCIL_BACK_FAIL, pRestoreStates.STENCIL_BACK_PASS_DEPTH_FAIL, pRestoreStates.STENCIL_BACK_PASS_DEPTH_PASS);
                    }
                }
            };

            WebGLRenderer.prototype.restorePackStates = function (pStatesFrom) {
                var pRestoreStates = this._pCurrentContextStates;

                if (pRestoreStates.UNPACK_ALIGNMENT !== pStatesFrom.UNPACK_ALIGNMENT) {
                    this._pWebGLContext.pixelStorei(3317 /* UNPACK_ALIGNMENT */, pRestoreStates.UNPACK_ALIGNMENT);
                }

                if (pRestoreStates.PACK_ALIGNMENT !== pStatesFrom.PACK_ALIGNMENT) {
                    this._pWebGLContext.pixelStorei(3333 /* PACK_ALIGNMENT */, pRestoreStates.PACK_ALIGNMENT);
                }
            };

            WebGLRenderer.prototype.forceUpdateContextRenderStates = function () {
                WebGLRenderer.initStatesFromWebGLContext(this._pCurrentContextStates, this._pWebGLContext);
            };

            WebGLRenderer.prototype.getFreeRenderStates = function () {
                if (this._pFreeRenderStatesPool.getLength() > 0) {
                    return this._pFreeRenderStatesPool.pop();
                } else {
                    return WebGLRenderer.createWebGLContextStates();
                }
            };

            WebGLRenderer.prototype.applyInputRenderStates = function (pStates) {
                var isStatesChanged = false;
                var iWebGLValue = 0;

                if (pStates[0 /* BLENDENABLE */] !== 0 /* UNDEF */) {
                    iWebGLValue = this.convertRenderStateValue(pStates[0 /* BLENDENABLE */]);
                    if (this._pCurrentContextStates.BLEND !== !!iWebGLValue) {
                        !isStatesChanged && this._pushRenderStates();
                        isStatesChanged = true;
                        this._pCurrentContextStates.BLEND = !!iWebGLValue;

                        if (this._pCurrentContextStates.BLEND) {
                            this._pWebGLContext.enable(3042 /* BLEND */);
                        } else {
                            this._pWebGLContext.disable(3042 /* BLEND */);
                        }
                    }
                }

                if (pStates[1 /* CULLFACEENABLE */] !== 0 /* UNDEF */) {
                    iWebGLValue = this.convertRenderStateValue(pStates[1 /* CULLFACEENABLE */]);
                    if (this._pCurrentContextStates.CULL_FACE !== !!iWebGLValue) {
                        !isStatesChanged && this._pushRenderStates();
                        isStatesChanged = true;
                        this._pCurrentContextStates.CULL_FACE = !!iWebGLValue;

                        if (this._pCurrentContextStates.CULL_FACE) {
                            this._pWebGLContext.enable(2884 /* CULL_FACE */);
                        } else {
                            this._pWebGLContext.disable(2884 /* CULL_FACE */);
                        }
                    }
                }

                if (pStates[2 /* ZENABLE */] !== 0 /* UNDEF */) {
                    iWebGLValue = this.convertRenderStateValue(pStates[2 /* ZENABLE */]);
                    if (this._pCurrentContextStates.DEPTH_TEST !== !!iWebGLValue) {
                        !isStatesChanged && this._pushRenderStates();
                        isStatesChanged = true;
                        this._pCurrentContextStates.DEPTH_TEST = !!iWebGLValue;

                        if (this._pCurrentContextStates.DEPTH_TEST) {
                            this._pWebGLContext.enable(2929 /* DEPTH_TEST */);
                        } else {
                            this._pWebGLContext.disable(2929 /* DEPTH_TEST */);
                        }
                    }
                }

                if (pStates[4 /* DITHERENABLE */] !== 0 /* UNDEF */) {
                    iWebGLValue = this.convertRenderStateValue(pStates[4 /* DITHERENABLE */]);
                    if (this._pCurrentContextStates.DITHER !== !!iWebGLValue) {
                        !isStatesChanged && this._pushRenderStates();
                        isStatesChanged = true;
                        this._pCurrentContextStates.DITHER = !!iWebGLValue;

                        if (this._pCurrentContextStates.DITHER) {
                            this._pWebGLContext.enable(3024 /* DITHER */);
                        } else {
                            this._pWebGLContext.disable(3024 /* DITHER */);
                        }
                    }
                }

                if (pStates[3 /* ZWRITEENABLE */] !== 0 /* UNDEF */) {
                    !isStatesChanged && this._pushRenderStates();
                    isStatesChanged = true;
                    this._pCurrentContextStates.DEPTH_WRITEMASK = this.convertRenderStateValue(pStates[3 /* ZWRITEENABLE */]);

                    this._pWebGLContext.depthMask(this._pCurrentContextStates.DEPTH_WRITEMASK);
                }

                if (pStates[5 /* SCISSORTESTENABLE */] !== 0 /* UNDEF */) {
                    iWebGLValue = this.convertRenderStateValue(pStates[5 /* SCISSORTESTENABLE */]);
                    if (this._pCurrentContextStates.SCISSOR_TEST !== !!iWebGLValue) {
                        !isStatesChanged && this._pushRenderStates();
                        isStatesChanged = true;
                        this._pCurrentContextStates.SCISSOR_TEST = !!iWebGLValue;

                        if (this._pCurrentContextStates.SCISSOR_TEST) {
                            this._pWebGLContext.enable(3089 /* SCISSOR_TEST */);
                        } else {
                            this._pWebGLContext.disable(3089 /* SCISSOR_TEST */);
                        }
                    }
                }

                if (pStates[6 /* STENCILTESTENABLE */] !== 0 /* UNDEF */) {
                    iWebGLValue = this.convertRenderStateValue(pStates[6 /* STENCILTESTENABLE */]);
                    if (this._pCurrentContextStates.STENCIL_TEST !== !!iWebGLValue) {
                        !isStatesChanged && this._pushRenderStates();
                        isStatesChanged = true;
                        this._pCurrentContextStates.STENCIL_TEST = !!iWebGLValue;

                        if (this._pCurrentContextStates.STENCIL_TEST) {
                            this._pWebGLContext.enable(2960 /* STENCIL_TEST */);
                        } else {
                            this._pWebGLContext.disable(2960 /* STENCIL_TEST */);
                        }
                    }
                }

                if (pStates[7 /* POLYGONOFFSETFILLENABLE */] !== 0 /* UNDEF */) {
                    iWebGLValue = this.convertRenderStateValue(pStates[7 /* POLYGONOFFSETFILLENABLE */]);
                    if (this._pCurrentContextStates.POLYGON_OFFSET_FILL !== !!iWebGLValue) {
                        !isStatesChanged && this._pushRenderStates();
                        isStatesChanged = true;
                        this._pCurrentContextStates.POLYGON_OFFSET_FILL = !!iWebGLValue;

                        if (this._pCurrentContextStates.POLYGON_OFFSET_FILL) {
                            this._pWebGLContext.enable(32823 /* POLYGON_OFFSET_FILL */);
                        } else {
                            this._pWebGLContext.disable(32823 /* POLYGON_OFFSET_FILL */);
                        }
                    }
                }

                if (pStates[8 /* CULLFACE */] !== 0 /* UNDEF */) {
                    iWebGLValue = this.convertRenderStateValue(pStates[8 /* CULLFACE */]);
                    if (this._pCurrentContextStates.CULL_FACE_MODE !== iWebGLValue) {
                        !isStatesChanged && this._pushRenderStates();
                        isStatesChanged = true;
                        this._pCurrentContextStates.CULL_FACE_MODE = iWebGLValue;

                        this._pWebGLContext.cullFace(this._pCurrentContextStates.CULL_FACE_MODE);
                    }
                }

                if (pStates[9 /* FRONTFACE */] !== 0 /* UNDEF */) {
                    iWebGLValue = this.convertRenderStateValue(pStates[9 /* FRONTFACE */]);
                    if (this._pCurrentContextStates.FRONT_FACE !== iWebGLValue) {
                        !isStatesChanged && this._pushRenderStates();
                        isStatesChanged = true;
                        this._pCurrentContextStates.FRONT_FACE = iWebGLValue;

                        this._pWebGLContext.frontFace(this._pCurrentContextStates.FRONT_FACE);
                    }
                }

                if (pStates[12 /* ZFUNC */] !== 0 /* UNDEF */) {
                    iWebGLValue = this.convertRenderStateValue(pStates[12 /* ZFUNC */]);
                    if (this._pCurrentContextStates.DEPTH_FUNC !== iWebGLValue) {
                        !isStatesChanged && this._pushRenderStates();
                        isStatesChanged = true;
                        this._pCurrentContextStates.DEPTH_FUNC = iWebGLValue;

                        this._pWebGLContext.depthFunc(this._pCurrentContextStates.DEPTH_FUNC);
                    }
                }

                if (pStates[10 /* SRCBLEND */] !== 0 /* UNDEF */ || pStates[11 /* DESTBLEND */] !== 0 /* UNDEF */) {
                    var iWebGLValue1 = this.convertRenderStateValue(pStates[10 /* SRCBLEND */]);
                    var iWebGLValue2 = this.convertRenderStateValue(pStates[11 /* DESTBLEND */]);

                    !isStatesChanged && this._pushRenderStates();
                    isStatesChanged = true;

                    this._pCurrentContextStates.BLEND_SRC_RGB = iWebGLValue1;
                    this._pCurrentContextStates.BLEND_SRC_ALPHA = iWebGLValue1;
                    this._pCurrentContextStates.BLEND_DST_RGB = iWebGLValue2;
                    this._pCurrentContextStates.BLEND_DST_ALPHA = iWebGLValue2;

                    this._pWebGLContext.blendFunc(iWebGLValue1, iWebGLValue2);
                }

                return isStatesChanged;
            };

            WebGLRenderer.prototype.convertRenderStateValue = function (eStateValue) {
                switch (eStateValue) {
                    case 1 /* TRUE */:
                        return 1;
                    case 2 /* FALSE */:
                        return 0;
                    case 3 /* ZERO */:
                        return 0 /* ZERO */;
                    case 4 /* ONE */:
                        return 1 /* ONE */;
                    case 5 /* SRCCOLOR */:
                        return 768 /* SRC_COLOR */;
                    case 6 /* INVSRCCOLOR */:
                        return 769 /* ONE_MINUS_SRC_COLOR */;
                    case 7 /* SRCALPHA */:
                        return 770 /* SRC_ALPHA */;
                    case 8 /* INVSRCALPHA */:
                        return 771 /* ONE_MINUS_SRC_ALPHA */;
                    case 9 /* DESTALPHA */:
                        return 772 /* DST_ALPHA */;
                    case 10 /* INVDESTALPHA */:
                        return 773 /* ONE_MINUS_DST_ALPHA */;
                    case 11 /* DESTCOLOR */:
                        return 774 /* DST_COLOR */;
                    case 12 /* INVDESTCOLOR */:
                        return 775 /* ONE_MINUS_DST_COLOR */;
                    case 13 /* SRCALPHASAT */:
                        return 776 /* SRC_ALPHA_SATURATE */;
                    case 14 /* NONE */:
                        return 0 /* NONE */;
                    case 15 /* CW */:
                        return 2304 /* CW */;
                    case 16 /* CCW */:
                        return 2305 /* CCW */;
                    case 17 /* FRONT */:
                        return 1028 /* FRONT */;
                    case 18 /* BACK */:
                        return 1029 /* BACK */;
                    case 19 /* FRONT_AND_BACK */:
                        return 1032 /* FRONT_AND_BACK */;
                    case 20 /* NEVER */:
                        return 512 /* NEVER */;
                    case 21 /* LESS */:
                        return 513 /* LESS */;
                    case 22 /* EQUAL */:
                        return 514 /* EQUAL */;
                    case 23 /* LESSEQUAL */:
                        return 515 /* LEQUAL */;
                    case 24 /* GREATER */:
                        return 516 /* GREATER */;
                    case 25 /* NOTEQUAL */:
                        return 517 /* NOTEQUAL */;
                    case 26 /* GREATEREQUAL */:
                        return 518 /* GEQUAL */;
                    case 27 /* ALWAYS */:
                        return 519 /* ALWAYS */;
                }
            };

            WebGLRenderer.prototype.convertCompareFunction = function (eFunc) {
                switch (eFunc) {
                    case 0 /* ALWAYS_FAIL */:
                        return 512 /* NEVER */;
                    case 1 /* ALWAYS_PASS */:
                        return 519 /* ALWAYS */;
                    case 2 /* LESS */:
                        return 513 /* LESS */;
                    case 3 /* LESS_EQUAL */:
                        return 515 /* LEQUAL */;
                    case 4 /* EQUAL */:
                        return 514 /* EQUAL */;
                    case 5 /* NOT_EQUAL */:
                        return 517 /* NOTEQUAL */;
                    case 6 /* GREATER_EQUAL */:
                        return 518 /* GEQUAL */;
                    case 7 /* GREATER */:
                        return 516 /* GREATER */;
                }

                return 519 /* ALWAYS */;
            };

            WebGLRenderer.createWebGLContextStates = function (pStates) {
                if (typeof pStates === "undefined") { pStates = null; }
                return {
                    BLEND: akra.isNull(pStates) ? false : pStates.BLEND,
                    BLEND_COLOR: akra.isNull(pStates) ? new Float32Array(4) : new Float32Array(pStates.BLEND_COLOR),
                    BLEND_DST_ALPHA: akra.isNull(pStates) ? 0 : pStates.BLEND_DST_ALPHA,
                    BLEND_DST_RGB: akra.isNull(pStates) ? 0 : pStates.BLEND_DST_RGB,
                    BLEND_EQUATION_ALPHA: akra.isNull(pStates) ? 0 : pStates.BLEND_EQUATION_ALPHA,
                    BLEND_EQUATION_RGB: akra.isNull(pStates) ? 0 : pStates.BLEND_EQUATION_RGB,
                    BLEND_SRC_ALPHA: akra.isNull(pStates) ? 0 : pStates.BLEND_SRC_ALPHA,
                    BLEND_SRC_RGB: akra.isNull(pStates) ? 0 : pStates.BLEND_SRC_RGB,
                    COLOR_CLEAR_VALUE: akra.isNull(pStates) ? new Float32Array(4) : new Float32Array(pStates.COLOR_CLEAR_VALUE),
                    COLOR_WRITEMASK: akra.isNull(pStates) ? [false, false, false, false] : pStates.COLOR_WRITEMASK.slice(0),
                    CULL_FACE: akra.isNull(pStates) ? false : pStates.CULL_FACE,
                    CULL_FACE_MODE: akra.isNull(pStates) ? 0 : pStates.CULL_FACE_MODE,
                    DEPTH_CLEAR_VALUE: akra.isNull(pStates) ? 0. : pStates.DEPTH_CLEAR_VALUE,
                    DEPTH_FUNC: akra.isNull(pStates) ? 0 : pStates.DEPTH_FUNC,
                    DEPTH_RANGE: akra.isNull(pStates) ? new Float32Array(2) : new Float32Array(pStates.DEPTH_RANGE),
                    DEPTH_TEST: akra.isNull(pStates) ? false : pStates.DEPTH_TEST,
                    DEPTH_WRITEMASK: akra.isNull(pStates) ? false : pStates.DEPTH_WRITEMASK,
                    DITHER: akra.isNull(pStates) ? false : pStates.DITHER,
                    FRONT_FACE: akra.isNull(pStates) ? 0 : pStates.FRONT_FACE,
                    LINE_WIDTH: akra.isNull(pStates) ? 0. : pStates.LINE_WIDTH,
                    POLYGON_OFFSET_FACTOR: akra.isNull(pStates) ? 0. : pStates.POLYGON_OFFSET_FACTOR,
                    POLYGON_OFFSET_FILL: akra.isNull(pStates) ? false : pStates.POLYGON_OFFSET_FILL,
                    POLYGON_OFFSET_UNITS: akra.isNull(pStates) ? 0. : pStates.POLYGON_OFFSET_UNITS,
                    SAMPLE_BUFFERS: akra.isNull(pStates) ? 0 : pStates.SAMPLE_BUFFERS,
                    SAMPLE_COVERAGE_INVERT: akra.isNull(pStates) ? false : pStates.SAMPLE_COVERAGE_INVERT,
                    SAMPLE_COVERAGE_VALUE: akra.isNull(pStates) ? 0. : pStates.SAMPLE_COVERAGE_VALUE,
                    SAMPLES: akra.isNull(pStates) ? 0 : pStates.SAMPLES,
                    SCISSOR_TEST: akra.isNull(pStates) ? false : pStates.SCISSOR_TEST,
                    STENCIL_BACK_FAIL: akra.isNull(pStates) ? 0 : pStates.STENCIL_BACK_FAIL,
                    STENCIL_BACK_FUNC: akra.isNull(pStates) ? 0 : pStates.STENCIL_BACK_FUNC,
                    STENCIL_BACK_PASS_DEPTH_FAIL: akra.isNull(pStates) ? 0 : pStates.STENCIL_BACK_PASS_DEPTH_FAIL,
                    STENCIL_BACK_PASS_DEPTH_PASS: akra.isNull(pStates) ? 0 : pStates.STENCIL_BACK_PASS_DEPTH_PASS,
                    STENCIL_BACK_REF: akra.isNull(pStates) ? 0 : pStates.STENCIL_BACK_REF,
                    STENCIL_BACK_VALUE_MASK: akra.isNull(pStates) ? 0 : pStates.STENCIL_BACK_VALUE_MASK,
                    STENCIL_BACK_WRITEMASK: akra.isNull(pStates) ? 0 : pStates.STENCIL_BACK_WRITEMASK,
                    STENCIL_CLEAR_VALUE: akra.isNull(pStates) ? 0 : pStates.STENCIL_CLEAR_VALUE,
                    STENCIL_FAIL: akra.isNull(pStates) ? 0 : pStates.STENCIL_FAIL,
                    STENCIL_FUNC: akra.isNull(pStates) ? 0 : pStates.STENCIL_FUNC,
                    STENCIL_PASS_DEPTH_FAIL: akra.isNull(pStates) ? 0 : pStates.STENCIL_PASS_DEPTH_FAIL,
                    STENCIL_PASS_DEPTH_PASS: akra.isNull(pStates) ? 0 : pStates.STENCIL_PASS_DEPTH_PASS,
                    STENCIL_REF: akra.isNull(pStates) ? 0 : pStates.STENCIL_REF,
                    STENCIL_TEST: akra.isNull(pStates) ? false : pStates.STENCIL_TEST,
                    STENCIL_VALUE_MASK: akra.isNull(pStates) ? 0 : pStates.STENCIL_VALUE_MASK,
                    STENCIL_WRITEMASK: akra.isNull(pStates) ? 0 : pStates.STENCIL_WRITEMASK,
                    PACK_ALIGNMENT: akra.isNull(pStates) ? 0 : pStates.PACK_ALIGNMENT,
                    UNPACK_ALIGNMENT: akra.isNull(pStates) ? 0 : pStates.UNPACK_ALIGNMENT
                };
            };

            WebGLRenderer.copyWebGLContextStates = function (pStatesTo, pStatesFrom) {
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
            };

            WebGLRenderer.initStatesFromWebGLContext = function (pStatesTo, pWebGLContext) {
                pStatesTo.BLEND = pWebGLContext.getParameter(3042 /* BLEND */);
                pStatesTo.BLEND_COLOR = pWebGLContext.getParameter(32773 /* BLEND_COLOR */);
                pStatesTo.BLEND_DST_ALPHA = pWebGLContext.getParameter(32970 /* BLEND_DST_ALPHA */);
                pStatesTo.BLEND_DST_RGB = pWebGLContext.getParameter(32968 /* BLEND_DST_RGB */);
                pStatesTo.BLEND_EQUATION_ALPHA = pWebGLContext.getParameter(34877 /* BLEND_EQUATION_ALPHA */);
                pStatesTo.BLEND_EQUATION_RGB = pWebGLContext.getParameter(32777 /* BLEND_EQUATION_RGB */);
                pStatesTo.BLEND_SRC_ALPHA = pWebGLContext.getParameter(32971 /* BLEND_SRC_ALPHA */);
                pStatesTo.BLEND_SRC_RGB = pWebGLContext.getParameter(32969 /* BLEND_SRC_RGB */);

                pStatesTo.COLOR_CLEAR_VALUE = pWebGLContext.getParameter(3106 /* COLOR_CLEAR_VALUE */);
                pStatesTo.COLOR_WRITEMASK = pWebGLContext.getParameter(3107 /* COLOR_WRITEMASK */);

                pStatesTo.CULL_FACE = pWebGLContext.getParameter(2884 /* CULL_FACE */);
                pStatesTo.CULL_FACE_MODE = pWebGLContext.getParameter(2885 /* CULL_FACE_MODE */);

                pStatesTo.DEPTH_CLEAR_VALUE = pWebGLContext.getParameter(2931 /* DEPTH_CLEAR_VALUE */);
                pStatesTo.DEPTH_FUNC = pWebGLContext.getParameter(2932 /* DEPTH_FUNC */);
                pStatesTo.DEPTH_RANGE = pWebGLContext.getParameter(2928 /* DEPTH_RANGE */);
                pStatesTo.DEPTH_TEST = pWebGLContext.getParameter(2929 /* DEPTH_TEST */);
                pStatesTo.DEPTH_WRITEMASK = pWebGLContext.getParameter(2930 /* DEPTH_WRITEMASK */);
                pStatesTo.DITHER = pWebGLContext.getParameter(3024 /* DITHER */);

                pStatesTo.FRONT_FACE = pWebGLContext.getParameter(2886 /* FRONT_FACE */);
                pStatesTo.LINE_WIDTH = pWebGLContext.getParameter(2849 /* LINE_WIDTH */);

                pStatesTo.POLYGON_OFFSET_FACTOR = pWebGLContext.getParameter(32824 /* POLYGON_OFFSET_FACTOR */);
                pStatesTo.POLYGON_OFFSET_FILL = pWebGLContext.getParameter(32823 /* POLYGON_OFFSET_FILL */);
                pStatesTo.POLYGON_OFFSET_UNITS = pWebGLContext.getParameter(10752 /* POLYGON_OFFSET_UNITS */);

                pStatesTo.SAMPLE_BUFFERS = pWebGLContext.getParameter(32936 /* SAMPLE_BUFFERS */);
                pStatesTo.SAMPLE_COVERAGE_INVERT = pWebGLContext.getParameter(32939 /* SAMPLE_COVERAGE_INVERT */);
                pStatesTo.SAMPLE_COVERAGE_VALUE = pWebGLContext.getParameter(32938 /* SAMPLE_COVERAGE_VALUE */);
                pStatesTo.SAMPLES = pWebGLContext.getParameter(32937 /* SAMPLES */);

                pStatesTo.SCISSOR_TEST = pWebGLContext.getParameter(3089 /* SCISSOR_TEST */);

                pStatesTo.STENCIL_BACK_FAIL = pWebGLContext.getParameter(34817 /* STENCIL_BACK_FAIL */);
                pStatesTo.STENCIL_BACK_FUNC = pWebGLContext.getParameter(34816 /* STENCIL_BACK_FUNC */);
                pStatesTo.STENCIL_BACK_PASS_DEPTH_FAIL = pWebGLContext.getParameter(34818 /* STENCIL_BACK_PASS_DEPTH_FAIL */);
                pStatesTo.STENCIL_BACK_PASS_DEPTH_PASS = pWebGLContext.getParameter(34819 /* STENCIL_BACK_PASS_DEPTH_PASS */);
                pStatesTo.STENCIL_BACK_REF = pWebGLContext.getParameter(36003 /* STENCIL_BACK_REF */);
                pStatesTo.STENCIL_BACK_VALUE_MASK = pWebGLContext.getParameter(36004 /* STENCIL_BACK_VALUE_MASK */);
                pStatesTo.STENCIL_BACK_WRITEMASK = pWebGLContext.getParameter(36005 /* STENCIL_BACK_WRITEMASK */);
                pStatesTo.STENCIL_CLEAR_VALUE = pWebGLContext.getParameter(2961 /* STENCIL_CLEAR_VALUE */);
                pStatesTo.STENCIL_FAIL = pWebGLContext.getParameter(2964 /* STENCIL_FAIL */);
                pStatesTo.STENCIL_FUNC = pWebGLContext.getParameter(2962 /* STENCIL_FUNC */);
                pStatesTo.STENCIL_PASS_DEPTH_FAIL = pWebGLContext.getParameter(2965 /* STENCIL_PASS_DEPTH_FAIL */);
                pStatesTo.STENCIL_PASS_DEPTH_PASS = pWebGLContext.getParameter(2966 /* STENCIL_PASS_DEPTH_PASS */);
                pStatesTo.STENCIL_REF = pWebGLContext.getParameter(2967 /* STENCIL_REF */);
                pStatesTo.STENCIL_TEST = pWebGLContext.getParameter(2960 /* STENCIL_TEST */);
                pStatesTo.STENCIL_VALUE_MASK = pWebGLContext.getParameter(2963 /* STENCIL_VALUE_MASK */);
                pStatesTo.STENCIL_WRITEMASK = pWebGLContext.getParameter(2968 /* STENCIL_WRITEMASK */);

                pStatesTo.PACK_ALIGNMENT = pWebGLContext.getParameter(3333 /* PACK_ALIGNMENT */);
                pStatesTo.UNPACK_ALIGNMENT = pWebGLContext.getParameter(3317 /* UNPACK_ALIGNMENT */);

                return pStatesTo;
            };
            WebGLRenderer.DEFAULT_OPTIONS = {
                depth: false,
                stencil: false,
                antialias: false,
                preserveDrawingBuffer: false
            };
            return WebGLRenderer;
        })(akra.render.Renderer);
        webgl.WebGLRenderer = WebGLRenderer;
    })(akra.webgl || (akra.webgl = {}));
    var webgl = akra.webgl;
})(akra || (akra = {}));
//# sourceMappingURL=WebGLRenderer.js.map
