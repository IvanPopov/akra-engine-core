
/// <reference path="ISceneNode.ts" />


/// <reference path="IEngine.ts" />

module akra {
	interface IJoint extends ISceneNode {
		boneName: string;
		// getEngine(): IEngine;
		create(): boolean;
		// toString(isRecursive: boolean, iDepth: int): string;
	}
}
