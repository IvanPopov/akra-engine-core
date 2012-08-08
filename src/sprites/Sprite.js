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

	this._isVisible = false; //отображать спрайт на экране или нет?
	this._pProgram = null;//временно здесь хранятся программы
	this._v3fCenterPosition = Vec3.create(0,0,0);
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

PROPERTY(Sprite,'centerPosition',
	function(){
		'use strict';
		return this._v3fCenterPosition;
	},
	function(v3fCenterPosition){
		'use strict';
		this._v3fCenterPosition = v3fCenterPosition;
	}
);

Sprite.prototype.setProgram = function(pProgram) {
	'use strict';
	this._pProgram = pProgram;
};

Sprite.prototype.render = function(){
	'use strict';
	if(this._isVisible && this._fnDraw != null){
		this.renderCallback();
	}
};

Sprite.prototype.renderCallback = function() {
	'use strict';
	var pProgram = this._pProgram;
	pProgram.activate();

	pProgram.applyVector3('CENTER_POSITION',this._v3fCenterPosition);

	this._fnDraw(pProgram);
	this._pRenderData.draw();
};

A_NAMESPACE(Sprite);