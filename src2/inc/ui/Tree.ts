#ifndef UITREE_TS
#define UITREE_TS

#include "IUIComponent.ts"
#include "Entity.ts"

module akra.ui {
	export class TreeNode extends Component {
		protected _pTree: IUITree;
		protected _pTargetNode: IEntity;

		inline get targetNode(): IEntity {
			return this._pTargetNode;
		}

		constructor (pTree: IUITree, options?, pNode: IEntity = null) {
			super(pTree, options, eType);

			this._pTree = pTree;
			this._pTargetNode = pNode;
		}
	}

	export class Tree extends Component {
		protected _pRootNode: IEntity = null;

		set root(pNode: IEntity) {
			if (!isNull(this._pRootNode)) {
				CRITICAL("TODO: replace node");
			}

			pNode.explore((pEntity: IEntity): bool => {
				
			});	
		}

		constructor (ui, options?, eType: EUIComponents = EUIComponents.TREE) {
			super(ui, options, eType);

		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-tree");
		}
	}
}

#endif
