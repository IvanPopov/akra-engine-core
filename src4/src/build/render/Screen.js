/// <reference path="RenderableObject.ts" />
/// <reference path="../data/VertexDeclaration.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (render) {
        var VE = akra.data.VertexElement;
        var DeclUsages = akra.data.Usages;

        var Screen = (function (_super) {
            __extends(Screen, _super);
            function Screen(pRenderer, pCollection) {
                _super.call(this, 2 /* SCREEN */);

                if (!akra.isDefAndNotNull(pCollection)) {
                    pCollection = pRenderer.getEngine().createRenderDataCollection(0);
                }

                var pData = pCollection.getEmptyRenderData(5 /* TRIANGLESTRIP */);

                pData.allocateAttribute(akra.data.VertexDeclaration.normalize([VE.float2(DeclUsages.POSITION)]), new Float32Array([-1, -1, -1, 1, 1, -1, 1, 1]));

                this._pRenderData = pData;
                this._setup(pRenderer);
            }
            return Screen;
        })(akra.render.RenderableObject);
        render.Screen = Screen;
    })(akra.render || (akra.render = {}));
    var render = akra.render;
})(akra || (akra = {}));
//# sourceMappingURL=Screen.js.map
