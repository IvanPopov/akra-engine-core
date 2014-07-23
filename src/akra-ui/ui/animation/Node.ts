/// <reference path="../../idl/IUIAnimationNode.ts" />
/// <reference path="../graph/Node.ts" />

module akra.ui.animation {
	export class Node extends graph.Node implements IUIAnimationNode {
		constructor(parent, options?, eType: EUIGraphNodes = EUIGraphNodes.UNKNOWN) {
			super(parent, options, eType);
		}

		attachToParent(pParent: IUIAnimationGraph): boolean {
			if (super.attachToParent(pParent)) {
				pParent.nodeSelected.connect(this, <any>this._selected);
			}

			return false;
		}

		_selected(pGraph: IUIAnimationGraph, pNode: IUIAnimationNode, bPlay: boolean): void {
			if (this === pNode) {
				this.getElement().addClass("selected");
			}
			else {
				this.getElement().removeClass("selected");
			}
		}

		getAnimation(): IAnimationBase {
			return null;
		}

		setAnimation(pAnimation: IAnimationBase): void { }

		getGraph(): IUIAnimationGraph {
			return <IUIAnimationGraph>this.getParent();
		}

		protected connected(pArea: IUIGraphConnectionArea, pFrom: IUIGraphConnector, pTo: IUIGraphConnector): void {
			if (pFrom.getDirection() === EUIGraphDirections.IN) {
				this.setAnimation((<IUIAnimationNode>pTo.getNode()).getAnimation());
			}
		}
	}
}

