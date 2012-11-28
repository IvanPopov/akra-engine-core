/**
 * @file
 * @brief файл содержит реализацию эмиттеров и эмиттер менеджера в Akra Engine
 * @author Igor Karateev
 * @email iakarateev@gmail.com
 */

Enum(
	[ 
		POINT = 1,
		TRIANGLE = 3,
		BILLBOARD = 4,
		OBJECT,
		MESH
	], TYPE , a.EMITTER);

function ParticleManager(pEngine){
	'use strict';
	this._pEmitters = [];
	//this._nEmitterCount = 0;

	//this._nCounter = 0;
	//this._isUpdated = false;
	//this._isRendered = false;
	this._pEngine = pEngine;

	this._pDataFactory = new a.RenderDataBuffer(pEngine);
	this._pDataFactory.dataType = a.RenderData;
	this._pDataFactory.setup(a.RenderDataBuffer.VB_READABLE);

	this._pFramebuffer = null;

	this._setup();
};

ParticleManager.prototype._setup = function(){
	'use strict';
	var pDevice = this._pEngine.pDevice;
	this._pFramebuffer = pDevice.createFramebuffer();
}

ParticleManager.prototype.registerEmitter = function(pEmitter){
	'use strict';
	var pDataSubset = this._pDataFactory.getEmptyRenderData(a.PRIMTYPE.POINTLIST,0);
    this._pEmitters.push(pEmitter);

    return pDataSubset;
}

A_NAMESPACE(ParticleManager);

function Emitter(pEngine,eType,nParticles){
	'use strict';
	A_CLASS;

	this._pEngine = pEngine;
	this._pDataSubset = pEngine.particleManager().registerEmitter(this);
	this._eType = eType; //тип источника - точки, треугольники, билборд, объект или меш
	this._nParticles = nParticles;

	this._isActive = false; // активен ли источник
	this._bParticleDataSetted = false;

	this._fTTL = 0; //время жизни источника в секундах

	this._iUpdateMapIndex = this._pDataSubset.getIndexSet();//номер карты используемой при update
	this._iDrawMapIndex = -1; //номер карты используемой при финальной отрисовке
	this._pParticleData = null; //объект хранящий данные частиц
	this._pObjectData = null;//объект хранящий данные для объектов (используеться только для биллбордов и треугольников)
	//this._pParticleDataDeclaration = null;//декларация для данных частиц
	//this._iObjectMapIndex = -1; //номер карты используемой для хранения объекта
	//this._pObjectData = null; //объект хранящий данные модели
	//this._pObjectDataDeclaration = null;//декларация данных для объекта

	this._pMesh = null;//указатель на mesh, используется если тип источника выставлен, как mesh

	//this._nPointsPerParticle = -1;
	/**
	 * длина индекса необходимая для того, чтобы отрисовать все частицы
	 * используеться для того чтобы подать, координаты (и все остальное) частиц в момент отрисовки
	 */
	this._nDrawIndexLength = -1;

	this._fnUpdate = null; //пользовательская функция для обновления частиц
	this._fnDraw = null; //пользовательская функция для отрисовки частиц

	this._fTime = 0; //текущее время для источника в секундах
	this._fDt = 0; //текущий шаг по времени в секундах
	this._nStep = 0; //номер текущего шага по времени

	this._nPreviousTime = 0; //реальное время в миллисекундах, на предыдущем шаге
	this._nCurrentTime = 0; //реальное время в миллисекундах на текущем шаге

	this._pPrograms = []; //временная мера, потом все будет через renderMethod

	this._pParticleOffsetsList = {}; //храняться оффсеты для данных частиц
	this._pObjectOffsetsList = {}; //храняться оффсеты для данных объекста (только для биллбордов и треугольников)

	this._fTimeAcceleration = 1;//уровень ускорения времени по сравнению с реальным

	this._setup();
}

EXTENDS(Emitter, a.SceneObject, a.RenderableObject);

//временная функция потом все будет делаться через renderMethod
Emitter.prototype.setProgram = function(pProgram){
	'use strict';
	this._pPrograms.push(pProgram);
};

