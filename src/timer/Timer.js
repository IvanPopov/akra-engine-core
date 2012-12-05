/**
 * @file
 * @brief Timer class.
 * @author xoma
 * @email xoma@odserve.org
 * Файл класса с таймером
 * Пример:
 *     var timer = new a.Timer;
 *     timer.start();
 *     timer.suspend();
 *     alert("Произвольная пауза, которая не учтеться");
 *     timer.resume();
 *     window.setTimeout(function()
 *        {
 *            timer.stop();
 *            alert(timer.elapsedSeconds()) //вывод того, сколько секунд прошло с момента старта таймера до его остановки
 *        }
 *        , 1000); //Пауза в 1 секунду
 **/

/**
 * @enum TIMER_STATE
 * Состояния тамера
 * @memberof Timer
 **/
Enum([OFF = 0, ON, HOLD], TIMER_STATE, a.Timer);
/**
 * @property Timer()
 * Конструктор класса Timer
 * @memberof Timer
 **/
/**
 * Timer Class
 * @ctor
 * Constructor of Timer class
 **/
function Timer () {
    /**
     * Время старта таймера
     * @type Int
     * @memberof Timer
     **/
    this._iStartTime = 0;
    /**
     * Время остановки таймера
     * @type Int
     * @memberof Timer
     **/
    this._iStopTime = 0;
    /**
     * Время прошедшее от старта до остановки таймера
     * @type Int
     * @memberof Timer
     **/
    this._iTimeDelta = 0;
    /**
     * Количество прошедших делений
     * @type Int
     * @memberof Timer
     **/
    this._iElapsedCount = 0;
    /**
     * Состояние таймера
     * @type Enumeration
     * @memberof Timer
     **/
    this._eState = a.Timer.OFF;


    this._setupTimerFrequency();
}
;

/**
 * Количество делений таймера в секунду
 * @type Int
 * @memberof Timer
 **/
Timer.prototype._iSecondsFrequency = 0;

/**
 * Количество делений таймера в миллисекунду
 * @type Int
 * @memberof Timer
 **/
Timer.prototype._iMillisecondsFrequency = 0;

/**
 * Количесвто секунд в делении таймера
 * @type Float
 * @memberof Timer
 **/
Timer.prototype._fInvSecFrequency = 0;


/**
 * @property start()
 * Старт таймера
 * @memberof Timer
 **/
Timer.prototype.start = function () {
    this._iStartTime = this._samplePerformanceCounter();
    this._iElapsedCount = 0;
    this._eState = a.Timer.ON;
};


/**
 * @property stop()
 * Остановка таймера
 * @memberof Timer
 **/
Timer.prototype.stop = function () {
    this._iElapsedCount = this.elapsedCount();
    this._eState = a.Timer.OFF;
};


/**
 * @property suspend()
 * Введение таймера в сон
 * @memberof Timer
 **/
Timer.prototype.suspend = function () {
    if (this._eState == a.Timer.ON) {
        this._iElapsedCount = this.elapsedCount();
        this._eState = a.Timer.HOLD;
    }
};


/**
 * @property suspend()
 * Возвращение таймер из сна
 * @memberof Timer
 **/
Timer.prototype.resume = function () {
    if (this._eState == a.Timer.HOLD) {
        // get the current time
        this._iStartTime = this._samplePerformanceCounter();

        // roll the start time back by our previous delta
        this._iStartTime -= this._iTimeDelta;
        this._iElapsedCount = 0;
        this._eState = a.Timer.ON;
    }
};


/**
 * @property elapsedTime()
 * Количесвто секунд прошедших с момента старта таймера, учитывая время сна
 * @memberof Timer
 * @return float количесвто секунд прошедших с момента старта таймера, учитывая время сна
 **/
Timer.prototype.elapsedTime = function () {
    if (this._eState != a.Timer.ON) {
        return this._iElapsedCount * this._fInvSecFrequency;
    }
    else {
        this._iStopTime = this._samplePerformanceCounter();
        this._iTimeDelta = this._iStopTime - this._iStartTime;
        var fReportedTime = this._iTimeDelta * this._fInvSecFrequency;
        return(fReportedTime);
    }
};

/**
 * @property elapsedSeconds()
 * Количесвто секунд прошедших с момента старта таймера, учитывая время сна
 * @memberof Timer
 * @return Int количесвто секунд прошедших с момента старта таймера, учитывая время сна
 **/
Timer.prototype.elapsedSeconds = function () {
    if (this._eState != a.Timer.ON) {
        return this._iElapsedCount / this._iSecondsFrequency;
    }
    else {
        this._iStopTime = this._samplePerformanceCounter();
        this._iTimeDelta = this._iStopTime - this._iStartTime;
        var iReportedTime = this._iTimeDelta / this._iSecondsFrequency;
        return(iReportedTime);
    }
};


/**
 * @property elapsedMilliseconds()
 * Количесвто миллисекунд прошедших с момента старта таймера, учитывая время сна
 * @memberof Timer
 * @return Int количесвто миллисекунд прошедших с момента старта таймера, учитывая время сна
 **/
Timer.prototype.elapsedMilliseconds = function () {
    if (this._eState != a.Timer.ON) {
        return this._iElapsedCount / this._iMillisecondsFrequency;
    }
    else {
        this._iStopTime = this._samplePerformanceCounter();
        this._iTimeDelta = this._iStopTime - this._iStartTime;
        var iReportedTime = this._iTimeDelta / this._iMillisecondsFrequency;
        return(iReportedTime);
    }
};


/**
 * @property elapsedCount()
 * Количесвто интервалов прошедших с момента старта таймера, учитывая время сна
 * @memberof Timer
 * @return Int количесвто интервалов прошедших с момента старта таймера, учитывая время сна
 **/
Timer.prototype.elapsedCount = function () {
    if (this._eState != a.Timer.ON) {
        return this._iElapsedCount;
    }
    else {
        this._iStopTime = this._samplePerformanceCounter();
        this._iTimeDelta = this._iStopTime - this._iStartTime;
        var iReportedTime = this._iTimeDelta;
        return(iReportedTime);
    }
};

/**
 * @property _setupTimerFrequency()
 * Выставляет настройки таймера, а иммено количество интервалов таймера в секунду, в миллисекунду, количество секунд в интервале
 * @memberof Timer
 **/
Timer.prototype._setupTimerFrequency = function () {
    if (!this._iSecondsFrequency) {
        //Мы так точно определять не можем,
        //в лучшем случае с точностью до миллисекунды
        //Поэтому частота будет как 1000 тиков в секунду
        this._iSecondsFrequency = 1000;
        this._iMillisecondsFrequency = this._iSecondsFrequency / 1000;
        this._fInvSecFrequency = 1.0 / this._iSecondsFrequency;
    }
};

/**
 * @property _samplePerformanceCounter()
 * Возвращает количестов системных интервалов, прошедших с определенного в системе времени
 * @return Int текущее количестов системных интервалов, прошедших с определенного в системе времени
 **/
Timer.prototype._samplePerformanceCounter = function () {
    return (new Date()).getTime();
};

a.Timer = Timer;




