export interface IGameCameraParameters {
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
        cameraCharacterFocusPoint       	: IVec3;
}