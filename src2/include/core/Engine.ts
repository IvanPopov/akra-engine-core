///<reference path="../akra.ts" />

module akra.core {
	export class Engine implements IEngine {

		private pResourceManager: IResourcePoolManager = null;
		private pDisplayManager: IDisplayManager = null;
		private pParticleManager: IParticleManager = null;

		constructor () {
			this.pResourceManager = new pool.ResourcePoolManager(this);
			this.pDisplayManager = new DisplayManager(this);


			if (!this.pResourceManager.initialize()) {
				debug_error('cannot initialize ResourcePoolManager');
			}

			if (!this.pDisplayManager.initialize()) {
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

		getDefaultRenderer(): IRenderer {
			var pDisplay: IDisplay3d = this.pDisplayManager.getDisplay3D();
			
			if (isNull(pDisplay)) {
				return null;
			}

			return pDisplay.getRenderer();
		}
	

		exec(): bool {
			return this.pDisplayManager.display();
		}

	}

}

module akra {
	export function createEngine() {
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