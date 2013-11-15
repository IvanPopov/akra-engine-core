// AINode interface
// [write description here...]

/// <reference path="AIEntity.ts" />


/// <reference path="AIVec3.ts" />
/// <reference path="AIMat3.ts" />
/// <reference path="AIMat4.ts" />
/// <reference path="AIQuat4.ts" />

enum AENodeInheritance {
	NONE,
	//inheritance only position
	POSITION,
	//inheritance rotation and scale only
	ROTSCALE,
	//inheritance rotation ans position only
	ROTPOSITION,
	//inheritance all
	ALL
};

interface AINodeMap {
	[index: string]: AINode;
}

interface AINode extends AIEntity {
	localOrientation: AIQuat4;
	localPosition: AIVec3;
	localScale: AIVec3;
	localMatrix: AIMat4;
	
	/** readonly */ worldMatrix: AIMat4;
	/** readonly */ worldPosition: AIVec3;
	/** readonly */ worldOrientation: AIQuat4;
	/** readonly */ worldScale: AIVec3;
	
	/** readonly */ inverseWorldMatrix: AIMat4;
	/** readonly */ normalMatrix: AIMat3;

	parent: AINode;
	sibling: AINode;
	child: AINode;

	create(): boolean;

	setInheritance(eInheritance: AENodeInheritance);
	getInheritance(): AENodeInheritance;

	isWorldMatrixNew(): boolean;
	isLocalMatrixNew(): boolean;

	setWorldPosition(v3fPosition: AIVec3): void;
	setWorldPosition(fX: float, fY: float, fZ: float): void;

	setPosition(v3fPosition: AIVec3): void;
	setPosition(fX: float, fY: float, fZ: float): void;

	setRelPosition(v3fPosition: AIVec3): void;
	setRelPosition(fX: float, fY: float, fZ: float): void;

	addPosition(v3fPosition: AIVec3): void;
	addPosition(fX: float, fY: float, fZ: float): void;
	addRelPosition(v3fPosition: AIVec3): void;
	addRelPosition(fX: float, fY: float, fZ: float): void;

	setRotationByMatrix(m3fRotation: AIMat3): void;
	setRotationByMatrix(m4fRotation: AIMat4): void;
	setRotationByAxisAngle(v3fAxis: AIVec3, fAngle: float): void;
	setRotationByForwardUp(v3fForward: AIVec3, v3fUp: AIVec3): void;
	setRotationByEulerAngles(fYaw: float, fPitch: float, fRoll: float): void;
	setRotationByXYZAxis(fX: float, fY: float, fZ: float): void;
	setRotation(q4fRotation: AIQuat4): void;

	addRelRotationByMatrix(m4fRotation: AIMat4): void;
	addRelRotationByMatrix(m3fRotation: AIMat3): void;
	addRelRotationByAxisAngle(v3fAxis: AIVec3, fAngle: float): void;
	addRelRotationByForwardUp(v3fForward: AIVec3, v3fUp: AIVec3): void;
	addRelRotationByEulerAngles(fYaw: float, fPitch: float, fRoll: float): void;
	addRelRotationByXYZAxis(fX: float, fY: float, fZ: float): void;
	addRelRotation(q4fRotation: AIQuat4): void;

	addRotationByMatrix(m4fRotation: AIMat4): void;
	addRotationByMatrix(m3fRotation: AIMat3): void;
	addRotationByAxisAngle(v3fAxis: AIVec3, fAngle: float): void;
	addRotationByForwardUp(v3fForward: AIVec3, v3fUp: AIVec3): void;
	addRotationByEulerAngles(fYaw: float, fPitch: float, fRoll: float): void;
	addRotationByXYZAxis(fX: float, fY: float, fZ: float): void;
	addRotation(q4fRotation: AIQuat4): void;

	scale(fScale: float): void;
	scale(v3fScale: AIVec3): void;
	scale(fX: float, fY: float, fZ: float): void;

	lookAt(v3fFrom: AIVec3, v3fCenter: AIVec3, v3fUp?: AIVec3);
	lookAt(v3fCenter: AIVec3, v3fUp?: AIVec3);
}