// AIUINode interface
// [write description here...]

/// <reference path="AIEntity.ts" />
/// <reference path="AIPoint.ts" />
/// <reference path="AIOffset.ts" />
/// <reference path="AIUILayout.ts" />


/// <reference path="AIUI.ts" />

enum AEUINodeTypes {
	UNKNOWN,
	HTML,
	DND,

	LAYOUT,

	COMPONENT
} 

interface AIUINode extends AIEntity {
	/** readonly */ nodeType: AEUINodeTypes;
	/** readonly */ ui: AIUI;

	render(): boolean;
	render(pParent: AIUINode): boolean;
	render(pElement: HTMLElement): boolean;
	render(pElement: JQuery): boolean;
	render(sSelector: string): boolean;

	attachToParent(pParent: AIUINode): boolean;
	recursiveRender(): void;
	renderTarget(): JQuery;
	hasRenderTarget(): boolean;

	signal relocated(pNode: AIUINode): void;
}