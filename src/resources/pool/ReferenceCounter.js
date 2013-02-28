/**
 * @file
 * @brief ReferenceCounter class.
 * @author xoma
 * @email xoma@odserve.org
 * Базовый класс который позволяет считать сслыки на объект
 * Пример:
 * var b=new a.ReferenceCounter();
 * b.addRef();
 * b.release();
 * if(b.referenceCount()==0)
 *         delete b;
 **/


/**
 * @property ReferenceCounter()
 * Конструктор =). Выстанавливает чило ссылок  на объект в ноль
 * @memberof ReferenceCounter
 **/
/**
 * @property ReferenceCounter(ReferenceCounter pSrc)
 * Конструктор =). Выстанавливает чило ссылок  на объект в ноль
 * количесвто ссылок привязаны к конкретному экземпляру, поэтому никогда не копируются
 * @param pSrc
 * @memberof ReferenceCounter
 **/
/**
 * ReferenceCounter Class
 * @ctor
 * Constructor of ReferenceCounter class
 **/
function ReferenceCounter () {
    /**
     * Число ссылок  на объект
     * @type Int
     * @memberof ReferenceCounter
     **/
    this._nReferenceCount = 0;
}
/**
 * @property destructor()
 * Предупреждает если объект еще используется
 * @memberof ReferenceCounter
 **/
/**
 * ReferenceCounter Class
 * @dtor
 * Destructor of ReferenceCounter class
 **/
ReferenceCounter.prototype.destructor = function () {
    // Предупреждение если данный объект еще используется
    assert(this._nReferenceCount == 0);
}

/**
 * @property addRef()
 * Добаволение ссылки  на объект, увеличивает внутренний счетчки на 1,
 * проверяет не достигнуто ли максимальное количесвто
 * @memberof ReferenceCounter
 * @return Int Текущее количесвто открытых объектов
 **/
ReferenceCounter.prototype.addRef = function () {
    assert(this._nReferenceCount != Number.MAX_VALUE, 'reference fail :(');
    this._nReferenceCount++;
    return this._nReferenceCount;
}

/**
 * @property release()
 * Уведомление об удалении ссылки  на объект, уменьшает внутренний счетчки на 1,
 * проверяет есть ли ее объекты
 * @memberof ReferenceCounter
 * @return Int Текущее количесвто открытых объектов
 **/
ReferenceCounter.prototype.release = function () {
    assert(this._nReferenceCount > 0);
    this._nReferenceCount--;
    return this._nReferenceCount;
}
/**
 * @property referenceCount()
 * Текущее количесвто ссылок  на объект
 * @memberof ReferenceCounter
 * @return Int Текущее количесвто ссылок  на объект
 **/
ReferenceCounter.prototype.referenceCount = function () {
    return this._nReferenceCount;
}

/**
 * @Operator =
 * Данная функция нужна чтобы обеспечить наследникам ее возможность,
 * само количестdо ссылок не копируется
 * @memberof ReferenceCounter
 * @return ReferenceCounter* текущий объект
 **/
ReferenceCounter.prototype.eq = function (pSrc) {
    return this;
};

a.ReferenceCounter = ReferenceCounter;
