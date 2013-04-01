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

		inline get graph(): IUIAnimationGraph {
			return <IUIAnimationGraph>this.parent;
		}
	}
}

#endif
