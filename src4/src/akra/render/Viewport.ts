/// <reference path="../idl/IViewport.ts" />
/// <reference path="../idl/ICamera.ts" />
/// <reference path="../idl/IRID.ts" />

/// <reference path="../events.ts" />
/// <reference path="../color/colors.ts" />
/// <reference path="../bf/bf.ts" />
/// <reference path="../config/config.ts" />
/// <reference path="../math/math.ts" />
/// <reference path="../debug.ts" />
/// <reference path="../geometry/Rect2d.ts" />
/// <reference path="../util/ObjectArray.ts" />
/// <reference path="../guid.ts" />

module akra.render {
	import Color = color.Color;

	import Vec3 = math.Vec3;
	import Vec4 = math.Vec4;


	//NOTE: This signal is not called directly from the viewport, call derives from render technique.
	class RenderSignal extends Signal<IViewport> {

		emit(pTechnique: IRenderTechnique, iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void {
			//is mouse under the viewport
			var pViewport: Viewport = <Viewport>this.getSender();
			pViewport._onRender(pTechnique, iPass, pRenderable, pSceneObject);
			//EMIT_BROADCAST(render, _CALL(pTechnique, iPass, pRenderable, pSceneObject));
			super.emit(pTechnique, iPass, pRenderable, pSceneObject);
		}
	}

	

	export class Viewport implements IViewport {
		guid: uint = guid();

		viewportDimensionsChanged: ISignal<{ (pViewport: IViewport): void; }>;
		viewportCameraChanged: ISignal<{ (pViewport: IViewport): void; }>;

