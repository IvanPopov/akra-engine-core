/**
 * @file
 * @brief Keymap class.
 * @author Konstantin Molodyakov
 * @email <xoma@odserve.org>
 * Класс Keymap.
 **/

/**
 * Класс для работы с нажатыми клавишами.
 * @ctor
 * @tparam Object Объект для прослушивания.
 * @note Как правило в качестве объекта прослушивания применяется document.
 */
function Keymap (pMouseTarget, pKeyboardTarget) {
    'use strict';
    
    pKeyboardTarget = pKeyboardTarget || pMouseTarget;

    this.pMap = new Array(256);
    this.isAlt = false;
    this.isCtrl = false;
    this.isShift = false;
    this.isMouseDown = false;
    this.v2iMousePos = new Int16Array(2);
    this.v2iMouseLastPos = new Int16Array(2);

    for (var i = 255; i--;) {
        this.pMap[i] = false;
    };

    Enum([
             BACKSPACE = 8,
             TAB = 9,
             ENTER = 13,
             SHIFT = 16, CTRL, ALT,
             PAUSE = 19, BREAK = 19,
             CAPSLOCK = 20,
             ESCAPE = 27,
             SPACE = 32,
             PAGEUP = 33, PAGEDOWN,
             END = 35, HOME,
             LEFT = 37, UP, RIGHT, DOWN,
             INSERT = 45, DELETE,
             N0 = 48, N1, N2, N3, N4, N5, N6, N7, N8, N9,
             A = 65, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z,
             LEFTWINDOWKEY = 91, RIGHTWINDOWKEY, SELECTKEY,
             NUMPAD0 = 96, NUMPAD1, NUMPAD2, NUMPAD3, NUMPAD4, NUMPAD5, NUMPAD6, NUMPAD7, NUMPAD8, NUMPAD9,
             MULTIPLY = 106, ADD, SUBTRACT = 109, DECIMALPOINT, DIVIDE,
             F1 = 112, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12,
             NUMLOCK = 144, SCROLLLOCK,
             SEMICOLON = 186, EQUALSIGN, COMMA, DASH, PERIOD, FORWARDSLASH, GRAVEACCENT,
             OPENBRACKET = 219, BACKSLASH, CLOSEBRACKET, SINGLEQUOTE
         ], KEY_CODES, a.KEY);

    if (pMouseTarget) {
        this.setTarget(pMouseTarget, pKeyboardTarget);
    }
}

Keymap.prototype.setTarget = function (pMouseTarget, pKeyboardTarget) {
    'use strict';
    
    pKeyboardTarget = pKeyboardTarget || pMouseTarget;

    var me = this;
    var fnCallback = function (e) {
        me.dispatch(e);
    };

    if (pMouseTarget.addEventListener) {
        pKeyboardTarget.addEventListener("keydown", fnCallback, false);
        pKeyboardTarget.addEventListener("keyup", fnCallback, false);
        pMouseTarget.addEventListener("mousemove", fnCallback, true);
        pMouseTarget.addEventListener("mouseup", fnCallback, true);
        pMouseTarget.addEventListener("mousedown", fnCallback, true);
    }
    else if (pMouseTarget.attachEvent) {
        pKeyboardTarget.attachEvent("onkeydown", fnCallback);
        pKeyboardTarget.attachEvent("onkeyup", fnCallback);
        pMouseTarget.attachEvent("onmousemove", fnCallback);
        pMouseTarget.attachEvent("onmouseup", fnCallback);
        pMouseTarget.attachEvent("onmousedown", fnCallback);
    }
    else {
        pKeyboardTarget.onkeydown = pKeyboardTarget.onkeyup = fnCallback;
        pMouseTarget.onmousemove = pMouseTarget.onmouseup = pMouseTarget.onmousedown = fnCallback;
    }
};

/**
 * Функция, вызываемая на измеение состояния клавиш.
 * @tparam Object pEvent Событие.
 */
Keymap.prototype.dispatch = function (pEvent) {
    var e = pEvent || window.event;

    var code = e.keyCode;

    //console.log(code);

    if (e.type == "keydown") {
        //console.log("keydown",code);
        this.pMap[code] = true;

        if (e.altKey) {
            this.isAlt = true;
        }
        if (e.ctrlKey) {
            this.isCtrl = true;
        }
        if (e.shiftKey) {
            this.isShift = true;
        }
        if (e.altKey || e.ctrlKey || e.shiftKey) {
            this.pMap.splice(0);
        }
    }
    else if (e.type == "keyup") {
        //console.log("onkeyup",code);
        this.pMap[code] = false;
        if(code == a.KEY.ALT){
            this.isAlt = false;
        }
        if(code == a.KEY.CTRL){
            this.isCtrl = false;
        }
        if(code == a.KEY.SHIFT){
            this.isShift = false;
        }
    }

    if (e.type == "mousemove") {
        this.v2iMousePos.X = e.pageX;
        this.v2iMousePos.Y = e.pageY;
    }
    else if (e.type == "mouseup") {
        this.isMouseDown = false;
    }
    else if (e.type == "mousedown") {
        this.isMouseDown = true;
    }
    /*if (e.stopPropagation)
     e.stopPropagation(); // Модель DOM
     else
     e.cancelBubble = true; // Модель IE
     if (e.preventDefault)
     e.preventDefault(); // DOM
     else
     e.returnValue = false; // IE
     return false; // Ранняя модель событий*/
};

/**
 * Функция для проверки нажата ли клавиша.
 * @tparam Int iCode Код клавишы.
 */
