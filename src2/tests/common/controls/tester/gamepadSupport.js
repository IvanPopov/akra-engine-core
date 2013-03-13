var gamepadSupport = {
    TYPICAL_BUTTON_COUNT: 16,
    TYPICAL_AXIS_COUNT: 4,
    ticking: false,
    gamepads: [],
    prevRawGamepadTypes: [],
    prevTimestamps: [],
    callbacks: {
        connect: function (gamepad) {
            console.log('connected gamepad: ', gamepad);
        },
        disconnect: function (gamepad) {
            console.log('disconnected gamepad: ', gamepad);   
        },
        update: function (gamepad) {
            console.log('gamepad updated: ', gamepad);
        }
    },

    on: function (event, callback) {
        gamepadSupport.callbacks[event] = callback;
    },

    init: function () {
        var gamepadSupportAvailable = !! navigator.webkitGetGamepads || !! navigator.webkitGamepads || (navigator.userAgent.indexOf('Firefox/') != -1);
        
        if (!gamepadSupportAvailable) {
            //todo: not supported...
        } else {
            window.addEventListener('MozGamepadConnected', gamepadSupport.onGamepadConnect, false);
            window.addEventListener('MozGamepadDisconnected', gamepadSupport.onGamepadDisconnect, false);
            
            if ( !! navigator.webkitGamepads || !! navigator.webkitGetGamepads) {
                gamepadSupport.startPolling();
                return true;
            }
        }

        return false;
    },
    onGamepadConnect: function (event) {
        gamepadSupport.gamepads.push(event.gamepad);
        gamepadSupport.callbacks.connect(event.gamepad);
        gamepadSupport.startPolling();
    },
    onGamepadDisconnect: function (event) {
        var gamepad;
        for (var i in gamepadSupport.gamepads) {
            if (gamepadSupport.gamepads[i].index == event.gamepad.index) {
                gamepad = gamepadSupport.gamepads.splice(i, 1)[0];
                gamepadSupport.callbacks.disconnect(gamepad);
                break;
            }
        }

        if (gamepadSupport.gamepads.length == 0) {
            gamepadSupport.stopPolling();
        }
    },
    startPolling: function () {
        if (!gamepadSupport.ticking) {
            gamepadSupport.ticking = true;
            gamepadSupport.tick();
        }
    },
    stopPolling: function () {
        gamepadSupport.ticking = false;
    },
    tick: function () {
        gamepadSupport.pollStatus();
        gamepadSupport.scheduleNextTick();
    },
    scheduleNextTick: function () {
        if (gamepadSupport.ticking) {
            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(gamepadSupport.tick);
            } else if (window.mozRequestAnimationFrame) {
                window.mozRequestAnimationFrame(gamepadSupport.tick);
            } else if (window.webkitRequestAnimationFrame) {
                window.webkitRequestAnimationFrame(gamepadSupport.tick);
            }
        }
    },
    pollStatus: function () {
        gamepadSupport.pollGamepads();
        for (var i in gamepadSupport.gamepads) {
            var gamepad = gamepadSupport.gamepads[i];
            if (gamepad.timestamp && (gamepad.timestamp == gamepadSupport.prevTimestamps[i])) {
                continue;
            }
            gamepadSupport.prevTimestamps[i] = gamepad.timestamp;
        }
    },
    pollGamepads: function () {
        var rawGamepads = (navigator.webkitGetGamepads && navigator.webkitGetGamepads()) || navigator.webkitGamepads;
        if (rawGamepads) {
            gamepadSupport.gamepads = [];
            var gamepadsChanged = false;
            for (var i = 0; i < rawGamepads.length; i++) {
                if (typeof rawGamepads[i] != gamepadSupport.prevRawGamepadTypes[i]) {
                    gamepadsChanged = true;
                    gamepadSupport.prevRawGamepadTypes[i] = typeof rawGamepads[i];
                    if (rawGamepads[i]) {
                        gamepadSupport.callbacks.update(rawGamepads[i]);
                    }
                }
                if (rawGamepads[i]) {
                    gamepadSupport.gamepads.push(rawGamepads[i]);
                }
            }
            if (gamepadsChanged) {
                //todo: gamepads changed...
            }
        }
    }
};