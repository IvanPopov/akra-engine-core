/**
 * @file
 * @brief Engine class.
 * @author xoma
 * @email xoma@odserve.org
 * Файл класса с движком
 **/

Define(a.fMillisecondsPerTick, 0.0333);

function Engine () {
    //Переменные отвечающие за состояния приложения

    //Оконный режим или полноэкранный
    //Пока нигде не используется
    this._isWindowed = true;

    //Активен ли джижок
    //пауза как раз выстявляется изменением этого параметра
    this._isActive = false;

    //Потерян ли девайс
    this._isDeviceLost = false;

    this._isObjectsInited = false; 		//Проинициализированы ли объекты
    this._isObjectsRestored = false;	//Перевесены ли объекты в энергозависимую память

    //Переменные используемые для синхронизации
    this._isFrameMoving = true;
    this._isSingleStep = false;

    //Переменные времени
    this.fTime = 0.0;	//Текущее время в секундах
    this.fElapsedTime = 0.0;	//Время прошедшее с последнего кадра
    this.fFPS = 0.0; //Значение FPS
    this.fUpdateTimeCount = 0;  //Время прошедшее с последнего отрендеренного кадра

    this.sWindowTitle = "Akra Engine"; //Заголовок окна

    this.sDeviceStats = ""; //Строка описывающая состояние девайса
    this.sFrameStats = ""; //Строка описывающая состояние кадра
    this.pFont = null;  //Шрифт, которым будут отоброжаться состояния\
    this._isShowStats = false;  //Показывать или нет статистику по ФПСам


    this.pKeymap = null; //Объект отвечающий остлеживание действий пользователя

    //3D девайс
    this.pCanvas = null;
    this.pDevice = null;

    //Объекты с которыми работает движок
    this.pResourceManager = null;
    this.pDisplayManager = null;
    this.pShaderManager = null;
    // this.pUniqManager = null;

    this._pRootNode = null; //Корень дерева сцены
    this._pDefaultCamera = null;		//Камера по умолчанию
    this._pActiveCamera = null; //Активная камера
    this._pSceneTree = null;      //Объект отвечающий за дерево сцены
    this._pWorldExtents = null;//Сцена


    this._isFrameReady = false;//?????
    this._iActiveRenderStage = 0;

    this._isShowCursorWhenFullscreen = false; //Показывать ли курсор в полноэкранном режиме
    this._isStartFullscreen = false; //Стартовать ли в полноэкранном режиме

    //Вводим движок в состояние паузы пока не будем готовы к рендерингу
    this.pause(true);

    //Размеры при создании
    this.iCreationWidth = 0;
    this.iCreationHeight = 0;
}

/**
 * @property Create()
 * Создание и инициализация всего подряд
 * @memberof Engine
 *
 * @return Boolean Успешно ли все создаллось
 **/
Engine.prototype.create = function (sCanvasId) {
    //инициализация
    this.pKeymap = new a.Keymap(window);
    this.pCanvas = document.getElementById(sCanvasId);
    this._pRootNode = new a.SceneNode(this); //Корень дерева сцены
    this._pDefaultCamera = new a.Camera(this);      //Камера по умолчанию
    this._pActiveCamera = this._pDefaultCamera; //Активная камера
    this._pSceneTree = new a.OcTree();      //Объект отвечающий за дерево сцены
    this.iCreationWidth = this.pCanvas.width;
    this.iCreationHeight = this.pCanvas.height;

    //Получение 3D девайса
    this.pDevice = a.createDevice(this.pCanvas);
    if (!this.pDevice) {
        debug_error("Объект устроства не создан, создание завершилось");
        a.deleteDevice(this.pDevice);
        return false;
    }

    this.pResourceManager = new a.ResourcePoolManager();
    this.pDisplayManager = new a.DisplayManager(this);
    this.pShaderManager = new a.ShaderManager(this);
    // this.pUniqManager = new a.UniqueManager(this);

    //Запускаем таймер приложения
    a.UtilTimer(a.UtilTimer.TimerStart);

    //Инициализация данных приложения
    if (!this.oneTimeSceneInit()) {
        debug_error("Engine.oneTimeSceneInit");
        a.deleteDevice(this.pDevice);
        return false;
    }

    //Дожидаемся загрузки всех ресурсов которые созданы, и после этого запускаем инициализацию объектов на сцене

    var me = this;
    this.pResourceManager.setLoadedAllRoutine(function () {
        //Инициализация объектов сцены
        if (!me.initialize3DEnvironment()) {
            debug_error("Engine.Initialize3DEnvironment");
            a.deleteDevice(me.pDevice);
            return false;
        }

        //Приложение готово стартануть
        me.pause(false);
    });
    return true;
}

