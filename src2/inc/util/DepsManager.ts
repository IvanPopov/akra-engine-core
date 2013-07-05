#ifndef DEPSMANAGER_TS
#define DEPSMANAGER_TS

#include "common.ts"
#include "IDepsManager.ts"
#include "IEngine.ts"
#include "io/files.ts"

#include "util/EffectParser.ts"
#include "util/URI.ts"

module akra.util {
	export enum EDepsManagerStates {
		IDLE,
		LOADING
	}

	class DepsManager implements IDepsManager {
		protected _eState: EDepsManagerStates = EDepsManagerStates.IDLE;
		protected _pEngine: IEngine;
		// protected _iTotalBytesLoaded: uint = 0;
		// protected _iTotalDepth: uint = 0;

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

			this.generateDepInfo(pDeps);
			this.normalizeDepsPaths(pDeps, pDeps.root || sRoot);
			this.createDepsResources(pDeps);
			this.loadDeps(pDeps);

			return true;
		}

		private walk(pDeps: IDependens, fn: (pDeps: IDependens, i: int, iDepth?: uint) => void, iDepth: uint = 0): void {
			var pFiles: IDep[] = pDeps.files;

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

		private generateDepInfo(pDeps: IDependens): void {
			var pCurr: IDependens = pDeps;
			var pInfo: number[] = [];

			
			while (isDefAndNotNull(pCurr)) {
				pInfo.push(pCurr.files? pCurr.files.length: 0);
				pCurr = pCurr.deps;
			}

			this.beforeLoad(pInfo);
		}

		private normalizeDepsPaths(pDeps: IDependens, sRoot: string): void {
			this.walk(pDeps, (pDeps: IDependens, i: int): void => {

				pDeps.files[i].path = util.URI.resolve(pDeps.files[i].path, sRoot || document.location.pathname);
			});
		}

		private createDepsResources(pDeps: IDependens): void {
			var pRmgr: IResourcePoolManager = this.getEngine().getResourceManager();
			this.walk(pDeps, (pDeps: IDependens, i: int, iDepth?: uint): void => {
				var pFiles: IDep[] = pDeps.files;
				var sResource: string = pFiles[i].name || pFiles[i].path;

				switch (pathinfo(pFiles[i].path).ext.toLowerCase()) {
					case "afx":
						if (!pRmgr.effectDataPool.findResource(sResource)) {
							pRmgr.effectDataPool.createResource(sResource);
						}
						break;
					case "jpg":
					case "jpeg":
					case "png":
					case "bmp":
					case "gif":
					case "dds":
						if (!pRmgr.imagePool.findResource(sResource)) {
							pRmgr.imagePool.createResource(sResource);
						}
						break;
					case "dae":
						if (!pRmgr.colladaPool.findResource(sResource)) {
							pRmgr.colladaPool.createResource(sResource);
						}
						break;
				}
			});
		}

		private loadDeps(pDeps: IDependens, iDepth: uint = 0): void {
			var pRmgr: IResourcePoolManager = this.getEngine().getResourceManager();

			//if got empty dependency.
			if (!isArray(pDeps.files) || pDeps.files.length === 0) {
				this._onDependencyLoad(pDeps, iDepth, -1/*, 0*/);
			}

			//walk single deps level
			this.walk({files: pDeps.files}, (pDep: IDependens, i: int, iDepth?: uint): void => {
				var pFiles: IDep[] = pDeps.files;
				var pManager: DepsManager = this;
				var pRes: IResourcePoolItem;
				
				if (isDefAndNotNull(pDep.type)) {
					if (pDep.type == "text" && isFunction(pDep.loader)) {
						var pFile: IFile = io.fopen(pFiles[i].path, "r");
						pFile.read((pErr: Error, sData: string): void => {
							if (!isNull(pErr)) {
								pManager.error(pErr);
							}

							pDep.loader(pDep, sData);
							pManager._onDependencyLoad(pDeps, iDepth, i/*, pFile.byteLength*/);
						});	
					}
				}
				
				var sResource: string = pFiles[i].name || pFiles[i].path;

				switch (pathinfo(pFiles[i].path).ext.toLowerCase()) {
					case "gr":
						var pGrammar: IFile = io.fopen(pFiles[i].path, "r");
						pGrammar.read((pErr: Error, sData: string): void => {
							if (!isNull(pErr)) {
								pManager.error(pErr);
							}

							//WARNING: only for HLSL grammar files.
							util.initAFXParser(sData);
							pManager._onDependencyLoad(pDeps, iDepth, i/*, pGrammar.byteLength*/);
						});	
						break;

					case "afx":
							pRes = pRmgr.effectDataPool.findResource(sResource);
							
							if (pRes.loadResource(pFiles[i].path)) {
								pManager._handleResourceEventOnce(pRes, SIGNAL(loaded),
									(pItem: IResourcePoolItem): void => {
										pManager._onDependencyLoad(pDeps, iDepth, i/*, (<core.pool.resources.EffectData>pItem).byteLength*/);
									}
								);
							}
							else {
								this.error(new Error("could not load resource: " + pFiles[i].path));
							}
							
						break;
					case "jpeg":
					case "jpg":
					case "png":
					case "gif":
					case "bmp":
					case "dds":
							pRes = pRmgr.imagePool.findResource(sResource);
							if (pRes.loadResource(pFiles[i].path)) {
								pManager._handleResourceEventOnce(pRes, SIGNAL(loaded), (pItem: IResourcePoolItem): void => {
									pManager._onDependencyLoad(pDeps, iDepth, i/*, (<IImg>pItem).byteLength*/);
								});
							}
							else {
								this.error(new Error("could not load resource: " + pFiles[i].path));
							}
						break;
					case "dae":
							pRes = pRmgr.colladaPool.findResource(sResource);
							if (pRes.loadResource(pFiles[i].path)) {
								pManager._handleResourceEventOnce(pRes, SIGNAL(loaded), 
									(pItem: IResourcePoolItem): void => {pManager._onDependencyLoad(pDeps, iDepth, i/*, (<IModel>pItem).byteLength*/);
								});
							}
							else {
								this.error(new Error("could not load resource: " + pFiles[i].path));
							}
						break;
					default:
						WARNING("dependence " + pFiles[i].path + " unknown, and will be skipped.");
				}	
			}, iDepth);
		}

		_handleResourceEventOnce(pRsc: IResourcePoolItem, sSignal: string, fnHandler: (pItem: IResourcePoolItem) => void): void {
			var fn: (pItem: IResourcePoolItem) => void;
			
			fn = (pItem: IResourcePoolItem): void => {
				fnHandler(pItem);
				pRsc.unbind(sSignal, fn);
			}

			pRsc.bind(sSignal, fn);
		}

		_onDependencyLoad(pDeps: IDependens, iDepth: uint, n: int/*, iByteLength: uint*/): void {
			// debug_assert(isDefAndNotNull(pDeps.files) && isString(pDeps.files[i]), "something going wrong...");

			if (n != -1) {
				// console.log(pDeps.files[n].path, iByteLength);

				// this._iTotalBytesLoaded += (iByteLength);
				pDeps.files[n] = null;
			}

			var nRestDepsInLevel: uint = 0;
			var nLoadedDepsInLevel: uint = 0;
			var nTotalDepsInLevel: uint = 0;
			
			if (isArray(pDeps.files)) {
				for (var i: int = 0; i < pDeps.files.length; ++ i) {
					if (!isNull(pDeps.files[i])) {
						// console.log("wait for: ", pDeps.files[i].path);
						nRestDepsInLevel ++;
					}
				};

				nTotalDepsInLevel = pDeps.files.length;
				nLoadedDepsInLevel = nTotalDepsInLevel - nRestDepsInLevel;
			}

			// LOG("lvl: ", iDepth, "loaded", nLoadedDepsInLevel, "/", nTotalDepsInLevel, "total mb - ", (this._iTotalBytesLoaded / (1024 * 1024)).toFixed(2));
			this.loadedDep(iDepth, nLoadedDepsInLevel, nTotalDepsInLevel);
			
			if (nRestDepsInLevel > 0) {
				return;
			}

			if (isDefAndNotNull(pDeps.deps)) {
				this.loadDeps(pDeps.deps, iDepth + 1);
			}
			else {
				this.loaded(pDeps);
			}
		}


		CREATE_EVENT_TABLE(DepsManager);
		BROADCAST(loaded, CALL(deps));
		BROADCAST(beforeLoad, CALL(info));
		BROADCAST(loadedDep, CALL(depth, loaded, total));
		// BROADCAST(error, CALL(pErr));
		
		error(pErr: Error): void {
			if (true) throw pErr;
			EMIT_BROADCAST(error, _CALL(pErr));
		}

	}

	export function createDepsManager(pEngine: IEngine): IDepsManager {
		debug_assert(isDefAndNotNull(pEngine));
		return new DepsManager(pEngine);
	}
}

#endif
