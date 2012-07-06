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

	this._pDataFactory = new a.RenderDataFactory(pEngine);
	this._pDataFactory.dataType = a.RenderData;
	this._pDataFactory.setup(a.RenderDataFactory.VB_READABLE);
};

ParticleManager.prototype.createEmitter = function(eType,nParticles){
	'use strict';
	var iId = this._pEmitters.length;
	var pDataSubset = this._pDataFactory.getEmptyRenderData(a.PRIMTYPE.POINTLIST,0);
    var pEmitter = new Emitter(this._pEngine,this,pDataSubset,eType,nParticles,iId);

    this._pEmitters.push(pEmitter);

    return pEmitter;
};

A_NAMESPACE(ParticleManager);

function Emitter(pEngine,pParticleManager,pDataSubset,eType,nParticles,iId){
	'use strict';

	A_CLASS;

	this._pEngine = pEngine;
	this._pParticleManager = pParticleManager;
	this._pDataSubset = pDataSubset;
	this._iId = iId;
	this._eType = eType; //тип источника - точки, треугольники, билборд, объект или меш
	this._nParticles = nParticles;

	this._isActive = false; // активен ли источник
	this._bParticleDataSetted = false;

	this._fTTL = 0; //время жизни источника в секундах

	this._iUpdateMapIndex = this._pDataSubset.getIndexSet();//номер карты используемой при update
	this._iDrawMapIndex = -1; //номер карты используемой при финальной отрисовке
	this._pParticleData = null; //объект хранящий данные частиц
	this._pParticleDataDeclaration = null;//декларация для данных частиц
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
	this._nCurrentTime = 0; //еальное время в миллисекундах на текущем шаге

	this._setup();
}

EXTENDS(Emitter, a.SceneObject, a.RenderableObject);

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
	pData = new Uint8Array(pData.buffer);
	var pVertexDeclaration = normalizeVertexDecl(pVertexDecl);
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

			if(pVertexElement.eUsage == 'PARTICLE_POSITION'
				|| pVertexElement.eUsage == 'PARTICLE_VELOCITY'){

				debug_assert(pVertexElement.eType == a.DTYPE.FLOAT,"позиции и скорости должна быть типа float");
				debug_assert(pVertexElement.nCount <= nElementsPerPixel,"длина скорости и позиции не должна превышать количества элементов на пиксель в текстуре");

				var pElementData; 
				if(pVertexElement.nCount < nElementsPerPixel){
					var iOffset = pVertexElement.iOffset;
					pElementData = new Uint8Array(4*this._nParticles*nElementsPerPixel);//умножить на 4 так как это float32 

					for(var j=0;j<this._nParticles;j++){

						var pSubData = pData.subarray(j*iStride + iOffset,j*iStride + iOffset + iSize);
						for(var k=0;k<iSize;k++){
							pElementData[4*nElementsPerPixel*j + k] = pSubData[k];
						}
					}
					
				}
				else{
					pElementData = new Uint8Array(iSize*this._nParticles);
					for(var j=0;j<this._nParticles;j++){
						var pSubData = pData.subarray(j*iStride + iOffset,j*iStride + iOffset + iSize);
						for(var k=0;k<iSize;k++){
							pElementData[iSize*j + k] = pSubData[k];
						}
					}
				}
				if(pVertexElement.eUsage == 'PARTICLE_POSITION'){
					if(nElementsPerPixel == 4){
						pVertexElement = [VE_VEC4('PARTICLE_POSITION')];
					}
					else if(nElementsPerPixel == 3){
						pVertexElement = [VE_VEC3('PARTICLE_POSITION')];
					}
				}
				else{
					if(nElementsPerPixel == 4){
						pVertexElement = [VE_VEC4('PARTICLE_VELOCITY')];
					}
					else if(nElementsPerPixel == 3){
						pVertexElement = [VE_VEC3('PARTICLE_VELOCITY')];
					}
				}
			}
			else{
				pElementData = new Uint8Array(iSize*this._nParticles);
				for(var j=0;j<this._nParticles;j++){
					var pSubData = pData.subarray(j*iStride + iOffset,j*iStride + iOffset + iSize);
					for(var k=0;k<iSize;k++){
						pElementData[iSize*j + k] = pSubData[k];
					}
				}
			}
			if(this._pParticleData == null){
				var iDataLocation = this._pDataSubset.allocateData(pVertexElement,pElementData);
				this._pParticleData = this._pDataSubset.getData(iDataLocation);
				this._pParticleDataDeclaration = this._pParticleData.getVertexDeclaration();			
			}
			else{
				this._pParticleData.extend(pVertexElement,pElementData);
			}
		}
	}
};

