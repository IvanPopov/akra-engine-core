#ifndef VIEWPORT_TS
#define VIEWPORT_TS

#include "IViewport.ts"
#include "ICamera.ts"
#include "util/Color.ts"
#include "geometry/Rect2d.ts"
#include "events/events.ts"
#include "util/ObjectArray.ts"

//#define DL_DEFAULT DEFAULT_NAME;

module akra.render {
	export class Viewport implements IViewport {
		protected _pCamera: ICamera;
		protected _pTarget: IRenderTarget;

		protected _fRelLeft: float;
		protected _fRelTop: float;
		protected _fRelWidth: float;
		protected _fRelHeight: float;

		protected _iActLeft: int;
		protected _iActTop: int;
		protected _iActWidth: int;
		protected _iActHeight: int;

		protected _iZIndex: int;

		protected _pViewportState: IViewportState = {
			cullingMode: ECullingMode.NONE,

			depthTest: true,
			depthWrite: true,
			depthFunction: ECompareFunction.LESS,

			clearColor: new Color(0., 0., 0., 0.),
			clearDepth: 1.,
			clearBuffers: EFrameBufferTypes.COLOR | EFrameBufferTypes.DEPTH
		};

		// protected _cBackColor: IColor = new Color(Color.BLACK);

		// protected _fDepthClearValue: float = 1.;

		protected _bClearEveryFrame: bool = true;

		// protected _iClearBuffers: int = EFrameBufferTypes.COLOR | EFrameBufferTypes.DEPTH;

		protected _bUpdated: bool = false;

		// protected _bShowOverlays: bool = true;

		// protected _bShowSkies: bool = true;
		// protected _bShowShadows: bool = true;

		protected _iVisibilityMask: int = 0xFFFFFFFF;

		// protected _sRQSequenceName: string;
		// protected mRQSequence: RenderQueueInvocationSequence;

		protected sMaterialSchemeName: string = DEFAULT_MATERIAL_NAME;

		// static _eDefaultOrientationMode: EOrientationModes;

		protected _isAutoUpdated: bool = true;

		protected _csDefaultRenderMethod: string = null;

		inline get zIndex(): int {
			return this._iZIndex;
		}

		inline get left(): float { return this._fRelLeft; }
        inline get top(): float { return this._fRelTop; }
        inline get width(): float { return this._fRelWidth; }
        inline get height(): float { return this._fRelHeight; }

        inline get actualLeft(): uint { return this._iActLeft; }
        inline get actualTop(): uint { return this._iActTop; }
        inline get actualWidth(): uint { return this._iActWidth; }
        inline get actualHeight(): uint { return this._iActHeight; }

        inline get backgroundColor(): IColor { return this._pViewportState.clearColor; }
        inline set backgroundColor(cColor: IColor) { this._pViewportState.clearColor.set(cColor); }

        inline get depthClear(): float { return this._pViewportState.clearDepth; }
        inline set depthClear(fDepthClearValue: float) { this._pViewportState.clearDepth = fDepthClearValue; }


		constructor (pCamera: ICamera, pTarget: IRenderTarget, csRenderMethod: string = null, fLeft: float = 0., fTop: float = 0., fWidth: float = 1., fHeight: float = 1., iZIndex: int = 0) {
			this._pTarget = pTarget;

			this._fRelLeft = fLeft;
			this._fRelTop = fTop;
			this._fRelWidth = fWidth;
			this._fRelHeight = fHeight;

			this._iZIndex = iZIndex;

			this._csDefaultRenderMethod = csRenderMethod;

			this._updateDimensions();

			this._setCamera(pCamera);

			this.connect(pTarget, SIGNAL(resized), SLOT(_updateDimensions));
		}

		destroy(): void {
			var pRenderer: IRenderer = this._pTarget.getRenderer();
			if (pRenderer && pRenderer._getViewport() === this) {
				pRenderer._setViewport(null);
			}
		}