/**
 * @property pause(Boolean isPause)
 * Выставление паузы
 * @param isPause
 * @memberof Engine
 **/
Engine.prototype.pause = function (isPause) {
    this.pause.iAppPausedCount += ( isPause ? +1 : -1 );
    this._isActive = ( this.pause.iAppPausedCount ? false : true );

    // Handle the first pause request (of many, nestable pause requests)
    if (isPause && ( 1 == this.pause.iAppPausedCount )) {
        // Stop the scene from animating
        if (this._isFrameMoving) {
            a.UtilTimer(a.UtilTimer.TimerStop);
        }
    }

    if (0 == this.pause.iAppPausedCount) {
        // Restart the timers
        if (this._isFrameMoving) {
            a.UtilTimer(a.UtilTimer.TimerStart);
        }
    }
}
Engine.prototype.pause.iAppPausedCount = 0;


/**
 * @property notifyOneTimeSceneInit()
 *
 * @memberof Engine
 * @return Boolean Успешно ли все создаллось
 **/
Engine.prototype.notifyOneTimeSceneInit = function () {
    //Инициализируется дисплей менеджер
    if (this.pDisplayManager.initialize()) {
        return true;
    }

    if (this.pShaderManager.initialize()) {
        return true;
    }

    // if (this.pUniqManager.initialize()) {
    //     return true;
    // }

    return false;
}

/**
 * @property showStats(Boolean isShow)
 * Нужно ли показыватьс статистику
 * @param isShow флаг, true показывать, false нет
 * @memberof Engine
 **/
Engine.prototype.showStats = function (isShow) {
    if (isShow == true && this._isShowStats == false) {
        this.pFont = new a.Font2D(22, '00FF00', "Arial", true);
        this.sFrameStats = this.pDisplayManager.draw2DText(2, 0, this.pFont, "");
        this.sDeviceStats = this.pDisplayManager.draw2DText(2, 20, this.pFont, "");
        this._isShowStats = true;
    }
    else if (isShow == false && this._isShowStats == true) {

        this.sDeviceStats.clear();
        this.sFrameStats.clear();

        this.sDeviceStats = null;
        this.sFrameStats = null;

        this.pFont = null;
        this._isShowStats = false;
    }
};



/**
 * @property notifyRestoreDeviceObjectsDefault()
 * Перенос объектов в энергозависимую память
 * @memberof Engine
 **/
Engine.prototype.notifyRestoreDeviceObjects = function () {

    this.pDisplayManager.restoreDeviceResources();
    this.pShaderManager.restoreDeviceResources();
    //this.pUniqManager.restoreDeviceResources();
    return true;
};

/**
 * @property setupWorldOcTree()
 * Инициализация сцены и дерева сцены
 * @memberof Engine
 **/
Engine.prototype.setupWorldOcTree = function (pWorldExtents) {
    this._pWorldExtents = pWorldExtents;
    this._pSceneTree.create(this._pWorldExtents, 10);
};

/**
 * @property notifyDeleteDeviceObjects()
 * Выгрузка объектов сцены
 * @memberof Engine
 **/
Engine.prototype.notifyDeleteDeviceObjects = function () {
    this.pDisplayManager.destroyDeviceResources();
    this.pShaderManager.destroyDeviceResources();
    this._pDefaultCamera.destroy();
    this._pRootNode.destroy();
    return true;
};

/**
 * @property notifyDeleteDeviceObjects()
 * Действия кторые должны происходить при обновление сцены
 * @memberof Engine
 **/
Engine.prototype.notifyUpdateScene = function () {
    // update the scene attached to the root node
    this._pRootNode.recursiveUpdate();
    this._isFrameReady = true;
    return true;
};

Engine.prototype.getRootNode = function () {
    return this._pRootNode;
};

Engine.prototype.getSceneTree = function () {
    return this._pSceneTree;
};

Engine.prototype.getDefaultCamera = function () {
    return this._pDefaultCamera;
};
Engine.prototype.getActiveCamera = function () {
    return this._pActiveCamera;
};

Engine.prototype.displayManager = function () {
    return this.pDisplayManager;
};

