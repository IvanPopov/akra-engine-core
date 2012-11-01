#ifndef ISCENEBUILDER_TS
#define ISCENEBUILDER_TS

IFACE(IBuildScenario);

module akra {
	export interface ISceneBuilder {
		build(pScenario: IBuildScenario): bool;
	}
}

#endif
