
/// <reference path="IUIHTMLNode.ts" />
/// <reference path="IUIComponent.ts" />

module akra {
	export interface IUIDraggableOptions {
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
	
	export interface IUIDNDNode extends IUIHTMLNode {
		setDraggable(bValue?: boolean, pOptions?: IUIDraggableOptions): void;
		setDraggableOptions(pOptions: IUIDraggableOptions): void;
	
		isDraggable(): boolean;
	
		dragStart: ISignal<{ (pNode: IUIDNDNode, e: IUIEvent): void; }>;
		dragStop: ISignal<{ (pNode: IUIDNDNode, e: IUIEvent): void; }>;
		move: ISignal<{ (pNode: IUIDNDNode, e: IUIEvent): void; }>;
		drop: ISignal<{ (pNode: IUIDNDNode, e: IUIEvent, comp: IUIComponent, info): void; }>;
	}
	
	
}