// Engine.prototype.uniqManager = function() {
//     return this.pUniqManager;
// };

Engine.prototype.shaderManager = function () {
    return this.pShaderManager;
};

/**
 * @property notifyInitDeviceObjects()
 * Инициализация обхектов на сцене
 * @memberof Engine
 * @return Boolean Успешно ли все создаллось
 **/
Engine.prototype.notifyInitDeviceObjects = function () {

    this.pDisplayManager.createDeviceResources();
    this.pShaderManager.createDeviceResources();
    //this.pUniqManager.createDeviceResources();

    // create the root node
    // for our scene and a camera
    this._pRootNode.create();
    this._pDefaultCamera.create();
    this._pDefaultCamera.attachToParent(this._pRootNode);

    // setup the default scene camera
    this._pDefaultCamera.setPosition(
        Vec3.create(0.0, 0.0, 0.0));
    //this._pDefaultCamera.setRotation(Vec3.create(1, 0, 0), Vec3.create(0, 0, 1));
    //a._pDefaultCamera.setRotation([1,1,1],Math.PI/2);
    //	Vec3.create(1.0,0.0,0.0),
    //	Vec3.create(0.0,0.0,1.0));

    this._pDefaultCamera.setProjParams(
        Math.PI / 3.0,
        this.pCanvas.width / this.pCanvas.height,
        0.1, 3000.0);

    return true;
}

/**
 * @property renderScene()
 * действия при рендеринге сценны
 * @memberof Engine
 * @return Boolean
 **/
Engine.prototype.renderScene = function () {

    //Получение всех объектов сцены, которые видны активной камере
    var pFirstMember = this._pSceneTree.buildSearchResults(this.getActiveCamera().searchRect(), this.getActiveCamera().frustum());
    //console.log(pFirstMember, this._pActiveCamera);
    /*console.log(pFirstMember, this._pActiveCamera.searchRect().fX0, this._pActiveCamera.searchRect().fX1,
                this._pActiveCamera.searchRect().fY0, this._pActiveCamera.searchRect().fY1,
                this._pActiveCamera.searchRect().fZ0, this._pActiveCamera.searchRect().fZ1)
    */
    var pRenderList = pFirstMember;

    //Подготовка всех объектов к рендерингу
    while (pFirstMember) {
        pFirstMember.prepareForRender();
        pFirstMember = pFirstMember.nextSearchLink();
    }

    //рендеринг всех объектов
    pFirstMember = pRenderList;
    while (pFirstMember) {
        pFirstMember.render();
        pFirstMember = pFirstMember.nextSearchLink();
    }

Ifdef (__DEBUG);
    //FIXME: remove direct render
    if (this.directRender) {
        this.directRender();
    }
Endif ();

    return true;
}

Engine.prototype.run = function () {
    var me = this;
    var fnRender = function () {
        window.requestAnimationFrame(fnRender, me.pCanvas);
        if (me._isDeviceLost) {
            //у нас пока он не теряется
            //но написать неплохо былобы
            debug_error("Девайс потерян");
        }
        if (me._isActive) {
            if (!me.render3DEnvironment()) {
                debug_error("a.render3DEnvironmen error");
            }
        }

    }
    fnRender();
    return true;
};

Engine.prototype.setActiveCamera = function (pCamera) {
    this._pActiveCamera = pCamera;

    if (!this._pActiveCamera) {
        this._pActiveCamera = this._pDefaultCamera;
    }
}


Engine.prototype.confirmDevice = function (//TODO
                                           /*D3DCAPS9* */ pCaps, /*DWORD*/ iBehavior, /*D3DFORMAT*/ pDisplay,
                                           /*D3DFORMAT*/ pBackBuffer) {
    // Device must support ps_1_1...
    if (a.pSystemInfo.getShaderVersion() >= 1.0) {
        return true;
    }

    return false;
}


/**
 * @property Initialize3DEnvironment()
 * Initialize the 3D environment for the app
 * @memberof Engine
 * @return Boolean Успешно ли все создаллось
 **/
Engine.prototype.initialize3DEnvironment = function () {
    // Initialize the app's device-dependent objects
    if (!this.initDeviceObjects()) {
        this.deleteDeviceObjects();
    }
    else {
        this._isDeviceObjectsInited = true;
        if (!this.restoreDeviceObjects()) {
            this.invalidateDeviceObjects();
        }
        else {
            this._isDeviceObjectsRestored = true;
            return true;
        }
    }

    // Cleanup before we try again
    this.cleanup3DEnvironment();

    return false;
}


