#ifndef IBUILDSCENARIO_TS
#define IBUILDSCENARIO_TS

#include "IEventProvider.ts"

module akra {
	IFACE(ICamera);
	IFACE(IViewport);

	export interface IBuildScenario extends IEventProvider {
		create(): bool;
		destroy(): void;

		build(pBuilder: ISceneBuilder, pCamera: ICamera, pViewport: IViewport): bool;
		
		getEngine(): IEngine;
	}
}

#endif