/**
 * выставляются данные для объекта, который необходимо отрисовывать, как частицу
 */
Emitter.prototype.setObjectData = function(pVertexDecl,pData){
	'use strict';
	if(this._eType != a.EMITTER.OBJECT){
		error("используемый тип частиц объектом не является");
		return;
	}

	if(!this._bParticleDataSetted){
		this._iDrawMapIndex = this._pDataSubset.addIndexSet(true,a.PRIMTYPE.TRIANGLELIST);
		this._bParticleDataSetted = true;
	}

	// pData = new Uint8Array(pData.buffer);
	// var pVertexDeclaration = normalizeVertexDecl(pVertexDecl);
	// var iStride = pVertexDeclaration.iStride;
	// var pElementData;
	// for(var i=0;i<pVertexDeclaration.length;i++){
	// 	debug_assert(pData.byteLength%iStride == 0,"неверное количество данных");
	// 	var iDataSize = pData.byteLength/iStride;
	// 	var pVertexElement = pVertexDeclaration[i];
	// 	var iSize = pVertexElement.iSize;
	// 	var iOffset = pElementData.iOffset;
	// 	pElementData = new Uint8Array(iSize*iDataSize);

	// 	for(var j=0;j<iDataSize;j++){
	// 		var pSubData = pData.subarray(j*iStride + iOffset,j*iStride + iOffset + iSize);
	// 		for(var k=0;k<iSize;k++){
	// 			pElementData[iSize*j + k] = pSubData[k];
	// 		}
	// 	}

	// 	if(_pObjectDataDeclaration == null){
	// 		var iDataLocation = this._pDataSubset.allocateData(pVertexElement,pElementData);
	// 		this._pObjectData = this._pDataSubset.getData(iDataLocation);
	// 		this._pObjectDataDeclaration = this._pParticleData.getVertexDeclaration();	
	// 	}
	// 	else{
	// 		this._pObjectData.extend(pVertexElement,pElementData);
	// 	}
	// }
	
	return this._pDataSubset.allocateData(pVertexDecl,pData);
	
};

Emitter.prototype.setObjectIndex = function(pAttrDecl,pData){
	'use strict';
	if(this._eType != a.EMITTER.OBJECT){
		error("используемый тип частиц объектом не является");
		return;
	}

	////////////
	
	pData = new Uint8Array(pData.buffer);
	var pDataExtended = new Uint8Array(pData.byteLength*this._nParticles); //необходимо для того, чтобы рендерить все объекты-частицы за один проход
	for(var i=0;i<this._nParticles;i++){
		pDataExtended.set(pData,pData.byteLength*i);
	}
	return this._pDataSubset.allocateIndex(pAttrDecl,pDataExtended);
};

Emitter.prototype.setObjectAttribute = function(pAttrDecl,pData){
	'use strict';
	if(this._eType != a.EMITTER.OBJECT){
		error("используемый тип частиц объектом не является");
		return;
	}

	////////////
	
	pData = new Uint8Array(pData.buffer);
	var pDataExtended = new Uint8Array(pData.byteLength*this._nParticles); //необходимо для того, чтобы рендерить все объекты-частицы за один проход
	for(var i=0;i<this._nParticles;i++){
		pDataExtended.set(pData,pData.byteLength*i);
	}
	return this._pDataSubset.setIndex.allocateAttribute(pAttrDecl,pDataExtended);
};

