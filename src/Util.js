/**
 * @file
 * @author Konstantin Molodyakov
 * @email <xoma@odserve.org>
 *
 * Вспомогательные функции.
 */

/**enum
 * @enum
 * Команды для вспомогательного таймера(UtilTimer)
 */
Enum([
         TimerReset, //! <to reset the timer
         TimerStart, //! <to start the timer
         TimerStop, //! <to stop (or pause) the timer
         TimerAdvance, //! <to advance the timer by 0.1 seconds
         TimerGetAbsoluteTime, //! <to get the absolute system time
         TimerGetAppTime, //! <to get the current time
         TimerGetElapsedTime
         //! to get the time that elapsed between TIMER_GETELAPSEDTIME calls
     ],
     eTimerCommand, a.UtilTimer)

/**
 * @property UtilTimer(Enumeration eCommand)
 * Функция утилитного таймера
 * @param eCommand Команад таймеру.
 *
 * @treturn Float Зависит от команды.
 **/
a.UtilTimer = function (eCommand) {
    if (a.UtilTimer._isTimerInitialized == false) {
        a.UtilTimer._isTimerInitialized = true;
        a.UtilTimer._fTicksPerSec = 1000;
    }
    var fTime = 0;
    var fElapsedTime = 0;
    var iTime;

    // Get either the current time or the stop time, depending
    // on whether we're stopped and what command was sent
    if (a.UtilTimer._iStopTime != 0 && eCommand != a.UtilTimer.TimerStart && eCommand
        != a.UtilTimer.TimerGetAbsoluteTime) {
        iTime = a.UtilTimer._iStopTime;
    }
    else {
        iTime = (new Date()).getTime();
    }

    // Return the elapsed time
    if (eCommand == a.UtilTimer.TimerGetElapsedTime) {
        fElapsedTime = (iTime - a.UtilTimer._iLastElapsedTime) / a.UtilTimer._fTicksPerSec;
        a.UtilTimer._iLastElapsedTime = iTime;
        return fElapsedTime;
    }

    // Return the current time
    if (eCommand == a.UtilTimer.TimerGetAppTime) {
        var fAppTime = ( iTime - a.UtilTimer._iBaseTime ) / a.UtilTimer._fTicksPerSec;
        return fAppTime;
    }

    // Reset the timer
    if (eCommand == a.UtilTimer.TimerReset) {
        a.UtilTimer._iBaseTime = iTime;
        a.UtilTimer._iLastElapsedTime = iTime;
        a.UtilTimer._iStopTime = 0;
        a.UtilTimer._isTimerStopped = false;
        return 0;
    }

    // Start the timer
    if (eCommand == a.UtilTimer.TimerStart) {
        if (a.UtilTimer._isTimerStopped) {
            a.UtilTimer._iBaseTime += iTime - a.UtilTimer._iStopTime;
        }
        a.UtilTimer._iStopTime = 0;
        a.UtilTimer._iLastElapsedTime = iTime;
        a.UtilTimer._isTimerStopped = false;
        return 0;
    }

    // Stop the timer
    if (eCommand == a.UtilTimer.TimerStop) {
        if (!a.UtilTimer._isTimerStopped) {
            a.UtilTimer._iStopTime = iTime;
            a.UtilTimer._iLastElapsedTime = iTime;
            a.UtilTimer._isTimerStopped = true;
        }
        return 0;
    }

    // Advance the timer by 1/10th second
    if (eCommand == a.UtilTimer.TimerAdvance) {
        a.UtilTimer._iStopTime += a.UtilTimer._fTicksPerSec / 10;
        return 0;
    }

    if (eCommand == a.UtilTimer.TimerGetAbsoluteTime) {
        fTime = iTime / a.UtilTimer._fTicksPerSec;
        return  fTime;
    }

    return -1; // Invalid command specified

}


a.UtilTimer._isTimerInitialized = false;
a.UtilTimer._isTimerStopped = true;
a.UtilTimer._fTicksPerSec = 0;
a.UtilTimer._iStopTime = 0;
a.UtilTimer._iLastElapsedTime = 0;
a.UtilTimer._iBaseTime = 0;
