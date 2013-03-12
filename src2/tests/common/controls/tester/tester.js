var tester = {
    VISIBLE_THRESHOLD: 0.1,
    STICK_OFFSET: 25,
    ANALOGUE_BUTTON_THRESHOLD: .5,
    init: function () {
        tester.updateMode();
        tester.updateGamepads();
    },
    showNotSupported: function () {
        document.querySelector('#no-gamepad-support').classList.add('visible');
    },
    updateMode: function () {
        if (document.querySelector('#mode-raw').checked) {
            document.querySelector('#gamepads').classList.add('raw');
        } else {
            document.querySelector('#gamepads').classList.remove('raw');
        }
    },
    updateGamepads: function (gamepads) {
        var els = document.querySelectorAll('#gamepads > :not(.template)');
        for (var i = 0, el; el = els[i]; i++) {
            el.parentNode.removeChild(el);
        }
        var padsConnected = false;
        if (gamepads) {
            for (var i in gamepads) {
                var gamepad = gamepads[i];
                if (gamepad) {
                    var el = document.createElement('li');
                    el.innerHTML = document.querySelector('#gamepads > .template').innerHTML;
                    el.id = 'gamepad-' + i;
                    el.querySelector('.name').innerHTML = gamepad.id;
                    el.querySelector('.index').innerHTML = gamepad.index;
                    document.querySelector('#gamepads').appendChild(el);
                    var extraButtonId = gamepadSupport.TYPICAL_BUTTON_COUNT;
                    while (typeof gamepad.buttons[extraButtonId] != 'undefined') {
                        var labelEl = document.createElement('label');
                        labelEl.setAttribute('for', 'extra-button-' + extraButtonId);
                        labelEl.setAttribute('description', 'Extra button');
                        labelEl.setAttribute('access', 'buttons[' + extraButtonId + ']');
                        el.querySelector('.extra-inputs').appendChild(labelEl);
                        extraButtonId++;
                    }
                    var extraAxisId = gamepadSupport.TYPICAL_AXIS_COUNT;
                    while (typeof gamepad.axes[extraAxisId] != 'undefined') {
                        var labelEl = document.createElement('label');
                        labelEl.setAttribute('for', 'extra-axis-' + extraAxisId);
                        labelEl.setAttribute('description', 'Extra axis');
                        labelEl.setAttribute('access', 'axes[' + extraAxisId + ']');
                        el.querySelector('.extra-inputs').appendChild(labelEl);
                        extraAxisId++;
                    }
                    padsConnected = true;
                }
            }
        }
        if (padsConnected) {
            document.querySelector('#no-gamepads-connected').classList.remove('visible');
        } else {
            document.querySelector('#no-gamepads-connected').classList.add('visible');
        }
    },
    updateButton: function (value, gamepadId, id) {
        var gamepadEl = document.querySelector('#gamepad-' + gamepadId);
        var buttonEl = gamepadEl.querySelector('[name="' + id + '"]');
        if (buttonEl) {
            if (value > tester.ANALOGUE_BUTTON_THRESHOLD) {
                buttonEl.classList.add('pressed');
            } else {
                buttonEl.classList.remove('pressed');
            }
        }
        var labelEl = gamepadEl.querySelector('label[for="' + id + '"]');
        if (typeof value == 'undefined') {
            labelEl.innerHTML = '?';
        } else {
            labelEl.innerHTML = value.toFixed(2);
            if (value > tester.VISIBLE_THRESHOLD) {
                labelEl.classList.add('visible');
            } else {
                labelEl.classList.remove('visible');
            }
        }
    },
    updateAxis: function (value, gamepadId, labelId, stickId, horizontal) {
        var gamepadEl = document.querySelector('#gamepad-' + gamepadId);
        var stickEl = gamepadEl.querySelector('[name="' + stickId + '"]');
        if (stickEl) {
            var offsetVal = value * tester.STICK_OFFSET;
            if (horizontal) {
                stickEl.style.marginLeft = offsetVal + 'px';
            } else {
                stickEl.style.marginTop = offsetVal + 'px';
            }
        }
        var labelEl = gamepadEl.querySelector('label[for="' + labelId + '"]');
        if (typeof value == 'undefined') {
            labelEl.innerHTML = '?';
        } else {
            labelEl.innerHTML = value.toFixed(2);
            if ((value < -tester.VISIBLE_THRESHOLD) || (value > tester.VISIBLE_THRESHOLD)) {
                labelEl.classList.add('visible');
                if (value > tester.VISIBLE_THRESHOLD) {
                    labelEl.classList.add('positive');
                } else {
                    labelEl.classList.add('negative');
                }
            } else {
                labelEl.classList.remove('visible');
                labelEl.classList.remove('positive');
                labelEl.classList.remove('negative');
            }
        }
    }
};