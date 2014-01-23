// IUILabel export interface
// [write description here...]

/// <reference path="IUIComponent.ts" />

module akra {
	export interface IUILabelOptions extends IUIComponentOptions {
		text?: string;
		editable?: boolean;
	}

	export interface IUILabel extends IUIComponent {
		changed: ISignal<{ (pLabel: IUILabel, sValue: string): void; }>;

		text: string;
		postfix: string;
	
		editable(bValue?: boolean): void;
		isEditable(): boolean;
	}
}

