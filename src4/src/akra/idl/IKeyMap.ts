
/// <reference path="IPoint.ts" />
/// <reference path="AIOffset.ts" />

module akra {
	export enum EKeyCodes {
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
		OPENBRACKET = 219, BACKSLASH, CLOSEBRACKET, SINGLEQUOTE,
		TOTAL = 256
	}
	
	export enum EMouseButton {
		UNKNOWN = 0,
		LEFT = 1,
		MIDDLE = 2,
		RIGHT = 3
	}
	
	export interface IKeyMap {
		isKeyPress(iCode: int);
		isKeyPress(eCode: EKeyCodes);
	
		getMouse(): IPoint;
		/*get offset from last frame*/
		getMouseShift(): AIOffset;
		isMouseMoved(): boolean;
		isMousePress(): boolean;
	
		bind(sCombination: string, fn: Function): boolean;
	
		captureMouse(pMouseTarget: Node): void;
		captureMouse(pMouseTarget: Document): void;
		captureKeyboard(pKeyboardTarget: Node): void;
		captureKeyboard(pKeyboardTarget: Document): void;
		capture(pTarget: Node): void;
		capture(pTarget: Document): void;
	
		update(): void;
	}
	
}
