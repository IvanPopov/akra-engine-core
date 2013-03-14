#ifndef UIDNDNODE_TS
#define UIDNDNODE_TS

#include "IUIDNDNode.ts"
#include "HTMLNode.ts"
#include "math/global.ts"

module akra.ui {
	

	export class DNDNode extends HTMLNode implements IUIDNDNode {

		constructor (parent, element?, eNodeType: EUINodeTypes = EUINodeTypes.DND) {
			super(getUI(parent), element, eNodeType);

			var pNode: DNDNode = this;

			this.$element.draggable({
				start: (e: Event) => { return pNode.dragStart(e); },
				stop: (e: Event) => { return pNode.dragStop(e); },
				drag: (e: Event) => { return pNode.move(e); }
			}).draggable("disable");

			this.$element.droppable({
		      drop: (e: Event) => { return pNode.drop(e); }
		    });

			if (!isUI(parent)) {
				this.attachToParent(<Node>parent);
			}
		}

		
		inline isDraggable(): bool {
			return !this.$element.draggable("option", "disabled");
		}


		setDraggable(bValue: bool = true): void {
			this.$element.draggable("option", "disabled", !bValue);
		}


		attachToParent(pParent: IUINode, bRender: bool = true): bool {
			var isAttached: bool = super.attachToParent(pParent, bRender);

			if (!isNull(this.parent) && isDefAndNotNull(this.$element)) {
				this.$element.draggable("option", "containment", "parent");
			}

			return isAttached;
		}

		BROADCAST(dragStart, CALL(e));
		BROADCAST(dragStop, CALL(e));
		BROADCAST(move, CALL(e));
		BROADCAST(drop, CALL(e));
	}
}

#endif