Engine.prototype.invalidateDeviceObjects = function () {

    this.pDisplayManager.disableDeviceResources();
    this.pShaderManager.disableDeviceResources();
    //this.pUniqManager.disableDeviceResources();
    return true;
}

Engine.prototype.cleanup3DEnvironment = function () {
    if (this.pDevice) {
        if (this.pDevice._isDeviceObjectsRestored) {
            this.pDevice._isDeviceObjectsRestored = false;
            this.pDevice.invalidateDeviceObjects();
        }
        if (this.pDevice._isDeviceObjectsInited) {
            this.pDevice._isDeviceObjectsInited = false;
            this.pDevice.deleteDeviceObjects();
        }
    }
}


Engine.prototype.render3DEnvironment = function () {
    if (this._isDeviceLost) {
        //у нас пока он не теряется
        //но написать неплохо былобы
        debug_error("Девайс потерян");
    }

    // Get the app's time, in seconds. Skip rendering if no time elapsed
    var fAppTime = a.UtilTimer(a.UtilTimer.TimerGetAppTime);
    var fElapsedAppTime = a.UtilTimer(a.UtilTimer.TimerGetElapsedTime);

    if (( 0 == fElapsedAppTime ) && this._isFrameMoving) {
        return true;
    }

    // FrameMove (animate) the scene
    if (this._isFrameMoving || this._isSingleStep) {
        // Store the time for the app
        this.fTime = fAppTime;
        this.fElapsedTime = fElapsedAppTime;

        // Frame move the scene
        if (!this.frameMove()) {
            return false;
        }

        this._isSingleStep = false;
    }

    // Render the scene as normal
    if (!this.render()) {
        return false;
    }

    if (this._isShowStats) {
        this.updateStats();
    }

    this.pKeymap.mouseSnapshot();
    // Show the frame on the primary surface.
    //Проверка что евайс потерян и выставление сооответсвующего флага
    //не раелизовано
    this._isDeviceLost = false;

    return true;
}

Engine.prototype.frameMove = function () {
    // add the real time elapsed to our
    // internal delay counter
    this.fUpdateTimeCount += this.fElapsedTime;
    // is there an update ready to happen?

    while (this.fUpdateTimeCount > a.fMillisecondsPerTick) {
        // update the scene
        if (!this.updateScene()) {
            return false;
        }
        // subtract the time interval
        // emulated with each tick
        this.fUpdateTimeCount -= a.fMillisecondsPerTick;
    }
    return true;
}


Engine.prototype.render = function () {
    if (!this._isFrameReady) {
        return true;
    }

    if (this.pDisplayManager.beginRenderSession()) {
        // render the scene
        this.renderScene();
        // process the contents of the render queue
        this.pDisplayManager.processRenderQueue();
        this.pDisplayManager.endRenderSession();
    }
    return true;
};

Engine.prototype.beginRenderStage = function (iStage) {
    debug_assert(
        iStage < a.RenderMethod.max_render_stages,
        "invalid render stage");

    this._iActiveRenderStage = iStage;

    if (this._iActiveRenderStage ===
        a.RenderMethod.bumpMapStage) {
        // during the bump map stage,
        // we write only to the alpha
        // channel of the destination
        this.pDevice.colorMask(false, false, false, true);
    }
    else if (this._iActiveRenderStage ===
        a.RenderMethod.lightingStage) {
        // during the lighting stage,
        // we write only to the color
        // channel of the destination
        this.pDevice.colorMask(true, true, true, false);
    }

    // to keep the results of each render stage sorting correctly
    // in the z-buffer, we apply a bias to the camera matrices for
    // each stage. We could also do this with the D3DRS_DEPTHBIAS
    // render state, but it is not widly supported
    this._pActiveCamera.applyRenderStageBias(iStage);
};

Engine.prototype.endRenderStage = function () {
    if (this._iActiveRenderStage ==
        a.RenderMethod.bumpMapStage) {
        // re-enable rendering to all
        // color channels
        this.pDevice.colorMask(true, true, true, true);
    }

    this._iActiveRenderStage = 0;
};


