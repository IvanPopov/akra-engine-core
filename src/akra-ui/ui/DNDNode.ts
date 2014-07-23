/// <reference path="../idl/IUIDNDNode.ts" />
/// <reference path="HTMLNode.ts" />


module akra.ui {

	export class DNDNode extends HTMLNode implements IUIDNDNode {

		dragStart: ISignal<{ (pNode: IUIDNDNode, e: IUIEvent): void; }>;
		dragStop: ISignal<{ (pNode: IUIDNDNode, e: IUIEvent): void; }>;
		move: ISignal<{ (pNode: IUIDNDNode, e: IUIEvent): void; }>;
		drop: ISignal<{ (pNode: IUIDNDNode, e: IUIEvent, pComponent: IUIComponent, info: any): void; }>;


		protected _bDraggableInited: boolean = false;
		protected _bDroppableInited: boolean = false;

		constructor(parent, element?, eNodeType: EUINodeTypes = EUINodeTypes.DND) {
			super(getUI(parent), element, eNodeType);

			if (!isUI(parent)) {
				this.attachToParent(<Node>parent);
			}
		}

		protected setupSignals(): void {
			this.dragStart = this.dragStart || new Signal(this);
			this.dragStop = this.dragStop || new Signal(this);
			this.move = this.move || new Signal(this);
			this.drop = this.drop || new Signal(this);

			super.setupSignals();
		}

		isDraggable(): boolean {
			return this._bDraggableInited && !this.$element.draggable("option", "disabled");
		}


		setDraggable(bValue: boolean = true, pOptions: IUIDraggableOptions = {}): void {
			if (!this._bDraggableInited) {
				var pNode: DNDNode = this;

				this.$element.draggable({
					start: (e: Event) => { return pNode.dragStart.emit(e); },
					stop: (e: Event) => { return pNode.dragStop.emit(e); },
					drag: (e: Event) => { return pNode.move.emit(e); }
				}).draggable("disable");

				this._bDraggableInited = true;
			}

			if (!isNull(this.getParent()) && isDefAndNotNull(this.$element)) {
				pOptions.containment = isDef(pOptions.containment) ? pOptions.containment : "parent";
				// this.$element.draggable("option", "containment", "parent");
			}

			pOptions.disabled = !bValue;
			// this.$element.draggable("option", "disabled", !bValue);
			this.setDraggableOptions(pOptions);
		}

		setDraggableOptions(pOptions: IUIDraggableOptions): void {
			this.getElement().draggable(pOptions);
		}

		setDroppable(bValue: boolean = true): void {
			if (!this._bDroppableInited) {
				var pNode: DNDNode = this;

				this.$element.droppable({
					drop: (e: Event, info) => { return pNode.drop.emit(e, info.draggable[0].component || null, info); }
				});

				this._bDroppableInited = true;
			}
		}

		attachToParent(pParent: IUINode, bRender: boolean = true): boolean {
			var isAttached: boolean = super.attachToParent(pParent, bRender);

			if (this.isDraggable()) {
				this.setDraggable(true);
			}

			return isAttached;
		}
	}
}


