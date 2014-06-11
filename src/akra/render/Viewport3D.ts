/// <reference path="../idl/IViewport3D.ts" />

/// <reference path="Viewport.ts" />

/// <reference path="../events.ts" />
/// <reference path="../color/colors.ts" />
/// <reference path="../bf/bf.ts" />
/// <reference path="../config/config.ts" />
/// <reference path="../math/math.ts" />
/// <reference path="../debug.ts" />


module akra.render {
	import Color = color.Color;

	import Vec3 = math.Vec3;
	import Vec4 = math.Vec4;

	//3D events 

	class DragstartSignal extends Signal<Viewport3D> {

		emit(eBtn: EMouseButton, x: uint, y: uint): void {
			var pViewport = this.getSender();
			pViewport._keepLastMousePosition(x, y);

			if (!pViewport.isUserEventSupported(EUserEvents.DRAGSTART)) {
				return;
			}

			var p = pViewport._pick(x, y);

			pViewport._setUserEventDragTarget(p.object, p.renderable);

			if (isNull(p.object) || (p.object.isUserEventSupported(EUserEvents.DRAGSTART))) {
				p.object && p.object.dragstart.emit(pViewport, p.renderable, x, y);
				p.renderable && p.renderable.dragstart.emit(pViewport, p.object, x, y);
			}

			super.emit(eBtn, x, y);
		}
	}

	class DragstopSignal extends Signal<Viewport3D> {

		emit(eBtn: EMouseButton, x: uint, y: uint): void {
			var pViewport = this.getSender();
			pViewport._keepLastMousePosition(x, y);

			if (!pViewport.isUserEventSupported(EUserEvents.DRAGSTOP)) {
				return;
			}

			var p = pViewport._getUserEventDragTarget();

			if (isNull(p.object) || (p.object.isUserEventSupported(EUserEvents.DRAGSTOP))) {
				p.object && p.object.dragstop.emit(pViewport, p.renderable, x, y);
				p.renderable && p.renderable.dragstop.emit(pViewport, p.object, x, y);
			}

			super.emit(eBtn, x, y);
		}
	}

	class DraggingSignal extends Signal<Viewport3D> {

		emit(eBtn: EMouseButton, x: uint, y: uint, dx: uint, dy: uint): void {
			var pViewport = this.getSender();

			pViewport._keepLastMousePosition(x, y);

			if (!pViewport.isUserEventSupported(EUserEvents.DRAGGING)) {
				return;
			}

			var p = pViewport._getUserEventDragTarget();

			if (isNull(p.object) || (p.object.isUserEventSupported(EUserEvents.DRAGGING))) {
				p.object && p.object.dragging.emit(pViewport, p.renderable, x, y);
				p.renderable && p.renderable.dragging.emit(pViewport, p.object, x, y);
			}

			super.emit(eBtn, x, y, dx, dy);
		}
	}

	class ClickSignal extends Signal<Viewport3D> {

		emit(x: int, y: int): void {
			var pViewport = this.getSender();

			pViewport._keepLastMousePosition(x, y);
			super.emit(x, y);

			if (!pViewport.isUserEventSupported(EUserEvents.CLICK)) {
				return;
			}

			var p = pViewport._pick(x, y);

			if (isNull(p.object) || (p.object.isUserEventSupported(EUserEvents.CLICK))) {
				p.object && p.object.click.emit(pViewport, p.renderable, x, y);
				p.renderable && p.renderable.click.emit(pViewport, p.object, x, y);
			}

		}
	}

	class MousemoveSignal extends Signal<Viewport3D> {

		emit(x: int, y: int): void {
			var pViewport = this.getSender();

			pViewport._keepLastMousePosition(x, y);
			super.emit(x, y);

			if (!pViewport.isUserEventSupported(EUserEvents.MOUSEMOVE)) {
				return;
			}

			var p = pViewport._pick(x, y);

			if (isNull(p.object) || (p.object.isUserEventSupported(EUserEvents.MOUSEMOVE))) {
				p.object && p.object.mousemove.emit(pViewport, p.renderable, x, y);
				p.renderable && p.renderable.mousemove.emit(pViewport, p.object, x, y);
			}


		}
	}

