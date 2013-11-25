// IUIList interface
// [write description here...]

/// <reference path="IUINode.ts" />

module akra {
	interface IUIList extends IUINode {
		set(pList: NodeList): IUIList;
	}
}

