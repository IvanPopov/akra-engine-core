#ifndef IJOINT_TS
#define IJOINT_TS

#include "ISceneNode.ts"

module akra {
	IFACE(IEngine);
	
	export interface IJoint extends ISceneNode {
		boneName: string;
		// getEngine(): IEngine;
		create(): bool;
		// toString(isRecursive: bool, iDepth: int): string;
	}
}

#endif

