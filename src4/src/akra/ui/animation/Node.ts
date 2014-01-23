#ifndef UIANIMATIONNODE_TS
#define UIANIMATIONNODE_TS

#include "IUIAnimationNode.ts"
#include "IAnimationBase.ts"
#include "../graph/Node.ts"

module akra.ui.animation {
	export class Node extends graph.Node implements IUIAnimationNode {
		constructor (parent, options?, eType: EUIGraphNodes = EUIGraphNodes.UNKNOWN) {
			super(parent, options, eType);
		}

		attachToParent(pParent: IUIAnimationGraph): boolean {
			if (super.attachToParent(pParent)) {
				this.connect(pParent, SIGNAL(nodeSelected), SLOT(_selected));
			}

			return false;
		}

		_selected(pGraph: IUIAnimationGraph, pNode: IUIAnimationNode, bPlay: boolean): void {
			if (this === pNode) {
				this.el.addClass("selected");
			}
			else {
				this.el.removeClass("selected");
			}
		}

		 get animation(): IAnimationBase {
			return null;
		}

		 get graph(): IUIAnimationGraph {
			return <IUIAnimationGraph>this.parent;
		}

		protected connected(pArea: IUIGraphConnectionArea, pFrom: IUIGraphConnector, pTo: IUIGraphConnector): void {
			if (pFrom.direction === EUIGraphDirections.IN) {
				this.animation = (<IUIAnimationNode>pTo.node).animation;
			}
		}
	}
}

#endif