Engine.prototype.updateStats = function () {
    // Keep track of the frame count
    var fTime = a.UtilTimer(a.UtilTimer.TimerGetAbsoluteTime);
    this.updateStats.iFrames++;

    // Update the scene stats once per second
    if (fTime - this.updateStats.fLastTime > 1.0) {
        this.fFPS = this.updateStats.iFrames / (fTime - this.updateStats.fLastTime);
        this.updateStats.fLastTime = fTime;
        this.updateStats.iFrames = 0;

        var sMultiSample = "Multisamples " + a.info.graphics.multisampleType(this.pDevice);

        this.sFrameStats.edit("" + this.fFPS.toFixed(1) + " fps (" + sMultiSample + ")");
    }
}
Engine.prototype.updateStats.fLastTime = 0.0;
Engine.prototype.updateStats.iFrames = 0.0;


Engine.prototype.getWorldExtents = function () {
    return this._pWorldExtents;
}

Engine.prototype.getDevice = function () {
    return this.pDevice;
}

Engine.prototype.getWindowTitle = function () {
    return this.sWindowTitle;
}

Engine.prototype.getCurrentRenderStage = function () {
    return this._iActiveRenderStage;
}

Engine.prototype.finalCleanup = function () {
    // destroy managers
    this.pDisplayManager.destroy();
    this.pShaderManager.destroy();
    //this.pUniqManager.destroy();
    this._pSceneTree.destroy();

    return true;
}


Engine.prototype.updateCamera = function (fLateralSpeed, fRotationSpeed, pTerrain, fGroundOffset, isForceUpdate) {

    //
    // This function reads the keyboard
    // and moves the default camera
    //
    var v3fCameraUp = this._pDefaultCamera.getUp();


    if (this.pKeymap.isKeyPress(a.KEY.RIGHT)) {
        this._pDefaultCamera.addRelRotation(0.0, 0.0, -fRotationSpeed);
        //v3fCameraUp.Z >0.0 ? fRotationSpeed: -fRotationSpeed);
    }
    else if (this.pKeymap.isKeyPress(a.KEY.LEFT)) {
        this._pDefaultCamera.addRelRotation(0.0, 0.0, fRotationSpeed);
        //v3fCameraUp.Z >0.0 ? -fRotationSpeed: fRotationSpeed);
    }

    if (this.pKeymap.isKeyPress(a.KEY.UP)) {

        this._pDefaultCamera.addRelRotation(0, fRotationSpeed, 0);
    }
    else if (this.pKeymap.isKeyPress(a.KEY.DOWN)) {
        this._pDefaultCamera.addRelRotation(0, -fRotationSpeed, 0);

    }
    var v3fOffset = Vec3.create([0, 0, 0]);
    var isCameraMoved = false;

    if (this.pKeymap.isKeyPress(a.KEY.D)) {
        v3fOffset[0] = fLateralSpeed;
        isCameraMoved = true;
    }
    else if (this.pKeymap.isKeyPress(a.KEY.A)) {
        v3fOffset[0] = -fLateralSpeed;
        isCameraMoved = true;
    }
    if (this.pKeymap.isKeyPress(a.KEY.R)) {
        v3fOffset[1] = fLateralSpeed;
        isCameraMoved = true;
    }
    else if (this.pKeymap.isKeyPress(a.KEY.F)) {
        v3fOffset[1] = -fLateralSpeed;
        isCameraMoved = true;
    }
    if (this.pKeymap.isKeyPress(a.KEY.W)) {
        v3fOffset[2] = -fLateralSpeed;
        isCameraMoved = true;
    }
    else if (this.pKeymap.isKeyPress(a.KEY.S)) {
        v3fOffset[2] = fLateralSpeed;
        isCameraMoved = true;
    }
    if (isCameraMoved || isForceUpdate) {

        // if a terrain was provided, make sure we are above it
        if (pTerrain) {
            var v3fCameraWorldPos = Vec3.create();
            Vec3.set(this._pDefaultCamera.worldPosition(), v3fCameraWorldPos);//TODO right?

            var fGroundLevel = pTerrain.calcWorldHeight(v3fCameraWorldPos.X, v3fCameraWorldPos.Y);
            var fMinCameraZ = fGroundLevel + fGroundOffset;

            if (fMinCameraZ > v3fCameraWorldPos.Z) {
                v3fOffset.Y = fMinCameraZ - v3fCameraWorldPos.Z;
            }
        }

        this._pDefaultCamera.addRelPosition(v3fOffset);
    }

}

a.Engine = Engine;
