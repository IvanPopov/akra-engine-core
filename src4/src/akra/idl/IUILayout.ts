
/// <reference path="IUIHTMLNode.ts" />


module akra {
	enum EUILayouts {
		UNKNOWN,
		HORIZONTAL,
		VERTICAL
	}
	
	interface IUILayoutAttributes {
		comment?: string;
	}
	
	interface IUILayout extends IUIHTMLNode {
		layoutType: EUILayouts;
	
		setAttributes(pAttrs: IUILayoutAttributes): void;
		attr(sAttr: string): any;
	}
	
	
}
