/// <reference path="../../../../built/Lib/akra.d.ts"/>

module akra {
	var pVirtualGamepad: Gamepad = {
		id: "akra virtual gamepad",

		index: -1,
		timestamp: time(),
		axes: [],
		buttons: []
	};

	export function virtualGamepad(pKeymap: IKeyMap): Gamepad {
		var pGamepad: Gamepad = pVirtualGamepad;
		pGamepad.buttons[EGamepadCodes.SELECT] = pKeymap.isKeyPress(EKeyCodes.ENTER);
		pGamepad.buttons[EGamepadCodes.START] = pKeymap.isKeyPress(EKeyCodes.G);

		pGamepad.buttons[EGamepadCodes.PAD_TOP] = pKeymap.isKeyPress(EKeyCodes.UP);
		pGamepad.buttons[EGamepadCodes.PAD_BOTTOM] = pKeymap.isKeyPress(EKeyCodes.DOWN);
		pGamepad.buttons[EGamepadCodes.PAD_LEFT] = pKeymap.isKeyPress(EKeyCodes.LEFT);
		pGamepad.buttons[EGamepadCodes.PAD_RIGHT] = pKeymap.isKeyPress(EKeyCodes.RIGHT);

		pGamepad.buttons[EGamepadCodes.FACE_1] = pKeymap.isKeyPress(EKeyCodes.N5);
		pGamepad.buttons[EGamepadCodes.FACE_2] = pKeymap.isKeyPress(EKeyCodes.N6);
		pGamepad.buttons[EGamepadCodes.FACE_3] = pKeymap.isKeyPress(EKeyCodes.N7);
		pGamepad.buttons[EGamepadCodes.FACE_4] = pKeymap.isKeyPress(EKeyCodes.N8);

		pGamepad.buttons[EGamepadCodes.RIGHT_SHOULDER_BOTTOM] = pKeymap.isKeyPress(EKeyCodes.CTRL) ? 1.0 : 0.0;
		pGamepad.buttons[EGamepadCodes.LEFT_SHOULDER_BOTTOM] = pKeymap.isKeyPress(EKeyCodes.SHIFT) ? 1.0 : 0.0;


		var fX: float = (pKeymap.isKeyPress(EKeyCodes.A) ? -1.0 : 0.0) + (pKeymap.isKeyPress(EKeyCodes.D) ? 1.0 : 0.0);
		var fY: float = (pKeymap.isKeyPress(EKeyCodes.S) ? 1.0 : 0.0) + (pKeymap.isKeyPress(EKeyCodes.W) ? -1.0 : 0.0);

		pGamepad.axes[EGamepadAxis.LEFT_ANALOGUE_VERT] = fY;
		pGamepad.axes[EGamepadAxis.LEFT_ANALOGUE_HOR] = fX;

		fX = (pKeymap.isKeyPress(EKeyCodes.NUMPAD4) ? -1.0 : 0.0) + (pKeymap.isKeyPress(EKeyCodes.NUMPAD6) ? 1.0 : 0.0);
		fY = (pKeymap.isKeyPress(EKeyCodes.NUMPAD5) ? 1.0 : 0.0) + (pKeymap.isKeyPress(EKeyCodes.NUMPAD8) ? -1.0 : 0.0);

		pGamepad.axes[EGamepadAxis.RIGHT_ANALOGUE_VERT] = fY;
		pGamepad.axes[EGamepadAxis.RIGHT_ANALOGUE_HOR] = fX;

		return pGamepad;
	}
}