#ifndef UIANIMATIONGRAPH_TS
#define UIANIMATIONGRAPH_TS

#include "IAnimationController.ts"
#include "IUIAnimationGraph.ts"
#include "IUIAnimationNode.ts"
#include "IUtilTimer.ts"
#include "../graph/Graph.ts"
#include "Controls.ts"

#include "animation/Animation.ts"

module akra.ui.animation {
	export class Graph extends graph.Graph implements IUIAnimationGraph {
		private _pSelectedNode: IUIAnimationNode = null;
		private _pAnimationController: IAnimationController = null;
		private _pTimer: IUtilTimer = null;

		constructor (parent, options) {
			super(parent, options, EUIGraphTypes.ANIMATION);
		}

		private setTimer(pTimer: IUtilTimer): void {
			this._pTimer = pTimer;
		}

		getController(): IAnimationController {
			return this._pAnimationController;
		}

		selectNode(pNode: IUIAnimationNode): void {
			var bPlay: bool = true;

			if (this._pSelectedNode === pNode) {
				return;
			}

			this._pSelectedNode = pNode;

			// ide.cmd(ECMD.EDIT_ANIMATION_NODE, pNode);

			if (bPlay && !isNull(this._pTimer)) {
				this._pAnimationController.play(pNode.animation, this._pTimer.appTime);
			}

			this.nodeSelected(pNode, bPlay);
		}

		BROADCAST(nodeSelected, CALL(pNode, bPlay));
		
		addAnimation(pAnimation: IAnimationBase): void {
			this._pAnimationController.addAnimation(pAnimation);
		}
		
		removeAnimation(pAnimation: IAnimationBase): void;
		removeAnimation(sAnimation: string): void;
		removeAnimation(iAnimation: int): void;
		removeAnimation(animation): void {
			this._pAnimationController.removeAnimation(<int>animation);
		}

		findNodeByAnimation(sName: string): IUIAnimationNode;
		findNodeByAnimation(pAnimation: IAnimationBase): IUIAnimationNode;
		findNodeByAnimation(animation): IUIAnimationNode {
			// var sName: string = !isString(animation)? (<IAnimationBase>animation).name: <string>animation;
			// var pNodes: IUIAnimationNode[] = <IUIAnimationNode[]>this.nodes;

			// for (var i: int = 0; i < pNodes.length; i ++) {
			// 	var pAnim: IAnimationBase = pNodes[i].animation;

			// 	if (!isNull(pAnim) && pAnim.name === sName) {
			// 		return pNodes[i];
			// 	}
			// }

			return null;
		}

		createNodeByController(pController: IAnimationController): void {
			var pNode: IUIAnimationNode = null;
			// LOG("createNodeByController(", pController ,")")
			for (var i: int = 0; i < pController.totalAnimations; ++ i) {
				var pAnimation: IAnimationBase = pController.getAnimation(i);
				pNode = this.createNodeByAnimation(pAnimation);
			}

			return;
		}

		createNodeByAnimation(pAnimation: IAnimationBase): IUIAnimationNode {
			var pNode: IUIAnimationNode = this.findNodeByAnimation(pAnimation.name);
			var pSubNode: IUIAnimationNode;
			// var pBlend: IUIAnimationBlender;
			// var pPlayer: IUIAnimationPlayer;
			var pMaskNode: IUIAnimationNode;
			
			var pSubAnimation: IAnimationBase;
			var n: int = 0;
			var pMask: FloatMap = null;

			if (!isNull(pNode)) {
				return pNode;
			}

			if (akra.animation.isAnimation(pAnimation)) {
				pNode = <IUIAnimationNode>new Data(this);
				pNode.animation = pAnimation;
			}
			else {
				CRITICAL("AHTUNG!!!");
			}

			return null;
		}

		capture(pController: IAnimationController): bool {
			ASSERT(isNull(this._pAnimationController), SLOT("controller exists!!!"));

			this._pAnimationController = pController;
			
			this.connect(pController, SIGNAL(play), SLOT(onControllerPlay));
			this.createNodeByController(pController);

			this.setTimer(pController.getEngine().getTimer());

			var pEngine: IEngine = pController.getEngine();

			pEngine.getScene().bind(SIGNAL(beforeUpdate), () => {
				pController.update(pEngine.time);
			});

			return true;
		}

		private onControllerPlay(pAnimation: IAnimationBase): void {
			// var pNode: IUIAnimationNode = this.findNodeByAnimation(pAnimation.name);
			// this.selectNode(pNode);
		}

		addChild(pChild: IEntity): IEntity {
			pChild = super.addChild(pChild);

			if (isComponent(pChild, EUIComponents.GRAPH_NODE)) {
				var pNode: IUIGraphNode = <IUIGraphNode>pChild;
				this.connect(pNode, SIGNAL(click), SLOT(selectNode));
			}

			return pChild;
		}
	}

	register("AnimationGraph", Graph);
}

#endif
