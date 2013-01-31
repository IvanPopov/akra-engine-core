#ifndef ISKELETON_TS
#define ISKELETON_TS

module akra {
	IFACE(INode);
	IFACE(IJoint);

	export interface IJointMap{
		[index: string]: IJoint;
	}



	export interface ISkeleton {
		readonly totalBones: int;
		readonly totalNodes: int;
		readonly name: string;
		readonly root: IJoint;

		getEngine(): IEngine;
		getRootJoint(): IJoint;
		getRootJoints(): IJoint[];
		getJointMap(): IJointMap;
		getNodeList(): INode[];
		addRootJoint(pJoint: IJoint): bool;
		update(): bool;
		findJoint(sName: string): IJoint;
		findJointByName(sName: string): IJoint;
		attachMesh(pMesh: IMesh): void;
		detachMesh(): void;

	}
}

#endif