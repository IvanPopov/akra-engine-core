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
		protected _pDepsLevel: IDependens = null;
		protected _eState: EDepsManagerStates = EDepsManagerStates.IDLE;
		protected _pEngine: IEngine;
		protected _sRoot: string = null;

		constructor (pEngine: IEngine) {
			this._pEngine = pEngine;
		}

		load(pDeps: IDependens, sRoot: string = null): bool {
			if (!isDefAndNotNull(pDeps)) {
				return false;
			}

			if (this._eState === EDepsManagerStates.LOADING) {
				WARNING("deps manager in loading state");
				return false;
			}

			if (isDefAndNotNull(sRoot)) {
				this._sRoot = sRoot;
			}

			this.loadLevel(pDeps);
		}

		private loadLevel(pDeps: IDependens): void {
			this._pDepsLevel = pDeps;

			var pFiles: string[] = pDeps.files || (new string[]);

			for (var i: int = 0; i < pFiles.length; ++ i) {
				var pPath: IPathinfo = util.pathinfo(pFiles[i]);

				switch (pPath.ext.toLowerCase()) {
					case "gr":
					case "afx":
							io.fopen(this._sRoot + "/" + pPath.toString(), "r").read((pErr: Error, sData: string): void => {
								if (isDefAndNotNull(pErr)) {
									ERROR(pErr);
								}

								LOG(sData);
							});
						break;
					default:
						CRITICAL("хуевое расширение!");
				}	
				
			}
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
