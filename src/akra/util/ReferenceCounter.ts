/// <reference path="../idl/IReferenceCounter.ts" />

/// <reference path="../limit.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../limit.ts" />

module akra.util {
	export class ReferenceCounter implements IReferenceCounter {
		private nReferenceCount: uint = 0;

		/** Выстанавливает чило ссылок  на объект в ноль */
		constructor();
		/** 
		 * Выстанавливает чило ссылок  на объект в ноль
		 * количесвто ссылок привязаны к конкретному экземпляру, поэтому никогда не копируются 
		 */
		constructor(pSrc: IReferenceCounter);
		constructor(pSrc?) { }

		referenceCount(): uint {
			return this.nReferenceCount;
		}

		destructor(): void {
			logger.assert(this.nReferenceCount === 0, "object is used");
		}

		release(): uint {
			logger.assert(this.nReferenceCount > 0, "object is used");
			this.nReferenceCount--;
			return this.nReferenceCount;
		}

		addRef(): uint {
			logger.assert(this.nReferenceCount != MIN_INT32, "reference fail");

			this.nReferenceCount++;

			return this.nReferenceCount;
		}

		eq(pSrc: IReferenceCounter): IReferenceCounter {
			return this;
		}
	}
}