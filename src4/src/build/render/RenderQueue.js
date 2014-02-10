/// <reference path="../idl/IRenderer.ts" />
/// <reference path="../idl/IRenderQueue.ts" />
var akra;
(function (akra) {
    /// <reference path="../util/ObjectArray.ts" />
    /// <reference path="../config/config.ts" />
    /// <reference path="RenderEntry.ts" />
    (function (render) {
        var RenderQueue = (function () {
            function RenderQueue(pRenderer) {
                this._fnSortFunction = null;
                this._pRenderer = pRenderer;
                this._pEntryList = new akra.util.ObjectArray();
                this._fnSortFunction = function (a, b) {
                    if (akra.isNull(a) || akra.isNull(a.maker)) {
                        return 1;
                    }
                    if (akra.isNull(b) || akra.isNull(b.maker)) {
                        return -1;
                    } else {
                        return a.maker.guid - b.maker.guid;
                    }
                };
            }
            RenderQueue.prototype.execute = function (bSort) {
                if (typeof bSort === "undefined") { bSort = false; }
                this._pRenderer._beginRender();
                if (bSort && this._pEntryList.getLength() > 0) {
                    this.quickSortQueue(0, this._pEntryList.getLength() - 1);
                }

                for (var i = 0; i < this._pEntryList.getLength(); i++) {
                    var pEntry = this._pEntryList.value(i);

                    this._pRenderer._renderEntry(pEntry);

                    if (!akra.config.__VIEW_INTERNALS__) {
                        this.releaseEntry(pEntry);
                    }
                }

                this._pEntryList.clear(false);

                this._pRenderer._endRender();
            };

            RenderQueue.prototype.quickSortQueue = function (iStart, iEnd) {
                var i = iStart;
                var j = iEnd;
                var iMiddle = this._pEntryList.value((iStart + iEnd) >> 1).maker.guid;

                do {
                    while (this._pEntryList.value(i).maker.guid < iMiddle)
                        ++i;
                    while (this._pEntryList.value(j).maker.guid > iMiddle)
                        --j;

                    if (i <= j) {
                        this._pEntryList.swap(i, j);
                        i++;
                        j--;
                    }
                } while(i < j);

                if (iStart < j)
                    this.quickSortQueue(iStart, j);
                if (i < iEnd)
                    this.quickSortQueue(i, iEnd);
            };

            RenderQueue.prototype.push = function (pEntry) {
                this._pEntryList.push(pEntry);
            };

            RenderQueue.prototype.createEntry = function () {
                return RenderQueue.createEntry();
            };

            RenderQueue.prototype.releaseEntry = function (pEntry) {
                return RenderQueue.releaseEntry(pEntry);
            };

            RenderQueue.createEntry = function () {
                return RenderQueue.pool.getLength() > 0 ? RenderQueue.pool.pop() : new akra.render.RenderEntry;
            };

            RenderQueue.releaseEntry = function (pEntry) {
                RenderQueue.pool.push(pEntry);
                pEntry.clear();
            };

            RenderQueue.pool = new akra.util.ObjectArray();
            return RenderQueue;
        })();
        render.RenderQueue = RenderQueue;
    })(akra.render || (akra.render = {}));
    var render = akra.render;
})(akra || (akra = {}));
//# sourceMappingURL=RenderQueue.js.map