Keymap.prototype.isKeyPress = function (iCode) {
    return this.pMap[iCode];
};

Keymap.prototype.mouseSnapshot = function () {
    this.v2iMouseLastPos.X = this.v2iMousePos.X;
    this.v2iMouseLastPos.Y = this.v2iMousePos.Y;
    return this.v2iMousePos;
};

Keymap.prototype.isMouseMoved = function () {
    return this.v2iMouseLastPos.X != this.v2iMousePos.X || this.v2iMouseLastPos.Y != this.v2iMousePos.Y;
};
Keymap.prototype.mouseShitfX = function () {
    return this.v2iMousePos.X - this.v2iMouseLastPos.X
};
Keymap.prototype.mouseShitfY = function () {
    return this.v2iMousePos.Y - this.v2iMouseLastPos.Y
};
Keymap.prototype.isMousePress = function () {
    return this.isMouseDown
};

a.Keymap = Keymap;


Enum([
    FACE_1 = 0, // Face (main) buttons
    FACE_2 = 1,
    FACE_3 = 2,
    FACE_4 = 3,
    LEFT_SHOULDER = 4, // Top shoulder buttons
    RIGHT_SHOULDER = 5,
    LEFT_SHOULDER_BOTTOM = 6, // Bottom shoulder buttons
    RIGHT_SHOULDER_BOTTOM = 7,
    SELECT = 8,
    START = 9,
    LEFT_ANALOGUE_STICK = 10, // Analogue sticks (if depressible)
    RIGHT_ANALOGUE_STICK = 11,
    PAD_TOP = 12, // Directional (discrete) pad
    PAD_BOTTOM = 13,
    PAD_LEFT = 14,
    PAD_RIGHT = 15
 ], GAMEPAD_CODES, a.KEY);

Enum([
    LEFT_ANALOGUE_HOR = 0,
    LEFT_ANALOGUE_VERT = 1,
    RIGHT_ANALOGUE_HOR = 2,
    RIGHT_ANALOGUE_VERT = 3
    ], GAMEPAD_AXIS, a.AXIS);

var Gamepad = {
    TYPICAL_BUTTON_COUNT: 16,
    TYPICAL_AXIS_COUNT: 4,
    ticking: false,
    collection: [],
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
        Gamepad.callbacks[event] = callback;
    },

    init: function () {
        var gamepadSupportAvailable = !! navigator.webkitGetGamepads || !! navigator.webkitGamepads || (navigator.userAgent.indexOf('Firefox/') != -1);
        
        if (!gamepadSupportAvailable) {
            //todo: not supported...
        } else {
            window.addEventListener('MozGamepadConnected', Gamepad.onGamepadConnect, false);
            window.addEventListener('MozGamepadDisconnected', Gamepad.onGamepadDisconnect, false);
            
            if ( !! navigator.webkitGamepads || !! navigator.webkitGetGamepads) {
                Gamepad.startPolling();
                return true;
            }
        }

        return false;
    },
    onGamepadConnect: function (event) {
        Gamepad.collection.push(event.gamepad);
        Gamepad.callbacks.connect(event.gamepad);
        Gamepad.startPolling();
    },
    onGamepadDisconnect: function (event) {
        var gamepad;
        for (var i in Gamepad.collection) {
            if (Gamepad.collection[i].index == event.gamepad.index) {
                gamepad = Gamepad.collection.splice(i, 1)[0];
                Gamepad.callbacks.disconnect(gamepad);
                break;
            }
        }

        if (Gamepad.collection.length == 0) {
            Gamepad.stopPolling();
        }
    },
    startPolling: function () {
        if (!Gamepad.ticking) {
            Gamepad.ticking = true;
            Gamepad.tick();
        }
    },
    stopPolling: function () {
        Gamepad.ticking = false;
    },
    tick: function () {
        Gamepad.pollStatus();
        Gamepad.scheduleNextTick();
    },
    scheduleNextTick: function () {
        if (Gamepad.ticking) {
            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(Gamepad.tick);
            } else if (window.mozRequestAnimationFrame) {
                window.mozRequestAnimationFrame(Gamepad.tick);
            } else if (window.webkitRequestAnimationFrame) {
                window.webkitRequestAnimationFrame(Gamepad.tick);
            }
        }
    },
    pollStatus: function () {
        Gamepad.pollGamepads();
        for (var i in Gamepad.collection) {
            var gamepad = Gamepad.collection[i];
            if (gamepad.timestamp && (gamepad.timestamp == Gamepad.prevTimestamps[i])) {
                continue;
            }
            Gamepad.prevTimestamps[i] = gamepad.timestamp;
        }
    },
    pollGamepads: function () {
        var rawGamepads = (navigator.webkitGetGamepads && navigator.webkitGetGamepads()) || navigator.webkitGamepads;
        if (rawGamepads) {
            Gamepad.collection = [];
            var gamepadsChanged = false;
            for (var i = 0; i < rawGamepads.length; i++) {
                if (typeof rawGamepads[i] != Gamepad.prevRawGamepadTypes[i]) {
                    gamepadsChanged = true;
                    Gamepad.prevRawGamepadTypes[i] = typeof rawGamepads[i];
                    if (rawGamepads[i]) {
                        Gamepad.callbacks.update(rawGamepads[i]);
                    }
                }
                if (rawGamepads[i]) {
                    Gamepad.collection.push(rawGamepads[i]);
                }
            }
            //if (gamepadsChanged) {
                //todo: collection changed...
            //}
        }
    }
};

a.Gamepad = Gamepad;