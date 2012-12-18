#ifndef VIEWPORT_TS
#define VIEWPORT_TS

#include "IViewport.ts"
#include "ICamera.ts"
#include "util/Color.ts"
#include "geometry/Rect2d.ts"
#include "IFrameBuffer.ts"
#include "events/events.ts"


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

		protected _cBackColor: IColor = new Color(Color.BLACK);

		protected _fDepthClearValue: float = 1.;

		protected _bClearEveryFrame: bool = true;

		protected _iClearBuffers: int = EFrameBufferTypes.COLOR | EFrameBufferTypes.DEPTH;

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

        inline get backgroundColor(): IColor { return this._cBackColor; }
        inline set backgroundColor(cColor: IColor) { this._cBackColor = cColor; }

        inline get depthClear(): float { return this._fDepthClearValue; }
        inline set depthClear(fDepthClearValue: float) { this._fDepthClearValue = fDepthClearValue; }


		constructor (pCamera: ICamera, pTarget: IRenderTarget, fLeft: float = 0., fTop: float = 0., fWidth: float = 1., fHeight: float = 1., iZIndex: int = 0) {
			this._pCamera = pCamera;
			this._pTarget = pTarget;

			this._fRelLeft = fLeft;
			this._fRelTop = fTop;
			this._fRelWidth = fWidth;
			this._fRelHeight = fHeight;

			this._iZIndex = iZIndex;

			this._updateDimensions();

			if (pCamera) {
				pCamera._keepLastViewport(this);
			}
		}

		destroy(): void {
			var pRenderer: IRenderer = this._pTarget.getRenderer();
			if (pRenderer && pRenderer._getViewport() === this) {
				pRenderer._setViewport(null);
			}
		}


		clear(iBuffers: uint = 1, cColor: IColor = Color.BLACK, iDepth: float = 1.): void {
			
			var pRenderer: IRenderer = this._pTarget.getRenderer();
			
			if (pRenderer) {
				var pCurrentViewport: IViewport = pRenderer._getViewport();
				
				if (pCurrentViewport && pCurrentViewport == this) {
					pRenderer.clearFrameBuffer(iBuffers, cColor, iDepth);
				}
				else if (pCurrentViewport) {
					pRenderer._setViewport(this);
					pRenderer.clearFrameBuffer(iBuffers, cColor, iDepth);
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

			this._pCamera = pCamera;
			if (this._pCamera) {
				// update aspect ratio of new camera if needed.
				if (!pCamera.isConstantAspect()) {
					pCamera.aspect = (<float> this._iActWidth / <float> this._iActHeight);
				}

				pCamera._keepLastViewport(this);
			}

			this.viewportCameraChanged();

			return true;
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

        //iBuffers=FBT_COLOUR|FBT_DEPTH
        setClearEveryFrame(isClear: bool, iBuffers?: uint): void {
        	this._bClearEveryFrame = isClear;
			this._iClearBuffers = iBuffers;
        }

        inline getClearEveryFrame(): bool {
        	return this._bClearEveryFrame;
        }

        inline getClearBuffers(): uint {
        	return this._iClearBuffers;
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
			if (this._pCamera) {
				this._pCamera._renderScene(this);
			}
		}

        inline isUpdated(): bool {
        	return this._bUpdated;
        }

        inline _clearUpdatedFlag(): void {
        	this._bUpdated = false;
        }

        _getNumRenderedPolygons(): uint {
        	return this._pCamera? this._pCamera._getNumRenderedFaces(): 0;
        }

        BEGIN_EVENT_TABLE(Viewport);
        	BROADCAST(viewportDimensionsChanged, VOID);
        	BROADCAST(viewportCameraChanged, VOID);
        END_EVENT_TABLE();
	}
}

#endif
