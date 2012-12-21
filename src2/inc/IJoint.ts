#ifndef IJOINT_TS
#define IJOINT_TS

module akra {
	IFACE(IEngine);
	
	export interface IJoint extends INode {
		boneName: string;
		getEngine(): IEngine;
		create(): bool;
		toString(isRecursive: bool, iDepth: int): string;
	}
}

#endif

