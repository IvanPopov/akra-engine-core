#ifndef IRENDERQUEUE_TS
#define IRENDERQUEUE_TS

module akra {
	IFACE(IRenderEntry);

	export interface IRenderQueue {
		execute(bSort?: bool): void;
		push(pEntry: IRenderEntry): void;
		createEntry(): IRenderEntry;
		releaseEntry(pEntry: IRenderEntry): void;
	}
}

#endif
