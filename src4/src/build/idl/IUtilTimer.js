var akra;
(function (akra) {
    (function (EUtilTimerCommands) {
        //! <to reset the timer
        EUtilTimerCommands[EUtilTimerCommands["TIMER_RESET"] = 0] = "TIMER_RESET";

        //! <to start the timer
        EUtilTimerCommands[EUtilTimerCommands["TIMER_START"] = 1] = "TIMER_START";

        //! <to stop (or pause) the timer
        EUtilTimerCommands[EUtilTimerCommands["TIMER_STOP"] = 2] = "TIMER_STOP";

        //! <to advance the timer by 0.1 seconds
        EUtilTimerCommands[EUtilTimerCommands["TIMER_ADVANCE"] = 3] = "TIMER_ADVANCE";

        //! <to get the absolute system time
        EUtilTimerCommands[EUtilTimerCommands["TIMER_GET_ABSOLUTE_TIME"] = 4] = "TIMER_GET_ABSOLUTE_TIME";

        //! <to get the current time
        EUtilTimerCommands[EUtilTimerCommands["TIMER_GET_APP_TIME"] = 5] = "TIMER_GET_APP_TIME";
        EUtilTimerCommands[EUtilTimerCommands["TIMER_GET_ELAPSED_TIME"] = 6] = "TIMER_GET_ELAPSED_TIME";
    })(akra.EUtilTimerCommands || (akra.EUtilTimerCommands = {}));
    var EUtilTimerCommands = akra.EUtilTimerCommands;
})(akra || (akra = {}));
//# sourceMappingURL=IUtilTimer.js.map
