/**
 * @file
 * @author Igor Karateev
 * @email iakarateev@gmail.com
 * @brief файл содержит классы источников света
 */

function LightPoint(pEngine,iMaxShadowResolution,isOmnidirectional){
	A_CLASS;

	//мкасимальный размер shadow текстуры
	this._iMaxShadowResolution = Math.ceilingPowerOfTwo(iMaxShadowResolution); 

	//всенаправленный источник или нет
	this._isOmnidirectional = isOmnidirectional;

	//depth textures for shadow maps
	//текстуры глубин для рендеринга теневых карт
	
	//depth текстура для направленного источника
	this._pDepthTexture = null;

	//depth cube map implementation
	//для всенаправленных источников
	this._pDepthTexture_POSITIVE_X = null;
	this._pDepthTexture_NEGATIVE_X = null;
	this._pDepthTexture_POSITIVE_Y = null;
	this._pDepthTexture_NEGATIVE_Y = null;
	this._pDepthTexture_POSITIVE_Z = null;
	this._pDepthTexture_NEGATIVE_Z = null;

	//текстура исключительно для colorAttachment-а 
	//пока без него рендерить во фреймбуффер нельзя
	this._pColorTexture = null;
	

	//камера для направленного источника
	this._pCamera = null;

	//камеры для всенаправленного источника
	this._pCamera_POSITIVE_X = null;
	this._pCamera_NEGATIVE_X = null;
	this._pCamera_POSITIVE_Y = null;
	this._pCamera_NEGATIVE_Y = null;
	this._pCamera_POSITIVE_Z = null;
	this._pCamera_NEGATIVE_Z = null;

	////////////////////////////////
	
	//проекционная матрица для направленного источника
	this._m4fDefaultProj = null;
	
	this._initializeTextures();
	//this._initializeCameras();
};

EXTENDS(LightPoint,a.Camera);

LightPoint.prototype._initializeTextures = function() {
	'use strict';
	
	var pEngine = this._pEngine;
	var iShadowResolution = this._iMaxShadowResolution;

	if(this._isOmnidirectional){
		this._pDepthTexture_POSITIVE_X = pEngine.displayManager().texturePool().createResource();
		this._pDepthTexture_NEGATIVE_X = pEngine.displayManager().texturePool().createResource();
		this._pDepthTexture_POSITIVE_Y = pEngine.displayManager().texturePool().createResource();
		this._pDepthTexture_NEGATIVE_Y = pEngine.displayManager().texturePool().createResource();
		this._pDepthTexture_POSITIVE_Z = pEngine.displayManager().texturePool().createResource();
		this._pDepthTexture_NEGATIVE_Z = pEngine.displayManager().texturePool().createResource();

		var pDepth_POSITIVE_X = this._pDepthTexture_POSITIVE_X;
		var pDepth_NEGATIVE_X = this._pDepthTexture_NEGATIVE_X;
		var pDepth_POSITIVE_Y = this._pDepthTexture_POSITIVE_Y;
		var pDepth_NEGATIVE_Y = this._pDepthTexture_NEGATIVE_Y;
		var pDepth_POSITIVE_Z = this._pDepthTexture_POSITIVE_Z;
		var pDepth_NEGATIVE_Z = this._pDepthTexture_NEGATIVE_Z;

		//create textures
		pDepth_POSITIVE_X.createTexture(iShadowResolution,iShadowResolution,
			0,a.IFORMAT.DEPTH_COMPONENT,a.DTYPE.UNSIGNED_INT,null);

		pDepth_NEGATIVE_X.createTexture(iShadowResolution,iShadowResolution,
			0,a.IFORMAT.DEPTH_COMPONENT,a.DTYPE.UNSIGNED_INT,null);

		pDepth_POSITIVE_Y.createTexture(iShadowResolution,iShadowResolution,
			0,a.IFORMAT.DEPTH_COMPONENT,a.DTYPE.UNSIGNED_INT,null);

		pDepth_NEGATIVE_Y.createTexture(iShadowResolution,iShadowResolution,
			0,a.IFORMAT.DEPTH_COMPONENT,a.DTYPE.UNSIGNED_INT,null);

		pDepth_POSITIVE_Z.createTexture(iShadowResolution,iShadowResolution,
			0,a.IFORMAT.DEPTH_COMPONENT,a.DTYPE.UNSIGNED_INT,null);

		pDepth_NEGATIVE_Z.createTexture(iShadowResolution,iShadowResolution,
			0,a.IFORMAT.DEPTH_COMPONENT,a.DTYPE.UNSIGNED_INT,null);
	}
	else{
		this._pDepthTexture = pEngine.displayManager().texturePool().createResource();

		var pDepth = this._pDepthTexture;

		//create texture
		pDepth.createTexture(iShadowResolution,iShadowResolution,
			0,a.IFORMAT.DEPTH_COMPONENT,a.DTYPE.UNSIGNED_INT,null);
	}

	this._pColorTexture = pEngine.displayManager().texturePool().createResource();
	var pColor = this._pColorTexture;

	pColor.createTexture(iShadowResolution,iShadowResolution,
			0,a.IFORMAT.RGBA,a.DTYPE.UNSIGNED_BYTE,null);
};