		clear(iBuffers: uint = EFrameBufferTypes.COLOR | EFrameBufferTypes.DEPTH,
			  cColor: IColor = Color.BLACK, fDepth: float = 1., iStencil: uint = 0): void {
			var pRenderer: IRenderer = this._pTarget.getRenderer();

			if (pRenderer) {
				var pCurrentViewport: IViewport = pRenderer._getViewport();
				
				if (pCurrentViewport && pCurrentViewport === this) {
					pRenderer.clearFrameBuffer(iBuffers, cColor, fDepth, iStencil);
				}
				else if (pCurrentViewport) {
					pRenderer._setViewport(this);
					pRenderer.clearFrameBuffer(iBuffers, cColor, fDepth, iStencil);
					pRenderer._setViewport(pCurrentViewport);
				}
			}
		}

        inline getTarget(): IRenderTarget {
        	return this._pTarget;
        }

        inline getCamera(): ICamera {
        	return this._pCamera;
        }

        setCamera(pCamera: ICamera): bool {
        	if(this._pCamera) {
				if(this._pCamera._getLastViewport() == this) {
					this._pCamera._keepLastViewport(null);
				}
			}

			if (this._pCamera) {
				// update aspect ratio of new camera if needed.
				if (!pCamera.isConstantAspect()) {
					pCamera.aspect = (<float> this._iActWidth / <float> this._iActHeight);
				}
			}

			this._setCamera(pCamera);
			this.viewportCameraChanged();

			return true;
        }

        protected _setCamera(pCamera: ICamera): void {
			this._pCamera = pCamera;

			if (pCamera) {
				pCamera._keepLastViewport(this);
			}
        }

        setDimensions(fLeft: float, fTop: float, fWidth: float, fHeight: float): bool;
        setDimensions(pRect: IRect2d): bool;
        setDimensions(fLeft?, fTop?, fWidth?, fHeight?): bool {
        	var pRect: IRect2d;
        	if (isNumber(arguments[0])) {
        		this._fRelLeft = <float>fLeft;
        		this._fRelTop = <float>fTop;
        		this._fRelWidth = <float>fWidth;
        		this._fRelHeight = <float>fHeight;
        	}
        	else {
        		pRect = <IRect2d>arguments[0];
        		this._fRelLeft = pRect.left;
        		this._fRelTop = pRect.top;
        		this._fRelWidth = pRect.width;
        		this._fRelHeight = pRect.height;
        	}

         	this._updateDimensions();

         	return true;
        }

        getActualDimensions(): IRect2d {
        	return new geometry.Rect2d(<float>this._iActLeft, <float>this._iActTop, <float>this._iActWidth, <float>this._iActHeight);
        }

        setClearEveryFrame(isClear: bool, iBuffers?: uint = EFrameBufferTypes.COLOR | EFrameBufferTypes.DEPTH): void {
        	this._bClearEveryFrame = isClear;
			this._pViewportState.clearBuffers = iBuffers;
        }

        inline getClearEveryFrame(): bool {
        	return this._bClearEveryFrame;
        }

        inline getClearBuffers(): uint {
        	return this._pViewportState.clearBuffers;
        }

        setDepthParams(bDepthTest: bool, bDepthWrite: bool, eDepthFunction: ECompareFunction): void {
        	this._pViewportState.depthTest = bDepthTest;
        	this._pViewportState.depthWrite = bDepthWrite;
        	this._pViewportState.depthFunction = eDepthFunction;
        }

        setCullingMode(eCullingMode: ECullingMode): void {
        	this._pViewportState.cullingMode = eCullingMode;
        }

        inline setAutoUpdated(bValue: bool = true): void { this._isAutoUpdated = bValue; }
        inline isAutoUpdated(): bool { return this._isAutoUpdated; }

