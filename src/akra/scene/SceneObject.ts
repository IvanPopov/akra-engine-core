/// <reference path="../idl/ISceneObject.ts" />
/// <reference path="../idl/IControllable.ts" />

/// <reference path="../idl/IRenderableObject.ts" />
/// <reference path="../geometry/Rect3d.ts" />

/// <reference path="../events.ts" />

/// <reference path="SceneNode.ts" />


module akra.scene {

	enum ESceneObjectFlags {
		k_NewLocalBounds = 0,
		k_NewWorldBounds
	};

	enum EObjectViewModes {
		k_Shadows = 0x01,
		k_Billboard = 0x02
	}

	export class SceneObject extends SceneNode implements ISceneObject {
		worldBoundsUpdated: ISignal<{ (pObject: ISceneObject): void; }>;

		click: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>;

		mousemove: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>;
		mousedown: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>;
		mouseup: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>;
		mouseover: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>;
		mouseout: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>;
		mousewheel: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int, fDelta: float): void; }>

		dragstart: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>;
		dragstop: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>;
		dragging: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>;

		protected _iObjectFlags: int = 0;
		protected _iViewModes: int = 0;

		protected _pLocalBounds: IRect3d = new geometry.Rect3d();
		protected _pWorldBounds: IRect3d = new geometry.Rect3d();

		//user event handing
		private _iUserEvents: int = EUserEvents.ANY;

		constructor(pScene: IScene3d, eType: EEntityTypes = EEntityTypes.SCENE_OBJECT) {
			super(pScene, eType);
		}

		protected setupSignals(): void {
			this.worldBoundsUpdated = this.worldBoundsUpdated || new Signal(this, EEventTypes.UNICAST);

			this.worldBoundsUpdated.setForerunner(this._setWorldBoundsUpdated);

			this.click = this.click || new Signal(this);

			this.mousemove = this.mousemove || new Signal(this);
			this.mousedown = this.mousedown || new Signal(this);
			this.mouseup = this.mouseup || new Signal(this);
			this.mouseover = this.mouseover || new Signal(this);
			this.mouseout = this.mouseout || new Signal(this);
			this.mousewheel = this.mousewheel || new Signal(this);

			this.dragstart = this.dragstart || new Signal(this);
			this.dragstop = this.dragstop || new Signal(this);
			this.dragging = this.dragging || new Signal(this);

			super.setupSignals();
		}

		enableSupportForUserEvent(iType: int): int {
			//get events that have not yet been activated
			var iNotActivate: int = (this._iUserEvents ^ 0x7fffffff) & iType;

			this._iUserEvents = bf.setAll(this._iUserEvents, iNotActivate);

			return iNotActivate;
		}

		isUserEventSupported(eType: EUserEvents): boolean {
			return bf.testAny(this._iUserEvents, <int>eType);
		}
		

		getTotalRenderable(): uint {
			return 0;
		}

		getWorldBounds(): IRect3d {
			return this._pWorldBounds;
		}

		getLocalBounds(): IRect3d {
			return this._pLocalBounds;
		}

		accessLocalBounds(): IRect3d {
			this._iObjectFlags = bf.setBit(this._iObjectFlags, ESceneObjectFlags.k_NewLocalBounds);
			return this._pLocalBounds;
		}

		getShadow(): boolean {
			return (this._iViewModes & EObjectViewModes.k_Shadows) != 0;
		}

		setShadow(bValue: boolean): void {
			this._iViewModes = bValue ? bf.setAll(this._iViewModes, EObjectViewModes.k_Shadows) : bf.clearAll(this._iViewModes, EObjectViewModes.k_Shadows);

			for (var i: uint = 0; i < this.getTotalRenderable(); i++) {
				(<IRenderableObject>this.getRenderable(i)).setShadow(bValue);
			}
		}

		setBillboard(bValue: boolean): void {
			this._iViewModes = bValue ? bf.setAll(this._iViewModes, EObjectViewModes.k_Billboard) : bf.clearAll(this._iViewModes, EObjectViewModes.k_Billboard);
		}

		getBillboard(): boolean {
			return (this._iViewModes & EObjectViewModes.k_Billboard) != 0;
		}

		isBillboard(): boolean {
			return this.getBillboard();
		}

		getRenderable(i?: uint): IRenderableObject {
			return null;
		}


		getRenderID(): int;
		/**
		 * Get unique render id.
		 * Render ID used to identify the object in each pixel of viewport/screen.
		 * @param iRenderable Number of renderable object.
		 */
		getRenderID(iRenderable: int): int;
		getRenderID(i?): int {
			var pComposer: IAFXComposer = this.getScene().getManager().getEngine().getComposer();

			if (isDef(i)) {
				return pComposer._calcRenderID(this, this.getRenderable(i));
			}

			return pComposer._calcRenderID(this, null);
		}

		isWorldBoundsNew(): boolean {
			return bf.testBit(this._iObjectFlags, ESceneObjectFlags.k_NewLocalBounds);
		}

		prepareForUpdate(): void {
			super.prepareForUpdate();

			this._iObjectFlags = bf.clearAll(this._iObjectFlags,
				bf.flag(ESceneObjectFlags.k_NewLocalBounds) | bf.flag(ESceneObjectFlags.k_NewWorldBounds));
		}

		update(): boolean {
			//если, обновится мировая матрица узла, то и AABB обновится 
			super.update();
			// do we need to update our local matrix?
			// derived classes update the local matrix
			// then call this base function to complete
			// the update
			return this.recalcWorldBounds();
		}

		protected recalcWorldBounds(): boolean {
			// nodes only get their bounds updated
			// as nessesary
			if ((bf.testBit(this._iObjectFlags, ESceneObjectFlags.k_NewLocalBounds)
				|| this.isWorldMatrixNew())) {
				// transform our local rectangle 
				// by the current world matrix
				this._pWorldBounds.set(this._pLocalBounds);
				// make sure we have some degree of thickness
				if (true) {
					this._pWorldBounds.x1 = math.max(this._pWorldBounds.x1, this._pWorldBounds.x0 + 0.01);
					this._pWorldBounds.y1 = math.max(this._pWorldBounds.y1, this._pWorldBounds.y0 + 0.01);
					this._pWorldBounds.z1 = math.max(this._pWorldBounds.z1, this._pWorldBounds.z0 + 0.01);
				}

				this._pWorldBounds.transform(this.getWorldMatrix());
				this.worldBoundsUpdated.emit();

				return true;
			}

			return false;
		}

		_setWorldBoundsUpdated(): int {
			// set the flag that our bounding box has changed
			return bf.setBit(this._iObjectFlags, ESceneObjectFlags.k_NewWorldBounds);
		}

		getObjectFlags(): int {
			return this._iObjectFlags;
		}

		prepareForRender(pViewport: IViewport): void { }

		toString(isRecursive: boolean = false, iDepth: uint = 0): string {
			if (config.DEBUG) {
				if (!isRecursive) {
					return "<scene_object" + (this._sName ? " " + this._sName : "") + ">"/* + " height: " + this.worldPosition.y*/;
				}

				return super.toString(isRecursive, iDepth);
			}

			return null;
		}

		static isSceneObject(pEntity: IEntity): boolean {
			return !isNull(pEntity) && pEntity.getType() >= EEntityTypes.SCENE_OBJECT && pEntity.getType() < EEntityTypes.OBJECTS_LIMIT;
		}
	}
}
