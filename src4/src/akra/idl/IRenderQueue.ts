

/// <reference path="IRenderEntry.ts" />

module akra {
	export interface IRenderQueue {
		execute(bSort?: boolean): void;
		push(pEntry: IRenderEntry): void;
		createEntry(): IRenderEntry;
		releaseEntry(pEntry: IRenderEntry): void;
	}
}
