/// <reference path="../idl/IEngine.ts" />
/// <reference path="../idl/IResourcePool.ts" />
/// <reference path="../idl/IResourcePoolItem.ts" />
/// <reference path="../idl/IDataPool.ts" />
/// <reference path="../idl/IResourceCode.ts" />
/// <reference path="../idl/IResourcePoolManager.ts" />

/// <reference path="../util/ReferenceCounter.ts" />
/// <reference path="../events.ts" />
/// <reference path="../guid.ts" />

/// <reference path="ResourceCode.ts" />
/// <reference path="PoolGroup.ts" />
/// <reference path="DataPool.ts" />

module akra.pool {
	export class ResourcePool<T extends IResourcePoolItem> extends util.ReferenceCounter implements IResourcePool<T> {
		guid: uint = guid();
		createdResource: ISignal<{ (pPool: IResourcePool<T>, pResource: T): void; }> = new Signal(<any>this);

		private _pManager: IResourcePoolManager = null;
		/** Конструктор для создания данных в пуле ресурсов */
		private _tTemplate: IResourcePoolItemType = null;
		private _sExt: string = null;
		private _pRegistrationCode: IResourceCode = new ResourceCode(EResourceCodes.INVALID_CODE);
		private _pNameMap: string[] = new Array<string>();
		private _pDataPool: IDataPool = null;


		getFourcc(): int {
			return (this._sExt.charCodeAt(3) << 24)
				| (this._sExt.charCodeAt(2) << 16)
				| (this._sExt.charCodeAt(1) << 8)
				| (this._sExt.charCodeAt(0));
		}

		setFourcc(iNewFourcc: int): void {
			this._sExt = String.fromCharCode((iNewFourcc & 0x000000FF),
				(iNewFourcc & 0x0000FF00) >>> 8,
				(iNewFourcc & 0x00FF0000) >>> 16,
				(iNewFourcc & 0xFF000000) >>> 24);
		}

		getManager(): IResourcePoolManager {
			return this._pManager;
		}

		constructor (pManager: IResourcePoolManager, tTemplate: IResourcePoolItemType) {
			super();

			this._pManager = pManager;
			this._tTemplate = tTemplate;
			this._pDataPool = new DataPool(this._pManager, tTemplate);
		}

		/** Добавление данного пула в менеджер ресурсво по его коду */
		registerResourcePool(pCode: IResourceCode): void {
			this._pRegistrationCode.eq(pCode);
			this._pManager.registerResourcePool(this._pRegistrationCode, this);
		}

		/** Удаление данного пула в менеджер ресурсво по его коду */
		unregisterResourcePool(): void {
			this._pManager.unregisterResourcePool(this._pRegistrationCode);
			this._pRegistrationCode.setInvalid();
		}

		/** По имени ресурса возвращает его хендл */
		findResourceHandle(sName: string): int {
			// look up the name in our map
			var iNewHandle = PoolGroup.INVALID_INDEX;
			
			for (var iHandle: int = 0; iHandle < this._pNameMap.length; ++ iHandle) {
				if (this._pNameMap[iHandle] === sName) {
					return iHandle;
				}
			}

			return iNewHandle;
		}

		/** 
		 * Get resource name by handle.
		 * @
		 */
		findResourceName(iHandle: int): string {
			return this._pNameMap[iHandle];
		}

		setResourceName(iHandle: int, sName: string): void {
			this._pNameMap[iHandle] = sName;
		}


		initialize(iGrowSize: int): void {
			this._pDataPool.initialize(iGrowSize);
		}

		/** @ */
		destroy(): void {
			this._pDataPool.destroy();
		}


		clean(): void {
			this._pDataPool.forEach(ResourcePool.callbackClean);
		}

		destroyAll(): void {
			this._pDataPool.forEach(ResourcePool.callbackDestroy);
		}

		restoreAll(): void {
			this._pDataPool.forEach(ResourcePool.callbackRestore);
		}

		disableAll(): void {
			this._pDataPool.forEach(ResourcePool.callbackDisable);
		}

