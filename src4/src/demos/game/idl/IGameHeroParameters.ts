/// <reference path="../../../../built/Lib/akra.d.ts"/>

enum EGameHeroStates {
        WEAPON_NOT_DRAWED,
        WEAPON_IDLE,

        GUN_BEFORE_DRAW,
        GUN_DRAWING,
        GUN_DRAWED,
        GUN_BEFORE_IDLE,
        GUN_BEFORE_UNDRAW,
        GUN_UNDRAWING,
        GUN_UNDRAWED,

        HARPOON_BEFORE_DRAW,
        HARPOON_DRAWING,
        HARPOON_DRAWED,
        HARPOON_BEFORE_IDLE,
        HARPOON_BEFORE_UNDRAW,
        HARPOON_UNDRAWING,
        HARPOON_UNDRAWED,

        HARPOON_BEFORE_ATTACK,
        HARPOON_ATTACKING,
        HARPOON_ATTACK_FINISHED
}

enum EGameHeroWeapons {
        NONE,
        GUN,
        HARPOON
}

interface IGameHeroParameters {
        //do not calcalate speed, if this cariable is ON
        manualSpeedControl      : boolean;
        manualSpeedRate         : float;

        movementRate          : float;
        movementRateThreshold : float;
        movementSpeedMax      : float;

        rotationSpeedMax : float;
        rotationRate     : float;

        runSpeed           		: float;
        walkToRunSpeed    		: float;
        walkSpeed                       : float;
        walkbackSpeed                   : float;
        //минимальная скорость с которой можно пятиться
        walkbackSpeedMin       		: float;
        walkWithWeaponSpeed             : float;
        //минимальная скорость, с которой можно идти с оружием
        walkWithWeaponSpeedMin 		: float;
        walkWithoutWeaponSpeed 	: float;

        //movement acceleration params
        movementDerivativeMax   : float;
        movementDerivativeMin   : float;
        movementDerivativeConst : float;

        //walkbak params
        walkBackAngleRange : float;

        state : EGameHeroStates;
        weapon: EGameHeroWeapons;

        //harpoon trigger params
        movementToHarpoonTime   : float;
        stateToHarpoonTime      : float;
        harpoonIdleToUndrawTime : float;
        harpoonDrawToIdleTime   : float;
        harpoonUndrawToIdleTime : float;
        harpoonToStateTime      : float;

        //temp variables for harpoon
        movementToHarpoonEndTime     : float;/*sec [temp/system] DO NOT EDIT!!!*/
        harpoonDrawStartTime         : float;/*sec [temp/system] DO NOT EDIT!!!*/
        harpoonDrawToIdleStartTime   : float;/*sec [temp/system] DO NOT EDIT!!!*/
        harpoonIdleToUnDrawStartTime : float;/*sec [temp/system] DO NOT EDIT!!!*/
        harpoonUndrawedTime          : float;/*sec [temp/system] DO NOT EDIT!!!*/
        harpoonUndrawStartTime       : float;/*sec [temp/system] DO NOT EDIT!!!*/

        //gun trigger params
        movementToGunTime       : float;
        stateToGunTime          : float;
        gunIdleToUndrawTime     : float;
        gunDrawToIdleTime       : float;
        gunToStateTime          : float;

        //temp variables for gun
        movementToGunEndTime     : float;/*sec [temp/system] DO NOT EDIT!!!*/
        idleWeightBeforeDraw     : float;/*sec [temp/system] DO NOT EDIT!!!*/
        movementWeightBeforeUnDraw     : float;/*sec [temp/system] DO NOT EDIT!!!*/
        gunDrawStartTime         : float;/*sec [temp/system] DO NOT EDIT!!!*/
        gunDrawToIdleStartTime   : float;/*sec [temp/system] DO NOT EDIT!!!*/
        gunIdleToUnDrawStartTime : float;/*sec [temp/system] DO NOT EDIT!!!*/
        gunUndrawToIdleTime      : float;/*sec [temp/system] DO NOT EDIT!!!*/
        gunUndrawedTime          : float;/*sec [temp/system] DO NOT EDIT!!!*/
        gunUndrawStartTime       : float;/*sec [temp/system] DO NOT EDIT!!!*/

        temp: float[];

        //gund direction beetween top and bottom
        gunDirection: float;

        //animation mar for quick access
        anim: akra.IMap<akra.IAnimation>;

        //current hero position 
        position: akra.IVec3;
        
        //attack state
        inAttack: boolean;

        fallDown: boolean;
        //поступательная скорость движения
        fallTransSpeed: float;
        //время начала падения
        fallStartTime: float;
}