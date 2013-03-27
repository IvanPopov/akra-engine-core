#ifndef UIGRAPHNODE_TS
#define UIGRAPHNODE_TS

#include "IUIGraphNode.ts"
#include "IKeyMap.ts"
#include "../Component.ts"
#include "Connector.ts"
#include "Route.ts"
#include "io/ajax.ts"
#include "ConnectionArea.ts"

#include "swig.d.ts"
/// @script ui/3d-party/swig/swig.pack.min.js


module akra.ui.graph {

	export function template(sUrl: string, pData: any = null): string {
		var sTemplate: string = io.ajax(sUrl, {async: false}).data;
		var fnTemplate: SwigTemplate = swig.compile(sTemplate, {filename: sUrl});
		return fnTemplate(pData);
	}

	export interface IGraphNodeAreaMap {
		[name: string]: IUIGraphConnectionArea;
	}

	export class Node extends Component implements IUIGraphNode {
		protected _eGraphNodeType: EUIGraphNodes;
		protected _isActive: bool = false;
		protected _pAreas: IGraphNodeAreaMap = <any>{};

		inline get graphNodeType(): EUIGraphNodes {
			return this._eGraphNodeType;
		}

		inline get graph(): IUIGraph { return <IUIGraph>this.parent; }

		constructor (pGraph: IUIGraph, eType: EUIGraphNodes = EUIGraphNodes.UNKNOWN) {
			super(getUI(pGraph), null, EUIComponents.GRAPH_NODE, 
				$(template("ui/templates/GraphNode.tpl")));

			this._eGraphNodeType = eType;

			ASSERT(isComponent(pGraph, EUIComponents.GRAPH), "only graph may be as parent");
			
			this.$element.css("position", "absolute");			

			this.attachToParent(pGraph);

			this.init();
			this.setDraggable();

			this.$element.offset(this.graph.$element.offset());
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-graphnode");
		}

		move(e: IUIEvent): void {
			//redraw routes
			this.routing();
		}

		dblclick(e: IUIEvent): void {
			this.activate(!this.isActive());
		}

		activate(bValue: bool = true): void {
			this._isActive = bValue;
			this.highlight(bValue);

			for (var sArea in this._pAreas) {
				this._pAreas[sArea].activate();
			}
		}

		inline isActive(): bool {
			return this._isActive;
		}

		private init(): void {
			var pSides: string[] = ["top", "left", "right", "bottom"];
			var pSidePanels: IUIGraphConnectionArea[] = [];
			
			for (var i: int = 0; i < pSides.length; ++ i) {
				var sSide: string = pSides[i];

				pSidePanels[i] = new ConnectionArea(this, {show: false});
				pSidePanels[i].render(this.el.find(".graph-node-" + sSide + ":first"));

				this._pAreas[sSide] = pSidePanels[i];
			}
		}


		grabEvent(iKeyCode: int): void {
			if (iKeyCode === EKeyCodes.DELETE) {
		        // var pConnectors: IUIGraphConnector[] = this._pConnectors;

		        // for (var i = 0; i < pConnectors.length; i++) {
		        //     if (isDefAndNotNull(pConnectors[i]) && pConnectors[i].isActive()) {
		        //         this.getRoute(i).remove(true);
		        //     }
		        // }
		        
		        for (var i in this._pAreas) {
		        	this._pAreas[i].grabEvent(iKeyCode);
		        }

		        if (this.isActive()) {
		            this.beforeDestroy(this);
		            this.destroy();
		        }
		    }
		}

		isSuitable(pTarget: IUIGraphNode): bool {
			return true;
		}
		
		highlight(bValue: bool = true): void {
		    if (bValue) {
		        this.$element.addClass('highlight');
		    }
		    else {
		        this.$element.removeClass('highlight');
		    }
		}

		routing(pConnector?: IUIGraphConnector, pArea?: IUIGraphConnectionArea): void {
			
		}


		//BROADCAST(routeBreaked, CALL(route, connection, dir));
		BROADCAST(beforeDestroy, CALL(node));
	}

	register("GraphNode", Node);
}

#endif

