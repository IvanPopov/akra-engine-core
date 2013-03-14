#ifndef UIGRAPHCONNECTOR_TS
#define UIGRAPHCONNECTOR_TS

#define UIGRAPH_INVALID_CONNECTION -1

#include "IUIGraph.ts"
#include "IUIGraphNode.ts"
#include "IUIGraphConnector.ts"
#include "../Component.ts"

module akra.ui.graph {
	export class Connector extends Component implements IUIGraphConnector {
		protected _eDirect: EUIGraphDirections = EUIGraphDirections.IN;
		protected _bActive: bool = false;
		protected _pGraphNode: IUIGraphNode = null;
		protected _iConnection: int = UIGRAPH_INVALID_CONNECTION;

		inline get graphNode(): IUIGraphNode { return this._pGraphNode; }
		inline get connection(): int { return this._iConnection; }
		inline set connection(i: int) { this._iConnection = i; }

		constructor (parent, pNode: IUIGraphNode = null) {
			super(pNode, null, EUIComponents.GRAPH_CONNECTOR);

			if (!isNull(pNode)) {
				this._pGraphNode = pNode;
			}
			else {
				ASSERT(!isUI(parent) && isComponent(<IEntity>parent, EUIComponents.GRAPH_NODE));
				this._pGraphNode = <IUIGraphNode>this.parent;
			}
		}

		label(): string {
			return "GraphConnector";
		}

		inline isValid(): bool {
			return this._iConnection >= 0;
		}

		inline isActive(): bool {
			return this._bActive;
		}

		activate(bValue: bool = true): void {
			this._bActive = bValue;
			this.activated(bValue);
			this.highlight(bValue);
		}

		input(): bool {
			this._eDirect = EUIGraphDirections.IN;
			return true;
		}

		output(): bool {
			this._eDirect = EUIGraphDirections.OUT;
			return true;
		}

		setDirection(eDirect: EUIGraphDirections): bool {
			return (eDirect === EUIGraphDirections.IN? this.input(): this.output());
		}

		highlight(bToggle: bool = false): void {
			bToggle? this.$element.addClass("highlight"): this.$element.removeClass("highlight");
		}

		BROADCAST(activated, CALL(value));

		static inline isValidConnection(i: int): bool {
			return i >= 0;
		}
	}

	Component.register("GraphConnector", Connector);
}

#endif
