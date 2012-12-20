#ifndef ISCENEBUILDER_TS
#define ISCENEBUILDER_TS



module akra {

	IFACE(IBuildScenario);
	IFACE(ICamera);
	IFACE(IViewport);

	export interface ISceneBuilder {

		build(pScenario: IBuildScenario, pCamera: ICamera, pViewport: IViewport): bool;

		getEngine(): IEngine;
		getBuilder(): ISceneBuilder;
	}
}

#endif
