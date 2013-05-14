#include "util/testutils.ts"
#include "akra.ts"
#include "controls/KeyMap.ts"
#include "ui/IDE.ts"
#include "util/SimpleGeometryObjects.ts"

/// @HERO_MODEL: {data}/models/hero/walk.dae|location()
/// @HERO_CONTROLLER: {data}/models/hero/movement.json|location()
/// @WINDSPOT_MODEL: {data}/models/windspot/WINDSPOT.DAE|location()
/// @MINER_MODEL: {data}/models/miner/miner.dae|location()
/// @ROCK_MODEL: {data}/models/rock/rock-1-low-p.DAE|location()

module akra {
	export interface IGameTrigger {
		triggers: Function[];
		time: float;
	}

	export interface IGameTimeParameters {
		time                    : float;
        timeDelta               : float;
	}

	export interface IGamePadParameters {
		analogueButtonThreshold : float;
		blocked     			: bool;
	}

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

        anim: IAnimationMap;

        position: IVec3;
	}

	export interface IGameCameraParameters {
		cameraPitchChaseSpeed : float;
        cameraPitchSpeed      : float;
        cameraPitchMax        : float;
        cameraPitchMin        : float;
        cameraPitchBase       : float;

        cameraCharacterDistanceBase       	: float;
        cameraCharacterDistanceMax        	: float;
        cameraCharacterChaseSpeed         	: float;
        cameraCharacterChaseRotationSpeed 	: float;
        cameraCharacterFocusPoint       	: IVec3;
	}

	export interface IGameTriggersParamerers {
		 lastTriggers : uint;
	}

	export interface IGameParameters extends 
		IGameTimeParameters, 
		IGamePadParameters, 
		IGameHeroParameters, 
		IGameCameraParameters, 
		IGameTriggersParamerers {
	}

	export interface IGameControls {
		direct: IOffset;

		forward : bool;
        back    : bool;
        right   : bool;
        left    : bool;
        dodge   : bool;
        gun     : bool;
	}

	var pEngine: IEngine = createEngine();

	var pRmgr: IResourcePoolManager 	= pEngine.getResourceManager();
	var pScene: IScene3d 				= pEngine.getScene();
	var pUI: IUI 						= pEngine.getSceneManager().createUI();
	var pCanvas: ICanvas3d 				= pEngine.getRenderer().getDefaultCanvas();
	var pCamera: ICamera 				= null;
	var pViewport: IViewport 			= null;
	var pIDE: ui.IDE 					= null;
	var pSkyBoxTexture: ITexture 		= null;
	var pGamepads: IGamepadMap 			= pEngine.getGamepads();
	var pKeymap: IKeyMap				= controls.createKeymap();

	export var self = {
		engine 		: pEngine,
		scene 		: pScene,
		camera 		: pCamera,
		viewport 	: pViewport,
		canvas 		: pCanvas,
		rsmgr 		: pRmgr,
		renderer 	: pEngine.getRenderer(),
		keymap 		: pKeymap,
		gamepads 	: pGamepads,

		hero: {
			root: 	<ISceneNode>null,
			head: 	<ISceneNode>null,
			pelvis: <ISceneNode>null,

			camera: <ICamera>null,
			triggers: <IGameTrigger[]>[],
			controls: <IGameControls> {
		        direct  : {
		            x : 0,
		            y : 0
		        },

		        forward : false,
		        back    : false,
		        right   : false,
		        left    : false,
		        dodge   : false,
		        gun     : false,
		    },

			parameters: <IGameParameters>{
		        analogueButtonThreshold : 0.25,
		        time                    : 0,/*this.fTime*/
		        timeDelta               : 0.,

		        movementRate          : 0,
		        movementRateThreshold : 0.0001,
		        movementSpeedMax      : 9.0, /* sec */

		        rotationSpeedMax : 10, /* rad/sec*/
		        rotationRate     : 0, /* current speed*/

		        runSpeed           : 9.0, /* m/sec*/
		        walkToRunSpeed     : 2.5, /* m/sec*/
		        walkSpeed          : 1.5, /* m/sec*/
		        walWithWeaponSpeed    : 1.0, /* m/sec */
        		walWithoutWeaponSpeed : 1.5, /* m/sec */

		        movementDerivativeMax   : 1.0,
		        movementDerivativeMin   : 0.5,
		        movementDerivativeConst : (2 * (Math.E + 1) / (Math.E - 1) *
		                                    (1.0 - 0.5)), /*(fSpeedDerivativeMax - fSpeedDerivativeMin)*/

		        walkBackAngleRange : -0.85, /*rad*/

		        cameraPitchChaseSpeed : 10.0, /*rad/sec*/
		        cameraPitchSpeed      : 3.0,
		        cameraPitchMax        : Math.PI / 5,
		        cameraPitchMin        : 0., /*-Math.PI/6,*/
		        cameraPitchBase       : Math.PI / 10,


		        blocked     	: true,
		        lastTriggers 	: 1,

		        position: new Vec3(0.),
		        cameraCharacterDistanceBase       : 5.0, /*метров [расстояние на которое можно убежать от центра камеры]*/
		        cameraCharacterDistanceMax        : 15.0,
		        cameraCharacterChaseSpeed         : 25, /* m/sec*/
		        cameraCharacterChaseRotationSpeed : 5., /* rad/sec*/
		        cameraCharacterFocusPoint       : new Vec3(0.0, 1.5, 0.0), /*meter*/

		        state : EGameHeroStates.GUN_NOT_DRAWED,

		        anim: <any>{}
		    }
		}
	};

	function setup(): void {
		pIDE = <ui.IDE>pUI.createComponent("IDE");
		pIDE.render($(document.body));

		pKeymap.captureMouse((<webgl.WebGLCanvas>pCanvas).el);
		pKeymap.captureKeyboard(document);

		pCanvas.bind(SIGNAL(viewportAdded), (pCanvas: ICanvas3d, pVp: IViewport) => {
			pViewport = self.viewport = pVp;
		});
	}

	function createCameras(): void {
		pCamera = self.camera = pScene.createCamera();
		pCamera.attachToParent(pScene.getRootNode());
	
		pCamera.addRelRotationByEulerAngles(-math.PI / 5., 0., 0.);
    	pCamera.addRelPosition(-8.0, 5.0, 11.0);
	}

	function createSceneEnvironment(): void {
		var pSceneQuad: ISceneModel = util.createQuad(pScene, 500.);
		pSceneQuad.attachToParent(pScene.getRootNode());

		var pSceneSurface: ISceneModel = util.createSceneSurface(pScene, 40);
		pSceneSurface.scale(5.);
		pSceneSurface.addPosition(0, 0.01, 0);
		pSceneSurface.attachToParent(pScene.getRootNode());
	}

	function createViewports(): void {
		pViewport = pCanvas.addViewport(pCamera, EViewportTypes.DSVIEWPORT);
	}

	function createLighting(): void {
		var pOmniLight: ILightPoint = pScene.createLightPoint(ELightTypes.OMNI, true, 512, "sun");
			
		pOmniLight.attachToParent(pScene.getRootNode());
		pOmniLight.enabled = true;
		pOmniLight.params.ambient.set(0.1, 0.1, 0.1, 1);
		pOmniLight.params.diffuse.set(1.);
		pOmniLight.params.specular.set(1, 1, 1, 1);
		pOmniLight.params.attenuation.set(1, 0, 0);

		pOmniLight.addPosition(0, 100, 100);

		// var pProjectShadowLight: ILightPoint = pScene.createLightPoint(ELightTypes.PROJECT, true, 512, "test-project-0");
		
		// pProjectShadowLight.attachToParent(pScene.getRootNode());
		// pProjectShadowLight.enabled = true;
		// pProjectShadowLight.params.ambient.set(0.1, 0.1, 0.1, 1);
		// pProjectShadowLight.params.diffuse.set(0.5);
		// pProjectShadowLight.params.specular.set(1, 1, 1, 1);
		// pProjectShadowLight.params.attenuation.set(1,0,0);
		// pProjectShadowLight.isShadowCaster = true;
		// pProjectShadowLight.addRelRotationByXYZAxis(0, -0.5, 0);
		// pProjectShadowLight.addRelPosition(0, 3, 10);

		// var pOmniShadowLight: ILightPoint = pScene.createLightPoint(ELightTypes.OMNI, true, 512, "test-omni-1");
		
		// pOmniShadowLight.attachToParent(pScene.getRootNode());
		// pOmniShadowLight.enabled = true;
		// pOmniShadowLight.params.ambient.set(0.1, 0.1, 0.1, 1);
		// pOmniShadowLight.params.diffuse.set(1);
		// pOmniShadowLight.params.specular.set(1, 1, 1, 1);
		// pOmniShadowLight.params.attenuation.set(1,0.,0);
		// pOmniShadowLight.isShadowCaster = false;

		// pOmniShadowLight.addPosition(0, 10, -10);
	}

	function setupAnimation(): void {

	}

	function initState() {
		var pStat = self.hero.parameters;

	    function findAnimation(sName: string, sPseudo?: string) {
	        pStat.anim[sPseudo || sName] = self.hero.root.getController().findAnimation(sName);
	    }

	    pStat.time = self.engine.time;
	    pStat.position.set(self.hero.root.worldPosition);

	    findAnimation("MOVEMENT.player");
	    findAnimation("MOVEMENT.blend");

	    findAnimation("RUN.player"); 
    	findAnimation("WALK.player");

	    activateTrigger([moveHero, movementHero, checkHeroState]);
	}

	function updateCharacterCamera(pControls: IGameControls, pHero: ISceneNode, pStat: IGameParameters, pController: IAnimationController) {
	    var pCamera: ICamera = self.hero.camera;
	    var fTimeDelta: float = pStat.timeDelta;
	    var pGamepad: Gamepad = self.gamepads.find(0);

	    if (!pGamepad || !pCamera.isActive()) {
	        return;
	    }

	    var fX: float = -pGamepad.axes[EGamepadAxis.RIGHT_ANALOGUE_HOR];
	    var fY: float = -pGamepad.axes[EGamepadAxis.RIGHT_ANALOGUE_VERT];

	    if (math.abs(fX) < pStat.analogueButtonThreshold) {
	        fX = 0;
	    }

	    if (math.abs(fY) < pStat.analogueButtonThreshold) {
	        fY = 0;
	    }

	    var pCameraWorldData: Float32Array = pCamera.worldMatrix.data;

	    var v3fCameraYPR: IVec3 = pCamera.localOrientation.toYawPitchRoll(vec3());
	    var v3fYPR: IVec3 = vec3(0.);
	    var qTemp: IQuat4;
	    var v3fCameraDir: IVec3 = vec3(-pCameraWorldData[__13], 0, -pCameraWorldData[__33]).normalize();
	    var v3fCameraOrtho: IVec3;

	    //hero displacmnet
	    var v3fDisplacement: IVec3 = pHero.worldPosition.subtract(pStat.position, vec3());

	    pCamera.addPosition(v3fDisplacement.negate(vec3()));
	    pStat.position.set(pHero.worldPosition);

	    //camera orientation
	    var v3fCameraHeroDist: IVec3 = pCamera.worldPosition.subtract(self.hero.pelvis.worldPosition, vec3());
	    var v3fCameraHeroDir: IVec3 = v3fCameraHeroDist.normalize(vec3());
	    var fCameraHeroDist: float = v3fCameraHeroDist.length();
 
	    var qCamera: IQuat4 = pCamera.localOrientation;
	    var qHeroView: IQuat4 = Mat4.lookAt(pCamera.localPosition, pStat.cameraCharacterFocusPoint, vec3(0., 1., 0.),
	                                mat4()).toQuat4(quat4());

	    qCamera.smix(qHeroView.conjugate(), pStat.cameraCharacterChaseRotationSpeed * fTimeDelta);

	    pCamera.localOrientation = qCamera;

	    //camera position
	    var fDist: float = (fCameraHeroDist - pStat.cameraCharacterDistanceBase) / pStat.cameraCharacterDistanceMax *
	                (-pStat.cameraCharacterChaseSpeed * fTimeDelta);

	    var v3fCameraZX: IVec3 = vec3(pCamera.worldPosition);
	    v3fCameraZX.y = 0;

	    var v3fHeroZX: IVec3 = vec3(pHero.worldPosition);
	    v3fHeroZX.y = 0;

	    var v3fDir: IVec3 = v3fHeroZX.subtract(v3fCameraZX).normalize();
	    pCamera.addPosition(v3fDir.scale(-fDist));

	    //====================

	    if (fY == 0.) {
	        fY = -(v3fCameraYPR.y - (-pStat.cameraPitchBase)) * pStat.cameraPitchChaseSpeed * fTimeDelta;

	        if (math.abs(fY) < 0.001) {
	            fY = 0.;
	        }
	    }

	    if (!(v3fCameraYPR.y > -pStat.cameraPitchMin && -fY < 0) &&
	        !(v3fCameraYPR.y < -pStat.cameraPitchMax && -fY > 0)) {

	        v3fCameraOrtho = vec3(v3fCameraDir.z, 0, -v3fCameraDir.x);

	        qTemp = Quat4.fromAxisAngle(v3fCameraOrtho, -fY * pStat.cameraPitchSpeed * fTimeDelta, quat4());
	        qTemp.toYawPitchRoll(v3fYPR);

	        // pCamera.localPosition.scale(1. - fY / 25);
	    }

	    var fX_ = fX / 10 + v3fYPR.x;
	    var fY_ = v3fYPR.y;
	    var fZ_ = v3fYPR.z;

	    if (fX_ || fY_ || fZ_) {
	        pCamera.addRotationByEulerAngles(fX_, fY_, fZ_);
	    }
	}

	function movementHero(pControls: IGameParameters, pHero: ISceneNode, pStat: IGameParameters, pController: IAnimationController) {
	    var pAnim: IAnimationMap = pStat.anim;

	    var fMovementRate: float = pStat.movementRate;
	    var fMovementRateAbs: float = math.abs(fMovementRate);

	    var fRunSpeed: float = pStat.runSpeed;
	    var fWalkSpeed: float = pStat.walkSpeed;
	    var fWalkToRunSpeed: float = pStat.walkToRunSpeed;

	    var fSpeed: float;

	    var fRunWeight: float;
	    var fWalkWeight: float;

	    //pStat.movementSpeedMax = pStat.state? pStat.walkToRunSpeed: pStat.runSpeed;


        pStat.walkSpeed = pStat.walWithoutWeaponSpeed;
        pStat.movementSpeedMax = pStat.runSpeed;


	    fSpeed = fMovementRateAbs * pStat.movementSpeedMax;

	    if (pController.active.name !== "STATE.player") {
	        // pController.play('STATE.player', this.fTime);
	    }

	    //character move
	    if (fSpeed > fWalkSpeed) {
	        if ((<IAnimationContainer>pAnim["MOVEMENT.player"]).isPaused()) {
	            (<IAnimationContainer>pAnim["MOVEMENT.player"]).pause(false);
	        }

	        if (fMovementRate > 0.0) {
	            //run forward
	            if (fSpeed < pStat.walkToRunSpeed) {

	                if (pStat.state) {
	                    (<IAnimationBlend>pAnim["MOVEMENT.blend"]).setWeights(0., 0., 0., 1.); /*only walk*/
	                }
	                else {
	                    (<IAnimationBlend>pAnim["MOVEMENT.blend"]).setWeights(0., 1., 0.); /* only walk */
	                }

	                (<IAnimationContainer>pAnim["WALK.player"]).setSpeed(fSpeed / fWalkSpeed);
	            }
	            else {
	                fRunWeight = (fSpeed - fWalkToRunSpeed) / (fRunSpeed - fWalkToRunSpeed);
	                fWalkWeight = 1. - fRunWeight;

	                //run //walk frw //walk back
	                if (pStat.state) {
	                    (<IAnimationBlend>pAnim["MOVEMENT.blend"]).setWeights(fRunWeight, 0., 0., fWalkWeight);
	                }
	                else {
	                    (<IAnimationBlend>pAnim["MOVEMENT.blend"]).setWeights(fRunWeight, fWalkWeight, 0.);
	                }

	                (<IAnimationContainer>pAnim["MOVEMENT.player"]).setSpeed(1.);
	            }
	        }
	        else {
	            //run //walk frw //walk back
	            (<IAnimationBlend>pAnim["MOVEMENT.blend"]).setWeights(0., 0., 1.);
	            (<IAnimationContainer>pAnim["MOVEMENT.player"]).setSpeed(fMovementRateAbs);

	            pStat.movementSpeedMax = fWalkSpeed;
	        }

	        //дабы быть уверенными что IDLE не считается
	        // pAnim["STATE.blend"].setAnimationWeight(0, 0.); /* idle */
	        // pAnim["STATE.blend"].setAnimationWeight(2, 0.); /* gun */
	    }
	    //character IDLE
	    else {
	        var iIDLE: int = pStat.state ? 2 : 0.;
	        var iMOVEMENT: int = 1;

	        (<IAnimationContainer>pAnim["MOVEMENT.player"]).pause(true);

	        if (pStat.state == EGameHeroStates.GUN_NOT_DRAWED || pStat.state >= EGameHeroStates.GUN_IDLE) {
	            // pAnim["STATE.blend"].setWeightSwitching(fSpeed / fWalkSpeed, iIDLE, iMOVEMENT); /* idle ---> run */
	        }

	        // trace(pAnim["STATE.blend"].getAnimationWeight(0), pAnim["STATE.blend"].getAnimationWeight(1), pAnim["STATE.blend"].getAnimationWeight(2))

	        if (fMovementRate > 0.0) {
	            //walk forward --> idle
	            if (pStat.state) {
	                (<IAnimationBlend>pAnim["MOVEMENT.blend"]).setWeights(null, 0., 0., fSpeed / fWalkSpeed);
	            }
	            else {
	                (<IAnimationBlend>pAnim["MOVEMENT.blend"]).setWeights(null, fSpeed / fWalkSpeed, 0.);
	            }
	        }
	        else if (fMovementRate < 0.0) {
	            //walk back --> idle
	            (<IAnimationBlend>pAnim["MOVEMENT.blend"]).setWeights(null, 0, fSpeed / fWalkSpeed);
	        }

	        (<IAnimationContainer>pAnim["MOVEMENT.player"]).setSpeed(1);
	    }

	    // if (pController.dodge) {
	    //     this.activateTrigger([this.dodgeHero, this.moveHero]);
	    // }
	}

	function checkHeroState(pControls, pHero, pStat, pController) {
	    // if (pControls.gun) {
	    //     this.activateTrigger([this.gunWeaponHero, this.moveHero]);
	    // }
	}


	inline function isFirstFrameOfTrigger(): bool {
	    return self.hero.parameters.lastTriggers !== self.hero.triggers.length;
	};

	function moveHero(pControls: IGameControls, pHero: ISceneNode, pStat: IGameParameters, pController: IAnimationController): void {
	    var fMovementRate: float;
	    var fMovementSpeedMax: float;

	    var fTimeDelta: float;
	    var fDirectX: float, fDirectY: float;
	    var fMovementDerivative: float;
	    var fMovementDerivativeMax: float;
	    var fRotationRate: float = 0;

	    var fMovementRateAbs: float;
	    var fWalkRate: float;
	    var f: float;

	    var pCamera: ICamera, pCameraWorldData: Float32Array;
	    var v3fCameraDir: IVec3, v3fCameraOrtho: IVec3;
	    var fCameraYaw: float;

	    var pHeroWorldData: Float32Array;
	    var v3fHeroDir: IVec3;

	    var v2fStick: IVec2;
	    var fScalar: float;
	    var fPower: float;
	    var v2fStickDir: IVec2;

	    var v3fRealDir: IVec3;

	    var fMovementDot: float;
	    var fMovementTest: float;
	    var fMovementDir: float;

	    //analogue stick values
	    fDirectY = pControls.direct.y;
	    fDirectX = -pControls.direct.x;

	    //camera data
	    pCamera = self.hero.camera;
	    pCameraWorldData = pCamera.worldMatrix.data;

	    //camera view direction projection to XZ axis
	    v3fCameraDir = vec3(-pCameraWorldData[__13], 0., -pCameraWorldData[__33]).normalize();
	    //v3fCameraOrtho  = Vec3(v3fCameraDir.z, 0., -v3fCameraDir.x);

	    //hero directiob proj to XZ axis
	    pHeroWorldData = pHero.worldMatrix.data;
	    v3fHeroDir = vec3(pHeroWorldData[__13], 0., pHeroWorldData[__33]).normalize();

	    //stick data
	    v2fStick = vec2(fDirectX, fDirectY);

	    //calculating stick power
	    if (v2fStick.x == v2fStick.y && v2fStick.x == 0.) {
	        fScalar = 0.;
	    }
	    else if (math.abs(v2fStick.x) > math.abs(v2fStick.y)) {
	        fScalar = math.sqrt(1. + math.pow(v2fStick.y / v2fStick.x, 2.));
	    }
	    else {
	        fScalar = math.sqrt(math.pow(v2fStick.x / v2fStick.y, 2.) + 1.);
	    }

	    //stick power value
	    fPower = fScalar ? v2fStick.length() / fScalar : 0.;
	    //stick dir
	    v2fStickDir = v2fStick.normalize(vec2());

	    //camera yaw
	    fCameraYaw = -math.atan2(v3fCameraDir.z, v3fCameraDir.x);

	    //real direction in hero-space
	    v3fRealDir = vec3(v2fStickDir.y, 0., v2fStickDir.x);
	    Quat4.fromYawPitchRoll(fCameraYaw, 0., 0., quat4()).multiplyVec3(v3fRealDir);


	    //movement parameters
	    fMovementDot = v3fRealDir.dot(v3fHeroDir);
	    fMovementTest = math.abs(fMovementDot - 1.) / 2.;
	    fMovementDir = 1.;

	    fMovementRate = fPower * math.sign(fMovementDot);

	    if (fMovementDot > pStat.walkBackAngleRange) {
	        fMovementDir = v3fRealDir.x * v3fHeroDir.z - v3fRealDir.z * v3fHeroDir.x;
	        fRotationRate = fPower * math.sign(fMovementDir) * fMovementTest;
	    }
	    else {
	        fRotationRate = 0.0;
	    }

	    fTimeDelta = pEngine.time - pStat.time;
	    fMovementSpeedMax = pStat.movementSpeedMax;
	    fWalkRate = pStat.walkSpeed / pStat.movementSpeedMax;

	    if (fTimeDelta != 0.0) {
	        fMovementDerivative = (fMovementRate - pStat.movementRate) / fTimeDelta;
	        f = math.exp(math.abs(pStat.movementRate));
	        fMovementDerivativeMax = pStat.movementDerivativeMin + ((f - 1.) / (f + 1.)) * pStat.movementDerivativeConst;
	        fMovementRate = pStat.movementRate +
	                        fTimeDelta * math.clamp(fMovementDerivative, -fMovementDerivativeMax, fMovementDerivativeMax);
	    }

	    fMovementRateAbs = math.abs(fMovementRate);

	    if (fMovementRateAbs < pStat.movementRateThreshold) {
	        fMovementRate = 0.;

	        // this.pCurrentSpeedField.edit("0.00 m/sec");
	    }

	    if (fRotationRate != 0.) {
	        pHero.addRelRotationByEulerAngles(fRotationRate * pStat.rotationSpeedMax * fTimeDelta, 0.0, 0.0);
	    }

	    if (fMovementRateAbs >= fWalkRate ||
	        (fMovementRate < 0. && fMovementRateAbs > pStat.walkSpeed / pStat.runSpeed)) {
	        pHero.addRelPosition(vec3(0.0, 0.0, fMovementRate * fMovementSpeedMax * fTimeDelta));

	        // this.pCurrentSpeedField.edit((fMovementRate * fMovementSpeedMax).toFixed(2) + " m/sec");
	    }

	    pStat.rotationRate = fRotationRate;
	    pStat.movementRate = fMovementRate;
	    pStat.time = pEngine.time;
	    pStat.timeDelta = fTimeDelta;
	};

	function activateTrigger(pTriggersList: Function[]): void {
	    pTriggersList.push(updateCharacterCamera);
	    self.hero.triggers.push({triggers : pTriggersList, time : pEngine.time});
	};

	function deactivateTrigger(): IGameTrigger {
	    return self.hero.triggers.pop();
	};

	function updateHero (): void {
	    var pGamepad: Gamepad = self.gamepads.find(0);
	    var pHero: ISceneNode = self.hero.root;
	    var pStat: IGameParameters = self.hero.parameters;
	    var pController: IAnimationController = self.hero.root.getController()
	    
	    var pTriggers: IGameTrigger	  = self.hero.triggers.last;
	    var pControls: IGameControls  = self.hero.controls;
	    var pTriggersData: Function[] = pTriggers.triggers;

	    if (!pGamepad) {
	        return;
	    }
	    if (pGamepad.buttons[EGamepadCodes.SELECT]) {
	        pStat.blocked = true;
	    }
	    if (pGamepad.buttons[EGamepadCodes.START]) {
	        pStat.blocked = false;
	    }
	    if (pStat.blocked) {
	        return;
	    }

	    var fDirectY: float = -pGamepad.axes[EGamepadAxis.LEFT_ANALOGUE_VERT];
	    var fDirectX: float = -pGamepad.axes[EGamepadAxis.LEFT_ANALOGUE_HOR];

	    var fAnalogueButtonThresholdInv: float = 1. - pStat.analogueButtonThreshold;

	    if (math.abs(fDirectX) < pStat.analogueButtonThreshold) {
	        fDirectX = 0.;
	    }
	    else {
	        fDirectX = math.sign(fDirectX) * (math.abs(fDirectX) - pStat.analogueButtonThreshold) /
	                   fAnalogueButtonThresholdInv;
	    }
	    if (math.abs(fDirectY) < pStat.analogueButtonThreshold) {
	        fDirectY = 0.;
	    }
	    else {
	        fDirectY = math.sign(fDirectY) * (math.abs(fDirectY) - pStat.analogueButtonThreshold) /
	                   fAnalogueButtonThresholdInv;
	    }

	    pControls.direct.y = fDirectY;
	    pControls.direct.x = fDirectX;

	    pControls.forward = !!pGamepad.buttons[EGamepadCodes.PAD_TOP];
	    pControls.back = !!pGamepad.buttons[EGamepadCodes.PAD_BOTTOM];
	    pControls.left = !!pGamepad.buttons[EGamepadCodes.PAD_LEFT];
	    pControls.right = !!pGamepad.buttons[EGamepadCodes.PAD_RIGHT];

	    pControls.dodge = !!pGamepad.buttons[EGamepadCodes.FACE_1];
	    pControls.gun = !!pGamepad.buttons[EGamepadCodes.FACE_4];

	    var iTrigger: uint = self.hero.triggers.length;

	    for (var i: int = 0; i < pTriggersData.length; ++i) {
	        pTriggersData[i](pControls, pHero, pStat, pController, pTriggers.time);
	    }

	    pStat.lastTriggers = iTrigger;
	}

	function updateCameraAxes(): void {
	    // var pCameraWorldData = this.getActiveCamera().worldMatrix().pData;
	    // var v3fCameraDir = Vec3(-pCameraWorldData._13, 0, -pCameraWorldData._33).normalize();

	    // this.pCameraBasis.setRotation(Vec3(0, 1, 0), -Math.atan2(v3fCameraDir.z, v3fCameraDir.x));
	}

	function setupCameras(): void {
		var pCharacterCamera: ICamera = pScene.createCamera("character-camera");
	    var pCharacterRoot: ISceneNode = self.hero.root;
	    var pCharacterPelvis: ISceneNode = <ISceneNode>pCharacterRoot.findEntity("node-Bip001");
	    var pCharacterHead: ISceneNode = <ISceneNode>pCharacterRoot.findEntity("node-Bip001_Head");

	    pCharacterCamera.setInheritance(ENodeInheritance.POSITION);
	    pCharacterCamera.attachToParent(pCharacterRoot);
	    pCharacterCamera.setProjParams(Math.PI / 4.0, pCanvas.width / pCanvas.height, 0.1, 3000.0);
	    pCharacterCamera.setRelPosition(vec3(0, 2.5, -5));

	    self.hero.camera = pCharacterCamera;
	    self.hero.head = pCharacterHead;
	    self.hero.pelvis = pCharacterPelvis;
	}

	function updateKeyboardControls(fLateralSpeed: float, fRotationSpeed: float): void {
		var pKeymap: IKeyMap = self.keymap;
		var pGamepad: Gamepad = self.gamepads.find(0);


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

	    var v3fOffset: IVec3 = vec3(0, 0, 0);
	    var isCameraMoved: bool = false;

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
	    else if (pKeymap.isKeyPress(EKeyCodes.SPACE)) {
	        pEngine.isActive()? pEngine.pause(): pEngine.play();
	    }

	    if (isCameraMoved) {
	        pCamera.addRelPosition(v3fOffset);
	    }
	}

	function updateCameras(): void {
		updateKeyboardControls(0.25, 0.05);

		var pKeymap: IKeyMap 			= self.keymap;
		var pGamepad: Gamepad 			= self.gamepads.find(0);
		var pCharacterCamera: ICamera 	= self.hero.camera;
		var pCamera: ICamera 			= self.camera;
		var pCanvas: ICanvas3d 			= self.canvas;
		var pViewport: IViewport 		= self.viewport;

	    if (pKeymap.isKeyPress(EKeyCodes.N1) ||
	        (pGamepad && pGamepad.buttons[EGamepadCodes.RIGHT_SHOULDER])) {
	        pCharacterCamera.lookAt(self.hero.head.worldPosition);
	        pViewport.setCamera(pCharacterCamera);
	    }
	    else if (pKeymap.isKeyPress(EKeyCodes.N2) ||
	             (pGamepad && pGamepad.buttons[EGamepadCodes.LEFT_SHOULDER])) {
	        pViewport.setCamera(pCamera);
	    }

	    if (pCharacterCamera.isActive()) {
	        return;
	    }

	    //default camera.

	    if (pKeymap.isMousePress() && pKeymap.isMouseMoved()) {
	    	var v2fD: IOffset = pKeymap.getMouseShift();
	        var fdX = v2fD.x, fdY = v2fD.y;

	        fdX /= pCanvas.width / 10.0;
	        fdY /= pCanvas.height / 10.0;

	        pCamera.addRelRotationByEulerAngles(-fdX, -fdY, 0);
	    }

	    if (!pGamepad) {
	        return;
	    }

	    var fX = pGamepad.axes[EGamepadAxis.RIGHT_ANALOGUE_HOR];
	    var fY = pGamepad.axes[EGamepadAxis.RIGHT_ANALOGUE_VERT];

	    if (Math.abs(fX) < 0.25) {
	        fX = 0;
	    }

	    if (Math.abs(fY) < 0.25) {
	        fY = 0;
	    }

	    if (fX || fY) {
	        pCamera.addRelRotationByEulerAngles(-fX / 10, -fY / 10, 0);
	    }
	}

	function createSkyBox(): void {
		pSkyBoxTexture = pRmgr.createTexture(".sky-box-texture");
		pSkyBoxTexture.loadResource("../../../data/textures/skyboxes/desert-3.dds");

		pSkyBoxTexture.bind(SIGNAL(loaded), (pTexture: ITexture) => {
			(<render.DSViewport>pViewport).setSkybox(pTexture);
		});
	}

	function loadModels(sPath, fnCallback?: Function): void {
		var pModel: ICollada = <ICollada>pRmgr.loadModel(sPath);

		pModel.bind(SIGNAL(loaded), (pModel: ICollada) => {
			var pModelRoot: IModelEntry = pModel.attachToScene(pScene);

			if (isFunction(fnCallback)) {
				fnCallback(pModelRoot);
			}
		});
	}

	function update(): void {
		updateCameras();
		updateHero();
		self.keymap.update();
	}

	function main(pEngine: IEngine): void {
		setup();
		createSceneEnvironment();
		createCameras();
		createViewports();
		createSkyBox();
		createLighting();
		

		loadModels("@HERO_MODEL", (pNode: ISceneNode) => {
			pNode.setRelPosition(-5., 0., 0.);

			fopen("@HERO_CONTROLLER", "r").read((err: Error, content: string) => {
				if (!isNull(err)) {
					throw err;
				}
	
				pNode.addController((new io.Importer(pEngine)).import(content).getController());

				self.hero.root = pNode;

				setupCameras();
				initState();

				pScene.bind(SIGNAL(beforeUpdate), update);

				/*pNode.child.explore((pEntity: IEntity): bool => {
					if (!scene.isModel(pEntity)) {
						return true;
					}

					var pModel: ISceneModel = <ISceneModel>pEntity;
					pModel.mesh.createBoundingBox();
					pModel.mesh.showBoundingBox();

					LOG(pModel.name, pModel.mesh.boundingBox.size(vec3()).toString());
				});*/
			});
		});

		loadModels("@MINER_MODEL");
		loadModels("@WINDSPOT_MODEL", (pNode: ISceneNode) => {
			pNode.setRelPosition(7.5, 0., 0.);
		});
		loadModels("@ROCK_MODEL", (pNode: ISceneNode) => {
			pNode.setRelPosition(0., 1., 5.);
		});
		
	}

	pEngine.bind(SIGNAL(depsLoaded), main);		
	pEngine.exec();
}