Emitter.prototype._setup = function() {
	'use strict';
	switch (this._eType){
		case a.EMITTER.POINT : 
			//this._nPointsPerParticle = 1;
			this._nDrawIndexLength = 1 * this._nParticles; //просто точки
			break;
		case a.EMITTER.TRIANGLE :
			//this._nPointsPerParticle = 3;
			this._nDrawIndexLength = 3 * this._nParticles; //треугольник
			break;
		case a.EMITTER.BILLBOARD :
			//this._nPointsPerParticle = 4;
			this._nDrawIndexLength = 6 * this._nParticles; //два треугольника
			break;
		case a.EMITTER.OBJECT :
		case a.EMITTER.MESH : 
			break;
		default :
			console.error('неверный тип частиц');
			this._eType = a.EMITTER.POINTLIST;
			break;
	}
};


/**
 * выставляються данные для частиц в целом (т.е координаты центра, скорости и т.д.)
 */

Emitter.prototype.setParticleData = function(pVertexDecl,pData){
	'use strict';
	if(this._bParticleDataSetted){
		console.error("нельзя добавлять данные для частиц после добавления данных для объекта");
		return;
	}
	var pVertexDeclaration = normalizeVertexDecl(pVertexDecl);

	if(pVertexDeclaration.hasSemantics('POSITION')){
		error('семантику POSITION апрещено использовать для данных частиц, используйте PARTICLE_POSITION');
		return;
	}

	pData = new Uint8Array(pData.buffer);
	var iStride = pVertexDeclaration.stride;
	//var nElementsPerPixel = this._pDataSubset._pFactory._pVideoBuffer._numElementsPerPixel;
	var nElementsPerPixel = 4;
	if(!this._isActive){
		debug_assert(pData.byteLength%iStride == 0,"неверное количество данных");
		debug_assert(this._nParticles == pData.byteLength/iStride,"количество данных не соответствует количеству частиц");

		for(var i=0;i<pVertexDeclaration.length;i++){
			var pVertexElement = pVertexDeclaration[i];
			var iSize = pVertexElement.iSize;
			var pElementData;
			var iOffset = pVertexElement.iOffset;
			var pNewVertexDeclaration;

			if(pVertexElement.eUsage == 'PARTICLE_POSITION'
				|| pVertexElement.eUsage == 'PARTICLE_VELOCITY' || 1){

				debug_assert(pVertexElement.eType == a.DTYPE.FLOAT,"позиции и скорости должна быть типа float");
				debug_assert(pVertexElement.nCount <= nElementsPerPixel,"длина скорости и позиции не должна превышать количества элементов на пиксель в текстуре");

				var pElementData; 
				pElementData = new Uint8Array(4*this._nParticles*nElementsPerPixel);//умножить на 4 так как это float32 
				for(var j=0;j<this._nParticles;j++){
					var pSubData = pData.subarray(j*iStride + iOffset,j*iStride + iOffset + iSize);
					pElementData.set(pSubData,4*nElementsPerPixel*j)
				}

				if(pVertexElement.eUsage == 'PARTICLE_POSITION'){
					pNewVertexDeclaration = [VE_VEC4('PARTICLE_POSITION')];
				}
				else if(pVertexElement.eUsage == 'PARTICLE_VELOCITY'){
					pNewVertexDeclaration = [VE_VEC4('PARTICLE_VELOCITY')];
				}
				else{
					pNewVertexDeclaration = [VE_VEC4(pVertexElement.eUsage)];	
				}
			}
			else{
				pElementData = new Uint8Array(iSize*this._nParticles);
				for(var j=0;j<this._nParticles;j++){
					var pSubData = pData.subarray(j*iStride + iOffset,j*iStride + iOffset + iSize);
					pElementData.set(pSubData,iSize*j);
				}
			}
			if(this._pParticleData == null){
				var iDataLocation = this._pDataSubset.allocateData(pNewVertexDeclaration,pElementData);
				this._pParticleData = this._pDataSubset.getData(iDataLocation);
				//this._pParticleDataDeclaration = this._pParticleData.getVertexDeclaration();			
			}
			else{
				this._pParticleData.extend(pNewVertexDeclaration,pElementData);
			}
			var pDeclaration = this._pParticleData.getVertexDeclaration();//пока будет так для надежности
			var iOffset = pDeclaration.element(pVertexElement.eUsage).iOffset/4.;
			var sUniformName = 'INDEX_' + pVertexElement.eUsage + '_OFFSET';

			this._pParticleOffsetsList[sUniformName] = iOffset;
		}
	}
};

