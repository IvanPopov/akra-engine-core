// AIUI interface
// [write description here...]

/// <reference path="AIScene2d.ts" />


/// <reference path="AIUIHTMLNode.ts" />
/// <reference path="AIUIDNDNode.ts" />

interface AIUI extends AIScene2d {
	createHTMLNode(pElement: HTMLElement): AIUIHTMLNode;
	createDNDNode(pElement: HTMLElement): AIUIDNDNode;
	//createComponent(eType: AEEntityTypes): AIUIComponent;
	createComponent(sName: string, pOptions?: AIUIComponentOptions): AIUIComponent;
	createLayout(eType: AEUILayouts, pAttrs?: AIUILayoutAttributes): AIUILayout;
	createLayout(sType: string, pAttrs?: AIUILayoutAttributes): AIUILayout;
}