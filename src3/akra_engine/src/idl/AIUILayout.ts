// AIUILayout interface
// [write description here...]

/// <reference path="AIUIHTMLNode.ts" />


enum AEUILayouts {
	UNKNOWN,
	HORIZONTAL,
	VERTICAL
}

interface AIUILayoutAttributes {
	comment?: string;
}

interface AIUILayout extends AIUIHTMLNode {
	layoutType: AEUILayouts;

	setAttributes(pAttrs: AIUILayoutAttributes): void;
	attr(sAttr: string): any;
}

