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
	export class RenderSignal
		extends Signal<{
			(pViewport: IViewport, pTechnique: IRenderTechnique,
				iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void;
		}, IViewport> {

		emit(pTechnique?: IRenderTechnique, iPass?: uint, pRenderable?: IRenderableObject, pSceneObject?: ISceneObject): void {
			//is mouse under the viewport
			var pViewport: Viewport = <Viewport>this.getSender();
			pViewport._onRender(pTechnique, iPass, pRenderable, pSceneObject);
			//EMIT_BROADCAST(render, _CALL(pTechnique, iPass, pRenderable, pSceneObject));
			super.emit(pTechnique, iPass, pRenderable, pSceneObject);
		}
	}

	//3D events 

	class DragstartSignal extends Signal<{ (pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint): void; }, IViewport> {

		emit(eBtn?: EMouseButton, x?: uint, y?: uint): void {
			var pViewport: IViewport = this.getSender();
			pViewport._keepLastMousePosition(x, y);

			if (!pViewport.is3DEventSupported(E3DEventTypes.DRAGSTART)) {
				return;
			}

			var p = pViewport.pick(x, y);

			pViewport._set3DEventDragTarget(p.object, p.renderable);

			p.object && p.object.dragstart.emit(pViewport, p.renderable, x, y);
			p.renderable && p.renderable.dragstart.emit(pViewport, p.object, x, y);

			super.emit(eBtn, x, y);
		}
	}

	class DragstopSignal extends Signal<{ (pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint): void; }, IViewport> {

		emit(eBtn?: EMouseButton, x?: uint, y?: uint): void {
			var pViewport: IViewport = this.getSender();
			pViewport._keepLastMousePosition(x, y);

			if (!pViewport.is3DEventSupported(E3DEventTypes.DRAGSTOP)) {
				return;
			}

			var p = pViewport._get3DEventDragTarget();

			p.object && p.object.dragstop.emit(pViewport, p.renderable, x, y);
			p.renderable && p.renderable.dragstop.emit(pViewport, p.object, x, y);

			this.emit(eBtn, x, y);
		}
	}

	class DraggingSignal extends Signal<{ (pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint): void; }, IViewport> {

		emit(eBtn?: EMouseButton, x?: uint, y?: uint): void {
			var pViewport: IViewport = this.getSender();

			pViewport._keepLastMousePosition(x, y);

			if (!pViewport.is3DEventSupported(E3DEventTypes.DRAGGING)) {
				return;
			}

			var p = pViewport._get3DEventDragTarget();

			p.object && p.object.dragging.emit(pViewport, p.renderable, x, y);
			p.renderable && p.renderable.dragging.emit(pViewport, p.object, x, y);

			this.emit(eBtn, x, y);
		}
	}

	class ClickSignal extends Signal<{ (pViewport: IViewport, x: uint, y: uint): void; }, IViewport> {

		emit(x?: int, y?: int): void {
			var pViewport: IViewport = this.getSender();

			pViewport._keepLastMousePosition(x, y);
			super.emit(x, y);

			if (!pViewport.is3DEventSupported(E3DEventTypes.CLICK)) {
				return;
			}

			var p = pViewport.pick(x, y);


			p.object && p.object.click.emit(pViewport, p.renderable, x, y);
			p.renderable && p.renderable.click.emit(pViewport, p.object, x, y);
		}
	}

	class MousemoveSignal extends Signal<{ (pViewport: IViewport, x: uint, y: uint): void; }, IViewport> {

		emit(x?: int, y?: int): void {
			var pViewport: IViewport = this.getSender();

			pViewport._keepLastMousePosition(x, y);
			super.emit(x, y);

			if (!pViewport.is3DEventSupported(E3DEventTypes.MOUSEMOVE)) {
				return;
			}

			var p = pViewport.pick(x, y);

			p.object && p.object.mousemove.emit(pViewport, p.renderable, x, y);
			p.renderable && p.renderable.mousemove.emit(pViewport, p.object, x, y);

		}
	}

	class MousedownSignal extends Signal<{ (pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint): void; }, IViewport> {

		emit(eBtn?: EMouseButton, x?: uint, y?: uint): void {
			var pViewport: IViewport = this.getSender();

			pViewport._keepLastMousePosition(x, y);
			super.emit(eBtn, x, y);

			if (!pViewport.is3DEventSupported(E3DEventTypes.MOUSEDOWN)) {
				return;
			}

			var p = pViewport.pick(x, y);

			p.object && p.object.mousedown.emit(pViewport, p.renderable, x, y);
			p.renderable && p.renderable.mousedown.emit(pViewport, p.object, x, y);
		}
	}

	class MouseupSignal extends Signal<{ (pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint): void; }, IViewport> {

		emit(eBtn?: EMouseButton, x?: uint, y?: uint): void {
			var pViewport: IViewport = this.getSender();
			pViewport._keepLastMousePosition(x, y);

			super.emit(eBtn, x, y);

			if (!pViewport.is3DEventSupported(E3DEventTypes.MOUSEUP)) {
				return;
			}

			var p = pViewport.pick(x, y);

			p.object && p.object.mouseup.emit(pViewport, p.renderable, x, y);
			p.renderable && p.renderable.mouseup.emit(pViewport, p.object, x, y);
		}
	}


	class MouseoverSignal extends Signal<{ (pViewport: IViewport, x: uint, y: uint): void; }, IViewport> {

		emit(x?: int, y?: int): void {
			var pViewport: IViewport = this.getSender();

			pViewport._keepLastMousePosition(x, y);
			pViewport._setMouseCaptured(true);
			super.emit(x, y);
		}
	}

	class MouseoutSignal extends Signal<{ (pViewport: IViewport, x: uint, y: uint): void; }, IViewport> {

		emit(x?: int, y?: int): void {
			var pViewport: IViewport = this.getSender();

			pViewport._keepLastMousePosition(x, y);
			pViewport._setMouseCaptured(false);
			//FIXME: do not create object this!
			pViewport._handleMouseInout({ object: null, renderable: null }, x, y);
			super.emit(x, y);
		}
	}

	class MousewheelSignal extends Signal<{ (pViewport: IViewport, x: uint, y: uint, fDelta: float): void; }, IViewport> {

		emit(x?: int, y?: int, fDelta?: float): void {
			var pViewport: IViewport = this.getSender();

			pViewport._keepLastMousePosition(x, y);
			super.emit(x, y, fDelta);
		}
	}

	export class Viewport implements IViewport {
		guid: uint = guid();

		viewportDimensionsChanged: ISignal<{ (pViewport: IViewport): void; }> = new Signal(<any>this);
		viewportCameraChanged: ISignal<{ (pViewport: IViewport): void; }> = new Signal(<any>this);

		render: ISignal<{
			(pViewport: IViewport, pTechnique: IRenderTechnique,
				iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void;
		}> = new RenderSignal(this);

		dragstart: ISignal<{ (pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint): void; }> = new DragstartSignal(this);
		dragstop: ISignal<{ (pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint): void; }> = new DragstopSignal(this);
		dragging: ISignal<{ (pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint): void; }> = new DraggingSignal(this);

		click: ISignal<{ (pViewport: IViewport, x: int, y: int): void; }> = new ClickSignal(this);
		mousemove: ISignal<{ (pViewport: IViewport, x: int, y: int): void; }> = new MousemoveSignal(this);

		mousedown: ISignal<{ (pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint): void; }> = new MousedownSignal(this);
		mouseup: ISignal<{ (pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint): void; }> = new MouseupSignal(this);

		mouseover: ISignal<{ (pViewport: IViewport, x: uint, y: uint): void; }> = new MouseoverSignal(this);
		mouseout: ISignal<{ (pViewport: IViewport, x: uint, y: uint): void; }> = new MouseoutSignal(this);
		mousewheel: ISignal<{ (pViewport: IViewport, x: uint, y: uint, fDelta: float): void; }> = new MousewheelSignal(this);

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

		//get last mouse postion backend
		protected _pMousePositionLast: IPoint = { x: 0, y: 0 }
		//is mouse under the viewport?
		protected _bMouseIsCaptured: boolean = false;

		//3d event handing
		private _i3DEvents: int = 0;
		//friends for Mouse event signals...
		private _p3DEventPickLast: IRIDPair = { object: null, renderable: null }
		private _p3DEventDragTarget: IRIDPair = { object: null, renderable: null }

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
	
		/**
		 * @param csRenderMethod Name of render technique, that will be selected in the renderable for render.
		 */ 
		constructor(pCamera: ICamera, csRenderMethod: string = null,
			fLeft: float = 0., fTop: float = 0., fWidth: float = 1., fHeight: float = 1., iZIndex: int = 0) {

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

			if (bf.testAny(iType, E3DEventTypes.DRAGSTART | E3DEventTypes.DRAGSTOP | E3DEventTypes.DRAGGING)) {
				bf.setAll(iType, E3DEventTypes.DRAGSTART | E3DEventTypes.DRAGSTOP | E3DEventTypes.DRAGGING |
					E3DEventTypes.MOUSEDOWN | E3DEventTypes.MOUSEUP | E3DEventTypes.MOUSEMOVE);
			}

			//mouse over and mouse out events require mouse move
			if (bf.testAny(iType, E3DEventTypes.MOUSEOVER | E3DEventTypes.MOUSEOUT)) {
				bf.setAll(iType, E3DEventTypes.MOUSEMOVE);
			}

			//get events that have not yet been activated
			var iNotActivate: int = (this._i3DEvents ^ MAX_INT32) & iType;

			bf.setAll(this._i3DEvents, iNotActivate);

			this.getTarget().enableSupportFor3DEvent(iType);

			return iNotActivate;
		}

		is3DEventSupported(eType: E3DEventTypes): boolean {
			return bf.testAny(this._i3DEvents, <int>eType);
		}

		getTarget(): IRenderTarget {
			return this._pTarget;
		}

		getCamera(): ICamera {
			return this._pCamera;
		}

		getDepth(x: uint, y: uint): float {
			return 1.0;
		}

		getDepthRange(): IDepthRange {

			if (!this._isDepthRangeUpdated) {
				this._isDepthRangeUpdated = true;
				var pDepthRange: IDepthRange = this._getDepthRangeImpl();

				this._pDepthRange.min = pDepthRange.min;
				this._pDepthRange.max = pDepthRange.max;
			}

			return this._pDepthRange;
		}

		protected _getDepthRangeImpl(): IDepthRange {
			return <IDepthRange>{ min: -1, max: 1 }
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

		protected _onRender(pTechnique: IRenderTechnique, iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void {
			if (this.isMouseCaptured() &&
				// ... and pass is last
				iPass === 0 &&
				// ... and mouseover or mouse out events are supported
				(this.is3DEventSupported(E3DEventTypes.MOUSEOVER) ||
				this.is3DEventSupported(E3DEventTypes.MOUSEOUT))) {
				//check, if the object are loss the mouse

				var pPos: IPoint = this._getLastMousePosition();
				var x: int = pPos.x;
				var y: int = pPos.y;

				this._handleMouseInout(this.pick(x, y), x, y);
			}

		}

		projectPoint(v3fPoint: IVec3, v3fDestination?: IVec3): IVec3 {
			var pCamera: ICamera = this.getCamera();
			var v3fResult: IVec3 = pCamera.projectPoint(v3fPoint, v3fDestination);

			if (isNull(v3fResult)) {
				return null;
			}

			var fX: float = v3fResult.x;
			var fY: float = v3fResult.y;
			var fZ: float = v3fResult.z;

			fX = fX * 0.5 + 0.5;
			fY = fY * 0.5 + 0.5;
			fZ = fZ * 0.5 + 0.5;

			//from top left angle of element
			fX = this.getActualLeft() + this.getActualWidth() * fX;
			fY = this.getActualTop() + this.getActualHeight() * fY;

			return v3fResult.set(fX, fY, fZ);
		}

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

			if (!isDef(v3fDestination)) {
				v3fDestination = new Vec3;
			}

			var pCamera: ICamera = this.getCamera();
			var m4fProjection: IMat4 = pCamera.getProjectionMatrix();
			var m4fWorld: IMat4 = pCamera.getWorldMatrix();

			var v4fIn: IVec4 = Vec4.temp(), v4fOut: IVec4 = Vec4.temp();

			//Transformation of normalized coordinates between -1 and 1
			v4fIn.x = ((x - this.getActualLeft()) / this.getActualWidth() * 2.0 - 1.0);
			//Y-axis look down for viewport, but look UP in GL
			v4fIn.y = ((y - this.getActualTop()) / this.getActualHeight() * 2.0 - 1.0);
			v4fIn.z = 2.0 * this.getDepth(x, y) - 1.0;
			v4fIn.w = 1.0;

			v3fDestination.set(m4fWorld.multiplyVec4(m4fProjection.unproj(v4fIn, v4fOut)).clone("xyz"));
			return v3fDestination;
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

		isMouseCaptured(): boolean {
			return this._bMouseIsCaptured;
		}

		_setMouseCaptured(bValue: boolean): void {
			this._bMouseIsCaptured = bValue;
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

		pick(x: uint, y: uint): IRIDPair {
			return { object: null, renderable: null }
		}

		getObject(x: uint, y: uint): ISceneObject {
			return null;
		}

		getRenderable(x: uint, y: uint): IRenderableObject {
			return null;
		}

		//manual recall over/out events for objects
		touch(): void {
			this._handleMouseInout({ object: null, renderable: null }, 0, 0);
		}

		//friends for RenderSignal.
		_handleMouseInout(pCurr: IRIDPair, x: uint, y: uint): IRIDPair {
			// var pCurr: IRIDPair = this.pick(x, y);
			var pPrev: IRIDPair = this._p3DEventPickLast;

			if (pCurr.object !== pPrev.object) {
				if (!isNull(pPrev.object)) {
					pPrev.object.mouseout.emit(this, pPrev.renderable, x, y);
				}

				if (!isNull(pCurr.object)) {
					pCurr.object.mouseover.emit(this, pCurr.renderable, x, y);
				}
			}
			// var ov = false;
			// var ou = false;
			// var n = math.floor(Math.random() * 100500);
			if (pCurr.renderable !== pPrev.renderable) {
				if (!isNull(pPrev.renderable)) {
					// ou = true;
					pPrev.renderable.mouseout.emit(this, pPrev.object, x, y);
				}

				if (!isNull(pCurr.renderable)) {
					// ov = true;
					pCurr.renderable.mouseover.emit(this, pCurr.object, x, y);
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

		_getLastMousePosition(): IPoint {
			return this._pMousePositionLast;
		}

		_set3DEventDragTarget(pObject: ISceneObject = null, pRenderable: IRenderableObject = null): void {
			this._p3DEventDragTarget.object = pObject;
			this._p3DEventDragTarget.renderable = pRenderable;
		}

		_get3DEventDragTarget(): IRIDPair {
			return this._p3DEventDragTarget;
		}
	}
}
