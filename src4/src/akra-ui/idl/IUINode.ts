/// <reference path="../../../build/akra.d.ts" />

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
		relocated: ISignal<{ (pNode: IUINode, pLocation: IUINode): void; }>;

		getNodeType(): EUINodeTypes;
		getUI(): IUI;
	
		render(): boolean;
		render(pParent: IUINode): boolean;
		render(pElement: HTMLElement): boolean;
		render(pElement: JQuery): boolean;
		render(sSelector: string): boolean;
	
		attachToParent(pParent: IUINode): boolean;
		recursiveRender(): void;
		renderTarget(): JQuery;
		hasRenderTarget(): boolean;
	}
}
