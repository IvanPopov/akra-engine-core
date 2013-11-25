

/// <reference path="IRenderEntry.ts" />

module akra {
	interface IRenderQueue {
		execute(bSort?: boolean): void;
		push(pEntry: IRenderEntry): void;
		createEntry(): IRenderEntry;
		releaseEntry(pEntry: IRenderEntry): void;
	}
}
