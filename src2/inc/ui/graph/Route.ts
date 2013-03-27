#ifndef UIGRAPHROUTE_TS
#define UIGRAPHROUTE_TS

#include "IUIGraph.ts"
#include "IUIGraphRoute.ts"
#include "IUIGraphConnector.ts"

#include "raphael.d.ts"

/// @script ui/3d-party/raphael/raphael-min.js

module akra.ui.graph {
	export class Route implements IUIGraphRoute {
		/** Route left address */
		protected _pLeft: IUIGraphConnector = null;
		/** Route right address */
		protected _pRight: IUIGraphConnector = null;

		/** Route status. */
		protected _bActive: bool = false;
		/** Route domain */
		protected _pPath: RaphaelPath = null;

		inline get left(): IUIGraphConnector { return this._pLeft; }
		inline get right(): IUIGraphConnector { return this._pRight; }

		set left(pConnector: IUIGraphConnector) {
			if (!isNull(this._pLeft)) {
				this._pLeft.destroy();
			}

			this._pLeft = pConnector;
		}

		set right(pConnector: IUIGraphConnector) {
			if (!isNull(this._pRight)) {
				this._pRight.destroy();
			}

			this._pRight = pConnector;
		}

		constructor (pLeft: IUIGraphConnector, pRight: IUIGraphConnector) {
			this._pLeft = pLeft;
			this._pRight = pRight;

			if (!isNull(pLeft)) {
				pLeft.route = this;
			}

			if (!isNull(pRight)) {
				pRight.route = this;
			}
		}

		inline get path(): RaphaelPath {
			return this._pPath;
		}

		inline get canvas(): RaphaelPaper {
			return this.left.graph.canvas;
		}

		inline set path(pPath: RaphaelPath) {

		    var pRoute: Route = this;

		    (<RaphaelElement>pPath).click(() => { pRoute.activate(!pRoute.isActive()); });

		    this._pPath = pPath;
		}

		inline isActive(): bool {
			return this._bActive;
		}

		detach(): void {
			this.left = null;
			this.right = null;
		}

		remove(bRecirsive: bool = false): void {
			if (!isNull(this.left)) {
				this.left.routeBreaked(this);
				bRecirsive && this.left.destroy();
			}

			if (!isNull(this.right)) {
				this.left.routeBreaked(this);
				bRecirsive && this.right.destroy();
			}

			if (!isNull(this.path)) {
				(<RaphaelElement>this.path).remove();
			}
		}

		destroy(): void {
			this.remove(false);
		}

		activate(bValue: bool = true): void {
			if (this.isActive()) {
				return;
			}

			if (bValue === false && (this.left.isActive() || this.right.isActive())) {
				return;
			}

			this._bActive = true;

			if (!isNull(this.path)) {
				(<RaphaelElement>this.path).attr({"stroke-width": bValue? 3 : 2});
			}

			this.left.activate(bValue);
    		this.right.activate(bValue);
		}

		routing(): void {
			var pLeft: IPoint = Route.calcPosition(this.left);
			var pRight: IPoint = Route.calcPosition(this.right);

			this.drawRoute(pLeft, pRight);

			this.left.routing();
			this.right.routing();
		}

		protected drawRoute(pFrom: IPoint, pTo: IPoint): void {
				var pPath: any = [
	            [<any>"M", pFrom.x, pFrom.y], [<any>"C", 
	            //output direction 
	            pFrom.x,
	            pFrom.y,

	            pFrom.x, 
	            (pFrom.y * 7 + pTo.y * 3) / 10, 

	            (pFrom.x + pTo.x) / 2, 
	            (pFrom.y + pTo.y) / 2, 

	            (pFrom.x + pTo.x) / 2, 
	            (pFrom.y + pTo.y) / 2, 

	            pTo.x, 
	            (pFrom.y * 3 + pTo.y * 7) / 10, 

	            //middle point
	            pTo.x,
	            pTo.y,
	            ]
	        ];

	        if (!isNull(this.path)) {
	        	(<RaphaelElement>this.path).attr({path: pPath});
	        }
	        else {
	        	this.path = (<RaphaelElement>(<any>this.canvas).path(pPath)).attr({
		        		"stroke": "#fff", 
		        		"stroke-width": 2, 
		        		"stroke-linecap": "round"
	        		});
	        }
		}

		static calcPosition(pConnector: IUIGraphConnector): IPoint {
			var pGraph: IUIGraph = pConnector.graph;

			var pGraphOffset = pGraph.$element.offset();
		    var pPosition = pConnector.$element.offset();
		    var pOut: IPoint = {x: pPosition.left - pGraphOffset.left, y: pPosition.top - pGraphOffset.top};

		    pOut.x += pConnector.$element.width() / 2.;
		    pOut.y += pConnector.$element.height() / 2.;

		    return pOut;
		}
	}

	export class TempRoute extends Route implements IUITempGraphRoute {
		constructor(pLeft: IUIGraphConnector) {
			super(pLeft, null);
		}

		routing(pRight: IPoint = {x: 0, y: 0}): void {
			var pLeft: IPoint = Route.calcPosition(this.left);

			this.drawRoute(pLeft, pRight);

			this.left.routing();
		}
	}
}

#endif

