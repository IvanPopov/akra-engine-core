#ifndef ENGINE_TS
#define ENGINE_TS

#include "IEngine.ts"
#include "IDisplayManager.ts"
#include "IParticleManager.ts"
#include "IResourcePoolManager.ts"
#include "IRenderer.ts"


#ifdef WEBGL
#include "webgl/WebGLRenderer.ts"
#endif

module akra.core {
	export class Engine implements IEngine {

		private _pResourceManager: IResourcePoolManager;
		private _pDisplayManager: IDisplayManager;
		private _pParticleManager: IParticleManager;
		private _pRenderer: IRenderer;

		constructor () {
			this._pResourceManager = new pool.ResourcePoolManager(this);
			this._pDisplayManager = new DisplayManager(this);
			this._pParticleManager = null;

#ifdef WEBGL
			this._pRenderer = new webgl.WebGLRenderer();
#else
			CRITICAL("render system not specified");
#endif


			if (!this._pResourceManager.initialize()) {
				debug_error('cannot initialize ResourcePoolManager');
			}

			if (!this._pDisplayManager.initialize()) {
				debug_error("cannot initialize DisplayManager");
			}
		}

		getDisplayManager(): IDisplayManager {
			return null;
		}

		getParticleManager(): IParticleManager {
			return null;
		}

		getResourceManager(): IResourcePoolManager {
			return null;
		}

		getRenderer(): IRenderer {
			return this._pRenderer;
		}
	

		exec(): bool {
			return this._pDisplayManager.display();
		}

	}

}

module akra {
	createEngine = function (): IEngine {
		return new core.Engine();
	}
}

/*
		private initDefaultStates(): bool {
			this.pRenderState = {
		        mesh            : {
		            isSkinning : false
		        },
		        isAdvancedIndex : false,
		        lights          : {
		            omni : 0,
		            project : 0,
		            omniShadows : 0,
		            projectShadows : 0
		        }
		    };

			return true;
		}
 */

#endif