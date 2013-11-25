
/// <reference path="IUIComponent.ts" />


/// <reference path="IUITreeNode.ts" />

module akra {
	interface IUITree extends IUIComponent {
		rootNode: IUITreeNode;
		selectedNode: IEntity;
		
		fromTree(pEntity: IEntity): void;
		//синхронизуем дерево с деревом из сущностей
		//или синхронизуем выбранный узел
		sync(pEntity?: IEntity): void;
	
		select(pNode: IUITreeNode): boolean;
		selectByGuid(iGuid: int): void;
	
		isSelected(pNode: IUITreeNode): boolean;
	
		_link(pNode: IUITreeNode): void;
		_unlink(pNode: IUITreeNode): void;
	
		_createNode(pEntity: IEntity): IUITreeNode;
	}
}
