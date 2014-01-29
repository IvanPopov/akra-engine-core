/// <reference path="IUINode.ts" />

module akra {
	export interface IUIList extends IUINode {
		set(pList: NodeList): IUIList;
	}
}
