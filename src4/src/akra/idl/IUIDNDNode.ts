
/// <reference path="IUIHTMLNode.ts" />
/// <reference path="IUIComponent.ts" />

module akra {
	interface IUIDraggableOptions {
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
	
	interface IUIDNDNode extends IUIHTMLNode {
		setDraggable(bValue?: boolean, pOptions?: IUIDraggableOptions): void;
		setDraggableOptions(pOptions: IUIDraggableOptions): void;
	
		isDraggable(): boolean;
	
		signal dragStart(e: IUIEvent): void;
		signal dragStop(e: IUIEvent): void;
		signal move(e: IUIEvent): void;
		signal drop(e: IUIEvent, comp: IUIComponent, info): void;
	}
	
	
}
