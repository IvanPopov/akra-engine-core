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
		protected _fnSortFunction: Function = null;

		constructor (pRenderer: IRenderer) {
			this._pRenderer = pRenderer;
			this._pEntryList = new util.ObjectArray;
			this._fnSortFunction = function(a: IRenderEntry, b: IRenderEntry): int{
				if(isNull(a) || isNull(a.maker)){
					return 1;
				}
				if(isNull(b) || isNull(b.maker)){
					return -1;
				}
				else {
					return a.maker.getGuid() - b.maker.getGuid();
				}
			}
		}

		bForceDisableSort: bool = false;
		// nCount: uint = 0;
		// fAVGMakerSeq: float = 0.;

		execute(bSort?: bool = false): void {
			this._pRenderer._beginRender();
			if(bSort && this._pEntryList.length > 0 && !this.bForceDisableSort){
				this.quickSortQueue(0, this._pEntryList.length - 1);
				// this._pEntryList._pData.sort(<any>this._fnSortFunction);
			}

			// var nCountOfMakerSeq: uint = 0;
			// var pLastMaker: IAFXMaker = null;

			for (var i: int = 0; i < this._pEntryList.length; i++) {
				var pEntry: IRenderEntry = this._pEntryList.value(i);
				
				// var pMaker: IAFXMaker = pEntry.maker;
				// if(pMaker !== pLastMaker){
				// 	nCountOfMakerSeq++;
				// }
				// pLastMaker = pMaker;

				this._pRenderer._renderEntry(pEntry);
#ifndef __VIEW_INTERNALS__
				this.releaseEntry(pEntry);
#endif
			}

			// if(this.nCount % 1000 === 0){
			// 	LOG("AVG count of sequences of makers:", this.fAVGMakerSeq);
			// 	this.nCount = 0;
			// 	this.fAVGMakerSeq = 0.;
			// }

			// this.fAVGMakerSeq = (this.fAVGMakerSeq * this.nCount + nCountOfMakerSeq) / (this.nCount + 1);
			// this.nCount++;

			this._pEntryList.clear(false);

			this._pRenderer._endRender();
		}

		quickSortQueue(iStart: uint, iEnd: uint): void {
			var i: uint = iStart;
			var j: uint = iEnd;
			var iMiddle: uint = this._pEntryList.value((iStart + iEnd)>>1).maker.getGuid();

			do {
				while(this._pEntryList.value(i).maker.getGuid() < iMiddle) ++i;
				while(this._pEntryList.value(j).maker.getGuid() > iMiddle) --j;
				
				if(i <= j){
					this._pEntryList.swap(i, j);
					i++; j--;
				}
			}
			while(i < j);

			if(iStart < j) this.quickSortQueue(iStart, j);
			if(i < iEnd) this.quickSortQueue(i, iEnd);
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
