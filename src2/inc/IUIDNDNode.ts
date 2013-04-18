#ifndef IUIDNDNODE_TS
#define IUIDNDNODE_TS

#include "IUIHTMLNode.ts"

module akra {

	export interface IUIDraggableOptions {
	    disabled?: bool;
	    addClasses?: bool;
	    appendTo?: any;
	    axis?: string;
	    cancel?: string;
	    connectToSortable?: string;
	    containment?: any;
	    cursor?: string;
	    cursorAt?: any;
	    delay?: number;
	    distance?: number;
	    grid?: number[];
	    handle?: any;
	    helper?: any;
	    iframeFix?: any;
	    opacity?: number;
	    refreshPositions?: bool;
	    revert?: any;
	    revertDuration?: number;
	    scope?: string;
	    scroll?: bool;
	    scrollSensitivity?: number;
	    scrollSpeed?: number;
	    snap?: any;
	    snapMode?: string;
	    snapTolerance?: number;
	    stack?: string;
	    zIndex?: number;
	}

	export interface IUIDNDNode extends IUIHTMLNode {
		setDraggable(bValue?: bool, pOptions?: IUIDraggableOptions): void;
		setDraggableOptions(pOptions: IUIDraggableOptions): void;

		isDraggable(): bool;

		signal dragStart(e: IUIEvent): void;
		signal dragStop(e: IUIEvent): void;
		signal move(e: IUIEvent): void;
		signal drop(e: IUIEvent): void;
	}
}

#endif

