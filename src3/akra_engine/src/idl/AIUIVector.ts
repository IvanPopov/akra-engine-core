// AIUIVector interface
// [write description here...]

/// <reference path="AIUIComponent.ts" />


/// <reference path="AIVec2.ts" />
/// <reference path="AIVec3.ts" />
/// <reference path="AIVec4.ts" />

interface AIUIVector extends AIUIComponent {
	/** readonly */ x: AIUILabel;
	/** readonly */ y: AIUILabel;
	/** readonly */ z: AIUILabel;
	/** readonly */ w: AIUILabel;

	/** readonly */ totalComponents: uint;

	value: any;
	
	toVec2(): AIVec2;
	toVec3(): AIVec3;
	toVec4(): AIVec4;

	setVec2(v: AIVec2): void;
	setVec3(v: AIVec3): void;
	setVec4(v: AIVec4): void;

	setColor(c: AIColorValue): void;

	isEditable(): boolean;
	editable(bValue?: boolean): void;
}