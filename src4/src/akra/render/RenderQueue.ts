/// <reference path="../idl/IRenderer.ts" />
/// <reference path="../idl/IRenderQueue.ts" />

/// <reference path="../util/ObjectArray.ts" />
/// <reference path="../config/config.ts" />

/// <reference path="RenderEntry.ts" />

module akra.render {
	export class RenderQueue implements IRenderQueue {
		protected _pRenderer: IRenderer;
		protected _pEntryList: IObjectArray<IRenderEntry>;
		protected _fnSortFunction: Function = null;

		constructor (pRenderer: IRenderer) {
			this._pRenderer = pRenderer;
			this._pEntryList = new util.ObjectArray<IRenderEntry>();
			this._fnSortFunction = (a: IRenderEntry, b: IRenderEntry): int => {
				if (isNull(a) || isNull(a.maker)) {
					return 1;
				}
				if (isNull(b) || isNull(b.maker)) {
					return -1;
				}
				else {
					return a.maker.guid - b.maker.guid;
				}
			}
		}

		execute(bSort: boolean = false): void {
			this._pRenderer._beginRender();
			if (bSort && this._pEntryList.length > 0) {
				this.quickSortQueue(0, this._pEntryList.length - 1);
			}

			for (var i: int = 0; i < this._pEntryList.length; i++) {
				var pEntry: IRenderEntry = this._pEntryList.value(i);


				this._pRenderer._renderEntry(pEntry);

				if (config.__VIEW_INTERNALS__) {
					this.releaseEntry(pEntry);
				}
			}

			this._pEntryList.clear(false);

			this._pRenderer._endRender();
		}

		quickSortQueue(iStart: uint, iEnd: uint): void {
			var i: uint = iStart;
			var j: uint = iEnd;
			var iMiddle: uint = this._pEntryList.value((iStart + iEnd) >> 1).maker.guid;

			do {
				while (this._pEntryList.value(i).maker.guid < iMiddle)++i;
				while (this._pEntryList.value(j).maker.guid > iMiddle)--j;

				if (i <= j) {
					this._pEntryList.swap(i, j);
					i++; j--;
				}
			}
			while (i < j);

			if (iStart < j) this.quickSortQueue(iStart, j);
			if (i < iEnd) this.quickSortQueue(i, iEnd);
		}

		push(pEntry: IRenderEntry): void {
			this._pEntryList.push(pEntry);
		}

		createEntry(): IRenderEntry {
			return RenderQueue.createEntry();
		}

		releaseEntry(pEntry: IRenderEntry): void {
			return RenderQueue.releaseEntry(pEntry);
		}

		static createEntry(): IRenderEntry {
			return RenderQueue.pool.length > 0 ? RenderQueue.pool.pop() : new RenderEntry;
		}

		static releaseEntry(pEntry: IRenderEntry): void {
			RenderQueue.pool.push(pEntry);
			pEntry.clear();
		}

		static pool: IObjectArray<IRenderEntry> = new util.ObjectArray<IRenderEntry>();
	}
}

