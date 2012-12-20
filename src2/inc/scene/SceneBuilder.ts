#ifndef SCENEBUILDER_TS
#define SCENEBUILDER_TS

#include "ISceneBuilder.ts"
#include "IRenderer.ts"
#include "IEngine.ts"
#include "IBuildScenario.ts"


module akra.scene {
	export class SceneBuilder implements ISceneBuilder {
		private _pEngine: IEngine;

		constructor (pEngine: IEngine) {
			this._pEngine = pEngine;
		}

		build(pScenario: IBuildScenario, pCamera: ICamera, pViewport: IViewport): bool {
			var pRenderer: IRenderer = this._getRenderer();
			var isOk: bool = false;

			pRenderer._beginFrame(pViewport);
			
			isOk = pScenario.build(pCamera, pViewport);
			
			pRenderer._endFrame();

			return isOk;
		}

		inline getEngine(): IEngine {
			return this._pEngine;
		}

		inline _getRenderer(): IRenderer {
			return this._pEngine.getRenderer();
		}
	}

}

#endif