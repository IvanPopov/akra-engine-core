///<reference path="akra.ts" />

module akra {
	export interface ISceneBuilder {
		build(pScenario: IBuildScenario): bool;
	}
}