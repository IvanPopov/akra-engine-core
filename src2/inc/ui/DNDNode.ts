#ifndef UIDNDNODE_TS
#define UIDNDNODE_TS

#include "IUIDNDNode.ts"
#include "HTMLNode.ts"
#include "math/global.ts"

module akra.ui {
	

	export class DNDNode extends HTMLNode implements IUIDNDNode {

		protected _bDraggableInited: bool = false;
		protected _bDroppableInited: bool = false;

		constructor (parent, element?, eNodeType: EUINodeTypes = EUINodeTypes.DND) {
			super(getUI(parent), element, eNodeType);

			if (!isUI(parent)) {
				this.attachToParent(<Node>parent);
			}
		}
		
		inline isDraggable(): bool {
			return this._bDraggableInited && !this.$element.draggable("option", "disabled");
		}


		setDraggable(bValue: bool = true, pOptions: IUIDraggableOptions = {}): void {
			if (!this._bDraggableInited) {
				var pNode: DNDNode = this;

				this.$element.draggable({
					start: (e: Event) => { return pNode.dragStart(e); },
					stop: (e: Event) => { return pNode.dragStop(e); },
					drag: (e: Event) => { return pNode.move(e); }
				}).draggable("disable");

				this._bDraggableInited = true;
			}

			if (!isNull(this.parent) && isDefAndNotNull(this.$element)) {
				pOptions.containment = isDef(pOptions.containment)? pOptions.containment: "parent";
				// this.$element.draggable("option", "containment", "parent");
			}

			pOptions.disabled = !bValue;
			// this.$element.draggable("option", "disabled", !bValue);
			this.setDraggableOptions(pOptions);
		}

		inline setDraggableOptions(pOptions: IUIDraggableOptions): void {
			this.el.draggable(pOptions);
		}

		setDroppable(bValue: bool = true): void {
			if (!this._bDroppableInited) {
				var pNode: DNDNode = this;

				this.$element.droppable({
			      drop: (e: Event, info) => { return pNode.drop(e, info.draggable[0].component || null, info); }
			    });

			    this._bDroppableInited = true;
			}
		}

		attachToParent(pParent: IUINode, bRender: bool = true): bool {
			var isAttached: bool = super.attachToParent(pParent, bRender);

			if (this.isDraggable()) {
				this.setDraggable(true);
			}

			return isAttached;
		}

		BROADCAST(dragStart, CALL(e));
		BROADCAST(dragStop, CALL(e));
		BROADCAST(move, CALL(e));
		BROADCAST(drop, CALL(e, comp, info));
	}
}

#endif
