// function Emitter(){
// 	this._pDirection
// }

// var pDecl = new a.VertexDeclaration([
//  VE_VEC3('POSITION'),
//  VE_VEC3('NORMAL'),
//  VE_VEC3('TEXCOORD')
// ]);


// function Manager(pEngine) {
//  this._pEngine = pEngine;
//  this._pVideoBuffer = null;
// }

// Manager.prototype.init = function() {
//  this._pVideoBuffer = 
//   this._pEngine.displayManager().videoBufferPool().createResource('...');
//  this._pVideoBuffer.create(0, FLAG(a.VBufferBase.ReadableBit));
// };

// Manager.prototype.createEmitter = function(nParticles, pDecl) {
//  var pEmitterData = null;

//  pEmitterData = this._pVideoBuffer.getEmptyVertexData(nParticles, pDecl);
//  pEmitterData.getData('position.x');
// };

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
	this._pVideoBuffer = null;

	this._pEmitters = [];
	//this._nEmitterCount = 0;

	this._nCounter = 0;
	this._isUpdated = false;
	this._isRendered = false;

	this._pDataFactory = new a.RenderDataFactory(pEngine);
	this._pDataFactory.subsetType = a.RenderDataSubset;
}

ParticleManager.prototype.createEmitter = function(nParticles){
	'use strict';

	var pDataSubset = this._pDataFactory.allocateSubset(a.PRIMTYPE.POINTS,0);
	pDataSubset.addRef();

    var iEmitterId = this._pEmitters.length;
    var pEmitter = new Emitter(this._pEngine,pDataSubset,iEmitterId,nParticles);

    this._pEmitters.push(pEmitter);

    return pEmitter;
}

// ParticleManager.prototype._update = function(){
// 	'use strict';
// 	if(!this._isUpdated){
// 		this._isUpdated = true;
// 		this._isRendered = false;
// 		this._updateCycle();
// 	}
// }

// ParticleManager.prototype._updateCycle = function(){
// 	'use strict';
// }

// ParticleManager.prototype._render = function(){
// 	'use strict';
// 	if(!this._isRendered){
// 		this._isRendered = true;
// 		this._isUpdated = false;
// 		this._renderCycle();
// 	}
// }

// ParticleManager.prototype._renderCycle = function(){
// 	'use strict';
// 	//for(var i=0;i<)
// }

A_NAMESPACE(ParticleManager);

function Emitter(pEngine,pDataSubset,iId,nParticles){
	'use strict';

	A_CLASS;

	this._pEngine = pEngine;
	//this._pParticleManager = pParticleManager;
	this._pDataSubset = pDataSubset;
	this._iId = iId;
	this._eType = -1; //тип источника - точки, треугольники, билборд, объект или меш
	this._nParticles = nParticles;

	this._isActive = false; // активен ли источник
	this._bParticleDataSetted = false;
	this._bEmitterTypeSetted = false;

	this._fTime = 0; //текущее время для источника
	this._fTTL = 0; //время жизни источника

	this._iUpdateMapIndex = this._pDataSubset.getIndexSet();//номер карты используемой при update
	this._iObjectMapIndex = -1; //номер карты используемой для хранения j,]trnf
	this._iDrawMapIndex = -1; //номер карты используемой при финальной отрисовке
	this._pParticleData = null; //объект хранящий данные частиц
	this._pParticleDataDeclaration = null;//декларация для данных частиц
	this._pObjectData = null; //объект хранящий данные модели
	this._pObjectDataDeclaration = null;//декларация данных для объекта

	this._pMesh = null;//указатель на mesh, используется если тип источника выставлен, как mesh

	//this._nPointsPerParticle = -1;
	/**
	 * длина индекса необходимая для того, чтобы отрисовать все частицы
	 * используеться для того чтобы подать, координаты (и все остальное) частиц в момент отрисовки
	 */
	this._nDrawIndexLength = -1;



}

EXTENDS(Emitter, a.SceneObject, a.RenderableObject);

/**
 * выставляються данные для частиц в целом (т.е координаты центра, скорости и т.д.)
 */

