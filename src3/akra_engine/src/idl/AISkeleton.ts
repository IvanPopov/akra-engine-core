// AISkeleton interface
// [write description here...]


/// <reference path="AINode.ts" />
/// <reference path="AIJoint.ts" />

interface AIJointMap {
	[index: string]: AIJoint;
}



interface AISkeleton {
	/** readonly */ totalBones: int;
	/** readonly */ totalNodes: int;
	/** readonly */ name: string;
	/** readonly */ root: AIJoint;

	getRootJoint(): AIJoint;
	getRootJoints(): AIJoint[];
	getJointMap(): AIJointMap;
	getNodeList(): AISceneNode[];
	addRootJoint(pJoint: AIJoint): boolean;
	update(): boolean;
	findJoint(sName: string): AIJoint;
	findJointByName(sName: string): AIJoint;
	attachMesh(pMesh: AIMesh): boolean;
	detachMesh(): void;

}