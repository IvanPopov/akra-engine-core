/**
 * @file
 * @brief CodeTimer and FunctionTimer class.
 * @author xoma
 * @email xoma@odserve.org
 * Два таймера первый, служит для нескольких замеров и сбора по ним статистики,
 * Второй служит оболочкой для первого для его запуска и остановки, просто как создание и удаление объекта этого типа
 * Пример:
 *var a={};
 *Include("/svn/core/branches/xoma/CodeTimer.js");
 *a.pApplicationTimer.start();
 *pCodeTimer1= new a.CodeTimer("1");
 *pCodeTimer= new a.CodeTimer("2");
 *
 *alert(pCodeTimer.totalCalls());
 *for(i=0;i<5;i++)
 *{
 *  pFuncTimer = new a.FunctionTimer(pCodeTimer);
 *  alert("Pause");
 *  pFuncTimer.destructor();
 *  alert("Count:"+pCodeTimer.totalCalls()+
 *        "\n Time:"+ pCodeTimer.totalTime()+
 *        "\n Min:"+ pCodeTimer.minimumTimeSample()+
 *       "\n Max:"+ pCodeTimer.maximumTimeSample());
 *}
 *
 **/

/**
 * @property CodeTimer(String sNameString)
 * Конструктор класса CodeTimer, Создается новый тамер с переданным именем, ввязывается в двух-связный список
 * @param sNameString Имя таймера
 * @memberof CodeTimer
 **/
/**
 * CodeTimer Class
 * @ctor
 * Constructor of CodeTimer class
 **/

function CodeTimer (sNameString) {
    /**
     * Следующий таймер в цепочке
     * @type CodeTimer*
     * @memberof CodeTimer
     **/
    this._pNextProfile = null;
    /**
     * Предыдущий таймер в цепочке
     * @type CodeTimer*
     * @memberof CodeTimer
     **/
    this._pLastProfile = this._pPreviousTimer;
    /**
     * Суммарное время замеров таймера
     * @type Float
     * @memberof CodeTimer
     **/
    this._fTotalTime = 0.0;
    /**
     * Количесвто замеров
     * @type Int
     * @memberof CodeTimer
     **/
    this._iTotalCalls = 0;

    /**
     * Максимальное время одного замера
     * @type Float
     * @memberof CodeTimer
     **/
    this._fMaximumTimeSample = 0;
    /**
     * Минимальное время одного замера
     * @type Float
     * @memberof CodeTimer
     **/
    this._fMinimumTimeSample = MAX_REAL32;
    /**
     * Время начала замера
     * @type Float
     * @memberof CodeTimer
     **/
    this._fStartTime = 0;

    debug_assert(sNameString, "A name must be provided to the code timer");

    /**
     * Имя таймера
     * @type String
     * @memberof CodeTimer
     **/
    this._sName = sNameString;

    if (this._pPreviousTimer != null) {
        this._pPreviousTimer._pNextProfile = this;
    }

    this._pPreviousTimer = this;
}
;

/**
 * Указатель на корневой таймер, создается в момент инициализации приложения
 * @type CodeTimer
 * @memberof CodeTimer
 **/
CodeTimer.prototype.pRootTimer = new CodeTimer("_ROOT_");

/**
 * Указатель на последний созданный таймер
 * @type CodeTimer
 * @memberof CodeTimer
 **/
CodeTimer.prototype._pPreviousTimer = null;

/**
 * @property averageTime()
 * Возвращает среднее время замеров таймера
 * @memberof CodeTimer
 * @return Float среднее время замеров таймера
 **/
CodeTimer.prototype.averageTime = function () {
    if (this._iTotalCalls != 0) {
        return this._fTotalTime / this._iTotalCalls;
    }
    return 0.0;
};

/**
 * @property totalTime()
 * Возвращает суммарное время замеров таймера
 * @memberof CodeTimer
 * @return Int суммарное время замеров таймера
 **/
CodeTimer.prototype.totalTime = function () {
    return this._fTotalTime;
};

/**
 * @property totalCalls()
 * Возвращает количесвто замеров таймером
 * @memberof CodeTimer
 * @return Int количесвто замеров таймером
 **/
CodeTimer.prototype.totalCalls = function () {
    return this._iTotalCalls;
};

