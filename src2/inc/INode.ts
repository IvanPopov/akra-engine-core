#ifndef INODE_TS
#define INODE_TS

#include "IEntity.ts"

module akra {

	IFACE(IVec3);
	IFACE(IMat3);
	IFACE(IMat4);
	IFACE(IQuat4);

	export enum ENodeInheritance {
		//inheritance only position
		POSITION = 0,
		//inheritance rotation and scale only
        ROTSCALE,
        //inheritance all
    	ALL
	};

	export interface INodeMap{
		[index: string]: INode;
	}

	export interface INode extends IEntity {
		localOrientation: IQuat4;
		localPosition: IVec3;
		localScale: IVec3;
		localMatrix: IMat4;
		
		readonly worldMatrix: IMat4;
		readonly worldPosition: IVec3;
		
		readonly inverseWorldMatrix: IMat4;
		readonly normalMatrix: IMat3;

		setInheritance(eInheritance: ENodeInheritance);
		getInheritance(): ENodeInheritance;
	
		isWorldMatrixNew(): bool;
		isLocalMatrixNew(): bool;

		//recalcWorldMatrix(): bool;

		setPosition(v3fPosition: IVec3): void;
		setPosition(fX: float, fY: float, fZ: float): void;

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
		scale(fX: float, fY: float, fZ: float): void;
	}
}

#endif
