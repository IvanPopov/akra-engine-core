/// <reference path="../../../../built/Lib/akra.d.ts"/>

module akra {
	var pVirtualGamepad: Gamepad = {
		id: "akra virtual gamepad",

		index: -1,
		timestamp: time(),
		axes: [],
		buttons: []
	};

	pVirtualGamepad.buttons[EGamepadCodes.SELECT] = { pressed: false, value: 0. };
	pVirtualGamepad.buttons[EGamepadCodes.START] = { pressed: false, value: 0. };

	pVirtualGamepad.buttons[EGamepadCodes.PAD_TOP] = { pressed: false, value: 0. };
	pVirtualGamepad.buttons[EGamepadCodes.PAD_BOTTOM] = { pressed: false, value: 0. };
	pVirtualGamepad.buttons[EGamepadCodes.PAD_LEFT] = { pressed: false, value: 0. };
	pVirtualGamepad.buttons[EGamepadCodes.PAD_RIGHT] = { pressed: false, value: 0. };

	pVirtualGamepad.buttons[EGamepadCodes.FACE_1] = { pressed: false, value: 0. };
	pVirtualGamepad.buttons[EGamepadCodes.FACE_2] = { pressed: false, value: 0. };
	pVirtualGamepad.buttons[EGamepadCodes.FACE_3] = { pressed: false, value: 0. };
	pVirtualGamepad.buttons[EGamepadCodes.FACE_4] = { pressed: false, value: 0. };

	pVirtualGamepad.buttons[EGamepadCodes.RIGHT_SHOULDER_BOTTOM] = { pressed: false, value: 0. };
	pVirtualGamepad.buttons[EGamepadCodes.LEFT_SHOULDER_BOTTOM] = { pressed: false, value: 0. };
	pVirtualGamepad.buttons[EGamepadCodes.RIGHT_SHOULDER] = { pressed: false, value: 0. };
	pVirtualGamepad.buttons[EGamepadCodes.LEFT_SHOULDER] = { pressed: false, value: 0. };


	export function virtualGamepad(pKeymap: IKeyMap): Gamepad {
		var pGamepad: Gamepad = pVirtualGamepad;
		pGamepad.buttons[EGamepadCodes.SELECT].pressed = pKeymap.isKeyPress(EKeyCodes.ENTER);
		pGamepad.buttons[EGamepadCodes.START].pressed = pKeymap.isKeyPress(EKeyCodes.G);

		pGamepad.buttons[EGamepadCodes.PAD_TOP].pressed = pKeymap.isKeyPress(EKeyCodes.UP);
		pGamepad.buttons[EGamepadCodes.PAD_BOTTOM].pressed = pKeymap.isKeyPress(EKeyCodes.DOWN);
		pGamepad.buttons[EGamepadCodes.PAD_LEFT].pressed = pKeymap.isKeyPress(EKeyCodes.LEFT);
		pGamepad.buttons[EGamepadCodes.PAD_RIGHT].pressed = pKeymap.isKeyPress(EKeyCodes.RIGHT);

		pGamepad.buttons[EGamepadCodes.FACE_1].pressed = pKeymap.isKeyPress(EKeyCodes.N5);
		pGamepad.buttons[EGamepadCodes.FACE_2].pressed = pKeymap.isKeyPress(EKeyCodes.N6);
		pGamepad.buttons[EGamepadCodes.FACE_3].pressed = pKeymap.isKeyPress(EKeyCodes.N7);
		pGamepad.buttons[EGamepadCodes.FACE_4].pressed = pKeymap.isKeyPress(EKeyCodes.N8);

		pGamepad.buttons[EGamepadCodes.RIGHT_SHOULDER_BOTTOM].value = pKeymap.isKeyPress(EKeyCodes.CTRL) ? 1.0 : 0.0;
		pGamepad.buttons[EGamepadCodes.LEFT_SHOULDER_BOTTOM].value = pKeymap.isKeyPress(EKeyCodes.SHIFT) ? 1.0 : 0.0;

		pGamepad.buttons[EGamepadCodes.RIGHT_SHOULDER_BOTTOM].pressed = !!pGamepad.buttons[EGamepadCodes.RIGHT_SHOULDER_BOTTOM].value;
		pGamepad.buttons[EGamepadCodes.LEFT_SHOULDER_BOTTOM].pressed = !!pGamepad.buttons[EGamepadCodes.LEFT_SHOULDER_BOTTOM].value;


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