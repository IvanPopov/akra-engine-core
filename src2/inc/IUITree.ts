#ifndef IUITREE_TS
#define IUITREE_TS

#include "IUIComponent.ts"

module akra {
	IFACE(IUITreeNode);
	
	export interface IUITree extends IUIComponent {
		rootNode: IUITreeNode;
		
		fromTree(pEntity: IEntity): void;
		//синхронизуем дерево с деревом из сущностей
		sync(): void;

		//уведомление дере о том, что синхронизация закончена
		//вызывается из узлов дерева
		//_synced(): void;

		_link(pNode: IUITreeNode): void;
		_unlink(pNode: IUITreeNode): void;

		_createNode(pEntity: IEntity): IUITreeNode;
	}
}

#endif

