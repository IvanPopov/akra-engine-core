///<reference path="../akra.ts" />

module akra.scene {
	export class SceneBuilder extends util.Singleton implements ISceneBuilder {
		
		constructor () {
			super();
		}

		build(pScenario: IBuildScenario): bool {
			return false;
		}

		//FIXME: hack for typescript limitaions. 
		static getSingleton(): ISceneBuilder {
			return <ISceneBuilder>((<any>SceneBuilder)._pInstance);
		}
	}

	//create singleton instance
	new SceneBuilder();
}