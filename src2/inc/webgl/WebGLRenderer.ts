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
	export interface IWebGLContextState {
		depthMask: bool;
		framebuffer: WebGLFramebuffer;
	}

	export class WebGLRenderer extends render.Renderer {
		private _pCanvas: HTMLCanvasElement;

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
		private _pContextState: IWebGLContextState = {
			depthMask: false,
			framebuffer: null
		}

		constructor (pEngine: IEngine);
		constructor (pEngine: IEngine, sCanvas: string);
		constructor (pEngine: IEngine, pCanvas: HTMLCanvasElement);
		constructor (pEngine: IEngine, pCanvas?: any) {
			super(pEngine);

			if (isDef(pCanvas)) {
				
				//get HTMLCanvasElement by id
				if (isString(pCanvas)) {
					this._pCanvas = <HTMLCanvasElement>document.getElementById(pCanvas);
				}
				else {
					this._pCanvas = <HTMLCanvasElement>pCanvas;
				}
			}
			else {
				this._pCanvas = <HTMLCanvasElement>document.createElement('canvas');
			}

			this._pWebGLContext = createContext(this._pCanvas);

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
					return this._pContextState.depthMask;
			}
		}

		_beginRender(): void {
			this._pWebGLContext.enable(GL_SCISSOR_TEST);
			this._pWebGLContext.disable(GL_BLEND);
		}

		_renderEntry(pEntry: IRenderEntry): void {
			var pViewport: render.Viewport = <render.Viewport>pEntry.viewport;
			var pRenderTarget: IRenderTarget = (<render.Viewport>pViewport).getTarget();
			var pInput: IShaderInput = pEntry.input;
			var pMaker: fx.Maker = <fx.Maker>pEntry.maker;

			// console.log(pEntry);

			if(!isNull(pEntry.renderTarget)){
				this._setRenderTarget(pEntry.renderTarget);
				this.lockRenderTarget();

				this._setViewportForRender(pViewport);

				this.unlockRenderTarget();
			}
			else {
				this._setViewportForRender(pViewport);
			}	

			var pWebGLProgram: WebGLShaderProgram = <WebGLShaderProgram>(pMaker).shaderProgram;

			this.useWebGLProgram(pWebGLProgram.getWebGLProgram());

			this.enableWebGLVertexAttribs(pWebGLProgram.totalAttributes);

			var pAttribLocations: IntMap = pWebGLProgram._getActiveAttribLocations();
			var pAttributeSemantics: string[] = pMaker.attributeSemantics;
			var pAttributeNames: string[] = pMaker.attributeNames;

			var pBufferMap: IBufferMap = pEntry.bufferMap;

			if(!isNull(pBufferMap.index)){
				this.bindWebGLBuffer(GL_ELEMENT_ARRAY_BUFFER, (<WebGLIndexBuffer>pBufferMap.index.buffer).getWebGLBuffer());
			}
			var nPreparedBuffers: uint = 0;
			for(var i: uint = 0; i < pAttributeNames.length; i++){
				var sAttrName: string = pAttributeNames[i];
				var sAttrSemantic: string = pAttributeSemantics[i];

				if(isNull(sAttrSemantic)){
					continue;
				}

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

			var pUniformNames: string[] = pMaker.uniformNames;

			for (var i: uint = 0; i < pUniformNames.length; i++) {
				pMaker.setUniform(pUniformNames[i],  pInput.uniforms[i]);
			}
			
			pEntry.bufferMap._draw();
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
        	this._pContextState.depthMask = bDepthWrite;

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
			if(this._pTextureSlotList[this._iCurrentTextureSlot] !== pTexture){
				this._pWebGLContext.bindTexture(eTarget, pTexture);
				this._pTextureSlotList[this._iCurrentTextureSlot] = pTexture;
			}
		}

		inline activateWebGLTexture(iWebGLSlot: int): void {
			this._pWebGLContext.activeTexture(iWebGLSlot);
			this._iCurrentTextureSlot = iWebGLSlot - GL_TEXTURE0;
		}

		activateWebGLTextureInAutoSlot(eTarget: uint, pTexture: WebGLTexture): uint {

			var iSlot: uint = this._pTextureSlotList.indexOf(pTexture);

			if(iSlot === -1) {
				iSlot = this._iNextTextureSlot;

				this._iNextTextureSlot++;

				if(this._iNextTextureSlot === maxTextureImageUnits){
					this._iNextTextureSlot = 0;
				}
				
				this.activateWebGLTexture(GL_TEXTURE0 + iSlot);
				this.bindWebGLTexture(eTarget, pTexture);
			}
			else {
				this.activateWebGLTexture(GL_TEXTURE0 + iSlot);
			}

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
			//this._pContextState.framebuffer = pBuffer;
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
	}
}

#endif