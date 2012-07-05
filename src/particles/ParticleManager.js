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
	this._eType = eType; //тип источника - точки, треугольники или билборд
	this._nParticles = nParticles;

	this._isActive = false; // активен ли источник
	this._bParticleDataSetted = false;
	this._bEmitterTypeSetted = false;

	this._fTime = 0; //текущее время для источника
	this._fTTL = 0; //время жизни источника

	this._iUpdateMapIndex = this._pDataSubset.getIndexSet();//номер карты используемой при update
	this._iDrawMapIndex = null; //номер карты используемой при финальной отрисовке

	this._nPointsPerParticle = 0;
}

EXTENDS(Emitter, a.SceneObject, a.RenderableObject);

// Emitter.prototype.prepareForUpdate = function(){
// 	'use strict';
// 	this._pParticleManager._update();
// };

// Emitter.prototype.prepareForRender = function(){
// 	'use strict';
// };

// Emitter.prototype.render = function(){
// 	'use strict';
// };

// Emitter.prototype.renderCallback = function(){
// 	'use strict';
// 	this._pParticleManager._render();
// };

/**
 * выставляються данные для частиц в целом (т.е координаты центра, скорости и т.д.)
 */

Emitter.prototype.setParticleData = function(pVertexDecl,pData){
	'use strict';
	if(this._bParticleDataSetted){
		console.error("нельзя добавлять данные для частиц после добавления данных для рендеринга");
		return;
	}
	pData = new Uint8Array(pData);
	var iStride = pVertexDeclaration.stride;
	var nElementsPerPixel = this._pDataSubset._pFactory._pVideoBuffer._numElementsPerPixel;
	if(!this._isActive){
		var pVertexDeclaration = normalizeVertexDecl(pVertexDeclaration);
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
						this._pDataSubset.allocateData([VE_VEC4('POSITION')],pElementData);
					}
					else if(nElementsPerPixel == 3){
						this._pDataSubset.allocateData([VE_VEC3('POSITION')],pElementData);	
					}
				}
				else{
					if(nElementsPerPixel == 4){
						this._pDataSubset.allocateData([VE_VEC4('VELOCITY')],pElementData);
					}
					else if(nElementsPerPixel == 3){
						this._pDataSubset.allocateData([VE_VEC3('VELOCITY')],pElementData);	
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
				this._pDataSubset.allocateData(pVertexElement,pElementData);
			}
		}
	}
};

/**
 * выставляются индексы для этапа update
 * этап update происходит для частицы в целомч
 */
Emitter.prototype.setParticleIndex = function(pAttrDecl,pData){
	'use strict';
	if(this._bParticleDataSetted){
		console.error("нельзя добавлять индексы для частиц после добавления данных для рендеринга");
		return;
	}
	var pAttributeDeclaration = normalizeVertexDecl(pAttrDecl);

	var iStride = pAttributeDeclaration.stride;
	var nCount = pData.byteLength/iStride;
	debug_assert(pData.byteLength%iStride == 0,"неверное количество данных");
	debug_assert(nCount == this._nParticles,"количество данных не согласуется с количеством частиц");
	this._pDataSubset.allocateIndex(pAttributeDeclaration,pData);
};
/**
 * связывает данные iData с индексом eSemantic для этапа update
 */
Emitter.prototype.particleIndex = function(iData,eSemantics) {
	'use strict';
	this._pDataSubset.selectIndexSet(this._iUpdateMapIndex);
	this._pDataSubset.index(iData,eSemantics);
};

Emitter.prototype.setDrawType = function(eType){
	'use strict';

	switch (eType){
		case a.EMITTER.POINT : 
			this._nPointsPerParticle = 1;
			break;
		case a.EMITTER.TRIANGLE :
			this._nPointsPerParticle = 3;
			break;
		case a.EMITTER.BILLBOARD :
			this._nPointsPerParticle = 4;
			break;
		case a.EMITTER.OBJECT :
		case a.EMITTER.MESH : 
			break;
		default :
			return;
	}
	this._eType = eType;
	this._bEmitterTypeSetted = true;
}

/**
 * выставляются данные для каждой точки частицы, то есть данные о том как рисовать частицу, например положение вершин, нормали для модели
 */
Emitter.prototype.setDrawData = function(){
	'use strict';
	if(!this._bEmitterTypeSetted){
		error('сначала должен быть проставлен тип частицы');
	}
	if(this._eType == a.EMITTER.MESH){
		//пока для меша ничего не выставляется
		return;
	}
	if(!this._bParticleDataSetted){
		if(this._eType != a.EMITTER.POINTS){
			this._iDrawMapIndex = this.addIndexSet.call(true,a.PRIMTYPE.TRIANGLELIST);
		}
		else{
			this._iDrawMapIndex = this._iUpdateMapIndex;
		}
		this._bParticleDataSetted = true;
	}
	var pVertexDeclaration = normalizeVertexDecl(pVertexDecl);
	var iStride = pVertexDeclaration.stride;
	var nCount = pData.byteLength/iStride;
	if(this._eType == a.EMITTER.OBJECT && this._nPointsPerParticle == 0){
		this._nPointsPerParticle = nCount;
	}
	debug_assert(pData.byteLength%iStride == 0,"неверное количество данных");
	debug_assert(nCount == this._eType * this._nParticles,"количество данных не согласуеться с количеством и типом частиц");

	this.allocateData(pVertexDeclaration,pData);
}

