#ifndef UIGRAPHROUTE_TS
#define UIGRAPHROUTE_TS

#include "IUIGraph.ts"
#include "IUIGraphNode.ts"
#include "IUIGraphRoute.ts"

/// @script ui/3d-party/raphael/raphael-min.js

module akra.ui.graph {
	export class Route implements IUIGraphRoute {
		/** Route left address */
		public left: IUIGraphNode = null;
		/** Route right address */
		public right: IUIGraphNode = null;

		public floatNode: IUIGraphFloatNode = null;
		
		/** Route port */
		public input: int = 0;
		/** Route port */
		public output: int = 0;

		/** Route status. */
		protected _bActive: bool = false;
		/** Route domain */
		protected _pPath: RaphaelPath = null;

		inline get path(): RaphaelPath {
			return this._pPath;
		}

		inline set path(pPath: RaphaelPath) {

		    var pRoute: Route = this;

		    pPath.click(() => { pRoute.activate(!pRoute.isActive()); });

		    this._pPath = pPath;
		}

		constructor (public graph: IUIGraph) {

		}


		inline isActive(): bool {
			return this._bActive;
		}

		inline isFloat(): bool {
			return !isNull(this.floatNode);
		}

		remove(bRecirsive: bool = false): void {
			if (!isNull(this.left) && bRecirsive) {
				this.left.removeRoute(this, this.output, EUIGraphDirections.OUT);
			}

			if (!isNull(this.right) && isNull(this.floatNode) && bRecirsive) {
				this.right.removeRoute(this, this.input, EUIGraphDirections.IN);
			}

			if (!isNull(this.path)) {
				(<any>this.path).remove();
			}
		}

		activate(bValue: bool = true): void {
			if (this.isActive()) {
				return;
			}

			if (bValue === false && (this.left.isActive() || this.right.isActive())) {
				return;
			}

			this._bActive = true;
			(<any>this.path).attr({"stroke-width": bValue? 3 : 2});
			this.left.activateRoute(this, bValue, this.output);
    		this.right.activateRoute(this, bValue, this.input);
		}

		routing(): void {
			this.left.routing();
			this.right.routing();
		}

		distribute(): void {
			this.left.addRoute(this, this.output);
			this.right.addRoute(this, this.input);
		}
	}
}

#endif

