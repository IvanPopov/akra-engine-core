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

		getText(): string;
		setText(sValue: string): void;
		getPostfix(): string;
		setPostfix(sValue: string): void;
	
		editable(bValue?: boolean): void;
		isEditable(): boolean;
	}
}

