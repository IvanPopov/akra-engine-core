export enum EGameHeroStates {
        GUN_NOT_DRAWED,
        GUN_BEFORE_DRAW,
        GUN_DRAWING,
        GUN_DRAWED,
        GUN_BEFORE_IDLE,
        GUN_IDLE,
        GUN_BEFORE_UNDRAW,
        GUN_UNDRAWING,
        GUN_UNDRAWED,
        GUN_END
}

export interface IGameHeroParameters {
        movementRate          : float;
        movementRateThreshold : float;
        movementSpeedMax      : float;

        rotationSpeedMax : float;
        rotationRate     : float;

        runSpeed           		: float;
        walkToRunSpeed    		: float;
        walkSpeed          		: float;
        walWithWeaponSpeed 		: float;
        walWithoutWeaponSpeed 	: float;

        movementDerivativeMax   : float;
        movementDerivativeMin   : float;
        movementDerivativeConst : float;

        walkBackAngleRange : float;

        state : EGameHeroStates;

        movementToGunTime       : float;
        stateToGunTime          : float;
        gunIdleToUndrawTime     : float;
        gunDrawToIdleTime       : float;
        gunToStateTime          : float;

        movementToGunEndTime     : float;/*sec [temp/system] DO NOT EDIT!!!*/
        idleWeightBeforeDraw     : float;/*sec [temp/system] DO NOT EDIT!!!*/
        gunDrawStartTime         : float;/*sec [temp/system] DO NOT EDIT!!!*/
        gunDrawToIdleStartTime   : float;/*sec [temp/system] DO NOT EDIT!!!*/
        gunIdleToUnDrawStartTime : float;/*sec [temp/system] DO NOT EDIT!!!*/
        gunUndrawedTime          : float;/*sec [temp/system] DO NOT EDIT!!!*/
        gunUndrawStartTime       : float;/*sec [temp/system] DO NOT EDIT!!!*/

        anim: IAnimationMap;

        position: IVec3;

        fallDown: bool;
        //поступательная скорость движения
        fallTransSpeed: float;
        //время начала падения
        fallStartTime: float;
}