/// <reference path="../../../../built/Lib/akra.d.ts"/>

module akra {
	var pCameraFPSParams = window['pCamFPSParams'] = {
		current: {
			rotation: new math.Vec3(),
			velocity: new math.Vec3(),
			position: new math.Vec3(),
		},
		target: {
			rotation: new math.Vec3(),
			velocity: new math.Vec3(),
			speed: 15.0,
			acceleration: 5.0,
		},
	}
	
	function animateFPSParams(pCamera: ICamera) {
		var currRot = pCameraFPSParams.current.rotation,
			targRot = pCameraFPSParams.target.rotation,
			currVel = pCameraFPSParams.current.velocity,
			targVel = pCameraFPSParams.target.velocity,
			currPos = pCameraFPSParams.current.position;

		targRot.y = math.clamp(targRot.y, -1.5, 1.5);
		currRot.x += (targRot.x - currRot.x) * 0.04;
		currRot.y = currRot.y + (targRot.y - currRot.y) * 0.04;
		currRot.z = currRot.z + (targRot.z - currRot.z) * 0.04;

		var dV = math.Vec3.temp(targVel).subtract(currVel);
		var dV_length = dV.length();
		var acc = pCameraFPSParams.target.acceleration;

		if(dV_length > acc / 60.0) {
			dV.scale( acc / 60.0 / dV_length );
		}
		currVel.add(dV);
		currPos.add(math.Vec3.temp(currVel).scale(1.0 / 60.0));

		pCamera.setRotationByEulerAngles(currRot.x, currRot.y, currRot.z);
		pCamera.setPosition(currPos);
	}

	export function updateCamera(pCamera: ICamera, pKeymap: IKeyMap, pGamepad: Gamepad = null): void {
		var speed = pCameraFPSParams.target.speed;
		updateKeyboardControls(pCamera, pCameraFPSParams, speed, 0.2, pKeymap, pGamepad);

		//default camera.
		
		var pCanvas: ICanvas3d = pCamera.getScene().getManager().getEngine().getRenderer().getDefaultCanvas();
		//var pCanvas: ICanvas3d = pCamera._getLastViewport().getTarget().getRenderer().getDefaultCanvas();

		if (pKeymap.isMousePress() && pKeymap.isMouseMoved()) {
			var v2fD: IOffset = pKeymap.getMouseShift();
			var fdX = v2fD.x / pCanvas.getWidth(),
				fdY = v2fD.y / pCanvas.getHeight();

			pCameraFPSParams.target.rotation.x -= fdX * 6.0;
			pCameraFPSParams.target.rotation.y -= fdY * 6.0;
			
			// pCamera.setRotationByEulerAngles(pCurRot.x-fdX, pCurRot.y-fdY, 0);
		}

		if (!pGamepad) {
			animateFPSParams(pCamera);
			return;
		}

		var fX = pGamepad.axes[EGamepadAxis.RIGHT_ANALOGUE_HOR];
		var fY = pGamepad.axes[EGamepadAxis.RIGHT_ANALOGUE_VERT];

		if (math.abs(fX) < 0.25) {
			fX = 0;
		}

		if (math.abs(fY) < 0.25) {
			fY = 0;
		}

		if (fX || fY) {
			pCameraFPSParams.target.rotation.x -= fX * 0.2;
			pCameraFPSParams.target.rotation.y -= fY * 0.2;
		}

		animateFPSParams(pCamera);
	}
}