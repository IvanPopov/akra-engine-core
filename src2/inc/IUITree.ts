#ifndef IUITREE_TS
#define IUITREE_TS

#include "IUIComponent.ts"

module akra {
	IFACE(IUITreeNode);
	
	export interface IUITree extends IUIComponent {
		rootNode: IUITreeNode;
		
		fromTree(pEntity: IEntity): void;
		//синхронизуем дерево с деревом из сущностей
		//или синхронизуем выбранный узел
		sync(pEntity?: IEntity): void;

		select(pNode: IUITreeNode): bool;

		isSelected(pNode: IUITreeNode): bool;

		_link(pNode: IUITreeNode): void;
		_unlink(pNode: IUITreeNode): void;

		_createNode(pEntity: IEntity): IUITreeNode;
	}
}

#endif

