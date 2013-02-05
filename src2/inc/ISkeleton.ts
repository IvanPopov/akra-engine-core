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

		getRootJoint(): IJoint;
		getRootJoints(): IJoint[];
		getJointMap(): IJointMap;
		getNodeList(): ISceneNode[];
		addRootJoint(pJoint: IJoint): bool;
		update(): bool;
		findJoint(sName: string): IJoint;
		findJointByName(sName: string): IJoint;
		attachMesh(pMesh: IMesh): bool;
		detachMesh(): void;

	}
}

#endif