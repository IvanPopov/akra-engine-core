// AIUITree interface
// [write description here...]

/// <reference path="AIUIComponent.ts" />


/// <reference path="AIUITreeNode.ts" />

interface AIUITree extends AIUIComponent {
	rootNode: AIUITreeNode;
	selectedNode: AIEntity;
	
	fromTree(pEntity: AIEntity): void;
	//синхронизуем дерево с деревом из сущностей
	//или синхронизуем выбранный узел
	sync(pEntity?: AIEntity): void;

	select(pNode: AIUITreeNode): boolean;
	selectByGuid(iGuid: int): void;

	isSelected(pNode: AIUITreeNode): boolean;

	_link(pNode: AIUITreeNode): void;
	_unlink(pNode: AIUITreeNode): void;

	_createNode(pEntity: AIEntity): AIUITreeNode;
}