Emitter.prototype.setParticleData = function(pVertexDecl,pData){
	'use strict';
	if(this._bParticleDataSetted){
		console.error("нельзя добавлять данные для частиц после добавления данных для объекта");
		return;
	}
	pData = new Uint8Array(pData);
	var pVertexDeclaration = normalizeVertexDecl(pVertexDeclaration);
	var iStride = pVertexDeclaration.stride;
	var nElementsPerPixel = this._pDataSubset._pFactory._pVideoBuffer._numElementsPerPixel;
	if(!this._isActive){
		debug_assert(pData.byteLength%iStride == 0,"неверное количество данных");
		debug_assert(this._nParticles == pData.byteLength/iStride,"количество данных не соответствует количеству частиц");

		for(var i=0;i<pVertexDeclaration.length;i++){
			var pVertexElement = pVertexDeclaration[i];
			var iSize = pVertexElement.iSize;
			var pElementData;

			if(pVertexElement.eUsage == a.DECLUSAGE.POSITION
				|| pVertexElement.eUsage == a.DECLUSAGE.VELOCITY){

				debug_assert(pVertexElement.eType == a.DTYPE.FLOAT,"позиции и скорости должна быть типа float");
				debug_assert(iSize <= nElementsPerPixel,"длина скорости и позиции не должна превышать количества элементов на пиксель в текстуре");

				var pElementData; 
				if(iSize < nElementsPerPixel){
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
				if(pVertexElement.eUsage == a.DECLUSAGE.POSITION){
					if(nElementsPerPixel == 4){
						pVertexElement = [VE_VEC4('POSITION')];
					}
					else if(nElementsPerPixel == 3){
						pVertexElement = [VE_VEC3('POSITION')];
					}
				}
				else{
					if(nElementsPerPixel == 4){
						pVertexElement = [VE_VEC4('VELOCITY')];
					}
					else if(nElementsPerPixel == 3){
						pVertexElement = [VE_VEC3('VELOCITY')];
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
 * выставляется тип частиц
 */

Emitter.prototype.setDrawType = function(eType){
	'use strict';

	debug_assert(this._eType == -1,"тип частиц уже выставлен");

	switch (eType){
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
			return;
	}
	this._eType = eType;
};

/**
 * выставляются данные для объекта, который необходимо отрисовывать, как частицу
 */
Emitter.prototype.setObjectData = function(pVertexDecl,pData){
	'use strict';
	if(this._eType == a.EMITTER.OBJECT){
		error("используемый тип частиц объектом не является");
		return;
	}

	////////////
	
	if(!this._bParticleDataSetted){
		this._iObjectMapIndex = this._pDataSubset.addIndexSet.call(true,a.PRIMTYPE.TRIANGLELIST);
		this._bParticleDataSetted = true;
	}

	// pData = new Uint8Array(pData);
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
	if(this._eType == a.EMITTER.OBJECT){
		error("используемый тип частиц объектом не является");
		return;
	}

	////////////
	
	pData = new Uint8Array(pData);
	var pDataExtended = new Uint8Array(pData.byteLength*this._nParticles); //необходимо для того, чтобы рендерить все объекты-частицы за один проход
	for(var i=0;i<this._nParticles;i++){
		pDataExtended.set(pData,pData.byteLength*i);
	}
	return this._pDataSubset.setIndex.allocateIndex(pAttrDecl,pDataExtended);
};

Emitter.prototype.setObjectAttribute = function(pAttrDecl,pData){
	'use strict';
	if(this._eType == a.EMITTER.OBJECT){
		error("используемый тип частиц объектом не является");
		return;
	}

	////////////
	
	pData = new Uint8Array(pData);
	var pDataExtended = new Uint8Array(pData.byteLength*this._nParticles); //необходимо для того, чтобы рендерить все объекты-частицы за один проход
	for(var i=0;i<this._nParticles;i++){
		pDataExtended.set(pData,pData.byteLength*i);
	}
	return this._pDataSubset.setIndex.allocateAttribute(pAttrDecl,pDataExtended);
};

Emitter.prototype.objectIndex = function(iData,eSemantic){
	'use strict';
	if(this._eType == a.EMITTER.OBJECT){
		error("используемый тип частиц объектом не является");
		return;
	}

	////////////
	
	return this._pDataSubset.index(iData,eSemantic);
}

Emitter.prototype.activate = function(){
	//готов ли источник (должны быть проставлены позиции, скорости, и время жизни)
	

	if(1){
		this._generateIndices();
		this._isActive = true;
	}
}

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
	this._pDataSubset.index(this._pDataSubset.getDataLocation('POSITION'),'UPDATE_INDEX');

	if(this._etype != a.EMITTER.MESH){
		this._pDataSubset.selectIndexSet(this._iUpdateMapIndex);
		this._pDataSubset.allocateAttribute([VE_FLOAT('POSITION_INDEX')],pDrawIndex);
	}

}

A_NAMESPACE(Emitter);