/**
 * @property maximumTimeSample()
 * Возвращает максимальное время замера
 * @memberof CodeTimer
 * @return Float максимальное время замера
 **/
CodeTimer.prototype.maximumTimeSample = function () {
    return this._fMaximumTimeSample;
};

/**
 * @property minimumTimeSample()
 * Возвращает минимальное время замера
 * @memberof CodeTimer
 * @return Float минимальное время замера
 *
 **/
CodeTimer.prototype.minimumTimeSample = function () {
    return this._fMinimumTimeSample;
};

/**
 * @property name()
 * Возвращает имя таймера
 * @memberof CodeTimer
 * @return String имя таймера
 **/
CodeTimer.prototype.name = function () {
    return this._sName;
};

/**
 * @property beginSession()
 * Запускает очерезной замер
 * @memberof CodeTimer
 **/
CodeTimer.prototype.beginSession = function () {
    this._iTotalCalls++;
    if (this._fStartTime == 0) {
        this._fStartTime = a.pApplicationTimer.elapsedTime();
    }
};

/**
 * @property beginSession()
 * Завершает очерезной замер, сохраняя и ожновляя статистку по замерам
 * @memberof CodeTimer
 **/
CodeTimer.prototype.endSession = function () {
    if (this._fStartTime != 0) {
        var fEndTime = a.pApplicationTimer.elapsedTime();

        debug_assert(fEndTime >= this._fStartTime, "we moved backwards in time!!!?");

        var fSample = fEndTime - this._fStartTime;
        this._fTotalTime += fSample;

        this._fMaximumTimeSample = Math.max(this._fMaximumTimeSample, fSample);
        this._fMinimumTimeSample = Math.min(this._fMinimumTimeSample, fSample);
    }
    this._fStartTime = 0.0;
};

/**
 * @property reset()
 * Сброс статистики таймера
 * @memberof CodeTimer
 **/
CodeTimer.prototype.reset = function () {
    this._fTotalTime = 0.0;
    this._iTotalCalls = 0;
    this._fMaximumTimeSample = 0;
    this._fMinimumTimeSample = MAX_REAL32;
    this._fStartTime = 0;
};

/**
 * @property output()
 * Вывод статистики таймера
 * @memberof CodeTimer
 **/
CodeTimer.prototype.output = function () {
    debug_assert(this._sName, this._fTotalTime, this._iTotalCalls,
                 this._iTotalCalls != 0 ? this._fTotalTime / this._iTotalCalls : 0.0,
                 this._fMinimumTimeSample, this._fMaximumTimeSample);
    this.reset();
};

/**
 * @property outputAllTimers()
 * Вывод статистики всех вышележащих таймеров
 * @memberof CodeTimer
 * @param iMessageFlags __DESCRIPTION__
 **/
CodeTimer.prototype.outputAllTimers = function (iMessageFlags) {
    this.output(iMessageFlags);
    if (this._pNextProfile != null) {
        this._pNextProfile.outputAllTimers(iMessageFlags);
    }

};

/**
 * @property resetAllTimers()
 * Сброс статистики всех вышедежащих таймеров
 * @memberof CodeTimer
 **/
CodeTimer.prototype.resetAllTimers = function () {
    this.reset();
    if (this._pNextProfile != null) {
        this._pNextProfile.resetAllTimers();
    }
};

a.CodeTimer = CodeTimer;

/**
 * @property FunctionTimer(CodeTimer* pTimer)
 * Конструктор класса FunctionTimer
 * @param pTimer __COMMENT__
 * @memberof FunctionTimer
 **/
/**
 * FunctionTimer Class
 * @ctor
 * Constructor of FunctionTimer class
 **/

function FunctionTimer (pTimer) {
    /**
     * __COMMENT__
     * @type CodeTimer*
     * @memberof FunctionTimer
     **/
    this._pInternalTimerLink = pTimer;
    debug_assert(this._pInternalTimerLink, "A timer link must be provided");
    this._pInternalTimerLink.beginSession();

}

/**
 * @property destructor()
 * Деструктор класса FunctionTimer
 * @memberof FunctionTimer
 **/
/**
 * FunctionTimer Class
 * @dtor
 * Destructor of FunctionTimer class
 **/
FunctionTimer.prototype.destructor = function () {
    this._pInternalTimerLink.endSession();
}


a.FunctionTimer = FunctionTimer;














