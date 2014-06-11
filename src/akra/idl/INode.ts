
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
		setLocalOrientation(qOrient: IQuat4): INode;

		getLocalPosition(): IVec3;
		setLocalPosition(v3fPosition: IVec3): INode;

		getLocalScale(): IVec3;
		setLocalScale(v3fScale: IVec3): INode;

		getLocalMatrix(): IMat4;
		setLocalMatrix(m4fLocal: IMat4): INode;
		
		getWorldMatrix(): IMat4;
		getWorldPosition(): IVec3;
		getWorldOrientation(): IQuat4;
		getWorldScale(): IVec3;
		
		getInverseWorldMatrix(): IMat4;
		getNormalMatrix(): IMat3;

		getVectorUp(): IVec3;
		getVectorRight(): IVec3;
		getVectorForward(): IVec3;
		getTempVectorUp(): IVec3;
		getTempVectorRight(): IVec3;
		getTempVectorForward(): IVec3;
		
		create(): boolean;
	
		setInheritance(eInheritance: ENodeInheritance);
		getInheritance(): ENodeInheritance;
	
		isWorldMatrixNew(): boolean;
		isLocalMatrixNew(): boolean;
	
		setWorldPosition(v3fPosition: IVec3): INode;
		setWorldPosition(fX: float, fY: float, fZ: float): INode;
	
		setPosition(v3fPosition: IVec3): INode;
		setPosition(fX: float, fY: float, fZ: float): INode;
	
		setRelPosition(v3fPosition: IVec3): INode;
		setRelPosition(fX: float, fY: float, fZ: float): INode;
	
		addPosition(v3fPosition: IVec3): INode;
		addPosition(fX: float, fY: float, fZ: float): INode;
		addRelPosition(v3fPosition: IVec3): INode;
		addRelPosition(fX: float, fY: float, fZ: float): INode;
	
		setRotationByMatrix(m3fRotation: IMat3): INode;
		setRotationByMatrix(m4fRotation: IMat4): INode;
		setRotationByAxisAngle(v3fAxis: IVec3, fAngle: float): INode;
		setRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): INode;
		setRotationByEulerAngles(fYaw: float, fPitch: float, fRoll: float): INode;
		setRotationByXYZAxis(fX: float, fY: float, fZ: float): INode;
		setRotation(q4fRotation: IQuat4): INode;
	
		addRelRotationByMatrix(m4fRotation: IMat4): INode;
		addRelRotationByMatrix(m3fRotation: IMat3): INode;
		addRelRotationByAxisAngle(v3fAxis: IVec3, fAngle: float): INode;
		addRelRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): INode;
		addRelRotationByEulerAngles(fYaw: float, fPitch: float, fRoll: float): INode;
		addRelRotationByXYZAxis(fX: float, fY: float, fZ: float): INode;
		addRelRotation(q4fRotation: IQuat4): INode;
	
		addRotationByMatrix(m4fRotation: IMat4): INode;
		addRotationByMatrix(m3fRotation: IMat3): INode;
		addRotationByAxisAngle(v3fAxis: IVec3, fAngle: float): INode;
		addRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): INode;
		addRotationByEulerAngles(fYaw: float, fPitch: float, fRoll: float): INode;
		addRotationByXYZAxis(fX: float, fY: float, fZ: float): INode;
		addRotation(q4fRotation: IQuat4): INode;

		addOrbitRotationByMatrix(m4fRotation: IMat4): INode;
		addOrbitRotationByMatrix(m3fRotation: IMat3): INode;
		addOrbitRotationByAxisAngle(v3fAxis: IVec3, fAngle: float): INode;
		addOrbitRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): INode;
		addOrbitRotationByEulerAngles(fYaw: float, fPitch: float, fRoll: float): INode;
		addOrbitRotationByXYZAxis(fX: float, fY: float, fZ: float): INode;
		addOrbitRotation(q4fRotation: IQuat4): INode;
	
		scale(fScale: float): INode;
		scale(v3fScale: IVec3): INode;
		scale(fX: float, fY: float, fZ: float): INode;
	
		lookAt(v3fFrom: IVec3, v3fCenter: IVec3, v3fUp?: IVec3);
		lookAt(v3fCenter: IVec3, v3fUp?: IVec3);
	}
}
