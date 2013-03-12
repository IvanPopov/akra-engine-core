#ifndef DEPSMANAGER_TS
#define DEPSMANAGER_TS

#include "common.ts"
#include "IDepsManager.ts"
#include "IEngine.ts"
#include "io/files.ts"

#include "util/EffectParser.ts"

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

			this.normalizeDepsPaths(pDeps, pDeps.root || sRoot);
			this.createDepsResources(pDeps);
			this.loadDeps(pDeps);

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
					case "afx":
						if (!pRmgr.effectDataPool.findResource(pFiles[i])) {
							//LOG("effectDataPool.createResource(" + pFiles[i] + ")");
							pRmgr.effectDataPool.createResource(pFiles[i]);
						}
						break;
				}
			});
		}

		private loadDeps(pDeps: IDependens): void {
			var pRmgr: IResourcePoolManager = this.getEngine().getResourceManager();
			var pRes: IResourcePoolItem;

			//if got empty dependency.
			if (!isArray(pDeps.files) || pDeps.files.length === 0) {
				this._onDependencyLoad(pDeps);
			}

			//walk single deps level
			this.walk({files: pDeps.files}, (pDep: IDependens, i: int): void => {
				var pFiles: string[] = pDeps.files;
				var pManager: DepsManager = this;
				
				if (isDefAndNotNull(pDep.type)) {
					if (pDep.type == "text" && isFunction(pDep.loader)) {
						io.fopen(pFiles[i], "r").read((pErr: Error, sData: string): void => {
							if (!isNull(pErr)) {
								pManager.error(pErr);
							}

							pDep.loader(pDep, sData);
							pManager._onDependencyLoad(pDeps, i);
						});	
					}
				}

				switch (pathinfo(pFiles[i]).ext.toLowerCase()) {
					case "gr":
						io.fopen(pFiles[i], "r").read((pErr: Error, sData: string): void => {
							if (!isNull(pErr)) {
								pManager.error(pErr);
							}

							//WARNING: only for HLSL grammar files.
							util.initAFXParser(sData);
							pManager._onDependencyLoad(pDeps, i);
						});	
						break;

					case "afx":
							pRes = pRmgr.effectDataPool.findResource(pFiles[i]);
							
							if (pRes.loadResource(pFiles[i])) {
								pManager._handleResourceEventOnce(pRes, SIGNAL(loaded),
									(pItem: IResourcePoolItem): void => {
										//LOG("[ LOADED ]  effectDataPool.loadResource(" + pFiles[i] + ")");
										pManager._onDependencyLoad(pDeps, i);
									}
								);
							}
							else {
								this.error(new Error("could not laod resource: " + pFiles[i]));
							}
							
						break;

					default:
						WARNING("dependence " + pFiles[i] + " unknown, and will be skipped.");
				}	
			});
		}

		_handleResourceEventOnce(pRsc: IResourcePoolItem, sSignal: string, fnHandler: (pItem: IResourcePoolItem) => void): void {
			var fn: (pItem: IResourcePoolItem) => void;
			
			fn = (pItem: IResourcePoolItem): void => {
				fnHandler(pItem);
				pRsc.unbind(sSignal, fn);
			}

			pRsc.bind(sSignal, fn);
		}

		_onDependencyLoad(pDeps: IDependens, n?: int): void {
			// debug_assert(isDefAndNotNull(pDeps.files) && isString(pDeps.files[i]), "something going wrong...");

			if (isDef(n)) {
				LOG("loaded dependency: " + pDeps.files[n]);
				pDeps.files[n] = null;
			}

			for (var i: int = 0; i < pDeps.files.length; ++ i) {
				if (!isNull(pDeps.files[i])) {
					//LOG("waiting for > " + pDeps.files[i]);
					return;
				}
			};

			if (isDefAndNotNull(pDeps.deps)) {
				this.loadDeps(pDeps.deps);
			}
			else {
				this.loaded();
			}
		}

		BEGIN_EVENT_TABLE(DepsManager);
			BROADCAST(loaded, VOID);
			// BROADCAST(error, CALL(pErr));
			
			error(pErr: Error): void {
				if (true) throw pErr;
				EMIT_BROADCAST(error, _CALL(pErr));
			}

		END_EVENT_TABLE();
	}

	export function createDepsManager(pEngine: IEngine): IDepsManager {
		debug_assert(isDefAndNotNull(pEngine));
		return new DepsManager(pEngine);
	}
}

#endif
