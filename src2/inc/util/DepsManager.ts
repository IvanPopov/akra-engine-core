#ifndef DEPSMANAGER_TS
#define DEPSMANAGER_TS

#include "common.ts"
#include "IDepsManager.ts"
#include "IEngine.ts"
#include "io/files.ts"

module akra.util {
	export enum EDepsManagerStates {
		IDLE,
		LOADING
	}

	class DepsManager implements IDepsManager {
		protected _eState: EDepsManagerStates = EDepsManagerStates.IDLE;
		protected _pEngine: IEngine;

		constructor (pEngine: IEngine) {
			this._pEngine = pEngine;
		}

		inline getEngine(): IEngine { return this._pEngine; }

		load(pDeps: IDependens, sRoot: string = null): bool {
			if (!isDefAndNotNull(pDeps)) {
				return false;
			}

			if (this._eState === EDepsManagerStates.LOADING) {
				WARNING("deps manager in loading state");
				return false;
			}

			this.loadDeps(pDeps, sRoot);

			return true;
		}

		private walk(pDeps: IDependens, fn: (pDeps: IDependens, i: int, iDepth?: uint) => void, iDepth: uint = 0): void {
			var pFiles: string[] = pDeps.files;

			if (isDefAndNotNull(pFiles)) {
				//normilize pathes to deps
				for (var i: int = 0; i < pFiles.length; ++ i) {
					fn.call(this, pDeps, i, iDepth);
				}
			}

			if (isDefAndNotNull(pDeps.deps)) {
				this.walk(pDeps.deps, fn, ++ iDepth);
			}
		}

		private normalizeDepsPaths(pDeps: IDependens, sRoot: string): void {
			this.walk(pDeps, (pDeps: IDependens, i: int): void => {
				pDeps.files[i] = (sRoot || "") + "/" + pDeps.files[i];
			});
		}

		private createDepsResources(pDeps: IDependens): void {
			var pRmgr: IResourcePoolManager = this.getEngine().getResourceManager();
			this.walk(pDeps, (pDeps: IDependens, i: int): void => {
				var pFiles: string[] = pDeps.files;
				switch (pathinfo(pFiles[i]).ext.toLowerCase()) {
					case "dae":
						if (!pRmgr.colladaPool.findResource(pFiles[i])) {
							pRmgr.colladaPool.createResource(pFiles[i]);
						}
						break;
				}
			});
		}

		private loadDeps(pDeps: IDependens, sRoot: string = null): void {
			this.walk(pDeps, (pDeps: IDependens, i: int, iDepth?: uint): void => {
				if (iDepth === 0) {
					this.normalizeDepsPaths(pDeps, sRoot);
					this.createDepsResources(pDeps);

					var pFiles: string[] = pDeps.files;

					switch (pathinfo(pFiles[i]).ext.toLowerCase()) {
						case "dae":
								io.fopen(pFiles[i], "r").read((pErr: Error, sData: string): void => {
									if (isDefAndNotNull(pErr)) {
										ERROR(pErr);
									}

									LOG(sData);
								});
							break;
						default:
							WARNING("dependence " + pFiles[i] + " unknown, and will be skipped.");
					}	
				}
			});
		}

		BEGIN_EVENT_TABLE(DepsManager);
			BROADCAST(loaded, VOID);
			BROADCAST(error, CALL(pErr));
		END_EVENT_TABLE();
	}

	export function createDepsManager(pEngine: IEngine): IDepsManager {
		debug_assert(isDefAndNotNull(pEngine));
		return new DepsManager(pEngine);
	}
}

#endif
