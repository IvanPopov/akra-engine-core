/**
 * @file
 * @brief файл содержит реализацию прайтов в Akra Engine
 * @author Igor Karateev
 * @email iakarateev@gmail.com
 */

function SpriteManager(pEngine){
	'use strict';
	this._pEngine = pEngine;
	this._pSprites = [];

	this._pDataFactory = new a.RenderDataBuffer(pEngine);
	this._pDataFactory.dataType = a.RenderData;
	this._pDataFactory.setup(a.RenderDataBuffer.VB_READABLE);
};

SpriteManager.prototype.registerSprite = function(pSprite) {
	'use strict';
	var pDataSubset = this._pDataFactory.getEmptyRenderData(a.PRIMTYPE.TRIANGLESTRIP,0);
	this._pSprites.push(pSprite);

	return pDataSubset;
};

A_NAMESPACE(SpriteManager);

function Sprite(pEngine){
	'use strict';
	A_CLASS;

	this._pEngine = pEngine;
	this._pRenderData = pEngine.spriteManager().registerSprite(this);

	this._bGeometrySetted = false;
	this._fnDraw = null; //пользовательская функция для отрисовки спрайта

	this._isVisible = true; //отображать спрайт на экране или нет?
}

EXTENDS(Sprite, a.SceneObject, a.RenderableObject);

Sprite.prototype._setup = function(pAttrDecl,pData){
	return this._pRenderData.allocateAttribute(pAttrDecl,pData);
}

Sprite.prototype.setGeometry = function(fSizeX,fSizeY) {
	'use strict';
	if(this._bGeometrySetted){
		error('геометрия уже установлена');
		return;
	}
	else{
		this._bGeometrySetted = true;
	}

	var pGeometry = new Float32Array(4*3);//4 вершины по 3 координаты

	for(var i=0;i<4;i++){
		var signX = Math.floor(i/2)*2 - 1;
		var signY = (i%2)*2 - 1;

		pGeometry[3*i    ] = signX*fSizeX/2;
		pGeometry[3*i + 1] = signY*fSizeY/2;
		pGeometry[3*i + 2] = 0;
	}

	var fMaxSize = (fSizeX > fSizeY) ? fSizeX : fSizeY;

	this.accessLocalBounds().set(fMaxSize,fMaxSize,fMaxSize);

	return this._setup([VE_VEC3('POSITION_OFFSET')],pGeometry);
};

Sprite.prototype.setData = function(pAttrDecl,pData) {
	'use strict';
	var pAttrDeclaration = normalizeVertexDecl(pAttrDecl);
	pData = new Uint8Array(pData.buffer);

	var iStride = pAttrDeclaration.iStride;
	if(pData.length/iStride != 4){
		error('неверное количество данных, данные должны быть установлены для каждой вершины спрайта');
		return;
	}
	if(pAttrDeclaration.hasSemantics('POSITION')){
		error('семантика POSITION является системной для спрайта и не может использоваться');
		return;
	}
	return this._setup(pAttrDeclaration,pData);
};

PROPERTY(Sprite,'drawRoutine',
	function(){
		'use strict';
		return this._fnDraw;
	},
	function(fnDraw){
		'use strict';
		this._fnDraw = fnDraw;
	}
);

PROPERTY(Sprite,'visible',
	function(){
		'use strict';
		return this._isVisible;
	},
	function(isVisible){
		'use strict';
		this._isVisible = isVisible;
	}
);
var zzzzz;
Sprite.prototype.render = function(){
	'use strict';
	if(this._isVisible && this._fnDraw != null){

		var pRenderer = this._pEngine.shaderManager();
		var pDeferredFrameBuffer = this._pEngine.lightManager().deferredFrameBuffers[0];

		pRenderer.setViewport(0, 0, this._pEngine.pCanvas.width, this._pEngine.pCanvas.height);

		pRenderer.activateSceneObject(this);
		this.startRender();

		this.activatePass(0);

		var pSnapshot = this._pActiveSnapshot;

		this._fnDraw(pSnapshot);
		this.applyRenderData(this._pRenderData);

		pRenderer.activateFrameBuffer(pDeferredFrameBuffer);

		var pEntry = this.renderPass();
		if(zzzzz === undefined){
			zzzzz = 1;
			console.log(pEntry.pProgram,pEntry.pUniforms, pEntry.pTextures);
		}

		this.deactivatePass();
		this.finishRender();

		pRenderer.deactivateSceneObject();

		pRenderer.activateFrameBuffer(null);
	}
};

// Sprite.prototype.renderCallback = function() {
// 	'use strict';
// 	var pProgram = this._pProgram;
// 	pProgram.activate();

	

// };

A_NAMESPACE(Sprite);