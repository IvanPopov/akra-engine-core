#ifndef BUILDSCENARIO_TS
#ifndef BUILDSCENARIO_TS

module akra.build {
	export class BuildScenario implements IBuildScenario {
		private _pBuilder: ISceneBuilder;

		constructor (pBuilder: ISceneBuilder) {
			this._pBuilder = pBuilder;
		}

		inline getBuilder(): ISceneBuilder {
			return this._pBuilder;
		}

		inline getEngine(): IEngine {
			return this._pBuilder.getEngine();
		}

		BEGIN_EVENT_TABLE();
		END_EVENT_TABLE();
	}
}

#endif