Emitter.prototype._setObjectData = function(pVertexDecl,pData){
	'use strict';
	if(!this._bParticleDataSetted){
		if(this._eType == a.EMITTER.BILLBOARD){
			this._iDrawMapIndex = this._pDataSubset.addIndexSet(true, a.PRIMTYPE.TRIANGLESTRIP, 'draw');	
		}
		else{
			this._iDrawMapIndex = this._pDataSubset.addIndexSet(true, a.PRIMTYPE.TRIANGLELIST, 'draw');		
		}
		this._bParticleDataSetted = true;
	}
	if(this._eType == a.EMITTER.OBJECT){
		return this._pDataSubset.allocateData(pVertexDecl,pData);
	}
	else{
		var pVertexDeclaration = normalizeVertexDecl(pVertexDecl);
		pData = new Uint8Array(pData.buffer);
		var nElementsPerPixel = 4;
		var iStride = pVertexDeclaration.iStride;

		var pElementData;
		var nEndIndex;
		if(this._eType == a.EMITTER.BILLBOARD){
			pElementData = new Uint8Array(16*nElementsPerPixel);//умножить на 4 так как это float32 и еще на 4, так как у биллборда только 4 вершины
			nEndIndex = 4;
		}
		else{
			//this._eType == a.EMITTER.TRIANGLE
			pElementData = new Uint8Array(12*nElementsPerPixel);//умножить на 4 так как это float32 и еще на 3, так как у треугольника только 3 вершины	
			nEndIndex = 3;
		}

		for(var i=0;i<pVertexDeclaration.length;i++){
			var pVertexElement = pVertexDeclaration[i];
			var iSize = pVertexElement.iSize;
			var iOffset = pVertexElement.iOffset;
			
			var pNewVertexDeclaration;

			for(var j=0;j<nEndIndex;j++){
				var pSubData = pData.subarray(j*iStride + iOffset,j*iStride + iOffset + iSize);
				pElementData.set(pSubData,4*nElementsPerPixel*j);//умножить на 4 так как float32
			}
			pNewVertexDeclaration = [VE_VEC4(pVertexElement.eUsage)];
		}
		
		if(this._pObjectData == null){
			var iDataLocation = this._pDataSubset.allocateData(pNewVertexDeclaration,pElementData);
			this._pObjectData = this._pDataSubset.getData(iDataLocation);	
		}
		else{
			this._pObjectData.extend(pNewVertexDeclaration,pElementData);
		}
		var pDeclaration = this._pObjectData.getVertexDeclaration();//пока будет так для надежности
		var iOffset = pDeclaration.element(pVertexElement.eUsage).iOffset/4.;
		var sUniformName = 'INDEX_' + pVertexElement.eUsage + '_OFFSET';

		this._pObjectOffsetsList[sUniformName] = iOffset;
	}
}

Emitter.prototype._setObjectIndex = function(pAttrDecl,pData) {
	'use strict';
	pData = new Uint8Array(pData.buffer);
	var pDataExtended = new Uint8Array(pData.byteLength*this._nParticles); //необходимо для того, чтобы рендерить все объекты-частицы за один проход
	for(var i=0;i<this._nParticles;i++){
		pDataExtended.set(pData,pData.byteLength*i);
	}
	return this._pDataSubset.allocateIndex(pAttrDecl,pDataExtended);
};

Emitter.prototype._setObjectAttribute = function(pAttrDecl,pData) {
	'use strict';
	pData = new Uint8Array(pData.buffer);
	var pDataExtended = new Uint8Array(pData.byteLength*this._nParticles); //необходимо для того, чтобы рендерить все объекты-частицы за один проход
	for(var i=0;i<this._nParticles;i++){
		pDataExtended.set(pData,pData.byteLength*i);
	}
	return this._pDataSubset.setIndex.allocateAttribute(pAttrDecl,pDataExtended);
};

