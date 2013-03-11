#ifndef IUIDNDNODE_TS
#define IUIDNDNODE_TS

#include "IUIHTMLNode.ts"

module akra {
	export interface IUIDNDNode extends IUIHTMLNode {
		setDraggable(bValue?: bool): void;

		isDraggable(): bool;

		signal dragStart(e: IUIEvent): void;
		signal dragStop(e: IUIEvent): void;
		signal dragMove(e: IUIEvent): void;
	}
}

#endif

