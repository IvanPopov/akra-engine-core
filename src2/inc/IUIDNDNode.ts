#ifndef IUIDNDNODE_TS
#define IUIDNDNODE_TS

#include "IUIHTMLNode.ts"

module akra {
	export interface IUIDNDNode extends IUIHTMLNode {
		dragBarier: IOffset;

		absoluteX: uint;
		absoluteY: uint;

		setDragZone(): bool;
		setDragZone(pZone: IUIZone): bool;
		setDragZone(iWidth: uint, iHeight: uint): bool;
		setDragZone(iTop: uint, iRight: uint, iBottom: uint, iLeft: uint): bool;

		setDraggable(bValue?: bool): void;

		isDraggable(): bool;

		signal dragStart(e: IUIEvent): void;
		signal dragStop(e: IUIEvent): void;
		signal dragMove(e: IUIEvent): void;
	}
}

#endif