/**
 * выставляються индексы для этапа рисования, то есть индексы для каждой точки частицы,
 * например текстурные координаты для каждой вершины билборда
 */
Emitter.prototype.setDrawIndex = function(pAttrDecl,pData){
	'use strict';
	if(!this._bParticleDataSetted){
		if(this._eType != a.EMITTER.POINTS){
			this._iDrawMapIndex = parent(RenderDataSubset).addIndexSet.call(this,true,a.PRIMTYPE.TRIANGLELIST);
		}
		else{
			this._iDrawMapIndex = this._iUpdateMapIndex;
		}
		this._bParticleDataSetted = true;
	}
	pData = new Uint8Array(pData);

	var pAttributeDeclaration = normalizeVertexDecl(pAttrDecl);
	var iStride = pAttrDecl.stride;
	var nCount = pData.byteLength/iStride;

	debug_assert(pData.byteLength%iStride == 0,"неверное количество данных");
	debug_assert(nCount == this._eType * this._nParticles,"количество данных не согласуеться с количеством и типом частиц");

	//переделываем индекс для билборда
	if(this._eType == a.EMITTER.BILLBOARDS){
		var pElementData = new Uint8Array(4*6*this._nParticles);//4 так как float 6 так как биллборд, то есть два треугольника
		for(var i=0;i<pAttributeDeclaration.length;i++){
			var pAttributeElement = pAttributeDeclaration[i];
			var iOffset = pAttributeElement.iOffset;
			for(var j=0;j<this._nParticles;j++){
				var pSubData = pData.subarray(iStride*j + iOffset,iStride*j + iOffset + 4*this._eType);

				//первые три вершины
				for(var k=0;k<12;k++){
					pElementData[6*4*j+k] = pSubData[k];
				}

				var iAddtionalOffset = 8;
				//следующие три вершины
				for(var k=4;k<16;k++){
					pElementData[6*4*j + iAddtionalOffset + k] = pSubData[k];
				}
			}
			this.allocateIndex(pAttributeElement,pElementData);
		}
	}
	else{
		this.allocateIndex(pAttributeDeclaration,pData);
	}
}

/**
 * связывает данные iData с индексом eSemantic для финальной отрисовки
 */
Emitter.prototype.drawIndex = function(iData,eSemantics){
	this.selectIndexSet(this._iDrawMapIndex);
	this.index(iData,eSemantics);
}

Emitter.prototype.setTimeToLive = function(fTimeToLive){
	'use strict';
	this._fTTL = fTimeToLive;
};

// Emitter.prototype._timeStep = function(fDt){
// 	'use strict';
// 	this._fTime += fDt; //увеличиваем время источника
// 	if(this._fTime > this._fTTL){
// 		this._isActive = false;
// 	}
// };

Emitter.prototype.activate = function(){
	//готов ли источник (должны быть проставлены позиции, скорости, и время жизни)
	

	if(1){
		this._generateIndices();
		this._isActive = true;
	}
}

Emitter.prototype._generateIndices = function(){
	var pUpdateIndices = new Float32Array(this._nParticles);
	var pRenderIndices;
	var pRenderPositionIndices;
	if(this._eType == a.EMITTER.BILLBOARDS){
		//eType не соответствует нужной длине
		//eType = 4, нужно 6
		pRenderIndices = new Float32Array(6*this._nParticles);
		pRenderPositionIndices = new Float32Array(6*this._nParticles); 
	}
	else{
		//eType - соответствует нужной длине
		pRenderIndices = new Float32Array(this._eType*this._nParticles);	
		pRenderPositionIndices = new Float32Array(6*this._nParticles); 
	} 
	for(var i=0;i<this._nParticles;i++){
		pUpdateIndices[i] = i;
		if(this._eType == a.EMITTER.BILLBOARDS){
			for(var j=0;j<3;j++){
				pRenderIndices[this._eType*i + j] = j;
			}
			var iAddtionalOffset = 2;
			for(var j=1;j<4;j++){
				pRenderIndices[this._eType*i + iAddtionalOffset + j] = j;
			}
			for(var j=0;j<6;j++){
				pRenderPositionIndices[6*i+j] = i;
			}
		}
		else{
			for(var j=0;j<this._eType;j++){
				pRenderIndices[this._eType*i + j] = j;
				pRenderPositionIndices[this._eType*i + j] = i;
			}	
		}
	}

	var iPositionIndex = this.getDataLocation('POSITION');
	var iVelocityIndex = this.getDataLocation('VELOCITY');

	this.selectIndexSet(this._iUpdateMapIndex);
	this.allocateIndex("POSITION_INDEX",pUpdateIndices);
	this.allocateIndex("VELOCITY_INDEX",pUpdateIndices);
	this.index(iPositionIndex,'POSITION_INDEX');
	this.index(iVelocityIndex,'VELOCITY_INDEX');

	this.selectIndexSet(this._iDrawMapIndex);
	this.allocateIndex("POSITION_INDEX",pRenderPositionIndices);
	this.allocateAttribute("RENDER_INDEX",pRenderIndices);
	this.index(iPositionIndex,'POSITION_INDEX');
}

DISMETHOD(RenderDataSubset,setup);
DISMETHOD(RenderDataSubset,index);

A_NAMESPACE(Emitter);

