#ifndef REFERENCECOUNTER_TS
#define REFERENCECOUNTER_TS

#include "IReferenceCounter.ts"

module akra.util {
	export class ReferenceCounter implements IReferenceCounter {
		private nReferenceCount: uint = 0;

		/** Выстанавливает чило ссылок  на объект в ноль */
		constructor ();
		/** 
		 * Выстанавливает чило ссылок  на объект в ноль
 		 * количесвто ссылок привязаны к конкретному экземпляру, поэтому никогда не копируются 
 		 */
		constructor (pSrc: IReferenceCounter);
		constructor (pSrc?) {}

		/** @inline */
		referenceCount(): uint {
			return this.nReferenceCount;
		}

		/** @inline */
		destructor(): void {
			ASSERT(this.nReferenceCount === 0, 'object is used');
		}

		release(): uint {
			ASSERT(this.nReferenceCount > 0, 'object is used');
		    this.nReferenceCount--;
		    return this.nReferenceCount;
		}

		addRef(): uint {
			ASSERT(this.nReferenceCount != MIN_INT32, 'reference fail');

    		this.nReferenceCount ++;

			return this.nReferenceCount;
		}

		/** @inline */
		eq (pSrc: IReferenceCounter): IReferenceCounter {
		    return this;
		};
	}
}

#endif