
/// <reference path="IUIComponent.ts" />


/// <reference path="IVec2.ts" />
/// <reference path="IVec3.ts" />
/// <reference path="IVec4.ts" />

module akra {
	interface IUIVector extends IUIComponent {
		/** readonly */ x: IUILabel;
		/** readonly */ y: IUILabel;
		/** readonly */ z: IUILabel;
		/** readonly */ w: IUILabel;
	
		/** readonly */ totalComponents: uint;
	
		value: any;
		
		toVec2(): IVec2;
		toVec3(): IVec3;
		toVec4(): IVec4;
	
		setVec2(v: IVec2): void;
		setVec3(v: IVec3): void;
		setVec4(v: IVec4): void;
	
		setColor(c: IColorValue): void;
	
		isEditable(): boolean;
		editable(bValue?: boolean): void;
	}
}