Emitter.prototype._objectIndex = function(iData,eSemantic){
	'use strict';
	return this._pDataSubset.index(iData,eSemantic);
}

/**
 * выставляются данные для объекта, который необходимо отрисовывать, как частицу
 */
Emitter.prototype.setObjectData = function(pVertexDecl,pData){
	'use strict';
	var pVertexDeclaration = normalizeVertexDecl(pVertexDecl);
	if(this._eType == a.EMITTER.OBJECT){
		return this._setObjectData(pVertexDecl,pData);
	}
	else if(this._eType == a.EMITTER.BILLBOARD){
		if(pVertexDeclaration.hasSemantics('POSITION')){
			error('семантика POSITION запрещена для биллборда');
			return;
		}
		var iStride = pVertexDeclaration.iStride;
		if(pData.byteLength/iStride != 4){
			error("неверное количество данных, для биллборда можно выставить данные только для четырех вершин");
			return;
		}
		this._setObjectData(pVertexDeclaration,pData);
	}
	else if(this._eType == a.EMITTER.TRIANGLE){
		if(pVertexDeclaration.hasSemantics('POSITION')){
			error('семантика POSITION запрещена для частиц-треугольников');
			return;
		}
		var iStride = pVertexDeclaration.iStride;
		if(pData.byteLength/iStride != 3){
			error("неверное количество данных, для треугольника можно выставить данные только для трех вершин");
			return;
		}
		this._setObjectData(pVertexDeclaration,pData);
	}
	else{
		error("используемый тип частиц объектом не является");
		return;
	}
	
};

Emitter.prototype.setObjectIndex = function(pAttrDecl,pData){
	'use strict';
	if(this._eType == a.EMITTER.OBJECT){
		return this._setObjectIndex(pAttrDecl,pData);
	}
	error("данную функцию можно использовать только для частиц-объектов");
	return;
	
};

Emitter.prototype.setObjectAttribute = function(pAttrDecl,pData){
	'use strict';
	if(this._eType == a.EMITTER.OBJECT){
		return this._setObjectAttribute(pAttrDecl,pData);
	}
	error("данную функцию можно использовать только для частиц-объектов");
	return;
	
};

Emitter.prototype.objectIndex = function(iData,eSemantic){
	'use strict';
	if(this._eType == a.EMITTER.OBJECT){
		return this._objectIndex(iData,eSemantic);	
	}
	error("данную функцию можно использовать только для частиц-объектов");
	return;
	
};

/**
 * устанавливается время жизни источника
 */

Emitter.prototype.setLiveTime = function(fTTL){
	'use strict'
	this._fTTL = fTTL;
};

Emitter.prototype.setTimeAcceleration = function(fTimeAcceleration){
	'use strict';
	this._fTimeAcceleration = fTimeAcceleration;
}

/**
 * активация источника
 */
Emitter.prototype.activate = function(){
	'use strict';
	//готов ли источник (должны быть проставлены позиции, скорости, и время жизни)
	this._pDataSubset.selectIndexSet(this._iUpdateMapIndex);
	if(this._pDataSubset.hasSemantics('PARTICLE_POSITION',false) &&
		this._pDataSubset.hasSemantics('PARTICLE_VELOCITY',false) &&
		this._fTTL > 0){
		if(this._generateIndices()){
			this._isActive = true;
			this._nPreviousTime = a.now();
			return true;
		}
		else{
			return false;
		}
	}
};

/**
 * генерируются индексы и атрибуты для обновления и отрисовки частиц
 */
