/// <reference path="../../../../built/Lib/akra.d.ts"/>

module akra {
	var v3fOffset: IVec3 = new Vec3;

	export function updateKeyboardControls(pCamera: ICamera, fLateralSpeed: number, fRotationSpeed: number, pKeymap: IKeyMap, pGamepad: Gamepad = null): void {
		if (pKeymap.isKeyPress(EKeyCodes.RIGHT)) {
			pCamera.addRelRotationByEulerAngles(0.0, 0.0, -fRotationSpeed);
			//v3fCameraUp.Z >0.0 ? fRotationSpeed: -fRotationSpeed);
		}
		else if (pKeymap.isKeyPress(EKeyCodes.LEFT)) {
			pCamera.addRelRotationByEulerAngles(0.0, 0.0, fRotationSpeed);
			//v3fCameraUp.Z >0.0 ? -fRotationSpeed: fRotationSpeed);
		}

		if (pKeymap.isKeyPress(EKeyCodes.UP)) {
			pCamera.addRelRotationByEulerAngles(0, fRotationSpeed, 0);
		}
		else if (pKeymap.isKeyPress(EKeyCodes.DOWN)) {
			pCamera.addRelRotationByEulerAngles(0, -fRotationSpeed, 0);
		}

		v3fOffset.set(0.);
		var isCameraMoved: boolean = false;

		if (pKeymap.isKeyPress(EKeyCodes.D) || (pGamepad && pGamepad.buttons[EGamepadCodes.PAD_RIGHT])) {
			v3fOffset.x = fLateralSpeed;
			isCameraMoved = true;
		}
		else if (pKeymap.isKeyPress(EKeyCodes.A) || (pGamepad && pGamepad.buttons[EGamepadCodes.PAD_LEFT])) {
			v3fOffset.x = -fLateralSpeed;
			isCameraMoved = true;
		}
		if (pKeymap.isKeyPress(EKeyCodes.R)) {
			v3fOffset.y = fLateralSpeed;
			isCameraMoved = true;
		}
		else if (pKeymap.isKeyPress(EKeyCodes.F)) {
			v3fOffset.y = -fLateralSpeed;
			isCameraMoved = true;
		}
		if (pKeymap.isKeyPress(EKeyCodes.W) || (pGamepad && pGamepad.buttons[EGamepadCodes.PAD_TOP])) {
			v3fOffset.z = -fLateralSpeed;
			isCameraMoved = true;
		}
		else if (pKeymap.isKeyPress(EKeyCodes.S) || (pGamepad && pGamepad.buttons[EGamepadCodes.PAD_BOTTOM])) {
			v3fOffset.z = fLateralSpeed;
			isCameraMoved = true;
		}
		// else if (pKeymap.isKeyPress(EKeyCodes.SPACE)) {
		//     pEngine.isActive()? pEngine.pause(): pEngine.play();
		// }

		if (isCameraMoved) {
			pCamera.addRelPosition(v3fOffset);
		}
	}
}