		render: ISignal<{
			(pViewport: IViewport, pTechnique: IRenderTechnique,
				iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void;
		}>;

		dragstart: ISignal<{ (pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint): void; }>;
		dragstop: ISignal<{ (pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint): void; }>;
		dragging: ISignal<{ (pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint): void; }>;

		click: ISignal<{ (pViewport: IViewport, x: int, y: int): void; }>;
		mousemove: ISignal<{ (pViewport: IViewport, x: int, y: int): void; }>;

		mousedown: ISignal<{ (pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint): void; }>;
		mouseup: ISignal<{ (pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint): void; }>;

		mouseover: ISignal<{ (pViewport: IViewport, x: uint, y: uint): void; }>;
		mouseout: ISignal<{ (pViewport: IViewport, x: uint, y: uint): void; }>;
		mousewheel: ISignal<{ (pViewport: IViewport, x: uint, y: uint, fDelta: float): void; }>;

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

		protected _pDepthRange: IDepthRange = { min: -1., max: 1. }

		protected _pViewportState: IViewportState = {
			cullingMode: ECullingMode.NONE,

			depthTest: true,
			depthWrite: true,
			depthFunction: ECompareFunction.LESS,

			clearColor: new Color(0., 0., 0., 0.),
			clearDepth: 1.,
			clearBuffers: EFrameBufferTypes.COLOR | EFrameBufferTypes.DEPTH
		}

		protected _bClearEveryFrame: boolean = true;
		protected _bUpdated: boolean = false;
		protected _iVisibilityMask: int = 0xFFFFFFFF;
		protected _sMaterialSchemeName: string = config.material.name;
		protected _isAutoUpdated: boolean = true;

		protected _csDefaultRenderMethod: string = null;

		protected _isDepthRangeUpdated: boolean = false;

		//show/hide
		protected _bHidden: boolean = false;

		//user events handing
		protected _iUserEvents: int = 0;

		/**
		 * @param csRenderMethod Name of render technique, that will be selected in the renderable for render.
		 */
		constructor(pCamera: ICamera, csRenderMethod: string = null,
			fLeft: float = 0., fTop: float = 0., fWidth: float = 1., fHeight: float = 1., iZIndex: int = 0) {
			this.setupSignals();

			this._fRelLeft = fLeft;
			this._fRelTop = fTop;
			this._fRelWidth = fWidth;
			this._fRelHeight = fHeight;

			this._iZIndex = iZIndex;

			this._csDefaultRenderMethod = csRenderMethod;

			this._setCamera(pCamera);
		}

		protected setupSignals(): void {
			this.viewportDimensionsChanged = this.viewportDimensionsChanged || new Signal(this);
			this.viewportCameraChanged = this.viewportCameraChanged || new Signal(this);

			this.render = this.render || new RenderSignal(this);

			this.dragstart = this.dragstart || new Signal(this);
			this.dragstop = this.dragstop || new Signal(this);
			this.dragging = this.dragging || new Signal(this);

			this.click = this.click || new Signal(this);
			this.mousemove = this.mousemove || new Signal(this);

			this.mousedown = this.mousedown || new Signal(this);
			this.mouseup = this.mouseup || new Signal(this);

			this.mouseover = this.mouseover || new Signal(this);
			this.mouseout = this.mouseout || new Signal(this);
			this.mousewheel = this.mousewheel || new Signal(this);
		}

		getLeft(): float {
			return this._fRelLeft;
		}

		getTop(): float {
			return this._fRelTop;
		}

		getWidth(): float {
			return this._fRelWidth;
		}

		getHeight(): float {
			return this._fRelHeight;
		}

		getActualLeft(): uint {
			return this._iActLeft;
		}

		getActualTop(): uint {
			return this._iActTop;
		}

		getActualWidth(): uint {
			return this._iActWidth;
		}

		getActualHeight(): uint {
			return this._iActHeight;
		}

		getZIndex(): int {
			return this._iZIndex;
		}

		getType(): EViewportTypes {
			return EViewportTypes.DEFAULT;
		}

		getBackgroundColor(): IColor {
			return this._pViewportState.clearColor;
		}

		setBackgroundColor(cColor: IColor): void {
			this._pViewportState.clearColor.set(cColor);
		}

		getDepthClear(): float {
			return this._pViewportState.clearDepth;
		}

		setDepthClear(fDepthClearValue: float): void {
			this._pViewportState.clearDepth = fDepthClearValue;
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

		getTarget(): IRenderTarget {
			return this._pTarget;
		}

		getCamera(): ICamera {
			return this._pCamera;
		}

		setCamera(pCamera: ICamera): boolean {
			if (isDefAndNotNull(pCamera)) {
				if (this._pCamera._getLastViewport() == this) {
					this._pCamera._keepLastViewport(null);
				}
			}

			this._setCamera(pCamera);
			this.viewportCameraChanged.emit();

			return true;
		}

		protected _setCamera(pCamera: ICamera): void {
			this._pCamera = pCamera;

			if (isDefAndNotNull(pCamera)) {
				// update aspect ratio of new camera if needed.
				if (!pCamera.isConstantAspect()) {
					pCamera.setAspect(<float> this._iActWidth / <float> this._iActHeight);
				}
				pCamera._keepLastViewport(this);
			}
		}

		setDimensions(fLeft: float, fTop: float, fWidth: float, fHeight: float): boolean;
		setDimensions(pRect: IRect2d): boolean;
		setDimensions(fLeft?, fTop?, fWidth?, fHeight?): boolean {
			var pRect: IRect2d;
			if (isNumber(arguments[0])) {
				this._fRelLeft = <float>fLeft;
				this._fRelTop = <float>fTop;
				this._fRelWidth = <float>fWidth;
				this._fRelHeight = <float>fHeight;
			}
			else {
				pRect = <IRect2d>arguments[0];
				this._fRelLeft = pRect.getLeft();
				this._fRelTop = pRect.getTop();
				this._fRelWidth = pRect.getWidth();
				this._fRelHeight = pRect.getHeight();
			}

			this._updateDimensions();

			return true;
		}

		getActualDimensions(): IRect2d {
			return new geometry.Rect2d(<float>this._iActLeft, <float>this._iActTop, <float>this._iActWidth, <float>this._iActHeight);
		}

		setClearEveryFrame(isClear: boolean, iBuffers: uint = EFrameBufferTypes.COLOR | EFrameBufferTypes.DEPTH): void {
			this._bClearEveryFrame = isClear;
			this._pViewportState.clearBuffers = iBuffers;
		}

		getClearEveryFrame(): boolean {
			return this._bClearEveryFrame;
		}

		getClearBuffers(): uint {
			return this._pViewportState.clearBuffers;
		}

		setDepthParams(bDepthTest: boolean, bDepthWrite: boolean, eDepthFunction: ECompareFunction): void {
			this._pViewportState.depthTest = bDepthTest;
			this._pViewportState.depthWrite = bDepthWrite;
			this._pViewportState.depthFunction = eDepthFunction;
		}

		setCullingMode(eCullingMode: ECullingMode): void {
			this._pViewportState.cullingMode = eCullingMode;
		}

		setAutoUpdated(bValue: boolean = true): void { this._isAutoUpdated = bValue; }
		isAutoUpdated(): boolean { return this._isAutoUpdated; }

		_updateDimensions(bEmitEvent: boolean = true): void {
			var fHeight: float = <float>this._pTarget.getHeight();
			var fWidth: float = <float>this._pTarget.getWidth();

			this._iActLeft = <int>math.round(this._fRelLeft * fWidth);
			this._iActTop = <int>math.round(this._fRelTop * fHeight);
			this._iActWidth = <int>math.round(this._fRelWidth * fWidth);
			this._iActHeight = <int>math.round(this._fRelHeight * fHeight);

			// This will check if the cameras getAutoAspectRatio() property is set.
			// If it's true its aspect ratio is fit to the current viewport
			// If it's false the camera remains unchanged.
			// This allows cameras to be used to render to many viewports,
			// which can have their own dimensions and aspect ratios.

			if (this._pCamera) {
				if (!this._pCamera.isConstantAspect())
					this._pCamera.setAspect(<float> this._iActWidth / <float> this._iActHeight);

			}

			this._bUpdated = true;

			if (bEmitEvent) {
				this.viewportDimensionsChanged.emit();
			}
		}

		hide(bValue: boolean = true): void {
			if (bValue !== this._bHidden) {
				this.clear();
				this._bHidden = bValue;
			}
		}

		update(): void {
			if (this._bHidden) {
				return;
			}

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
			if (this._bClearEveryFrame) {
				this.clear(this._pViewportState.clearBuffers,
					this._pViewportState.clearColor,
					this._pViewportState.clearDepth);
			}
		}

		renderObject(pRenderable: IRenderableObject, csMethod: string = null): void {
			pRenderable.render(this, csMethod || this._csDefaultRenderMethod, null);
		}

		endFrame(): void {
			this.getTarget().getRenderer().executeQueue(true);
		}

		protected renderAsNormal(csMethod: string, pCamera: ICamera): void {
			var pVisibleObjects: IObjectArray<ISceneObject> = pCamera.display();
			var pRenderable: IRenderableObject;

			for (var i: int = 0; i < pVisibleObjects.getLength(); ++i) {
				pVisibleObjects.value(i).prepareForRender(this);
			}

			for (var i: int = 0; i < pVisibleObjects.getLength(); ++i) {
				var pSceneObject: ISceneObject = pVisibleObjects.value(i);

				for (var j: int = 0; j < pSceneObject.getTotalRenderable(); j++) {
					pRenderable = pSceneObject.getRenderable(j);

					if (!isNull(pRenderable)) {
						pRenderable.render(this, csMethod, pSceneObject);
					}
				}
			}
		}

		_onRender(pTechnique: IRenderTechnique, iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void {
			
		}

		

		_setTarget(pTarget: IRenderTarget): void {
			if (!isNull(this._pTarget)) {
				logger.critical("render target already exists in this viewport");
				//this.disconnect(this._pTarget, SIGNAL(resized), SLOT(_updateDimensions));
			}

			this._pTarget = pTarget;

			if (!isNull(this._pTarget)) {
				//FIXME: unsafe <any> conversion used for _updateDimensins
				this._pTarget.resized.connect(this, <any>this._updateDimensions);
				this._updateDimensions();
				this._setCamera(this._pCamera);
			}
		}

		isUpdated(): boolean {
			return this._bUpdated;
		}

		enableSupportForUserEvent(iType: int): int {
			if (isNull(this.getTarget())) {
				return 0;
			}

			//get events that have not yet been activated
			var iNotActivate: int = (this._iUserEvents ^ MAX_INT32) & iType;

			this._iUserEvents = bf.setAll(this._iUserEvents, iNotActivate);

			this.getTarget().enableSupportForUserEvent(iType);

			return iNotActivate;
		}

		isUserEventSupported(eType: EUserEvents): boolean {
			return bf.testAny(this._iUserEvents, <int>eType);
		}

	
		_clearUpdatedFlag(): void {
			this._bUpdated = false;
		}

		_getNumRenderedPolygons(): uint {
			return this._pCamera ? this._pCamera._getNumRenderedFaces() : 0;
		}

		_getViewportState(): IViewportState {
			return this._pViewportState;
		}

		static RenderSignal = <any>RenderSignal;
	}
}
