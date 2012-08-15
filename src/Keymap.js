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