	class MousedownSignal extends Signal<Viewport3D> {

		emit(eBtn: EMouseButton, x: uint, y: uint): void {
			var pViewport = this.getSender();

			pViewport._keepLastMousePosition(x, y);
			super.emit(eBtn, x, y);

			if (!pViewport.isUserEventSupported(EUserEvents.MOUSEDOWN)) {
				return;
			}

			var p = pViewport._pick(x, y);

			if (isNull(p.object) || (p.object.isUserEventSupported(EUserEvents.MOUSEDOWN))) {
				p.object && p.object.mousedown.emit(pViewport, p.renderable, x, y);
				p.renderable && p.renderable.mousedown.emit(pViewport, p.object, x, y);
			}

		}
	}

	class MouseupSignal extends Signal<Viewport3D> {

		emit(eBtn: EMouseButton, x: uint, y: uint): void {
			var pViewport = this.getSender();
			pViewport._keepLastMousePosition(x, y);

			super.emit(eBtn, x, y);

			if (!pViewport.isUserEventSupported(EUserEvents.MOUSEUP)) {
				return;
			}

			var p = pViewport._pick(x, y);

			if (isNull(p.object) || (p.object.isUserEventSupported(EUserEvents.MOUSEUP))) {
				p.object && p.object.mouseup.emit(pViewport, p.renderable, x, y);
				p.renderable && p.renderable.mouseup.emit(pViewport, p.object, x, y);
			}

		}
	}

	class MouseoverSignal extends Signal<Viewport3D> {

		emit(x: int, y: int): void {
			var pViewport = this.getSender();

			pViewport._keepLastMousePosition(x, y);
			pViewport._setMouseCaptured(true);
			super.emit(x, y);
		}
	}

	class MouseoutSignal extends Signal<Viewport3D> {

		emit(x: int, y: int): void {
			var pViewport = this.getSender();

			pViewport._keepLastMousePosition(x, y);
			pViewport._setMouseCaptured(false);

			//FIXME: do not create object this!
			pViewport._handleMouseInout(null, x, y);
			super.emit(x, y);
		}
	}

	class MousewheelSignal extends Signal<Viewport3D> {

		emit(x: int, y: int, fDelta: float): void {
			var pViewport = this.getSender();

			pViewport._keepLastMousePosition(x, y);
			super.emit(x, y, fDelta);


			if (!pViewport.isUserEventSupported(EUserEvents.MOUSEWHEEL)) {
				return;
			}

			var p = pViewport._pick(x, y);

			if (isNull(p.object) || (p.object.isUserEventSupported(EUserEvents.MOUSEWHEEL))) {
				p.object && p.object.mousewheel.emit(pViewport, p.renderable, x, y, fDelta);
				p.renderable && p.renderable.mousewheel.emit(pViewport, p.object, x, y, fDelta);
			}

		}
	}

	export class Viewport3D extends Viewport implements IViewport3D {
		//get last mouse postion backend
		private _pMousePositionLast: IPoint = { x: 0, y: 0 }
		//is mouse under the viewport?
		private _bMouseIsCaptured: boolean = false;

		//Specifies whether the object is perfect choice in a given frame
		private _b3DRequirePick = true;
		private _p3DEventPickLast: IPickedObject = { object: null, renderable: null, x: -1, y: -1 }
		private _p3DEventPickPrev: IPickedObject = { object: null, renderable: null, x: -1, y: -1 }
		private _p3DEventDragTarget: IRIDPair = { object: null, renderable: null }

		private _b3DEventsSupport: boolean = true;