		/** @ */
		isInitialized(): boolean {
			return this._pDataPool.isInitialized();
		}

	   

		createResource(sResourceName: string): T {
			var iHandle: int = this.internalCreateResource(sResourceName);

			if (iHandle !== PoolGroup.INVALID_INDEX) {
				var pResource: T = this.getResource(iHandle);

				pResource.setResourcePool(this);
				pResource.setResourceHandle(iHandle);
				pResource.setResourceCode(this._pRegistrationCode);

				this.createdResource.emit(pResource);

				return pResource;
			}

			return null;
		}

		loadResource(sResourceName: string): T {
			// does the resource already exist?
			var pResource: T = this.findResource(sResourceName);
	   
			if (pResource == null) {
				// create a new resource
				pResource = this.createResource(sResourceName);

				if (pResource != null) {
					// attempt to load the desired data
					if (pResource.loadResource(sResourceName)) {
						// ok!
						return pResource;
					}

					// loading failed.
					// destroy the resource we created
					// destroyResource(pResource);
					pResource.release();
					pResource = null;
				}
			}

			return pResource;
		}

		saveResource(pResource: T): boolean {
			if (pResource != null) {
				// save the resource using it's own name as the file path
				return pResource.saveResource();
			}
			return false;
		}

		destroyResource(pResource: T): void {
			if (pResource != null) {
				var iReferenceCount: int = pResource.referenceCount();

				debug.assert(iReferenceCount == 0, "destruction of non-zero reference count!");

				if (iReferenceCount <= 0) {
					var iHandle: int = pResource.getResourceHandle();
					this.internalDestroyResource(iHandle);
				}
			}
		}

		findResource(sName: string): T {

			// look up the name in our map
			for (var iHandle: int = 0; iHandle < this._pNameMap.length; ++ iHandle) {
				if (this._pNameMap[iHandle] == sName) {
					if (iHandle != PoolGroup.INVALID_INDEX) {
						var pResource = this.getResource(iHandle);
						return pResource;
					}
				}
			}

			return null;
		}

		getResource(iHandle: int): T {
			var pResource: T = this.internalGetResource(iHandle);

			if (pResource != null) {
				pResource.addRef();
			}

			return pResource;
		}

		getResources(): T[] {
			var pResources: T[] = [];

			for (var iHandleResource in this._pNameMap) {
				pResources.push(this.getResource(parseInt(iHandleResource)));
			}

			return pResources;
		}


		private internalGetResource(iHandle: int): T {
			return this._pDataPool.getPtr(iHandle);
		}

		private internalDestroyResource(iHandle: int): void {
			// get a pointer to the resource and call it's destruction handler
			var pResource = this._pDataPool.getPtr(iHandle);

			pResource.destroyResource();

			delete this._pNameMap[iHandle];

			// free the resource slot associated with the handle
			this._pDataPool.release(iHandle);
		}

		private internalCreateResource(sResourceName: string): int {
			var iHandle: int = this._pDataPool.nextHandle();

			// make sure this name is not already in use
			for (var iter in this._pNameMap) {
				debug.assert((this._pNameMap[iter] != sResourceName),
							"A resource with this name already exists: " + sResourceName);
			}

			// add this resource name to our map of handles
			this._pNameMap[iHandle] = sResourceName;

			// get a pointer to the resource and call it's creation function
			var pResource = this._pDataPool.getPtr(iHandle);

			pResource.createResource();

			return iHandle;
		}

		private static callbackDestroy(pPool: IDataPool, iHandle: int, pResource: IResourcePoolItem): void {
			pResource.destroyResource();
		}

		private static callbackDisable(pPool: IDataPool, iHandle: int, pResource: IResourcePoolItem): void {
			pResource.disableResource();
		}

		private static callbackRestore(pPool: IDataPool, iHandle: int, pResource: IResourcePoolItem): void {
			pResource.restoreResource();
		}

		private static callbackClean(pPool: IDataPool, iHandle: int, pResource: IResourcePoolItem): void {
			if (pResource.referenceCount() == 0) {
				pPool.release(iHandle);
			}
		}
	}
}
