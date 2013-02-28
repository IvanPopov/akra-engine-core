	Enum([
		INTERPOLATION_MATRIX_LINEAR, //матрицы
		INTERPOLATION_LINEAR //не матрицы
		], ANIMATION_INTERPOLATION, a.Animation);

function AnimationFrame (fTime, pMatrix, fWeight) {
	A_CHECK_STORAGE();

	this.fTime = 0.0;
	this.fWeight = 1.0;

	this.pMatrix 		= null;

	this.qRotation 		= new Quat4;
	this.v3fScale 		= new Vec3;
	this.v3fTranslation = new Vec3;
	
	switch (arguments.length) {		
		case 0:
			this.pMatrix = new Mat4;
			return;
		case 3:
			this.fWeight = fWeight;
		case 2:
			this.pMatrix = pMatrix;
		case 1:
			this.fTime = fTime;
	};


	this.pMatrix.decompose(this.qRotation, this.v3fScale, this.v3fTranslation);
}

AnimationFrame.prototype.toMatrix = null;

AnimationFrame.prototype.toMatrixFromMatrix = function () {
    'use strict';
    
	return this.pMatrix;
};

AnimationFrame.prototype.toMatrixFromTransforms = function () {
    'use strict';
    
	return this.qRotation.toMat4(this.pMatrix)
		.setTranslation(this.v3fTranslation).scaleRight(this.v3fScale);
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

	pData = this.qRotation.pData;
	pData.X = pData.Y = pData.Z = 0;
	pData.W = 1.0;

	pData = this.v3fTranslation.pData;
	pData.X = pData.Y = pData.Z = 0;

	pData = this.v3fScale.pData;
	pData.X = pData.Y = pData.Z = 0;

	return this;
};

AnimationFrame.prototype.set = function (pFrame) {
    'use strict';
    
    //FIXME: расписать побыстрее
	this.pMatrix.set(pFrame.pMatrix);

	this.qRotation.set(pFrame.qRotation);
	this.v3fScale.set(pFrame.v3fScale);
	this.v3fTranslation.set(pFrame.v3fTranslation);

	this.fTime = pFrame.fTime;
	this.fWeight = pFrame.fWeight;
};

/**
 * Добавить данные к фрейму с их весом.
 * После данного метода фрейму потребуется нормализация!!!!
 */

AnimationFrame.prototype.add = null;

AnimationFrame.prototype.addMatrix = function (pFrame) {
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

AnimationFrame.prototype.addTransforms = function (pFrame, isFirst) {
    'use strict';
    
	var pScaleData = pFrame.v3fScale.pData;
	var pTranslationData = pFrame.v3fTranslation.pData;

	var fWeight = pFrame.fWeight;

	var pResScaleData = this.v3fScale.pData;
	var pResTranslationData = this.v3fTranslation.pData;

	pResScaleData.X += pScaleData.X * fWeight;
	pResScaleData.Y += pScaleData.Y * fWeight;
	pResScaleData.Z += pScaleData.Z * fWeight;

	pResTranslationData.X += pTranslationData.X * fWeight;
	pResTranslationData.Y += pTranslationData.Y * fWeight;
	pResTranslationData.Z += pTranslationData.Z * fWeight;

	this.fWeight += fWeight;

	if (!isFirst) {
		this.qRotation.slerp(pFrame.qRotation, fWeight / this.fWeight);
	}
	else {
		this.qRotation.set(pFrame.qRotation);
	}

	return this;
};


AnimationFrame.prototype.mult = function (fScalar) {
    'use strict';
    
	this.fWeight *= fScalar;
	return this;
};

AnimationFrame.prototype.normilize = null;

AnimationFrame.prototype.normilizeMatrix = function () {
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

AnimationFrame.prototype.normilizeTransforms = function () {
    'use strict';
    
    var fScalar = 1.0 / this.fWeight;
    var pScaleData = this.v3fScale.pData;
	var pTranslationData = this.v3fTranslation.pData;

    pScaleData.X *= fScalar;
    pScaleData.Y *= fScalar;
    pScaleData.Z *= fScalar;
		
    pTranslationData.X *= fScalar;
    pTranslationData.Y *= fScalar;
    pTranslationData.Z *= fScalar;

	return this;
};

AnimationFrame.prototype.interpolate = null;
AnimationFrame.prototype.interpolateMatrix = function (pStartFrame, pEndFrame, fBlend) {
    'use strict';
    
	var pResultData = this.pMatrix.pData;
	var pStartData = pStartFrame.pMatrix.pData;
	var pEndData = pEndFrame.pMatrix.pData;
	var fBlendInv = 1. - fBlend;

	for (var i = 0; i < 16; i++) {
		pResultData[i] = pEndData[i] * fBlend + pStartData[i] * fBlendInv;
	};

};
AnimationFrame.prototype.interpolateTransformations = function (pStartFrame, pEndFrame, fBlend) {
    'use strict';
    
	pStartFrame.v3fTranslation.mix(pEndFrame.v3fTranslation, fBlend, this.v3fTranslation);
	pStartFrame.v3fScale.mix(pEndFrame.v3fScale, fBlend, this.v3fScale);
	pStartFrame.qRotation.slerp(pEndFrame.qRotation, fBlend, this.qRotation);
};

AnimationFrame.prototype.add = AnimationFrame.prototype.addTransforms;
AnimationFrame.prototype.normilize = AnimationFrame.prototype.normilizeTransforms;
AnimationFrame.prototype.interpolate = AnimationFrame.prototype.interpolateTransformations;
AnimationFrame.prototype.toMatrix = AnimationFrame.prototype.toMatrixFromTransforms;

// AnimationFrame.prototype.add = AnimationFrame.prototype.addMatrix;
// AnimationFrame.prototype.normilize = AnimationFrame.prototype.normilizeMatrix;
// AnimationFrame.prototype.interpolate = AnimationFrame.prototype.interpolateMatrix;
// AnimationFrame.prototype.toMatrix = AnimationFrame.prototype.toMatrixFromMatrix;

A_ALLOCATE_STORAGE(AnimationFrame, 4 * 4096);
A_NAMESPACE(AnimationFrame);

