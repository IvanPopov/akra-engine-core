#ifndef ISCENEBUILDER_TS
#define ISCENEBUILDER_TS



module akra {

	IFACE(IBuildScenario);

	export interface ISceneBuilder {
		build(pScenario: IBuildScenario): bool;
	}
}

#endif
