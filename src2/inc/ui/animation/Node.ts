#ifndef UIANIMATIONNODE_TS
#define UIANIMATIONNODE_TS

#include "IUIAnimationNode.ts"
#include "IAnimationBase.ts"
#include "../graph/Node.ts"

module akra.ui.animation {
	export class Node extends graph.Node implements IUIAnimationNode {
		inline get animation(): IAnimationBase {
			return null;
		}

		_enterFrame(fTime: float): void {}
		_selected(bValue: bool): void {
			bValue? 
				this.$element.addClass("selected"): 
				this.$element.removeClass('selected');
		}
	}
}

#endif
