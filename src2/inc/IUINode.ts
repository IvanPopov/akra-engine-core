#ifndef IUINODE_TS
#define IUINODE_TS

#include "IEntity.ts"
#include "IPoint.ts"
#include "IOffset.ts"
#include "IUILayout.ts"

module akra {
	IFACE(IUI);

	export enum EUINodeTypes {
		UNKNOWN,
		HTML,
		DND,

		LAYOUT,

		COMPONENT
	} 

	export interface IUINode extends IEntity {
		readonly nodeType: EUINodeTypes;
		readonly ui: IUI;

		render(): bool;
		render(pParent: IUINode): bool;
		render(pElement: HTMLElement): bool;
		render(pElement: JQuery): bool;
		render(sSelector: string): bool;

		attachToParent(pParent: IUINode): bool;
		recursiveRender(): void;
		renderTarget(): JQuery;

		signal relocated(pNode: IUINode): void;
	}
}

#endif