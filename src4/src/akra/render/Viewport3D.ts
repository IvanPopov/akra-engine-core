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

	class DragstartSignal extends Signal<IViewport3D> {

		emit(eBtn: EMouseButton, x: uint, y: uint): void {
			var pViewport: IViewport3D = this.getSender();
			pViewport._keepLastMousePosition(x, y);

			if (!pViewport.isUserEventSupported(EUserEvents.DRAGSTART)) {
				return;
			}

			var p = pViewport.pick(x, y);

			pViewport._setUserEventDragTarget(p.object, p.renderable);

			p.object && p.object.dragstart.emit(pViewport, p.renderable, x, y);
			p.renderable && p.renderable.dragstart.emit(pViewport, p.object, x, y);

			super.emit(eBtn, x, y);
		}
	}

	class DragstopSignal extends Signal<IViewport3D> {

		emit(eBtn: EMouseButton, x: uint, y: uint): void {
			var pViewport: IViewport3D = this.getSender();
			pViewport._keepLastMousePosition(x, y);

			if (!pViewport.isUserEventSupported(EUserEvents.DRAGSTOP)) {
				return;
			}

			var p = pViewport._getUserEventDragTarget();

			p.object && p.object.dragstop.emit(pViewport, p.renderable, x, y);
			p.renderable && p.renderable.dragstop.emit(pViewport, p.object, x, y);

			super.emit(eBtn, x, y);
		}
	}

	class DraggingSignal extends Signal<IViewport3D> {

		emit(eBtn: EMouseButton, x: uint, y: uint): void {
			var pViewport: IViewport3D = this.getSender();

			pViewport._keepLastMousePosition(x, y);

			if (!pViewport.isUserEventSupported(EUserEvents.DRAGGING)) {
				return;
			}

			var p = pViewport._getUserEventDragTarget();

			p.object && p.object.dragging.emit(pViewport, p.renderable, x, y);
			p.renderable && p.renderable.dragging.emit(pViewport, p.object, x, y);

			super.emit(eBtn, x, y);
		}
	}

	class ClickSignal extends Signal<IViewport3D> {

		emit(x: int, y: int): void {
			var pViewport: IViewport3D = this.getSender();

			pViewport._keepLastMousePosition(x, y);
			super.emit(x, y);

			if (!pViewport.isUserEventSupported(EUserEvents.CLICK)) {
				return;
			}

			var p = pViewport.pick(x, y);

			p.object && p.object.click.emit(pViewport, p.renderable, x, y);
			p.renderable && p.renderable.click.emit(pViewport, p.object, x, y);
		}
	}

	class MousemoveSignal extends Signal<IViewport3D> {

		emit(x: int, y: int): void {
			var pViewport: IViewport3D = this.getSender();

			pViewport._keepLastMousePosition(x, y);
			super.emit(x, y);

			if (!pViewport.isUserEventSupported(EUserEvents.MOUSEMOVE)) {
				return;
			}

			var p = pViewport.pick(x, y);

			p.object && p.object.mousemove.emit(pViewport, p.renderable, x, y);
			p.renderable && p.renderable.mousemove.emit(pViewport, p.object, x, y);

		}
	}

	class MousedownSignal extends Signal<IViewport3D> {

		emit(eBtn: EMouseButton, x: uint, y: uint): void {
			var pViewport: IViewport3D = this.getSender();

			pViewport._keepLastMousePosition(x, y);
			super.emit(eBtn, x, y);

			if (!pViewport.isUserEventSupported(EUserEvents.MOUSEDOWN)) {
				return;
			}

			var p = pViewport.pick(x, y);

			p.object && p.object.mousedown.emit(pViewport, p.renderable, x, y);
			p.renderable && p.renderable.mousedown.emit(pViewport, p.object, x, y);
		}
	}

	class MouseupSignal extends Signal<IViewport3D> {

		emit(eBtn: EMouseButton, x: uint, y: uint): void {
			var pViewport: IViewport3D = this.getSender();
			pViewport._keepLastMousePosition(x, y);

			super.emit(eBtn, x, y);

			if (!pViewport.isUserEventSupported(EUserEvents.MOUSEUP)) {
				return;
			}

			var p = pViewport.pick(x, y);

			p.object && p.object.mouseup.emit(pViewport, p.renderable, x, y);
			p.renderable && p.renderable.mouseup.emit(pViewport, p.object, x, y);
		}
	}


	class MouseoverSignal extends Signal<IViewport3D> {

		emit(x: int, y: int): void {
			var pViewport: IViewport3D = this.getSender();

			pViewport._keepLastMousePosition(x, y);
			pViewport._setMouseCaptured(true);
			super.emit(x, y);
		}
	}

	class MouseoutSignal extends Signal<IViewport3D> {

		emit(x: int, y: int): void {
			var pViewport: IViewport3D = this.getSender();

			pViewport._keepLastMousePosition(x, y);
			pViewport._setMouseCaptured(false);

			//FIXME: do not create object this!
			pViewport._handleMouseInout(null, x, y);
			super.emit(x, y);
		}
	}

	class MousewheelSignal extends Signal<IViewport3D> {

		emit(x: int, y: int, fDelta: float): void {
			var pViewport: IViewport3D = this.getSender();

			pViewport._keepLastMousePosition(x, y);
			super.emit(x, y, fDelta);
		}
	}

	export class Viewport3D extends Viewport implements IViewport3D {
		//get last mouse postion backend
		protected _pMousePositionLast: IPoint = { x: 0, y: 0 }
		//is mouse under the viewport?
		protected _bMouseIsCaptured: boolean = false;

		//Specifies whether the object is perfect choice in a given frame
		protected _b3DRequirePick = true;
		protected _p3DEventPickLast: IRIDPair = { object: null, renderable: null }
		protected _p3DEventPickPrev: IRIDPair = { object: null, renderable: null }
		protected _p3DEventDragTarget: IRIDPair = { object: null, renderable: null }

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

		

		getDepth(x: uint, y: uint): float {
			return 1.0;
		}

		update(): void {
			super.update();

			//framde updated, pick required, if needed
			this._b3DRequirePick = true;
		}

		protected _getDepthRangeImpl(): IDepthRange {
			return <IDepthRange>{ min: -1, max: 1 }
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

		getObject(x: uint, y: uint): ISceneObject {
			return null;
		}

		getRenderable(x: uint, y: uint): IRenderableObject {
			return null;
		}

		//manual recall over/out events for objects
		touch(): void {
			this._handleMouseInout(null, 0, 0);
		}

		getEffect(): IEffect {
			return null;
		}

		isMouseCaptured(): boolean {
			return this._bMouseIsCaptured;
		}

		pick(x: uint, y: uint): IRIDPair {
			if (this._b3DRequirePick) {
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

				//save last pick result
				this._p3DEventPickPrev.renderable = this._p3DEventPickLast.renderable;
				this._p3DEventPickPrev.object = this._p3DEventPickLast.object;

				//save new pick result
				this._p3DEventPickLast.renderable = pRenderable;
				this._p3DEventPickLast.object = pObject;

				this._b3DRequirePick = false;
			}

			return this._p3DEventPickLast;
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
				if (!isNull(pPrev.object)) {
					pPrev.object.mouseout.emit(this, pPrev.renderable, x, y);
				}

				if (!isNull(pCurrObject)) {
					pCurrObject.mouseover.emit(this, pCurrRenderable, x, y);
				}
			}

			if (pCurrRenderable !== pPrev.renderable) {
				if (!isNull(pPrev.renderable)) {
					pPrev.renderable.mouseout.emit(this, pPrev.object, x, y);
				}

				if (!isNull(pCurrRenderable)) {
					pCurrRenderable.mouseover.emit(this, pCurrObject, x, y);
				}
			}

			return pCurr;
		}

		_keepLastMousePosition(x: uint, y: uint): void {
			this._pMousePositionLast.x = x;
			this._pMousePositionLast.y = y;
		}

		_getLastMousePosition(): IPoint {
			return this._pMousePositionLast;
		}

		_setUserEventDragTarget(pObject: ISceneObject = null, pRenderable: IRenderableObject = null): void {
			this._p3DEventDragTarget.object = pObject;
			this._p3DEventDragTarget.renderable = pRenderable;
		}

		_getUserEventDragTarget(): IRIDPair {
			return this._p3DEventDragTarget;
		}

		_setMouseCaptured(bValue: boolean): void {
			this._bMouseIsCaptured = bValue;
		}

		_getRenderId(x: uint, y: uint): int {
			return 0;
		}

		_onRender(pTechnique: IRenderTechnique, iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void {
			if (this.isMouseCaptured() &&
				// ... and pass is last
				iPass === 0 &&
				// ... and mouseover or mouse out events are supported
				(this.isUserEventSupported(EUserEvents.MOUSEOVER) ||
				this.isUserEventSupported(EUserEvents.MOUSEOUT))) {
				//check, if the object are loss the mouse

				var pPos: IPoint = this._getLastMousePosition();
				var x: int = pPos.x;
				var y: int = pPos.y;

				this._handleMouseInout(this.pick(x, y), x, y);
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
	}
}

 