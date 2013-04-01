#ifndef UIGRAPHROUTE_TS
#define UIGRAPHROUTE_TS

#include "IUIGraph.ts"
#include "IUIGraphRoute.ts"
#include "IUIGraphConnector.ts"

#include "util/Color.ts"

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
		protected _pArrow: RaphaelPath = null;
		protected _pColor: IColor;
		protected _fWeight: float = 1.;
		protected _fMaxWeight: float = 2.;

		inline get color(): IColor { return this._pColor; }
		inline get left(): IUIGraphConnector { return this._pLeft; }
		inline get right(): IUIGraphConnector { return this._pRight; }
		inline get weight(): float { return this._fWeight; }

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

		inline get arrow(): RaphaelPath {
			return this._pArrow;
		}

		inline set arrow(pPath: RaphaelPath) {
			this._pArrow = pPath;
		}

		inline set weight(fWeight: float) {
			this._fWeight = fWeight;
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

		constructor (pLeft: IUIGraphConnector, pRight: IUIGraphConnector) {
			this._pLeft = pLeft;
			this._pRight = pRight;
			this._pColor = util.randomColor(true);
			this._pColor.a = .5;

			if (!isNull(pLeft)) {
				pLeft.route = this;
			}

			if (!isNull(pRight)) {
				pRight.route = this;
			}
		}

		inline isConnectedWithNode(pNode: IUIGraphNode): bool {
			return this.left.node === pNode || this.right.node === pNode;
		}

		inline isConnectedWith(pConnector: IUIGraphConnector): bool {
			return this.left === pConnector || this.right === pConnector;
		}

		inline isBridge(): bool {
			return !isNull(this.left) && !isNull(this.right);
		}

		inline isActive(): bool {
			return this._bActive;
		}

		detach(): void {
			this._pLeft = null;
			this._pRight = null;
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
				(<RaphaelElement>this.arrow).remove();
			}
		}

		sendEvent(e: IUIGraphEvent): void {
			for (var i: int = 0; i < e.traversedRoutes.length; ++ i) {
				if (e.traversedRoutes[i] === this) {
					return;
				}
			}

			e.traversedRoutes.push(this);

			if (!isNull(this.right)) {
				this.right.sendEvent(e);
			}

			switch (e.type) {
				case EUIGraphEvents.SHOW_MAP:
					this.color.a = 1.;
					this.routing();
					break;
				case EUIGraphEvents.HIDE_MAP:
					this.color.a = .5;
					this.routing();
					break;
			}
		}

		destroy(): void {
			this.remove(false);
		}

		activate(bValue: bool = true): void {
			if (this.isActive() === bValue) {
				return;
			}

			// if (bValue === false && (this.left.isActive() || this.right.isActive())) {
			// 	return;
			// }

			this._bActive = bValue;

			if (!isNull(this.path)) {
				(<RaphaelElement>this.path).attr({"stroke-width": bValue? 3 : 2});
			}

			this.left && this.left.activate(bValue);
    		this.right && this.right.activate(bValue);
		}

		routing(): void {
			var pLeft: IPoint = Route.calcPosition(this.left);
			var pRight: IPoint = Route.calcPosition(this.right);

			this.drawRoute(pLeft, pRight);
		}

		protected drawRoute(pFrom: IPoint, pTo: IPoint): void {
			var fAngle: float = math.HALF_PI + math.atan2(pFrom.x - pTo.x, pTo.y - pFrom.y);
	        // fAngle = (fAngle / (math.TWO_PI)) * 360;
	        var iArrowHeight: int = 6;
	        var iArrowWidth: int = 15;

	        var pA0: IPoint = {x: (0 - iArrowWidth), y: (0 - iArrowHeight)};
	        var pA1: IPoint = {x: (0 - iArrowWidth), y: (0 + iArrowHeight)};

	        var pA0n: IPoint = {
	        	x: pA0.x * math.cos(fAngle) - pA0.y * math.sin(fAngle), 
	        	y: pA0.x * math.sin(fAngle) + pA0.y * math.cos(fAngle)
			};
	        
	        var pA1n: IPoint = {
	        	x: pA1.x * math.cos(fAngle) - pA1.y * math.sin(fAngle), 
	        	y: pA1.x * math.sin(fAngle) + pA1.y * math.cos(fAngle)
			};

			

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
	        var sColor: string;
	        var fWeight: float = this._fMaxWeight * this._fWeight;

	        sColor = this.isBridge()? this.color.htmlRgba: "rgba(255, 255, 255, 1.)";
	        
	        if (!isNull(this.path)) {
	        	(<RaphaelElement>this.path).attr({
	        		path: pPath,
	        		"stroke": sColor,
	        		"stroke-width": fWeight
	        	});
	        }
	        else {
	        	this.path = (<RaphaelElement>(<any>this.canvas).path(pPath)).attr({
		        		"stroke": sColor, 
		        		"stroke-width": fWeight, 
		        		"stroke-linecap": "round"
	        		});
	        	
	        }

	        var iLength: int = (<any>this.path).getTotalLength();

	        var pCenter: IPoint = (<any>this.path).getPointAtLength(iLength / 2);
// math.max(iLength - 15, 0)
			var pArrow: any = [
				[<any>"M", pCenter.x, pCenter.y], 
				[<any>"L", pCenter.x + pA0n.x, pCenter.y + pA0n.y], 
				[<any>"L", pCenter.x + pA1n.x, pCenter.y + pA1n.y], 
				[<any>"L", (pCenter.x), (pCenter.y)]
			];
			
	        if (!isNull(this.arrow)) {
	        	(<RaphaelElement>this.arrow).attr({path: pArrow});
	        }
	        else {
	        	this.arrow = (<any>(<RaphaelElement>(<any>this.canvas).path(pArrow)).attr({
	        			"fill": sColor,
	        			"stroke": "#FF0", 
		        		"stroke-width": 1
	        		}));
	        }

	        // (<any>this.arrow).rotate(90 + fAngle, pTo.x, pTo.y);
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
		}
	}
}

#endif

