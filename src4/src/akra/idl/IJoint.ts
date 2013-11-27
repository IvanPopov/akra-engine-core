
/// <reference path="ISceneNode.ts" />


/// <reference path="IEngine.ts" />

module akra {
	export interface IJoint extends ISceneNode {
		boneName: string;
		// getEngine(): IEngine;
		create(): boolean;
		// toString(isRecursive: boolean, iDepth: int): string;
	}
}
