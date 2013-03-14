#ifndef UIGRAPH_TS
#define UIGRAPH_TS

#include "IUIGraphRoute.ts"
#include "IUIGraph.ts"
#include "IUIGraphNode.ts"
#include "IUIGraphConnector.ts"
#include "Route.ts"
#include "../Component.ts"

module akra.ui.graph {

	export class Graph extends Component implements IUIGraph {
		protected _eGraphType: EUIGraphTypes;
		protected _pCanvas: RaphaelPaper = null;
		protected _pInputNode: IUIGraphNode = null;
		protected _pOutputNode: IUIGraphNode = null;
		protected _bReadyForConnect: bool = false;
		protected _pTempRoute: IUIGraphRoute = null;

		inline get nodes(): IUIGraphNode[] {
			var pNodes: IUIGraphNode[] = [];
			var pChild: IEntity = this.child;
			
			while(!isNull(pChild)) {
				pNodes.push(<IUIGraphNode>pChild);
				pChild = pChild.sibling;
			}

			return pNodes;
		}

		inline get graphType(): EUIGraphTypes { return this._eGraphType; }

		constructor (parent, eType: EUIGraphTypes = EUIGraphTypes.UNKNOWN) {
			super(parent, null, EUIComponents.GRAPH);

			this._eGraphType = eType;
		}

		label(): string {
			return "Graph";
		}

		rendered(): void {
			this._pCanvas = Raphael(this.getHTMLElement(), 0, 0);

			var $svg = this.$element.children(":first");
			$svg.css({
				width: "100%",
				height: "100%"
			});
		}

		// relocated(pNode: IUINode): void {
		// 	if ($.contains(document.documentElement, (<IUIHTMLNode>pNode).getHTMLElement())) {
		// 		console.log(this.width(), this.height());
		// 	}

		// 	super.relocated(pNode);
		// }

		mouseup(e: IUIEvent): void {
			this._readyForConnect(false);
			super.mouseup(e);
		}

		mousemove(e: IUIEvent): void {
			if (isNull(this._pOutputNode)) {
				super.mousemove(e);
				return;
			}

			var pRightNode: IUIGraphNode = null;
			var pFloatNode: IUIGraphFloatNode = null;
			var pLeftNode: IUIGraphNode = this._pOutputNode;
			var pRoute: IUIGraphRoute = this._pTempRoute;

			if (isNull(pRoute)) {
				pFloatNode = {
					x: 0,
					y: 0,
					width: 0,
					height: 0
				};

				pRoute = this._pTempRoute = new Route(this);

				pRoute.input = UIGRAPH_FLOATING_INPUT;
				pRoute.output = pLeftNode.route(EUIGraphDirections.OUT, pFloatNode);
				pRoute.left = pLeftNode;
				pRoute.floatNode = pFloatNode;
			}

			var pOffset = this.$element.offset();
			
			pRoute.floatNode.x = e.pageX - pOffset.left;
			pRoute.floatNode.y = e.pageY - pOffset.top;

			this.routing(pRoute);
			super.mousemove(e);
		}

		keydown(e: IUIEvent): void {
			var pNodes: IUIGraphNode[] = this.nodes;

			for (var i: int = 0; i < pNodes.length; ++ i) {
				pNodes[i].grabEvent((<KeyboardEvent><any>e).keyCode);
			}

			super.keydown(e);
		}

		click(e: IUIEvent): void {
			var pNodes: IUIGraphNode[] = this.nodes;
			for (var i: int = 0; i < pNodes.length; ++ i) {
				pNodes[i].activate(false);
			}
			super.click(e);
		}

		// addChild(pChild: IUINode): IEntity {
		// 	if (!isComponent(pChild, EUIComponents.GRAPH_NODE)) {
		// 		CRITICAL("graph can contains only graph nodes");
		// 	}

		// 	return pChild;
		// }

		routing(pRoute: IUIGraphRoute): void {
			var pLeft: IPoint, pRight: IPoint;

			pLeft = pRoute.left.output(pRoute.output);
			pRight = pRoute.isFloat()? pRoute.floatNode: pRoute.right.input(pRoute.input);

			var pPath: any = [
	            [<any>"M", pLeft.x, pLeft.y], [<any>"C", 
	            //output direction 
	            pLeft.x,
	            pLeft.y,

	            pLeft.x, 
	            (pLeft.y * 7 + pRight.y * 3) / 10, 

	            (pLeft.x + pRight.x) / 2, 
	            (pLeft.y + pRight.y) / 2, 

	            (pLeft.x + pRight.x) / 2, 
	            (pLeft.y + pRight.y) / 2, 

	            pRight.x, 
	            (pLeft.y * 3 + pRight.y * 7) / 10, 

	            //middle point
	            pRight.x,
	            pRight.y,
	            ]
	        ];

	        if (!isNull(pRoute.path)) {
	        	pRoute.path.attr({path: pPath});
	        }
	        else {
	        	pRoute.path = <RaphaelPath>this._pCanvas.path(pPath).attr({
		        		"stroke": "#fff", 
		        		"stroke-width": 2, 
		        		"stroke-linecap": "round"
	        		});
	        }
		}

		_setOutputNode(pNode: IUIGraphNode): bool {
			if (!this.isReadyForConnect()) {
				return false;
			}

			this._pOutputNode = pNode;

			return true;
		}

		_setInputNode(pNode: IUIGraphNode): bool {
			if (!this.isReadyForConnect()) {
				return false;
			}

			this._pInputNode = pNode;

			return true;
		}

		connectPair(pOut: IUIGraphNode, pIn: IUIGraphNode): void {
			var pLeftNode: IUIGraphNode = pOut;
		    var pRightNode: IUIGraphNode = pIn;
		    var pRoute: IUIGraphRoute = new Route(this);

		    pRoute.input = pRightNode.route(EUIGraphDirections.IN, pLeftNode);
		    pRoute.output = pLeftNode.route(EUIGraphDirections.OUT, pRightNode);
		    pRoute.left = pLeftNode;
		    pRoute.right = pRightNode;
		    
		    this.routing(pRoute);

		    pRoute.distribute();
		}

		abortConnection(): void {
			this._pInputNode  = null;
		    this._pOutputNode = null;
		    this._pTempRoute  = null;
		    this._bReadyForConnect = false;
		}

		_readyForConnect(bStatus: bool): void {
			if (!bStatus) {
		        if(!isNull(this._pOutputNode)&& !isNull(this._pInputNode) && 
		        	this._pInputNode !== this._pOutputNode && 
		        	this._pInputNode.isSuitable(this._pOutputNode)) {
		        	
		        	this.connectPair(this._pOutputNode, this._pInputNode);
		        }
		        else {
		            if (!isNull(this._pOutputNode)) {
		                this._pOutputNode.uponConnection(null);
		            }
		        }

		        if (!isNull(this._pTempRoute)) {
		            this._pTempRoute.remove();
		        }

		        this.abortConnection();
		    }

		    this._bReadyForConnect = bStatus;
		}

		inline isReadyForConnect(): bool {
			return this._bReadyForConnect;
		}
	}

	Component.register("Graph", Graph);
}

#endif

