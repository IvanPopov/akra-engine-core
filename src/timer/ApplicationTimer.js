/**
 * @file
 * @brief ApplicationTimer class.
 * @author xoma
 * @email xoma@odserve.org
 * Файл класса с таймером описывающим и создающим глобальный таймер прилижения
 **/

/**
 * @property ApplicationTimer()
 * Конструктор класса ApplicationTimer
 * @memberof ApplicationTimer
 **/
/**
 * ApplicationTimer Class
 * @ctor
 * Constructor of ApplicationTimer class
 **/
function ApplicationTimer () {
    //Наследорвание от класса Timer;
    ApplicationTimer.superclass.constructor.apply(this, arguments);
}
;

//Наследорвание от класса Timer;
a.extend(ApplicationTimer, a.Timer);


/**
 * @property start()
 * Старт таймера
 * @memberof ApplicationTimer
 **/
ApplicationTimer.prototype.start = function () {
    ApplicationTimer.superclass.start.apply(this, arguments);
};

/**
 * @property stop()
 * Остановка таймера
 * @memberof ApplicationTimer
 **/
ApplicationTimer.prototype.stop = function () {
    ApplicationTimer.superclass.stop.apply(this, arguments);
};


//Занесение типа в глобальну зону вилимости
a.ApplicationTimer = ApplicationTimer;

//Создание глобального таймера
pApplicationTimer = new a.ApplicationTimer();
a.pApplicationTimer = pApplicationTimer;
