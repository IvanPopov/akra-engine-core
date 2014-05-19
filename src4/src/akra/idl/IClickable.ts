
/// <reference path="IEventProvider.ts" />
/// <reference path="IKeyMap.ts" />

module akra {
	export interface IClickable extends IEventProvider {
		dragstart: ISignal<any>;
		dragstop: ISignal<any>;
		dragging: ISignal<any>;

		click: ISignal<any>;
		mousemove: ISignal<any>;

		mousedown: ISignal<any>;
		mouseup: ISignal<any>;

		mouseover: ISignal<any>;
		mouseout: ISignal<any>;

		mousewheel: ISignal<any>;
	}
}
