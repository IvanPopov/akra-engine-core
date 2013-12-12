
/// <reference path="IUIHTMLNode.ts" />


module akra {
	export enum EUILayouts {
		UNKNOWN,
		HORIZONTAL,
		VERTICAL
	}
	
	export interface IUILayoutAttributes {
		comment?: string;
	}
	
	export interface IUILayout extends IUIHTMLNode<IUIHTMLNode> {
		layoutType: EUILayouts;
	
		setAttributes(pAttrs: IUILayoutAttributes): void;
		attr(sAttr: string): any;
	}
	
	
}
