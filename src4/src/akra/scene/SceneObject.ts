/// <reference path="../idl/ISceneObject.ts" />

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
		worldBoundsUpdated: ISignal<{ (pObject: ISceneObject): void; }> = new Signal(this, EEventTypes.UNICAST);

		click: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>
		= new Signal(this);

		mousemove: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>
		= new Signal(this);
		mousedown: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>
		= new Signal(this);
		mouseup: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>
		= new Signal(this);
		mouseover: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>
		= new Signal(this);
		mouseout: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>
		= new Signal(this);


		dragstart: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>
		= new Signal(this);
		dragstop: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>
		= new Signal(this);
		dragging: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>
		= new Signal(this);

		protected _iObjectFlags: int = 0;
		protected _pLocalBounds: IRect3d = new geometry.Rect3d();
		protected _pWorldBounds: IRect3d = new geometry.Rect3d();
		protected _iViewModes: int = 0;


		get totalRenderable(): uint { return 0; }

		get worldBounds(): IRect3d {
			return this._pWorldBounds;
		}

		set worldBounds(pBox: IRect3d) {
			this._pWorldBounds = pBox;
		}

		get localBounds(): IRect3d {
			return this._pLocalBounds;
		}

		set onclick(
			fn: (pObject: ISceneObject, pViewport: IViewport,
			pRenderable: IRenderableObject, x: uint, y: uint) => void) {
			this.click.connect(fn);
		}

		set onmousemove(
			fn: (pObject: ISceneObject, pViewport: IViewport,
			pRenderable: IRenderableObject, x: uint, y: uint) => void) {
			this.mousemove.connect(fn);
		}

		set onmousedown(
			fn: (pObject: ISceneObject, pViewport: IViewport,
			pRenderable: IRenderableObject, x: uint, y: uint) => void) {
			this.mousedown.connect(fn);
		}

		set onmouseup(
			fn: (pObject: ISceneObject, pViewport: IViewport,
			pRenderable: IRenderableObject, x: uint, y: uint) => void) {
			this.mouseup.connect(fn);
		}

		set onmouseover(
			fn: (pObject: ISceneObject, pViewport: IViewport,
			pRenderable: IRenderableObject, x: uint, y: uint) => void) {
			this.mouseover.connect(fn);
		}

		set onmouseout(
			fn: (pObject: ISceneObject, pViewport: IViewport,
			pRenderable: IRenderableObject, x: uint, y: uint) => void) {
			this.mouseout.connect(fn);
		}

		set ondragstart(
			fn: (pObject: ISceneObject, pViewport: IViewport,
			pRenderable: IRenderableObject, x: uint, y: uint) => void) {
			this.dragstart.connect(fn);
		}

		set ondragstop(
			fn: (pObject: ISceneObject, pViewport: IViewport,
			pRenderable: IRenderableObject, x: uint, y: uint) => void) {
			this.dragstop.connect(fn);
		}

		set ondragging(
			fn: (pObject: ISceneObject, pViewport: IViewport,
			pRenderable: IRenderableObject, x: uint, y: uint) => void) {
			this.dragging.connect(fn);
		}


		constructor(pScene: IScene3d, eType: EEntityTypes = EEntityTypes.SCENE_OBJECT) {
			super(pScene, eType);
		}

		getRenderable(i?: uint): IRenderableObject {
			return null;
		}

		accessLocalBounds(): IRect3d {
			bf.setBit(this._iObjectFlags, ESceneObjectFlags.k_NewLocalBounds);
			return this._pLocalBounds;
		}

		isWorldBoundsNew(): boolean {
			return bf.testBit(this._iObjectFlags, ESceneObjectFlags.k_NewLocalBounds);
		}

		destroy(): void {
			super.destroy();
		}

		prepareForUpdate(): void {
			super.prepareForUpdate();

			bf.clearAll(this._iObjectFlags,
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

		private recalcWorldBounds(): boolean {
			// nodes only get their bounds updated
			// as nessesary
			if ((bf.testBit(this._iObjectFlags, ESceneObjectFlags.k_NewLocalBounds)
				|| this.isWorldMatrixNew())) {
				// transform our local rectangle 
				// by the current world matrix
				this._pWorldBounds.set(this._pLocalBounds);
				// make sure we have some degree of thickness
				if (true) {
					this._pWorldBounds.x1 = Math.max(this._pWorldBounds.x1, this._pWorldBounds.x0 + 0.01);
					this._pWorldBounds.y1 = Math.max(this._pWorldBounds.y1, this._pWorldBounds.y0 + 0.01);
					this._pWorldBounds.z1 = Math.max(this._pWorldBounds.z1, this._pWorldBounds.z0 + 0.01);
				}
				this._pWorldBounds.transform(this.worldMatrix);

				// set the flag that our bounding box has changed
				bf.setBit(this._iObjectFlags, ESceneObjectFlags.k_NewWorldBounds);

				this.worldBoundsUpdated.emit();

				return true;
			}

			return false;
		}

		get shadow(): boolean {
			return (this._iViewModes & EObjectViewModes.k_Shadows) != 0;
		}

		set shadow(bValue: boolean) {
			bValue ? bf.setAll(this._iViewModes, EObjectViewModes.k_Shadows) : bf.clearAll(this._iViewModes, EObjectViewModes.k_Shadows);

			for (var i: uint = 0; i < this.totalRenderable; i++) {
				(<IRenderableObject>this.getRenderable(i)).shadow = bValue;
			}
		}

		set billboard(bValue: boolean) {
			bValue ? bf.setAll(this._iViewModes, EObjectViewModes.k_Billboard) : bf.clearAll(this._iViewModes, EObjectViewModes.k_Billboard);
		}

		get billboard(): boolean {
			return (this._iViewModes & EObjectViewModes.k_Billboard) != 0;
		}

		isBillboard(): boolean {
			return this.billboard;
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
			return !isNull(pEntity) && pEntity.type >= EEntityTypes.SCENE_OBJECT && pEntity.type < EEntityTypes.OBJECTS_LIMIT;
		}
	}
}
