#ifndef RENDERRENDERQUEUE_TS
#define RENDERRENDERQUEUE_TS

#include "IRenderer.ts"
#include "IRenderQueue.ts"
#include "RenderEntry.ts"
#include "util/ObjectArray.ts"

module akra.render {
	export class RenderQueue implements IRenderQueue {
		protected _pRenderer: IRenderer;
		protected _pEntryList: util.ObjectArray;

		constructor (pRenderer: IRenderer) {
			this._pRenderer = pRenderer;
			this._pEntryList = new util.ObjectArray;
		}

		execute(): void {
			//this.sort()
			// ERROR("@@@@@@@@@@@@@@@@@@@@@@@@@ Start execute @@@@@@@@@@@@@@@@@@@@@@@@");
			this._pRenderer._beginRender();
			
			for (var i: int = 0; i < this._pEntryList.length; i++) {
				var pEntry: IRenderEntry = this._pEntryList.value(i);
				this._pRenderer._renderEntry(pEntry);
				this.releaseEntry(pEntry);
			}

			this._pEntryList.clear(false);

			this._pRenderer._endRender();
			// ERROR("@@@@@@@@@@@@@@@@@@@@@@@@@ End execute @@@@@@@@@@@@@@@@@@@@@@@@");
		}

		push(pEntry: IRenderEntry): void {
			this._pEntryList.push(pEntry);
		}

		inline createEntry(): IRenderEntry {
			return RenderQueue.createEntry();
		}

		inline releaseEntry(pEntry: IRenderEntry): void {
			return RenderQueue.releaseEntry(pEntry);
		}

		static createEntry(): IRenderEntry {
			return RenderQueue.pool.length > 0? RenderQueue.pool.pop(): new RenderEntry;
		}

		static releaseEntry(pEntry: IRenderEntry): void {
			RenderQueue.pool.push(pEntry);
			pEntry.clear();
		}

		static pool: util.ObjectArray = new util.ObjectArray;
	}
}

#endif
