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
		worldBoundsUpdated: ISignal<{ (pObject: ISceneObject): void; }> = new Signal(<any>this, EEventTypes.UNICAST);

		click: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>
		= new Signal(<any>this);

		mousemove: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>
		= new Signal(<any>this);
		mousedown: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>
		= new Signal(<any>this);
		mouseup: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>
		= new Signal(<any>this);
		mouseover: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>
		= new Signal(<any>this);
		mouseout: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>
		= new Signal(<any>this);


		dragstart: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>
		= new Signal(<any>this);
		dragstop: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>
		= new Signal(<any>this);
		dragging: ISignal<{ (pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: int, y: int): void; }>
		= new Signal(<any>this);

		protected _iObjectFlags: int = 0;
		protected _pLocalBounds: IRect3d = new geometry.Rect3d();
		protected _pWorldBounds: IRect3d = new geometry.Rect3d();
		protected _iViewModes: int = 0;


		getTotalRenderable(): uint {
			return 0;
		}

		getWorldBounds(): IRect3d {
			return this._pWorldBounds;
		}

		//setWorldBounds(pBox: IRect3d): void {
		//	this._pWorldBounds = pBox;
		//}

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

		setOnClick(
			fn: (pObject: ISceneObject, pViewport: IViewport,
			pRenderable: IRenderableObject, x: uint, y: uint) => void): void {
			this.click.connect(fn);
		}

		setOnMouseMove(
			fn: (pObject: ISceneObject, pViewport: IViewport,
			pRenderable: IRenderableObject, x: uint, y: uint) => void): void {
			this.mousemove.connect(fn);
		}

		setOnMouseDown(
			fn: (pObject: ISceneObject, pViewport: IViewport,
			pRenderable: IRenderableObject, x: uint, y: uint) => void): void {
			this.mousedown.connect(fn);
		}

		setOnMouseUp(
			fn: (pObject: ISceneObject, pViewport: IViewport,
			pRenderable: IRenderableObject, x: uint, y: uint) => void): void {
			this.mouseup.connect(fn);
		}

		setOnMouseOver(
			fn: (pObject: ISceneObject, pViewport: IViewport,
			pRenderable: IRenderableObject, x: uint, y: uint) => void): void {
			this.mouseover.connect(fn);
		}

		setOnMouseOut(
			fn: (pObject: ISceneObject, pViewport: IViewport,
			pRenderable: IRenderableObject, x: uint, y: uint) => void): void {
			this.mouseout.connect(fn);
		}

		setOnDragStart(
			fn: (pObject: ISceneObject, pViewport: IViewport,
			pRenderable: IRenderableObject, x: uint, y: uint) => void): void {
			this.dragstart.connect(fn);
		}

		setOnDragStop(
			fn: (pObject: ISceneObject, pViewport: IViewport,
			pRenderable: IRenderableObject, x: uint, y: uint) => void): void {
			this.dragstop.connect(fn);
		}

		setOnDragging(
			fn: (pObject: ISceneObject, pViewport: IViewport,
			pRenderable: IRenderableObject, x: uint, y: uint) => void): void {
			this.dragging.connect(fn);
		}

		constructor(pScene: IScene3d, eType: EEntityTypes = EEntityTypes.SCENE_OBJECT) {
			super(pScene, eType);
		}

		getRenderable(i?: uint): IRenderableObject {
			return null;
		}

		isWorldBoundsNew(): boolean {
			return bf.testBit(this._iObjectFlags, ESceneObjectFlags.k_NewLocalBounds);
		}

		destroy(): void {
			super.destroy();
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
				this._pWorldBounds.transform(this.getWorldMatrix());

				// set the flag that our bounding box has changed
				this._iObjectFlags = bf.setBit(this._iObjectFlags, ESceneObjectFlags.k_NewWorldBounds);

				this.worldBoundsUpdated.emit();

				return true;
			}

			return false;
		}

		isBillboard(): boolean {
			return this.getBillboard();
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
