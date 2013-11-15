// AICamera interface
// [write description here...]

/// <reference path="AISceneObject.ts" />


/// <reference path="AIViewport.ts" />
/// <reference path="AIVec3.ts" />
/// <reference path="AIMat4.ts" />
/// <reference path="AIRect3d.ts" />
/// <reference path="AIFrustum.ts" />
/// <reference path="AIObjectArray.ts" />

enum AECameraParameters {
	CONST_ASPECT = 1
}

enum AECameraTypes {
	PERSPECTIVE,
	ORTHO,
	OFFSET_ORTHO
}



interface AICamera extends AISceneNode {
	/** readonly */ viewMatrix: AIMat4;
	/** readonly */ projectionMatrix: AIMat4;
	/** readonly */ projViewMatrix: AIMat4;
	// /** readonly */ internalProjectionMatrix: AIMat4;
	// /** readonly */ internalViewProjMatrix: AIMat4;
	/** readonly */ targetPos: AIVec3;
	
	fov: float;
	aspect: float;
	nearPlane: float;
	farPlane: float;
	
	/** readonly */ viewDistance: float;
	/** readonly */ searchRect: AIRect3d;
	/** readonly */ frustum: AIFrustum;

	setParameter(eParam: AECameraParameters, pValue: any): void;
	isConstantAspect(): boolean;
	
	setProjParams(fFOV: float, fAspect: float, fNearPlane: float, fFarPlane: float): void;
	setOrthoParams(fWidth: float, fHeight: float, fNearPlane: float, fFarPlane: float): void;
	setOffsetOrthoParams(fMinX: float, fMaxX: float, fMinY: float, fMaxY: float, fNearPlane: float, fFarPlane: float): void;

	projectPoint(v3fPoint: AIVec3, v3fDestination?: AIVec3): AIVec3;

	//moved to private.
	// recalcMatrices(): void;

	// applyRenderStageBias(iStage: int): void;
	
	//изменились ли параметры процекции
	isProjParamsNew(): boolean; 
	recalcProjMatrix(): void;

	isActive(): boolean;

	//display via display list with name <csList>
	display(iList?: int): AIObjectArray<AISceneNode>;

	_renderScene(pViewport: AIViewport): void;
	_keepLastViewport(pViewport: AIViewport): void;
	_getLastViewport(): AIViewport;
	_getNumRenderedFaces(): uint;
	_notifyRenderedFaces(nFaces: uint): void;
	_getLastResults(iList?: int): AIObjectArray<AISceneNode>;

	getDepthRange(): AIDepthRange;
}