Emitter.prototype.objectIndex = function(iData,eSemantic){
	'use strict';
	if(this._eType != a.EMITTER.OBJECT){
		error("используемый тип частиц объектом не является");
		return;
	}

	////////////
	
	return this._pDataSubset.index(iData,eSemantic);
}

/**
 * устанавливается время жизни источника
 */

Emitter.prototype.setLiveTime = function(fTTL){
	'use strict'
	this._fTTL = fTTL;
};

/**
 * активация источника
 */
Emitter.prototype.activate = function(){
	//готов ли источник (должны быть проставлены позиции, скорости, и время жизни)
	
	this._pDataSubset.selectIndexSet(this._iUpdateMapIndex);
	if(this._pDataSubset.hasSemantics('PARTICLE_POSITION',false) &&
		this._pDataSubset.hasSemantics('PARTICLE_VELOCITY',false) &&
		this._fTTL > 0){
		this._generateIndices();
		this._isActive = true;
		this._nPreviousTime = a.now();
	}
};

/**
 * генерируются индексы и атрибуты для обновления и отрисовки частиц
 */
Emitter.prototype._generateIndices = function(){
	var pUpdateIndex = new Float32Array(this._nParticles);
	var pDrawIndex;

	for(var i=0;i<this._nParticles;i++){
		pUpdateIndex[i] = i;
	}

	if(this._eType == a.EMITTER.OBJECT){
		this._pDataSubset.selectIndexSet(this._iDrawMapIndex);
		this._nDrawIndexLength = this._pDataSubset.getPrimitiveCount()*3;//пока поддерживается только TRIANGLELIST
	}
	if(this._eType != a.EMITTER.MESH){
		pDrawIndex = new Float32Array(this._nDrawIndexLength);
		var nParticleDrawLength = this._nDrawIndexLength/this._nParticles;
		for(var i=0;i<this._nParticles;i++){
			for(var j=0;j<nParticleDrawLength;j++){
				pDrawIndex[i*nParticleDrawLength + j] = i;
			}
		}
	}
	this._pDataSubset.selectIndexSet(this._iUpdateMapIndex);
	this._pDataSubset.allocateIndex([VE_FLOAT('UPDATE_INDEX')],pUpdateIndex);
	this._pDataSubset.index(this._pDataSubset.getDataLocation('PARTICLE_POSITION'),'UPDATE_INDEX');

	if(this._etype != a.EMITTER.MESH){
		this._pDataSubset.selectIndexSet(this._iDrawMapIndex);
		this._pDataSubset.allocateAttribute([VE_FLOAT('INDEX_PARTICLE_POSITION')],pDrawIndex);
	}

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

	if(this._isActive && this._fnUpdate!=null){
		this._update();
	}
};

/**
 * здесь происходит реальное обновление источника
 */

Emitter.prototype._update = function(){
	'use strict';
	this._fTime += this._fDt;
	this._nCurrentTime = a.now();
	this._fDt = (this._nCurrentTime - this._nPreviousTime)/1000;
	this._nPreviousTime = this._nCurrentTime;
	this._nStep++;//увеличиваем номер шага по времени

	this._pDataSubset.selectIndexSet(this._iUpdateMapIndex);

	//TODO:
	//цикл по passes в update renderMethod-е

	this._fnUpdate(this._fDt,this._fTime,this._nStep,'velocity');
	this._pDataSubset._pMap.draw();

	this._fnUpdate(this._fDt,this._fTime,this._nStep,'position');
	this._pDataSubset._pMap.draw();
};

/**
 * перегруженный render от SceneObject
 */
Emitter.prototype.render = function() {
	'use strict';
	//TODO:
	//использовать очередь рендеринга
	if(this._isActive && this._fnDraw!=null){
		this.renderCallback();
	}
};

Emitter.prototype.renderCallback = function() {
	'use strict';
	this._pDataSubset.selectIndexSet(this._iDrawMapIndex);
	this._fnDraw(this._fDt,this._fTime,this._nStep,'draw');
	this._pDataSubset.draw();
};

A_NAMESPACE(Emitter);

