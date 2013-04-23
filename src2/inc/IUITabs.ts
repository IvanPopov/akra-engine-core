#ifndef IUITABS_TS
#define IUITABS_TS

#include "IUIComponent.ts"

module akra {
	IFACE(IUIPanel);

	export interface IUITabs extends IUIComponent {
		active: IUIPanel;

		tab(iTab: int): IUIPanel;

		select(i: uint): void;
		select(pPanel: IUIPanel): void;

		findTabByTitle(sName: string): int;
		findTab(sName: string): int;

		tabIndex(pPanel: IUIPanel): uint;
	}
}

#endif
