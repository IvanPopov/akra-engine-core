
/// <reference path="IUIComponent.ts" />


/// <reference path="IUICheckbox.ts" />

module akra {
	export interface IUICheckboxList extends IUIComponent {
		/** readonly */ length: uint;
		/** readonly */ items: IUICheckbox[];
	
		/** readonly */ checked: IUICheckbox;
	
		//режим, в котором хотябы 1 чекбокс должен оставаться выбранным
		radio: boolean;
	
		hasMultiSelect(): boolean;
	
		changed: ISignal<{ (pList: IUICheckboxList, pCheckbox: IUICheckbox): void; }>;
	}
}