Emitter.prototype._generateIndices = function(){
	'use strict';

	var pUpdateIndex = new Float32Array(this._nParticles);
	var pDrawIndex;

	if(this._iDrawMapIndex == -1 && this._eType == a.EMITTER.OBJECT){
		error('данные объекта не выставлены');
		return false;
	}

	for(var i=0;i<this._nParticles;i++){
		pUpdateIndex[i] = i;
	}

	var iPos = this._pDataSubset.getDataLocation('PARTICLE_POSITION');
	var pDeclaration = this._pParticleData.getVertexDeclaration();
	var iStride = pDeclaration.iStride;

	this._pDataSubset.selectIndexSet(this._iDrawMapIndex);

	if(this._eType == a.EMITTER.TRIANGLE){
		//заполняем семантику POSITION у объекта и генерируем индекс для рисования
		this._setObjectData([VE_VEC3('POSITION')],new Float32Array([-0.5,-Math.sqrt(3)/6,0,  0,Math.sqrt(3)/3,0,   0.5,-Math.sqrt(3)/6,0]));
		this._setObjectIndex([VE_FLOAT('INDEX_POSITION')],new Float32Array([0,1,2]));
		var iObjectDataPosition = this._pDataSubset.getDataLocation('POSITION');
		this._objectIndex(iObjectDataPosition,'INDEX_POSITION');
	}
	else if(this._eType == a.EMITTER.BILLBOARD){
		//заполняем семантику POSITION у объекта и генерируем индекс для рисования
		this._setObjectData([VE_VEC3('POSITION')],new Float32Array([-1,-1,0,  -1,1,0,  1,-1,0,  1,1,0]));
		//this._setObjectIndex([VE_FLOAT('INDEX_POSITION')],new Float32Array([0,1,2,1,2,3]));
		this._setObjectIndex([VE_FLOAT('INDEX_POSITION')],new Float32Array([0,0,1,2,3,3]));//рисуем TRIANGLESTRIP

		var iObjectDataPosition = this._pDataSubset.getDataLocation('POSITION');
		this._objectIndex(iObjectDataPosition,'INDEX_POSITION');
	}
	else if(this._eType == a.EMITTER.OBJECT){
		this._nDrawIndexLength = this._pDataSubset.getPrimitiveCount()*3;//пока поддерживается только TRIANGLELIST
	}

	if(this._eType != a.EMITTER.MESH && this._eType != a.EMITTER.POINT){
		//для POINT,TRIANGLE и BILLBORD this._nDrawIndexLength выставлено в функции _setup
		pDrawIndex = new Float32Array(this._nDrawIndexLength);
		var nParticleDrawLength = this._nDrawIndexLength/this._nParticles;
		for(var i=0;i<this._nParticles;i++){
			for(var j=0;j<nParticleDrawLength;j++){
				pDrawIndex[i*nParticleDrawLength + j] = i;
			}
		}
	}

	// trace(this._pDataSubset.toString());
	// trace(this._pObjectData.getTypedData('TEXTURE_POSITION'),this._pObjectData.getTypedData('POSITION'));

	this._pDataSubset.selectIndexSet(this._iUpdateMapIndex);
	this._pDataSubset.allocateIndex([VE_FLOAT('INDEX_UPDATE')],pUpdateIndex);
	this._pDataSubset.index(iPos,'INDEX_UPDATE');

	if(this._eType != a.EMITTER.MESH && this._eType != a.EMITTER.POINT){
		this._pDataSubset.selectIndexSet(this._iDrawMapIndex);
		if (!this._pDataSubset.allocateIndex([VE_FLOAT('INDEX_PARTICLE')],pDrawIndex)) {
			error('cannot allocate index: INDEX_PARTICLE');
		}
		this._pDataSubset.index(iPos,'INDEX_PARTICLE');
	}

	return true;
};

PROPERTY(Emitter,'updateRoutine',
	function(){
		'use strict';
		return this._fnUpdate;
	},
	function(fnUpdate){
		'use strict';
		this._fnUpdate = fnUpdate;
	}
);

PROPERTY(Emitter,'drawRoutine',
	function(){
		'use strict';
		return this._fnDraw;
	},
	function(fnDraw){
		'use strict';
		this._fnDraw = fnDraw;
	}
);

/**
 * перегруженный update от SceneObject
 */
Emitter.prototype.update = function(){
	'use strict';
	parent(SceneObject).update.call(this);
	if(this._isActive && this._fnUpdate!=null){
		this._update();
	}
};

/**
 * здесь происходит реальное обновление источника
 */

