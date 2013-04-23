#ifndef UIANIMATIONGRAPH_TS
#define UIANIMATIONGRAPH_TS

#include "IAnimationController.ts"
#include "IUIAnimationGraph.ts"
#include "IUIAnimationNode.ts"
#include "IUtilTimer.ts"
#include "../graph/Graph.ts"
#include "Controls.ts"

#include "animation/Animation.ts"
#include "io/filedrop.ts"

module akra.ui.animation {
	export class Graph extends graph.Graph implements IUIAnimationGraph {
		private _pSelectedNode: IUIAnimationNode = null;
		private _pAnimationController: IAnimationController = null;

		constructor (parent, options) {
			super(parent, options, EUIGraphTypes.ANIMATION);

			this.setupFileDropping();
		}

		private setupFileDropping(): void {
			var pGraph = this;
			var pRmgr: IResourcePoolManager = ide.getResourceManager();
			

			io.createFileDropArea(null, {
				drop: (file: File, content, format, e: DragEvent): void => {
					pGraph.el.removeClass("file-drag-over");
					
					if (e.target !== (<any>pGraph).$svg[0]) {
						return;
					}

					var pName: IPathinfo = pathinfo(file.name);

				    if (pName.ext.toUpperCase() !== "DAE") {
				    	alert("unsupported format used: " + file.name);
				    	return;
				    }

			    	var pModelResource: ICollada = <ICollada>pRmgr.colladaPool.createResource(pName.toString());
		    		pModelResource.parse(<string>content, {scene: false, name: pName.toString()});

		    		var pAnimations: IAnimation[] = pModelResource.extractAnimations();

		    		for (var j = 0; j < pAnimations.length; ++ j) {
		    			pGraph.addAnimation(pAnimations[j]);
		    			pGraph.createNodeByAnimation(pAnimations[j]);
		    		}
		    	},

		    	// dragenter: (e) => {
		    	// 	pGraph.el.addClass("file-drag-over");
		    	// },

		    	dragover: (e) => {
		    		pGraph.el.addClass("file-drag-over");
		    	},

		    	dragleave: (e) => {
		    		pGraph.el.removeClass("file-drag-over");
		    	},

		    	format: EFileDataTypes.TEXT
			});
		}


		getController(): IAnimationController {
			return this._pAnimationController;
		}

		selectNode(pNode: IUIAnimationNode, bModified: bool): void {
			var bPlay: bool = true;

			if (this._pSelectedNode === pNode) {
				
				if (bModified) {
					ide.cmd(ECMD.INSPECT_ANIMATION_NODE, pNode);
				}

				return;
			}

			ide.cmd(ECMD.INSPECT_ANIMATION_NODE, pNode);

			this._pSelectedNode = pNode;


			if (bPlay) {
				this._pAnimationController.play(pNode.animation);
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
			this.connect(pController, SIGNAL(animationAdded), SLOT(animationAdded));

			this.createNodeByController(pController);

			return true;
		}

		private animationAdded(pController: IAnimationController, pAnimation: IAnimationBase): void {

		}

		private onControllerPlay(pController: IAnimationController, pAnimation: IAnimationBase): void {
			// var pNode: IUIAnimationNode = this.findNodeByAnimation(pAnimation.name);
			// this.selectNode(pNode);
		}

		addChild(pChild: IEntity): IEntity {
			pChild = super.addChild(pChild);

			if (isComponent(pChild, EUIComponents.GRAPH_NODE)) {
				var pNode: IUIGraphNode = <IUIGraphNode>pChild;
				this.connect(pNode, SIGNAL(selected), SLOT(selectNode));
			}

			return pChild;
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-animationgraph");
		}
	}

	register("animation.Graph", Graph);
}

#endif