		_updateDimensions(): void {
			var fHeight: float  = <float>this._pTarget.height;
			var fWidth: float  = <float>this._pTarget.width;

			this._iActLeft = <int>(this._fRelLeft * fWidth);
			this._iActTop = <int>(this._fRelTop * fHeight);
			this._iActWidth = <int>(this._fRelWidth * fWidth);
			this._iActHeight = <int>(this._fRelHeight * fHeight);

			 // This will check if the cameras getAutoAspectRatio() property is set.
	        // If it's true its aspect ratio is fit to the current viewport
	        // If it's false the camera remains unchanged.
	        // This allows cameras to be used to render to many viewports,
	        // which can have their own dimensions and aspect ratios.

	        if (this._pCamera)  {
	            if (!this._pCamera.isConstantAspect())
	                this._pCamera.aspect = (<float> this._iActWidth / <float> this._iActHeight);

			}
	
	 		this._bUpdated = true;

			this.viewportDimensionsChanged();
		}

		update(): void {
			if(this._bClearEveryFrame){
				this.clear(this._pViewportState.clearBuffers, 
        				   this._pViewportState.clearColor,
        				   this._pViewportState.clearDepth);
			}

			this._updateImpl();

			this.getTarget().getRenderer().executeQueue();
		}

		_updateImpl(): void {
			if (this._pCamera) {
				this.renderAsNormal(this._csDefaultRenderMethod, this._pCamera);
			}
		}

		startFrame(): void {
			if(this._bClearEveryFrame){
				this.clear(this._pViewportState.clearBuffers, 
        				   this._pViewportState.clearColor,
        				   this._pViewportState.clearDepth);
			}
		}

        inline renderObject(pRenderable: IRenderableObject, csMethod?: string = this._csDefaultRenderMethod): void {
        	pRenderable.render(this, csMethod, null);
        }

        endFrame(): void {
        	this.getTarget().getRenderer().executeQueue();
        }

		protected renderAsNormal(csMethod: string, pCamera: ICamera): void {
			var pVisibleObjects: IObjectArray = pCamera.display();
			var pRenderable: IRenderableObject;
			
			for(var i: int = 0; i < pVisibleObjects.length; ++ i){
				pVisibleObjects.value(i).prepareForRender(this);
			}

			for (var i: int = 0; i < pVisibleObjects.length; ++ i) {
				var pSceneObject: ISceneObject = pVisibleObjects.value(i);
				
				for (var j: int = 0; j < pSceneObject.totalRenderable; j++) {
					pRenderable = pSceneObject.getRenderable(j);
					
					if (!isNull(pRenderable)) {
						pRenderable.render(this, csMethod, pSceneObject);
					}
				}
			}
		}

		projectPoint(v3fPoint: IVec3, v3fDestination?: IVec3): IVec3{
			var pCamera: ICamera = this.getCamera();
			var v3fResult: IVec3 = pCamera.projectPoint(v3fPoint, v3fDestination);

			if(isNull(v3fResult)){
				return null;
			}

			var fX: float = v3fResult.x;
			var fY: float = v3fResult.y;
			var fZ: float = v3fResult.z;

			fX = fX*0.5 + 0.5;
			fY = fY*0.5 + 0.5;
			fZ = fZ*0.5 + 0.5;

			fX = this.actualLeft + this.width * fX;
			fY = this.actualTop + this.height * fY;

			return v3fResult.set(fX, fY, fZ);
		};


        inline isUpdated(): bool {
        	return this._bUpdated;
        }

        inline _clearUpdatedFlag(): void {
        	this._bUpdated = false;
        }

        _getNumRenderedPolygons(): uint {
        	return this._pCamera? this._pCamera._getNumRenderedFaces(): 0;
        }

        inline _getViewportState(): IViewportState {
        	return this._pViewportState;
        }

        CREATE_EVENT_TABLE(Viewport);
    	BROADCAST(viewportDimensionsChanged, VOID);
    	BROADCAST(viewportCameraChanged, VOID);
	}
}

#endif
