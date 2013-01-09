#ifndef ISKELETON_TS
#define ISKELETON_TS

module akra {
	IFACE(INode);

	export interface INodeMap{
		[index: string]: INode;
	}

	export interface ISkeleton {
		readonly totalBones: int;
		readonly totalNodes: int;
		readonly name: string;
		readonly root: INode;

		getEngine(): IEngine;
		getRootJoint(): INode;
		getRootJoints(): INode[];
		getJointMap(): INodeMap;
		getNodeList(): INode[];
		addRootJoint(pJoint: INode): bool;
		update(): bool;
		findJoint(sName: string): INode;
		findJointByName(sName: string): INode;
		attachMesh(pMesh: IMesh): void;
		detachMesh(): void;

	}
}

#endif