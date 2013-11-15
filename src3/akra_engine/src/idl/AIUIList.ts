// AIUIList interface
// [write description here...]

/// <reference path="AIUINode.ts" />

module akra {
interface AIUIList extends AIUINode {
	set(pList: NodeList): AIUIList;
}
}

#endif