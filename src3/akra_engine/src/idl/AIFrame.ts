/// <reference path="AIMat4.ts" />
/// <reference path="AIQuat4.ts" />
/// <reference path="AIVec3.ts" />

//SLERP <==> slerp for rotation, MATRIX_LINEAR - linear between matrices

enum AEAnimationInterpolations {
	LINEAR,
	SPHERICAL
}

interface AIFrame {
	type: AEAnimationInterpolations;

	/** readonly */ time: float;
	/** readonly */ weight: float;
	
	reset(): AIFrame;
	set(pFrame: AIFrame): AIFrame;
	add(pFrame: AIFrame, isFirst: boolean): AIFrame;
	mult(fScalar: float): AIFrame;
	normilize(): AIFrame;

	interpolate(pStartFrame: AIFrame, pEndFrame: AIFrame, fBlend: float): AIFrame;
}
