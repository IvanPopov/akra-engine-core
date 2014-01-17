
/// <reference path="IEntity.ts" />
/// <reference path="IPoint.ts" />
/// <reference path="IOffset.ts" />
/// <reference path="IUILayout.ts" />


/// <reference path="IUI.ts" />

module akra {
	export enum EUINodeTypes {
		UNKNOWN,
		HTML,
		DND,
	
		LAYOUT,
	
		COMPONENT
	} 
	
	export interface IUINode extends IEntity {
		nodeType: EUINodeTypes;
		ui: IUI;
	
		render(): boolean;
		render(pParent: IUINode): boolean;
		render(pElement: HTMLElement): boolean;
		render(pElement: JQuery): boolean;
		render(sSelector: string): boolean;
	
		attachToParent(pParent: IUINode): boolean;
		recursiveRender(): void;
		renderTarget(): JQuery;
		hasRenderTarget(): boolean;
	
		signal relocated(pNode: IUINode): void;
	}
}
