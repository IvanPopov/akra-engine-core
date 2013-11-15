// AIRenderQueue interface
// [write description here...]


/// <reference path="AIRenderEntry.ts" />

interface AIRenderQueue {
	execute(bSort?: boolean): void;
	push(pEntry: AIRenderEntry): void;
	createEntry(): AIRenderEntry;
	releaseEntry(pEntry: AIRenderEntry): void;
}