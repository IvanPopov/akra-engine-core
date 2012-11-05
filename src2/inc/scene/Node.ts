#ifndef NODE_TS
#define NODE_TS

#include "INode.ts"

module akra.scene {
	export class Node implements INode {
		private sName: string = null;

		get name(): string { return this.sName; }
		set name(sName: string) { this.sName = sName; }

		constructor () {

		}
	}
}

#endif