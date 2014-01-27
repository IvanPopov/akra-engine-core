
/// <reference path="IUIComponent.ts" />


/// <reference path="IUICheckbox.ts" />

module akra {
	export interface IUICheckboxList extends IUIComponent {
		getLength(): uint;
		getItems(): IUICheckbox[];
	
		isChecked(): IUICheckbox;
	
		//режим, в котором хотябы 1 чекбокс должен оставаться выбранным
		isRadio(): boolean;
		setRadio(bValue: boolean): void;
	
		hasMultiSelect(): boolean;
	
		changed: ISignal<{ (pList: IUICheckboxList, pCheckbox: IUICheckbox): void; }>;
	}
}