		protected setupSignals(): void {
			this.dragstart = this.dragstart || new DragstartSignal(this);
			this.dragstop = this.dragstop || new DragstopSignal(this);
			this.dragging = this.dragging || new DraggingSignal(this);

			this.click = this.click || new ClickSignal(this);
			this.mousemove = this.mousemove || new MousemoveSignal(this);

			this.mousedown = this.mousedown || new MousedownSignal(this);
			this.mouseup = this.mouseup || new MouseupSignal(this);

			this.mouseover = this.mouseover || new MouseoverSignal(this);
			this.mouseout = this.mouseout || new MouseoutSignal(this);
			this.mousewheel = this.mousewheel || new MousewheelSignal(this);

			super.setupSignals();
		}

		/** @copydoc IViewport3D::getEffect() */
		getEffect(): IEffect {
			return null;
		}

		update(): void {
			super.update();

			//frame updated, pick required, if needed
			this._b3DRequirePick = true;
		}

		/** @copydoc IViewport3D::enable3DEvents() */
		final enable3DEvents(bEnable: boolean = true): void {
			this._b3DEventsSupport = bEnable;
		}

		/** @copydoc IViewport3D::is3DEventsSupported() */
		final is3DEventsSupported(): boolean {
			return this._b3DEventsSupport;
		}

		/** @copydoc IViewport3D::touch() */
		touch(): void {
			this._handleMouseInout(null, 0, 0);
		}

		/** @copydoc IViewport3D::pick() */
		pick(x: uint, y: uint, pDest: IPickedObject = { object: null, renderable: null, x: 0, y: 0 }): IPickedObject {
			debug.log("pick();");
			var pComposer: IAFXComposer = this.getTarget().getRenderer().getEngine().getComposer();
			var iRid: int = this._getRenderId(x, y);
			var pObject: ISceneObject = pComposer._getObjectByRid(iRid);
			var pRenderable: IRenderableObject = null;

			if (isNull(pObject) || !pObject.isFrozen()) {
				pRenderable = pComposer._getRenderableByRid(iRid);
			}
			else {
				pObject = null;
			}

			pDest.renderable = pRenderable;
			pDest.object = pObject;
			pDest.x = x;
			pDest.y = y;

			return pDest;
		}

		/** @copydoc IViewport3D::getObject() */
		getObject(x: uint, y: uint): ISceneObject {
			return this.pick(x, y, Viewport3D.PICK_CONTAINER).object;
		}

		/** @copydoc IViewport3D::getRenderable() */
		getRenderable(x: uint, y: uint): IRenderableObject {
			return this.pick(x, y, Viewport3D.PICK_CONTAINER).renderable;
		}

		protected _getDepthRangeImpl(): IDepthRange {
			return <IDepthRange>{ min: -1, max: 1 }
		}

		/** @copydoc IViewport3D::getDepth() */
		getDepth(x: uint, y: uint): float {
			return 1.0;
		}

		/** @copydoc IViewport3D::getDepthRange() */
		final getDepthRange(): IDepthRange {

			if (!this._isDepthRangeUpdated) {
				this._isDepthRangeUpdated = true;
				var pDepthRange: IDepthRange = this._getDepthRangeImpl();

				this._pDepthRange.min = pDepthRange.min;
				this._pDepthRange.max = pDepthRange.max;
			}

			return this._pDepthRange;
		}

