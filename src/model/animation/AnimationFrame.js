function AnimationFrame (fTime, pMatrix, fWeight) {
	A_CHECK_STORAGE();

	this.fTime = 0.0;
	this.fWeight = 1.0;

	this.pMatrix 		= null;
	this.v3fTranslation = null;
	this.qRotation 		= null;
	this.v3fScale 		= null;
	
	switch (arguments.length) {		
		case 0:
			this.pMatrix = new Mat4;
			break;

		case 3:
			this.fWeight = fWeight;
		case 2:
			this.pMatrix = pMatrix;
		case 1:
			this.fTime = fTime;
			break;	
			
		case 5:
			this.fWeight = fWeight;
		case 4:	
			this.v3fScale 		= arguments[3];
			this.v3fTranslation = arguments[1];
			this.qRotation 		= arguments[2];
			this.fTime = fTime;
	};
	
}


AnimationFrame.prototype.toMatrix = function () {
    'use strict';
    
	return this.pMatrix;
};

AnimationFrame.prototype.reset = function () {
    'use strict';
    
	this.fWeight = 0.0;
	this.fTime = 0.0;

	var pData = this.pMatrix.pData;
	pData._11 = pData._12 = pData._13 = pData._14 = 
	pData._21 = pData._22 = pData._23 = pData._24 = 
	pData._31 = pData._32 = pData._33 = pData._34 = 
	pData._41 = pData._42 = pData._43 = pData._44 = 0;
	return this;
};

/**
 * Добавить данные к фрейму с их весом.
 * После данного метода фрейму потребуется нормализация!!!!
 */
AnimationFrame.prototype.add = function (pFrame) {
    'use strict';
    
	var pMatData = pFrame.pMatrix.pData;
	var fWeight = pFrame.fWeight;
	var pResData = this.pMatrix.pData;

	for (var i = 0; i < 16; ++ i) {
		pResData[i] += pMatData[i] * fWeight;
	}

	this.fWeight += fWeight;
	return this;
};

AnimationFrame.prototype.mult = function (fScalar) {
    'use strict';
    
	this.fWeight *= fScalar;
	return this;
};

AnimationFrame.prototype.normilize = function () {
    'use strict';
    
    var fScalar = 1.0 / this.fWeight;
    var pData = this.pMatrix.pData;

    pData._11 *= fScalar;
    pData._12 *= fScalar; 
    pData._13 *= fScalar;
    pData._14 *= fScalar;
	
	pData._21 *= fScalar;
    pData._22 *= fScalar; 
    pData._23 *= fScalar;
    pData._24 *= fScalar;
	
	pData._31 *= fScalar;
    pData._32 *= fScalar; 
    pData._33 *= fScalar;
    pData._34 *= fScalar;
	
	pData._41 *= fScalar;
    pData._42 *= fScalar; 
    pData._43 *= fScalar;
    pData._44 *= fScalar;
		
	return this;
};

A_ALLOCATE_STORAGE(AnimationFrame, 4096/*16384*/);
A_NAMESPACE(AnimationFrame);