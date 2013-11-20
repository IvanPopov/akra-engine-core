// AIUtilTimer interface
// [write description here...]
var AEUtilTimerCommands;
(function (AEUtilTimerCommands) {
    //! <to reset the timer
    AEUtilTimerCommands[AEUtilTimerCommands["TIMER_RESET"] = 0] = "TIMER_RESET";

    //! <to start the timer
    AEUtilTimerCommands[AEUtilTimerCommands["TIMER_START"] = 1] = "TIMER_START";

    //! <to stop (or pause) the timer
    AEUtilTimerCommands[AEUtilTimerCommands["TIMER_STOP"] = 2] = "TIMER_STOP";

    //! <to advance the timer by 0.1 seconds
    AEUtilTimerCommands[AEUtilTimerCommands["TIMER_ADVANCE"] = 3] = "TIMER_ADVANCE";

    //! <to get the absolute system time
    AEUtilTimerCommands[AEUtilTimerCommands["TIMER_GET_ABSOLUTE_TIME"] = 4] = "TIMER_GET_ABSOLUTE_TIME";

    //! <to get the current time
    AEUtilTimerCommands[AEUtilTimerCommands["TIMER_GET_APP_TIME"] = 5] = "TIMER_GET_APP_TIME";
    AEUtilTimerCommands[AEUtilTimerCommands["TIMER_GET_ELAPSED_TIME"] = 6] = "TIMER_GET_ELAPSED_TIME";
})(AEUtilTimerCommands || (AEUtilTimerCommands = {}));
//# sourceMappingURL=AIUtilTimer.js.map
