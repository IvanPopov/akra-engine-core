// AIUIDNDNode interface
// [write description here...]

/// <reference path="AIUIHTMLNode.ts" />
/// <reference path="AIUIComponent.ts" />

interface AIUIDraggableOptions {
	disabled?: boolean;
	addClasses?: boolean;
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
	refreshPositions?: boolean;
	revert?: any;
	revertDuration?: number;
	scope?: string;
	scroll?: boolean;
	scrollSensitivity?: number;
	scrollSpeed?: number;
	snap?: any;
	snapMode?: string;
	snapTolerance?: number;
	stack?: string;
	zIndex?: number;
}

interface AIUIDNDNode extends AIUIHTMLNode {
	setDraggable(bValue?: boolean, pOptions?: AIUIDraggableOptions): void;
	setDraggableOptions(pOptions: AIUIDraggableOptions): void;

	isDraggable(): boolean;

	signal dragStart(e: IUIEvent): void;
	signal dragStop(e: IUIEvent): void;
	signal move(e: IUIEvent): void;
	signal drop(e: IUIEvent, comp: AIUIComponent, info): void;
}

