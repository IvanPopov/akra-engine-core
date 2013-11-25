
/// <reference path="IEntity.ts" />
/// <reference path="IPoint.ts" />
/// <reference path="AIOffset.ts" />
/// <reference path="IUILayout.ts" />


/// <reference path="IUI.ts" />

module akra {
	enum EUINodeTypes {
		UNKNOWN,
		HTML,
		DND,
	
		LAYOUT,
	
		COMPONENT
	} 
	
	interface IUINode extends IEntity {
		/** readonly */ nodeType: EUINodeTypes;
		/** readonly */ ui: IUI;
	
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