LightPoint.prototype.create = function() {
	'use strict';
	
	SceneNode.prototype.create.call(this);

	var pEngine = this._pEngine;

	if(this._isOmnidirectional){
		//create cameras
		
		this._pCamera_POSITIVE_X = new a.Camera(pEngine);
		this._pCamera_NEGATIVE_X = new a.Camera(pEngine);
		this._pCamera_POSITIVE_Y = new a.Camera(pEngine);
		this._pCamera_NEGATIVE_Y = new a.Camera(pEngine);
		this._pCamera_POSITIVE_Z = new a.Camera(pEngine);
		this._pCamera_NEGATIVE_Z = new a.Camera(pEngine);

		var pCamera_POSITIVE_X = this._pCamera_POSITIVE_X;
		var pCamera_NEGATIVE_X = this._pCamera_NEGATIVE_X;
		var pCamera_POSITIVE_Y = this._pCamera_POSITIVE_Y;
		var pCamera_NEGATIVE_Y = this._pCamera_NEGATIVE_Y;
		var pCamera_POSITIVE_Z = this._pCamera_POSITIVE_Z;
		var pCamera_NEGATIVE_Z = this._pCamera_NEGATIVE_Z;

		pCamera_POSITIVE_X.create();
		pCamera_POSITIVE_X.attachToParent(this);
		pCamera_POSITIVE_X.accessLocalMatrix().set(
			[ 0, 0, 1, 0, //first column, not row!
			  0, 1, 0, 0,
			  -1, 0, 0, 0,
			  0, 0, 0, 1
			]);
		
		pCamera_NEGATIVE_X.create();
		pCamera_NEGATIVE_X.attachToParent(this);
		pCamera_NEGATIVE_X.accessLocalMatrix().set(
			[ 0, 0, -1, 0, //first column, not row!
			  0, 1, 0, 0,
			  1, 0, 0, 0,
			  0, 0, 0, 1
			]);

		
		pCamera_POSITIVE_Y.create();
		pCamera_POSITIVE_Y.attachToParent(this);
		pCamera_POSITIVE_Y.accessLocalMatrix().set(
			[ 1, 0, 0, 0, //first column, not row!
			  0, 0, 1, 0,
			  0, -1, 0, 0,
			  0, 0, 0, 1
			]);

		
		pCamera_NEGATIVE_Y.create();
		pCamera_NEGATIVE_Y.attachToParent(this);
		pCamera_NEGATIVE_Y.accessLocalMatrix().set(
			[ 1, 0, 0, 0, //first column, not row!
			  0, 0, -1, 0,
			  0, 1, 0, 0,
			  0, 0, 0, 1
			]);

		
		pCamera_POSITIVE_Z.create();
		pCamera_POSITIVE_Z.attachToParent(this);
		pCamera_POSITIVE_Z.accessLocalMatrix().set(
			[ 1, 0, 0, 0, //first column, not row!
			  0, -1, 0, 0,
			  0, 0, -1, 0,
			  0, 0, 0, 1
			]);

		
		pCamera_NEGATIVE_Z.create();
		pCamera_NEGATIVE_Z.attachToParent(this);
		pCamera_NEGATIVE_Z.accessLocalMatrix().set(
			[ 1, 0, 0, 0, //first column, not row!
			  0, 1, 0, 0,
			  0, 0, 1, 0,
			  0, 0, 0, 1
			]); //не обязательно, но для общности
	}
	else{

		this._pCamera = new a.Camera(pEngine);

		var pCamera = this._pCamera;

		pCamera.create();
		pCamera.attachToParent(this);
		pCamera.accessLocalMatrix().set(
			[ 1, 0, 0, 0, //first column, not row!
			  0, 1, 0, 0,
			  0, 0, 1, 0,
			  0, 0, 0, 1
			]); //не обязательно, но для общности
	}
};

A_NAMESPACE(LightPoint);



