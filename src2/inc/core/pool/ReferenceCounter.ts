#ifndef REFERENCECOUNTER_TS
#define REFERENCECOUNTER_TS

#include "IReferenceCounter.ts"

module akra.core.pool {

	export class ReferenceCounter implements IReferenceCounter{
		/**
		 * Число ссылок  на объект
		 */
		private _nReferenceCount: uint = 0;

		/**
		 * Предупреждает если объект еще используется
		 */
		destructor(): void {
			assert(this._nReferenceCount == 0);
		}

		/**
		 * Добаволение ссылки  на объект, увеличивает внутренний счетчки на 1,
		 * проверяет не достигнуто ли максимальное количесвто
		 */
		addRef(): uint {
			assert(this._nReferenceCount != Number.MAX_VALUE, 'reference fail :(');
			this._nReferenceCount++;
			return this._nReferenceCount;
		}

		/**
		 * Уведомление об удалении ссылки  на объект, уменьшает внутренний счетчки на 1,
		 * проверяет есть ли ее объекты
		 */
		release(): uint {
			assert(this._nReferenceCount > 0);
			this._nReferenceCount--;
			return this._nReferenceCount;
		}

		/**
		 * Текущее количесвто ссылок  на объект
		 */
		referenceCount(): uint {
			return this._nReferenceCount;
		}

		/**
		 * Данная функция нужна чтобы обеспечить наследникам ее возможность,
		 * само количестdо ссылок не копируется
		 */
		eq(pSrc: IReferenceCounter): IReferenceCounter {
			return this;
		} 
	}
}

#endif