var gamepadSupport = {
    TYPICAL_BUTTON_COUNT: 16,
    TYPICAL_AXIS_COUNT: 4,
    ticking: false,
    gamepads: [],
    prevRawGamepadTypes: [],
    prevTimestamps: [],
    init: function () {
        var gamepadSupportAvailable = !! navigator.webkitGetGamepads || !! navigator.webkitGamepads || (navigator.userAgent.indexOf('Firefox/') != -1);
        if (!gamepadSupportAvailable) {
            tester.showNotSupported();
        } else {
            window.addEventListener('MozGamepadConnected', gamepadSupport.onGamepadConnect, false);
            window.addEventListener('MozGamepadDisconnected', gamepadSupport.onGamepadDisconnect, false);
            if ( !! navigator.webkitGamepads || !! navigator.webkitGetGamepads) {
                gamepadSupport.startPolling();
            }
        }
    },
    onGamepadConnect: function (event) {
        gamepadSupport.gamepads.push(event.gamepad);
        tester.updateGamepads(gamepadSupport.gamepads);
        gamepadSupport.startPolling();
    },
    onGamepadDisconnect: function (event) {
        for (var i in gamepadSupport.gamepads) {
            if (gamepadSupport.gamepads[i].index == event.gamepad.index) {
                gamepadSupport.gamepads.splice(i, 1);
                break;
            }
        }
        if (gamepadSupport.gamepads.length == 0) {
            gamepadSupport.stopPolling();
        }
        tester.updateGamepads(gamepadSupport.gamepads);
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
            gamepadSupport.updateDisplay(i);
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
                }
                if (rawGamepads[i]) {
                    gamepadSupport.gamepads.push(rawGamepads[i]);
                }
            }
            if (gamepadsChanged) {
                tester.updateGamepads(gamepadSupport.gamepads);
            }
        }
    },
    updateDisplay: function (gamepadId) {
        var gamepad = gamepadSupport.gamepads[gamepadId];
        tester.updateButton(gamepad.buttons[0], gamepadId, 'button-1');
        tester.updateButton(gamepad.buttons[1], gamepadId, 'button-2');
        tester.updateButton(gamepad.buttons[2], gamepadId, 'button-3');
        tester.updateButton(gamepad.buttons[3], gamepadId, 'button-4');
        tester.updateButton(gamepad.buttons[4], gamepadId, 'button-left-shoulder-top');
        tester.updateButton(gamepad.buttons[6], gamepadId, 'button-left-shoulder-bottom');
        tester.updateButton(gamepad.buttons[5], gamepadId, 'button-right-shoulder-top');
        tester.updateButton(gamepad.buttons[7], gamepadId, 'button-right-shoulder-bottom');
        tester.updateButton(gamepad.buttons[8], gamepadId, 'button-select');
        tester.updateButton(gamepad.buttons[9], gamepadId, 'button-start');
        tester.updateButton(gamepad.buttons[10], gamepadId, 'stick-1');
        tester.updateButton(gamepad.buttons[11], gamepadId, 'stick-2');
        tester.updateButton(gamepad.buttons[12], gamepadId, 'button-dpad-top');
        tester.updateButton(gamepad.buttons[13], gamepadId, 'button-dpad-bottom');
        tester.updateButton(gamepad.buttons[14], gamepadId, 'button-dpad-left');
        tester.updateButton(gamepad.buttons[15], gamepadId, 'button-dpad-right');
        tester.updateAxis(gamepad.axes[0], gamepadId, 'stick-1-axis-x', 'stick-1', true);
        tester.updateAxis(gamepad.axes[1], gamepadId, 'stick-1-axis-y', 'stick-1', false);
        tester.updateAxis(gamepad.axes[2], gamepadId, 'stick-2-axis-x', 'stick-2', true);
        tester.updateAxis(gamepad.axes[3], gamepadId, 'stick-2-axis-y', 'stick-2', false);
        var extraButtonId = gamepadSupport.TYPICAL_BUTTON_COUNT;
        while (typeof gamepad.buttons[extraButtonId] != 'undefined') {
            tester.updateButton(gamepad.buttons[extraButtonId], gamepadId, 'extra-button-' + extraButtonId);
            extraButtonId++;
        }
        var extraAxisId = gamepadSupport.TYPICAL_AXIS_COUNT;
        while (typeof gamepad.axes[extraAxisId] != 'undefined') {
            tester.updateAxis(gamepad.axes[extraAxisId], gamepadId, 'extra-axis-' + extraAxisId);
            extraAxisId++;
        }
    }
};