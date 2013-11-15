// AIUICheckboxList interface
// [write description here...]

/// <reference path="AIUIComponent.ts" />


/// <reference path="AIUICheckbox.ts" />

interface AIUICheckboxList extends AIUIComponent {
	/** readonly */ length: uint;
	/** readonly */ items: AIUICheckbox[];

	/** readonly */ checked: AIUICheckbox;

	//режим, в котором хотябы 1 чекбокс должен оставаться выбранным
	radio: boolean;

	hasMultiSelect(): boolean;

	signal changed(pCheckbox: AIUICheckbox);
}