/// <reference path="../idl/ILightGraph.ts" />
/// <reference path="../util/ObjectList.ts" />
/// <reference path="../common.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="light/LightPoint.ts" />
    /// <reference path="DisplayList.ts" />
    (function (scene) {
        var LightPoint = akra.scene.light.LightPoint;

        var LightGraph = (function (_super) {
            __extends(LightGraph, _super);
            function LightGraph() {
                _super.call(this, "LightGraph");
                this._pLightPoints = new akra.util.ObjectList();
            }
            LightGraph.prototype._findObjects = function (pCamera, pResultArray, bFastSearch) {
                if (typeof pResultArray === "undefined") { pResultArray = null; }
                if (typeof bFastSearch === "undefined") { bFastSearch = false; }
                if (akra.isNull(pResultArray)) {
                    pResultArray = new akra.util.ObjectArray();
                }

                //while we ignore second parametr
                //don't have normal implementation
                pResultArray.clear();

                var pList = this._pLightPoints;

                var pLightPoint = pList.getFirst();

                while (akra.isDefAndNotNull(pLightPoint)) {
                    if (pLightPoint._prepareForLighting(pCamera)) {
                        // LOG("light point added");
                        pResultArray.push(pLightPoint);
                    }

                    pLightPoint = pList.next();
                }

                return pResultArray;
            };

            LightGraph.prototype.attachObject = function (pNode) {
                if (LightPoint.isLightPoint(pNode)) {
                    this._pLightPoints.push(pNode);
                }
            };

            LightGraph.prototype.detachObject = function (pNode) {
                if (LightPoint.isLightPoint(pNode)) {
                    var iPosition = this._pLightPoints.indexOf(pNode);
                    if (iPosition != -1) {
                        this._pLightPoints.takeAt(iPosition);
                    } else {
                        akra.debug.assert(false, "cannot find light point");
                    }
                }
            };
            return LightGraph;
        })(akra.scene.DisplayList);
        scene.LightGraph = LightGraph;
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
//# sourceMappingURL=LightGraph.js.map
