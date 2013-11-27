// AIDataPool interface
// [write description here...]


/// <reference path="AIEngine.ts" />
/// <reference path="AIResourcePoolManager.ts" />

interface AIDataPool {
	manager: AIResourcePoolManager;
	/** Инициализация пула данных */
	initialize(iGrowSize: uint): void;

	/** Инициализирован ли пул */
	isInitialized(): boolean;

	/** Очистка пула и пометка о том что он больш не инициализирован */
	destroy(): void;

	/** Высвобождаем элемент в пуле по его номеру */
	release(iHandle: int): void;
	/*
	 * даление всех групп
 		 * Все группы должны быть пусты, иначе во время удаления произойдет ошибка
	 **/
	clear(): void;
	/** Добавляет новый элемент в пул */
	add(pMembers: AIResourcePoolItem): int;
	
	/** Цикл по всем объектам с приминением к ним функции, как fFunction(текущий пул данных, объект к торому применяется); */
	forEach(fFunction: (pPool: AIDataPool, iHandle: int, pMember: AIResourcePoolItem) => void): void;
	
	/** Ищет первый свободный элемент в пуле */
	nextHandle(): int;
	/** Проверяется используется лм этот элемент */
	isHandleValid(iHandle: int): boolean;

	/** Возвратитть элемент по хендлу */
	get(iHandle: int): AIResourcePoolItem;
	/** Возвратитть элемент по хендлу */
	getPtr(iHandle: int): AIResourcePoolItem;
	/** Возвратитть элемент по хендлу */
	getGenericPtr(iHandle: int): AIResourcePoolItem;
}