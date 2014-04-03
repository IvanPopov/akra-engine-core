/// <reference path="../../../../built/Lib/akra.d.ts"/>

interface IGameCameraParameters {
        cameraPitchChaseSpeed : float;
        cameraPitchSpeed      : float;
        cameraPitchMax        : float;
        cameraPitchMin        : float;
        cameraPitchBase       : float;

        // cameraCharacterBasePosition             : IVec3;
        cameraCharacterDistanceBase       	: float;
        cameraCharacterDistanceMax        	: float;
        cameraCharacterChaseSpeed         	: float;
        cameraCharacterChaseRotationSpeed 	: float;
        cameraCharacterFocusPoint       	: akra.IVec3;
}