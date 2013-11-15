// AIJoint interface
// [write description here...]

/// <reference path="AISceneNode.ts" />


/// <reference path="AIEngine.ts" />

interface AIJoint extends AISceneNode {
	boneName: string;
	// getEngine(): AIEngine;
	create(): boolean;
	// toString(isRecursive: boolean, iDepth: int): string;
}