Emitter.prototype._update = function(){
	'use strict';
	var pDevice = this._pEngine.pDevice;
	var pFramebuffer = this._pEngine.particleManager()._pFramebuffer;

	pDevice.bindFramebuffer(pDevice.FRAMEBUFFER,pFramebuffer);
	
	var pDataBuffer = this._pEngine.particleManager()._pDataFactory._pDataBuffer;
	pDevice.framebufferTexture2D(pDevice.FRAMEBUFFER,pDevice.COLOR_ATTACHMENT0,pDevice.TEXTURE_2D,pDataBuffer._pTexture,0);
	var iHeight = pDataBuffer.height;
	var iWidth = pDataBuffer.width;
	
	pDevice.viewport(0,0,iWidth,iHeight);

	this._fTime += this._fDt;
	this._nCurrentTime = a.now();
	this._fDt = this._fTimeAcceleration*(this._nCurrentTime - this._nPreviousTime)/1000;
	this._nPreviousTime = this._nCurrentTime;
	this._nStep++;//увеличиваем номер шага по времени

	//trace(pDeclaration);
	//console.error('-----------------><--------------------');

	var pUniformList; //список в котором хранятся юниформы программы

	this._pDataSubset.selectIndexSet(this._iUpdateMapIndex);
	
	//trace(this._pDataSubset.toString());

	//velocity update

	var pProgram = this._pPrograms[0];
	pProgram.activate();

	pUniformList = pProgram._pUniformList; 

	for(var sName in this._pParticleOffsetsList){
		var iOffset = this._pParticleOffsetsList[sName];
		if(pUniformList[sName] != undefined){
			pProgram.applyFloat(sName,iOffset);
		}
	}

	//TODO:
	//цикл по passes в update renderMethod-е

	this._fnUpdate(this._fDt,this._fTime,this._nStep,pProgram,'velocity');

	//trace(this._pDataSubset.toString(), this._pDataSubset);
	//statics.iCount++;
	
	this._pDataSubset.draw();
	

	//position update

	pProgram = this._pPrograms[1];
	pProgram.activate();

	pUniformList = pProgram._pUniformList; 
	for(var sName in this._pParticleOffsetsList){
		var iOffset = this._pParticleOffsetsList[sName];
		if(pUniformList[sName] != undefined){
			pProgram.applyFloat(sName,iOffset);
		}
	}

	this._fnUpdate(this._fDt,this._fTime,this._nStep,pProgram,'position');
	this._pDataSubset.draw();

	pDevice.flush();
	pDevice.bindFramebuffer(pDevice.FRAMEBUFFER,null);
};

/**
 * перегруженный render от SceneObject
 */
Emitter.prototype.render = function() {
	'use strict';
	//TODO:
	//использовать очередь рендеринга
	if(this._isActive && this._fnDraw!=null){
		//this.renderCallback();
	}
};

Emitter.prototype.renderCallback = function() {
	'use strict';
	
	if(this._eType == a.EMITTER.POINT){
		this._pDataSubset.selectIndexSet(this._iUpdateMapIndex);
	}
	else{
		this._pDataSubset.selectIndexSet(this._iDrawMapIndex);
	}
	var pProgram = this._pPrograms[this._pPrograms.length - 1];
	pProgram.activate();

	var pUniformList; //список в котором хранятся юниформы программы

	pUniformList = pProgram._pUniformList; 

	if(this._eType == a.EMITTER.TRIANGLE || this._eType == a.EMITTER.BILLBOARD){
		for(var sName in this._pObjectOffsetsList){
			var iOffset = this._pObjectOffsetsList[sName];
			if(pUniformList[sName] != undefined){
				pProgram.applyFloat(sName,iOffset);
			}	
		}
	}
	for(var sName in this._pParticleOffsetsList){
		var iOffset = this._pParticleOffsetsList[sName];
		if(pUniformList[sName] != undefined){
			pProgram.applyFloat(sName,iOffset);
		}
	}
	
	this._fnDraw(this._fDt,this._fTime,this._nStep,pProgram,'draw');

	var pDevice = this._pEngine.pDevice;
	pDevice.enable(pDevice.BLEND);
    pDevice.disable(pDevice.DEPTH_TEST);
    pDevice.blendFunc(pDevice.SRC_ALPHA, pDevice.ONE_MINUS_SRC_ALPHA);

	this._pDataSubset.draw();

	pDevice.enable(pDevice.DEPTH_TEST);
    pDevice.disable(pDevice.BLEND);
};

A_NAMESPACE(Emitter);

