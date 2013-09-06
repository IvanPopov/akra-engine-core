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
		protected _pCamera: ICamera = null;
		protected _pTarget: IRenderTarget = null;

		protected _fRelLeft: float;
		protected _fRelTop: float;
		protected _fRelWidth: float;
		protected _fRelHeight: float;

		protected _iActLeft: int = 0;
		protected _iActTop: int = 0;
		protected _iActWidth: int = 1;
		protected _iActHeight: int = 1;

		protected _iZIndex: int;

		protected _pDepthRange: IDepthRange = {min: -1., max: 1.};

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

		protected _isDepthRangeUpdated: bool = false;

		//get last mouse postion backend
		protected _pMousePositionLast: IPoint = {x: 0, y: 0};
		//is mouse under the viewport?
		protected _bMouseIsCaptured: bool = false;

		//3d event handing
	    private _i3DEvents: int = 0;
	    private _p3DEventPickLast: IRIDPair = {object: null, renderable: null};
	    private _p3DEventDragTarget: IRIDPair = {object: null, renderable: null};

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


        inline get type(): EViewportTypes { return EViewportTypes.DEFAULT; }

        inline set onclick(fn: (pViewport: IViewport, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(click), fn);
        }

        inline set onmousemove(fn: (pViewport: IViewport, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(mousemove), fn);
        }

        inline set onmousedown(fn: (pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(mousedown), fn);
        }

        inline set onmouseup(fn: (pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(mouseup), fn);
        }

        inline set onmouseover(fn: (pViewport: IViewport, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(mouseover), fn);
        }

        inline set onmouseout(fn: (pViewport: IViewport, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(mouseout), fn);
        }

        inline set onmousewheel(fn: (pViewport: IViewport, x: uint, y: uint, fDelta: float) => void) {
        	this.bind(SIGNAL(mousewheel), fn);
        }

        inline set ondragstart(fn: (pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(dragstart), fn);
        }

        inline set ondragstop(fn: (pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(dragstop), fn);
        }

        inline set ondragging(fn: (pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(dragging), fn);
        }

		constructor (pCamera: ICamera, csRenderMethod: string = null, fLeft: float = 0., fTop: float = 0., fWidth: float = 1., fHeight: float = 1., iZIndex: int = 0) {
			this._fRelLeft = fLeft;
			this._fRelTop = fTop;
			this._fRelWidth = fWidth;
			this._fRelHeight = fHeight;

			this._iZIndex = iZIndex;

			this._csDefaultRenderMethod = csRenderMethod;

			this._setCamera(pCamera);
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
				
				if (pCurrentViewport === this) {
					pRenderer.clearFrameBuffer(iBuffers, cColor, fDepth, iStencil);
				}
				else {
					pRenderer._setViewport(this);
					pRenderer.clearFrameBuffer(iBuffers, cColor, fDepth, iStencil);
					pRenderer._setViewport(pCurrentViewport);
				}
			}
		}

		enableSupportFor3DEvent(iType: int): int {
			if (isNull(this.getTarget())) {
				return 0;
			}

			if (TEST_ANY(iType, E3DEventTypes.DRAGSTART | E3DEventTypes.DRAGSTOP | E3DEventTypes.DRAGGING)) {
				SET_ALL(iType, E3DEventTypes.DRAGSTART | E3DEventTypes.DRAGSTOP | E3DEventTypes.DRAGGING |
					E3DEventTypes.MOUSEDOWN | E3DEventTypes.MOUSEUP | E3DEventTypes.MOUSEMOVE);
			}

			//mouse over and mouse out events require mouse move
			if (TEST_ANY(iType, E3DEventTypes.MOUSEOVER | E3DEventTypes.MOUSEOUT)) {
				SET_ALL(iType, E3DEventTypes.MOUSEMOVE);
			}

			//get events that have not yet been activated
			var iNotActivate: int = (this._i3DEvents ^ MAX_INT32) & iType;

			SET_ALL(this._i3DEvents, iNotActivate);

			this.getTarget().enableSupportFor3DEvent(iType);
			
			return iNotActivate;
		}

		inline is3DEventSupported(eType: E3DEventTypes): bool {
			return TEST_ANY(this._i3DEvents, <int>eType);
		}

        inline getTarget(): IRenderTarget {
        	return this._pTarget;
        }

        inline getCamera(): ICamera {
        	return this._pCamera;
        }

        getDepth(x: uint, y: uint): float {
        	return 1.0;
        }

        getDepthRange(): IDepthRange{

        	if(!this._isDepthRangeUpdated){
	        	this._isDepthRangeUpdated = true;
	        	var pDepthRange: IDepthRange = this._getDepthRangeImpl();

	        	this._pDepthRange.min = pDepthRange.min;
	        	this._pDepthRange.max = pDepthRange.max;
        	}

        	return this._pDepthRange;
        }

        protected _getDepthRangeImpl(): IDepthRange{
        	return <IDepthRange>{min: -1, max: 1};
        }

        setCamera(pCamera: ICamera): bool {
        	if(isDefAndNotNull(pCamera)) {
				if(this._pCamera._getLastViewport() == this) {
					this._pCamera._keepLastViewport(null);
				}
			}

			this._setCamera(pCamera);
			this.viewportCameraChanged();

			return true;
        }

        protected _setCamera(pCamera: ICamera): void {
			this._pCamera = pCamera;

			if (isDefAndNotNull(pCamera)) {
				// update aspect ratio of new camera if needed.
				if (!pCamera.isConstantAspect()) {
					pCamera.aspect = (<float> this._iActWidth / <float> this._iActHeight);
				}
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

		_updateDimensions(bEmitEvent: bool = true): void {
			var fHeight: float  = <float>this._pTarget.height;
			var fWidth: float  = <float>this._pTarget.width;

			this._iActLeft = <int>math.round(this._fRelLeft * fWidth);
			this._iActTop = <int>math.round(this._fRelTop * fHeight);
			this._iActWidth = <int>math.round(this._fRelWidth * fWidth);
			this._iActHeight = <int>math.round(this._fRelHeight * fHeight);

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

	 		if (bEmitEvent) {
				this.viewportDimensionsChanged();
	 		}
		}

		update(): void {
			if (isDefAndNotNull(this._pCamera)) {
				this._pCamera._keepLastViewport(this);
			}

			this.startFrame();

			this._isDepthRangeUpdated = false;

			this._updateImpl();

			this.endFrame();
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
        	this.getTarget().getRenderer().executeQueue(true);
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

		projectPoint(v3fPoint: IVec3, v3fDestination?: IVec3): IVec3 {
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

			//from top left angle of element
			fX = this.actualLeft + this.actualWidth * fX;
			fY = this.actualTop + this.actualHeight * (1. - fY);

			return v3fResult.set(fX, fY, fZ);
		};

		unprojectPoint(x: uint, y: uint, v3fDestination?: IVec3): IVec3;
		unprojectPoint(pPos: IPoint, v3fDestination?: IVec3): IVec3;
		unprojectPoint(a0, a1?, a2?): IVec3 {
			var x: uint, y: uint;
			var v3fDestination: IVec3;

			if (isInt(arguments[0])) {
				x = arguments[0];
				y = arguments[1];
				v3fDestination = arguments[2];
			}
			else {
				x = arguments[0].x;
				y = arguments[0].y;
				v3fDestination = arguments[1];
			}
			
			if(!isDef(v3fDestination)){
				v3fDestination = new Vec3;
			}

			var pCamera: ICamera = this.getCamera();
			var m4fProjection: IMat4 = pCamera.projectionMatrix;
			var m4fWorld: IMat4 = pCamera.worldMatrix;
			
			var v4fIn: IVec4 = vec4(), v4fOut: IVec4 = vec4();

			//Transformation of normalized coordinates between -1 and 1
			v4fIn.x = (x - this.actualLeft) / this.actualWidth * 2.0 - 1.0;
			//Y-axis look down for viewport, but look UP in GL
			v4fIn.y = -((y - this.actualTop) / this.actualHeight * 2.0 - 1.0);
			v4fIn.z = 2.0 * this.getDepth(x, y) - 1.0;

			v4fIn.w = 1.0;

            v3fDestination.set(m4fWorld.multiplyVec4(m4fProjection.unproj(v4fIn, v4fOut)).xyz);
			return v3fDestination;
		}

		_setTarget(pTarget: IRenderTarget): void {
			if (!isNull(this._pTarget)) {
				CRITICAL("render target already exists in this viewport");
				//this.disconnect(this._pTarget, SIGNAL(resized), SLOT(_updateDimensions));
			}

			this._pTarget = pTarget;

			if (!isNull(this._pTarget)) {
				this.connect(this._pTarget, SIGNAL(resized), SLOT(_updateDimensions));
				this._updateDimensions();
				this._setCamera(this._pCamera);
			}
		}

        inline isUpdated(): bool {
        	return this._bUpdated;
        }

        inline isMouseCaptured(): bool {
        	return this._bMouseIsCaptured;
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

        pick(x: uint, y: uint): IRIDPair {
        	return {object: null, renderable: null};
        }

		getObject(x: uint, y: uint): ISceneObject {
			return null;
		}

		getRenderable(x: uint, y: uint): IRenderableObject {
			return null;
		}

		//manual recall over/out events for objects
		touch(): void {
			this.handleMouseInout({object: null, renderable: null}, 0, 0);
		}

		protected handleMouseInout(pCurr: IRIDPair, x: uint, y: uint): IRIDPair {
			// var pCurr: IRIDPair = this.pick(x, y);
			var pPrev: IRIDPair = this._p3DEventPickLast;
			
			if (pCurr.object !== pPrev.object) {
				if (!isNull(pPrev.object)) {
					pPrev.object.mouseout(this, pPrev.renderable, x, y);
				}

				if (!isNull(pCurr.object)) {
					pCurr.object.mouseover(this, pCurr.renderable, x, y);
				}
			}
			// var ov = false;
			// var ou = false;
			// var n = math.floor(Math.random() * 100500);
			if (pCurr.renderable !== pPrev.renderable) {
				if (!isNull(pPrev.renderable)) {
					// ou = true;
					pPrev.renderable.mouseout(this, pPrev.object, x, y);
				}

				if (!isNull(pCurr.renderable)) {
					// ov = true;
					pCurr.renderable.mouseover(this, pCurr.object, x, y);
				}
			}

			// if (!ov && ou) {
				// console.log("opacity enabled");
			// }

			this._p3DEventPickLast = pCurr;

			return pCurr;
		}

        _keepLastMousePosition(x: uint, y: uint): void {
        	this._pMousePositionLast.x = x;
        	this._pMousePositionLast.y = y;
        }

        inline _getLastMousePosition(): IPoint {
        	return this._pMousePositionLast;
        }

        CREATE_EVENT_TABLE(Viewport);
        
    	BROADCAST(viewportDimensionsChanged, VOID);
    	BROADCAST(viewportCameraChanged, VOID);

    	signal render(pTechnique: IRenderTechnique, iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void {
    		//is mouse under the viewport
			if (this.isMouseCaptured() && 
				// ... and pass is last
				iPass === 0 && 
				// ... and mouseover or mouse out events are supported
				(this.is3DEventSupported(E3DEventTypes.MOUSEOVER) || this.is3DEventSupported(E3DEventTypes.MOUSEOUT))) {
				//check, if the object are loss the mouse

				var x = this._pMousePositionLast.x;
				var y = this._pMousePositionLast.y;
				this.handleMouseInout(this.pick(x, y), x, y);
			}

			EMIT_BROADCAST(render, _CALL(pTechnique, iPass, pRenderable, pSceneObject));
    	}

    	// BROADCAST(render, CALL(pTechnique, iPass, pRenderable, pSceneObject));

    	signal click(x: uint, y: uint): void {
			this._keepLastMousePosition(x, y);
    		EMIT_BROADCAST(click, _CALL(x, y));

			if (!this.is3DEventSupported(E3DEventTypes.CLICK)) {
				return;
			}

			var p = this.pick(x, y);


			p.object && p.object.click(this, p.renderable, x, y);
			p.renderable && p.renderable.click(this, p.object, x, y);
		}

		signal mousemove(x: uint, y: uint): void {
			this._keepLastMousePosition(x, y);
    		EMIT_BROADCAST(mousemove, _CALL(x, y));

			if (!this.is3DEventSupported(E3DEventTypes.MOUSEMOVE)) {
				return;
			}

			var p = this.pick(x, y);

			p.object && p.object.mousemove(this, p.renderable, x, y);
			p.renderable && p.renderable.mousemove(this, p.object, x, y);
		}

		signal mousedown(eBtn: EMouseButton, x: uint, y: uint): void {
			this._keepLastMousePosition(x, y);
    		EMIT_BROADCAST(mousedown, _CALL(x, y));

			if (!this.is3DEventSupported(E3DEventTypes.MOUSEDOWN)) {
				return;
			}

			var p = this.pick(x, y);

			p.object && p.object.mousedown(this, p.renderable, x, y);
			p.renderable && p.renderable.mousedown(this, p.object, x, y);
		}

		signal mouseup(eBtn: EMouseButton, x: uint, y: uint): void {
			this._keepLastMousePosition(x, y);
    		EMIT_BROADCAST(mouseup, _CALL(x, y));

			if (!this.is3DEventSupported(E3DEventTypes.MOUSEUP)) {
				return;
			}

			var p = this.pick(x, y);

			p.object && p.object.mouseup(this, p.renderable, x, y);
			p.renderable && p.renderable.mouseup(this, p.object, x, y);
		}

    	signal mouseover(x: uint, y: uint): void {
    		this._keepLastMousePosition(x, y);
    		this._bMouseIsCaptured = true;
    		EMIT_BROADCAST(mouseover, _CALL(x, y));
    	}

    	signal mouseout(x: uint, y: uint): void {
    		this._keepLastMousePosition(x, y);
    		this._bMouseIsCaptured = false;
    		this.handleMouseInout({object: null, renderable: null}, x, y);
    		EMIT_BROADCAST(mouseout, _CALL(x, y));
    	}

    	signal mousewheel(x: uint, y: uint, fDelta: float): void {
    		this._keepLastMousePosition(x, y);
    		EMIT_BROADCAST(mousewheel, _CALL(x, y, fDelta));
    	}

    	signal dragstart(eBtn: EMouseButton, x: uint, y: uint): void {
    		this._keepLastMousePosition(x, y);

    		if (!this.is3DEventSupported(E3DEventTypes.DRAGSTART)) {
				return;
			}

			var p = this.pick(x, y);

			this._p3DEventDragTarget.object = p.object;
			this._p3DEventDragTarget.renderable = p.renderable;

			p.object && p.object.dragstart(this, p.renderable, x, y);
			p.renderable && p.renderable.dragstart(this, p.object, x, y);

    		EMIT_BROADCAST(dragstart, _CALL(eBtn, x, y));
    	}

    	signal dragstop(eBtn: EMouseButton, x: uint, y: uint): void {
    		this._keepLastMousePosition(x, y);

    		if (!this.is3DEventSupported(E3DEventTypes.DRAGSTOP)) {
				return;
			}

			var p = this._p3DEventDragTarget;

			p.object && p.object.dragstop(this, p.renderable, x, y);
			p.renderable && p.renderable.dragstop(this, p.object, x, y);

    		EMIT_BROADCAST(dragstop, _CALL(eBtn, x, y));
    	}

    	signal dragging(eBtn: EMouseButton, x: uint, y: uint): void {
    		this._keepLastMousePosition(x, y);

    		if (!this.is3DEventSupported(E3DEventTypes.DRAGGING)) {
				return;
			}

			var p = this._p3DEventDragTarget;

			p.object && p.object.dragging(this, p.renderable, x, y);
			p.renderable && p.renderable.dragging(this, p.object, x, y);

    		EMIT_BROADCAST(dragging, _CALL(eBtn, x, y));
    	}
	}
}

#endif
