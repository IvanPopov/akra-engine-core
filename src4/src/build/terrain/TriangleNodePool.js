/// <reference path="../idl/ITriTreeNode.ts" />
var akra;
(function (akra) {
    (function (terrain) {
        var TriangleNodePool = (function () {
            function TriangleNodePool(iCount) {
                this._iNextTriNode = 0;
                this._iMaxCount = undefined;
                this._pPool = null;
                this._iMaxCount = iCount;
                this._pPool = new Array(iCount);

                for (var i = 0; i < this._iMaxCount; i++) {
                    this._pPool[i] = TriangleNodePool.createTriTreeNode();
                }
            }
            TriangleNodePool.prototype.getNextTriNode = function () {
                return this._iNextTriNode;
            };

            TriangleNodePool.prototype.setNextTriNode = function (iNextTriNode) {
                this._iNextTriNode = iNextTriNode;
            };

            TriangleNodePool.prototype.getMaxCount = function () {
                return this._iMaxCount;
            };

            TriangleNodePool.prototype.getPool = function () {
                return this._pPool;
            };

            TriangleNodePool.prototype.setPool = function (pPool) {
                this._pPool = pPool;
            };

            TriangleNodePool.prototype.request = function () {
                var pNode = null;

                if (this._iNextTriNode < this._iMaxCount) {
                    pNode = this._pPool[this._iNextTriNode];
                    pNode.baseNeighbor = null;
                    pNode.leftNeighbor = null;
                    pNode.rightNeighbor = null;
                    pNode.leftChild = null;
                    pNode.rightChild = null;
                    this._iNextTriNode++;
                }

                return pNode;
            };

            TriangleNodePool.prototype.reset = function () {
                this._iNextTriNode = 0;
            };

            TriangleNodePool.createTriTreeNode = function () {
                return {
                    baseNeighbor: null,
                    leftNeighbor: null,
                    rightNeighbor: null,
                    leftChild: null,
                    rightChild: null
                };
            };
            return TriangleNodePool;
        })();
        terrain.TriangleNodePool = TriangleNodePool;
    })(akra.terrain || (akra.terrain = {}));
    var terrain = akra.terrain;
})(akra || (akra = {}));
//# sourceMappingURL=TriangleNodePool.js.map
