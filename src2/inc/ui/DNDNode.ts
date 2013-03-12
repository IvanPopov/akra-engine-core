#ifndef UIDNDNODE_TS
#define UIDNDNODE_TS

#include "IUIDNDNode.ts"
#include "HTMLNode.ts"
#include "math/global.ts"

module akra.ui {
	

	export class DNDNode extends HTMLNode implements IUIDNDNode {

		constructor (pUI: IUI, pElement: HTMLElement, eNodeType: EUINodeTypes = EUINodeTypes.DND) {
			super(pUI, pElement, eNodeType);

			var pNode: DNDNode = this;

			this.$element.draggable({
				start: (e: Event) => { return pNode.dragStart(e); },
				stop: (e: Event) => { return pNode.dragStop(e); },
				drag: (e: Event) => { return pNode.dragMove(e); }
			}).draggable("disable");;
		}

		
		inline isDraggable(): bool {
			return !this.$element.draggable( "option","disabled");
		}


		setDraggable(bValue: bool = true): void {
			this.$element.draggable("option", "disabled", !bValue);
		}

		
		BEGIN_EVENT_TABLE(DNDNode);
			BROADCAST(dragStart, CALL(e));
			BROADCAST(dragStop, CALL(e));
			BROADCAST(dragMove, CALL(e));
		END_EVENT_TABLE();
	}
}

#endif
