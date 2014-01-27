
/// <reference path="IEntity.ts" />


/// <reference path="IVec3.ts" />
/// <reference path="IMat3.ts" />
/// <reference path="IMat4.ts" />
/// <reference path="IQuat4.ts" />

module akra {
	export enum ENodeInheritance {
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
	
	export interface INode extends IEntity {
		getLocalOrientation(): IQuat4;
		setLocalOrientation(qOrient: IQuat4): void;

		getLocalPosition(): IVec3;
		setLocalPosition(v3fPosition: IVec3): void;

		getLocalScale(): IVec3;
		setLocalScale(v3fScale: IVec3): void;

		getLocalMatrix(): IMat4;
		setLocalMatrix(m4fLocal: IMat4): void;
		
		getWorldMatrix(): IMat4;
		getWorldPosition(): IVec3;
		getWorldOrientation(): IQuat4;
		getWorldScale(): IVec3;
		
		getInverseWorldMatrix(): IMat4;
		getNormalMatrix(): IMat3;
	
		create(): boolean;
	
		setInheritance(eInheritance: ENodeInheritance);
		getInheritance(): ENodeInheritance;
	
		isWorldMatrixNew(): boolean;
		isLocalMatrixNew(): boolean;
	
		setWorldPosition(v3fPosition: IVec3): void;
		setWorldPosition(fX: float, fY: float, fZ: float): void;
	
		setPosition(v3fPosition: IVec3): void;
		setPosition(fX: float, fY: float, fZ: float): void;
	
		setRelPosition(v3fPosition: IVec3): void;
		setRelPosition(fX: float, fY: float, fZ: float): void;
	
		addPosition(v3fPosition: IVec3): void;
		addPosition(fX: float, fY: float, fZ: float): void;
		addRelPosition(v3fPosition: IVec3): void;
		addRelPosition(fX: float, fY: float, fZ: float): void;
	
		setRotationByMatrix(m3fRotation: IMat3): void;
		setRotationByMatrix(m4fRotation: IMat4): void;
		setRotationByAxisAngle(v3fAxis: IVec3, fAngle: float): void;
		setRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): void;
		setRotationByEulerAngles(fYaw: float, fPitch: float, fRoll: float): void;
		setRotationByXYZAxis(fX: float, fY: float, fZ: float): void;
		setRotation(q4fRotation: IQuat4): void;
	
		addRelRotationByMatrix(m4fRotation: IMat4): void;
		addRelRotationByMatrix(m3fRotation: IMat3): void;
		addRelRotationByAxisAngle(v3fAxis: IVec3, fAngle: float): void;
		addRelRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): void;
		addRelRotationByEulerAngles(fYaw: float, fPitch: float, fRoll: float): void;
		addRelRotationByXYZAxis(fX: float, fY: float, fZ: float): void;
		addRelRotation(q4fRotation: IQuat4): void;
	
		addRotationByMatrix(m4fRotation: IMat4): void;
		addRotationByMatrix(m3fRotation: IMat3): void;
		addRotationByAxisAngle(v3fAxis: IVec3, fAngle: float): void;
		addRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): void;
		addRotationByEulerAngles(fYaw: float, fPitch: float, fRoll: float): void;
		addRotationByXYZAxis(fX: float, fY: float, fZ: float): void;
		addRotation(q4fRotation: IQuat4): void;
	
		scale(fScale: float): void;
		scale(v3fScale: IVec3): void;
		scale(fX: float, fY: float, fZ: float): void;
	
		lookAt(v3fFrom: IVec3, v3fCenter: IVec3, v3fUp?: IVec3);
		lookAt(v3fCenter: IVec3, v3fUp?: IVec3);
	}
}
