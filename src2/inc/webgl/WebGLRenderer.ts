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

		getParameter(iWebGLParam: uint): any {
			switch(iWebGLParam){
				case GL_FRAMEBUFFER_BINDING:
					return this._pWebGLContext.getParameter(iWebGLParam);
				case GL_DEPTH_WRITEMASK:
					return this._pCurrentContextStates.DEPTH_WRITEMASK;
			}
			// this._pWebGLContext.getParameter(iWebGLParam);
		}

		_beginRender(): void {
			this._pWebGLContext.enable(GL_SCISSOR_TEST);
			this._pWebGLContext.disable(GL_BLEND);
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

			if(isDef(pMaker["_pShaderUniformInfoMap"]["fKrESun"])){
				// LOG("1");
				this._pWebGLContext.depthMask(false);
			}
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
			if(isDef(pMaker["_pShaderUniformInfoMap"]["fKrESun"])){
				this._pWebGLContext.depthMask(true);
			}
		}

		_endRender(): void {
			this._pWebGLContext.disable(GL_SCISSOR_TEST);
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
        			this._pWebGLContext.disable(GL_CULL_FACE);
        			return;

        		default:
        		case ECullingMode.CLOCKWISE:
        			iWebGLCullMode = GL_FRONT;
        			break;

        		case ECullingMode.ANTICLOCKWISE:
        			iWebGLCullMode = GL_BACK;
        			break;
        	}

        	this._pWebGLContext.enable(GL_CULL_FACE);
        	this._pWebGLContext.cullFace(iWebGLCullMode);
        }

        _setDepthBufferParams(bDepthTest: bool, bDepthWrite: bool, 
        					  eDepthFunction: ECompareFunction, fClearDepth?: float = 1.): void {
        	// if(true){
        	// 	return;
        	// }
        	if(bDepthTest){
        		this._pWebGLContext.clearDepth(fClearDepth);
        		this._pWebGLContext.enable(GL_DEPTH_TEST);
        	}
        	else {
        		this._pWebGLContext.disable(GL_DEPTH_TEST);
        	}

        	this._pWebGLContext.depthMask(bDepthWrite); 
        	this._pCurrentContextStates.DEPTH_WRITEMASK = bDepthWrite;

        	this._pWebGLContext.depthFunc(this.convertCompareFunction(eDepthFunction));
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
			// if(true){
			// 	return;
			// }
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

		_popRenderStates(): void {
			if(this._pRenderStatesPool.length === 0) {
				debug_warning("Can not pop context render states. Pool of context is empty.");
			}

			this._pFreeRenderStatesPool.push(this._pCurrentContextStates);

			var pCurreentStates: IWebGLContextStates = this._pCurrentContextStates;
			this._pCurrentContextStates = this._pRenderStatesPool.pop();

			this.restoreWebGLContextRenderStates(pCurreentStates);
		}

		private restoreWebGLContextRenderStates(pStatesFrom: IWebGLContextStates): void {
			this.restoreBlendStates(pStatesFrom);
			this.restoreCullStates(pStatesFrom);
			this.restoreColorStates(pStatesFrom);
			this.restoreDepthStates(pStatesFrom);
			this.restorePolygonStates(pStatesFrom);
			this.restoreStencilStates(pStatesFrom);
			this.restoreSampleStates(pStatesFrom);
		}

		private restoreBlendStates(pStatesFrom: IWebGLContextStates): void {
			var pRestoreStates: IWebGLContextStates = this._pCurrentContextStates;

			if (pRestoreStates.BLEND !== pStatesFrom.BLEND){
				if(pRestoreStates.BLEND) {
					this._pWebGLContext.enable(GL_BLEND)
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
					this._pWebGLContext.enable(GL_CULL_FACE)
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

			if (pRestoreStates.COLOR_WRITEMASK[0] !== pStatesFrom.COLOR_CLEAR_VALUE[0] ||
				pRestoreStates.COLOR_WRITEMASK[1] !== pStatesFrom.COLOR_CLEAR_VALUE[1] ||
				pRestoreStates.COLOR_WRITEMASK[2] !== pStatesFrom.COLOR_CLEAR_VALUE[2] ||
				pRestoreStates.COLOR_WRITEMASK[3] !== pStatesFrom.COLOR_CLEAR_VALUE[3]){
				
				this._pWebGLContext.colorMask(pRestoreStates.COLOR_WRITEMASK[0],
											  pRestoreStates.COLOR_WRITEMASK[1],
											  pRestoreStates.COLOR_WRITEMASK[2],
											  pRestoreStates.COLOR_WRITEMASK[3]);
			}
		}

		private restoreDepthStates(pStatesFrom: IWebGLContextStates): void {
		}

		private restorePolygonStates(pStatesFrom: IWebGLContextStates): void {
		}

		private restoreStencilStates(pStatesFrom: IWebGLContextStates): void {
		}

		private restoreSampleStates(pStatesFrom: IWebGLContextStates): void {
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
				STENCIL_WRITEMASK: isNull(pStates) ? 0 : pStates.STENCIL_WRITEMASK
			};
		}

		static copyWebGLContextStates(pStatesTo: IWebGLContextStates, pStatesFrom: IWebGLContextStates): IWebGLContextStates {
			pStatesTo.BLEND = pStatesFrom.BLEND;
			pStatesTo.BLEND_DST_ALPHA = pStatesFrom.BLEND_DST_ALPHA;
			pStatesTo.BLEND_DST_RGB = pStatesFrom.BLEND_DST_RGB;
			pStatesTo.BLEND_EQUATION_ALPHA = pStatesFrom.BLEND_EQUATION_ALPHA;
			pStatesTo.BLEND_EQUATION_RGB = pStatesFrom.BLEND_EQUATION_RGB;
			pStatesTo.BLEND_SRC_ALPHA = pStatesFrom.BLEND_SRC_ALPHA;
			pStatesTo.BLEND_SRC_RGB = pStatesFrom.BLEND_SRC_RGB;

			pStatesTo.COLOR_CLEAR_VALUE = pStatesFrom.COLOR_CLEAR_VALUE;
			pStatesTo.COLOR_WRITEMASK = pStatesFrom.COLOR_WRITEMASK;

			pStatesTo.CULL_FACE = pStatesFrom.CULL_FACE;
			pStatesTo.CULL_FACE_MODE = pStatesFrom.CULL_FACE_MODE;

			pStatesTo.DEPTH_CLEAR_VALUE = pStatesFrom.DEPTH_CLEAR_VALUE;
			pStatesTo.DEPTH_FUNC = pStatesFrom.DEPTH_FUNC;
			pStatesTo.DEPTH_RANGE = pStatesFrom.DEPTH_RANGE;
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

			return pStatesTo;
		}

		static initStatesFromWebGLContext(pStatesTo: IWebGLContextStates, pWebGLContext: WebGLRenderingContext): IWebGLContextStates {
			pStatesTo.BLEND = pWebGLContext.getParameter(GL_BLEND);
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

			return pStatesTo;
		}
	}
}

#endif