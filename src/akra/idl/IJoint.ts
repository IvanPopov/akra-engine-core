
/// <reference path="ISceneNode.ts" />


/// <reference path="IEngine.ts" />

module akra {
	export interface IJoint extends ISceneNode {
		getBoneName(): string;
		setBoneName(sName: string): void;

		// getEngine(): IEngine;
		create(): boolean;
		// toString(isRecursive: boolean, iDepth: int): string;
	}
}