		/** @copydoc IViewport3D::isMouseCaptured() */
		final isMouseCaptured(): boolean {
			return this._bMouseIsCaptured;
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

			if (isNumber(arguments[0])) {
				x = math.round(arguments[0]);
				y = math.round(arguments[1]);
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


		/** @return Cached pick result, limited - one pick per frame maximum. */
		_pick(x: uint, y: uint): IPickedObject {
			if (this.isPickResultRecalcNeeded()) {
				//save last pick result
				this._p3DEventPickPrev.renderable = this._p3DEventPickLast.renderable;
				this._p3DEventPickPrev.object = this._p3DEventPickLast.object;
				this._p3DEventPickPrev.x = this._p3DEventPickLast.x;
				this._p3DEventPickPrev.y = this._p3DEventPickLast.y;

				//save new pick result
				<IPickedObject>this.pick(x, y, this._p3DEventPickLast);

				this._b3DRequirePick = false;
			}

			return this._p3DEventPickLast;
		}

		/** @return Is pick required for current frame? */
		private isPickResultRecalcNeeded(): boolean {
			return this._b3DRequirePick && this._b3DEventsSupport;
		}

		//friends for RenderSignal.
		_handleMouseInout(pCurr: IRIDPair, x: uint, y: uint): IRIDPair {
			var pPrev: IRIDPair = this._p3DEventPickPrev;

			var pCurrObject = null;
			var pCurrRenderable = null;

			if (pCurr) {
				pCurrObject = pCurr.object;
				pCurrRenderable = pCurr.renderable;
			}

			if (pCurrObject !== pPrev.object) {
				if (!isNull(pPrev.object) && pPrev.object.isUserEventSupported(EUserEvents.MOUSEOUT)) {
					pPrev.object.mouseout.emit(this, pPrev.renderable, x, y);
				}

				if (!isNull(pCurrObject) && pCurrObject.isUserEventSupported(EUserEvents.MOUSEOVER)) {
					pCurrObject.mouseover.emit(this, pCurrRenderable, x, y);
				}
			}

			if (pCurrRenderable !== pPrev.renderable) {
				if (!isNull(pPrev.renderable) && (isNull(pPrev.object) || pPrev.object.isUserEventSupported(EUserEvents.MOUSEOUT))) {
					pPrev.renderable.mouseout.emit(this, pPrev.object, x, y);
				}

				if (!isNull(pCurrRenderable) && (isNull(pCurrObject) || pCurrObject.isUserEventSupported(EUserEvents.MOUSEOUT))) {
					pCurrRenderable.mouseover.emit(this, pCurrObject, x, y);
				}
			}

			return pCurr;
		}

		final _keepLastMousePosition(x: uint, y: uint): void {
			this._pMousePositionLast.x = x;
			this._pMousePositionLast.y = y;
		}

		final _getLastMousePosition(): IPoint {
			return this._pMousePositionLast;
		}

		final _setUserEventDragTarget(pObject: ISceneObject = null, pRenderable: IRenderableObject = null): void {
			this._p3DEventDragTarget.object = pObject;
			this._p3DEventDragTarget.renderable = pRenderable;
		}

		final _getUserEventDragTarget(): IRIDPair {
			return this._p3DEventDragTarget;
		}

		final _setMouseCaptured(bValue: boolean): void {
			this._bMouseIsCaptured = bValue;
		}

		_getRenderId(x: uint, y: uint): int {
			return 0;
		}

		_onRender(pTechnique: IRenderTechnique, iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void {
			if (this.isMouseCaptured() &&
				// ... and pass is last/first
				iPass === 0 &&
				// ... and mouseover or mouse out events are supported
				(this.isUserEventSupported(EUserEvents.MOUSEOVER) ||
				this.isUserEventSupported(EUserEvents.MOUSEOUT))) {
				//check, if the object are loss the mouse

				var pPos: IPoint = this._getLastMousePosition();
				var x: int = pPos.x;
				var y: int = pPos.y;


				this._handleMouseInout(this._pick(x, y), x, y);
			}
		}

		static DraggingSignal = <typeof Signal><any>DraggingSignal;
		static DragstartSignal = <typeof Signal><any>DragstartSignal;
		static DragstopSignal = <typeof Signal><any>DragstopSignal;

		static MousedownSignal = <typeof Signal><any>MousedownSignal;
		static MouseupSignal = <typeof Signal><any>MouseupSignal;

		static MouseoverSignal = <typeof Signal><any>MouseoverSignal;
		static MouseoutSignal = <typeof Signal><any>MouseoutSignal;

		static MousewheelSignal = <typeof Signal><any>MousewheelSignal;
		static MousemoveSignal = <typeof Signal><any>MousemoveSignal;

		static ClickSignal = <typeof Signal><any>ClickSignal;

		private static PICK_CONTAINER: IPickedObject = { x: 0, y: 0, renderable: null, object: null };
	}
}

