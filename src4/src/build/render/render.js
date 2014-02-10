/// <reference path="../idl/IRenderer.ts" />
/// <reference path="../idl/ERenderStateValues.ts" />
/// <reference path="../common.ts" />
var akra;
(function (akra) {
    (function (render) {
        function createRenderStateMap() {
            var pMap = {};

            pMap[0 /* BLENDENABLE */] = 0 /* UNDEF */;
            pMap[1 /* CULLFACEENABLE */] = 0 /* UNDEF */;
            pMap[2 /* ZENABLE */] = 0 /* UNDEF */;
            pMap[3 /* ZWRITEENABLE */] = 0 /* UNDEF */;
            pMap[4 /* DITHERENABLE */] = 0 /* UNDEF */;
            pMap[5 /* SCISSORTESTENABLE */] = 0 /* UNDEF */;
            pMap[6 /* STENCILTESTENABLE */] = 0 /* UNDEF */;
            pMap[7 /* POLYGONOFFSETFILLENABLE */] = 0 /* UNDEF */;
            pMap[8 /* CULLFACE */] = 0 /* UNDEF */;
            pMap[9 /* FRONTFACE */] = 0 /* UNDEF */;
            pMap[10 /* SRCBLEND */] = 0 /* UNDEF */;
            pMap[11 /* DESTBLEND */] = 0 /* UNDEF */;
            pMap[12 /* ZFUNC */] = 0 /* UNDEF */;
            pMap[13 /* ALPHABLENDENABLE */] = 0 /* UNDEF */;
            pMap[14 /* ALPHATESTENABLE */] = 0 /* UNDEF */;

            return pMap;
        }
        render.createRenderStateMap = createRenderStateMap;

        function copyRenderStateMap(pFrom, pTo) {
            if (akra.isNull(pFrom)) {
                return;
            }

            pTo[0 /* BLENDENABLE */] = pFrom[0 /* BLENDENABLE */] || pTo[0 /* BLENDENABLE */];
            pTo[1 /* CULLFACEENABLE */] = pFrom[1 /* CULLFACEENABLE */] || pTo[1 /* CULLFACEENABLE */];
            pTo[2 /* ZENABLE */] = pFrom[2 /* ZENABLE */] || pTo[2 /* ZENABLE */];
            pTo[3 /* ZWRITEENABLE */] = pFrom[3 /* ZWRITEENABLE */] || pTo[3 /* ZWRITEENABLE */];
            pTo[4 /* DITHERENABLE */] = pFrom[4 /* DITHERENABLE */] || pTo[4 /* DITHERENABLE */];
            pTo[5 /* SCISSORTESTENABLE */] = pFrom[5 /* SCISSORTESTENABLE */] || pTo[5 /* SCISSORTESTENABLE */];
            pTo[6 /* STENCILTESTENABLE */] = pFrom[6 /* STENCILTESTENABLE */] || pTo[6 /* STENCILTESTENABLE */];
            pTo[7 /* POLYGONOFFSETFILLENABLE */] = pFrom[7 /* POLYGONOFFSETFILLENABLE */] || pTo[7 /* POLYGONOFFSETFILLENABLE */];
            pTo[8 /* CULLFACE */] = pFrom[8 /* CULLFACE */] || pTo[8 /* CULLFACE */];
            pTo[9 /* FRONTFACE */] = pFrom[9 /* FRONTFACE */] || pTo[9 /* FRONTFACE */];
            pTo[10 /* SRCBLEND */] = pFrom[10 /* SRCBLEND */] || pTo[10 /* SRCBLEND */];
            pTo[11 /* DESTBLEND */] = pFrom[11 /* DESTBLEND */] || pTo[11 /* DESTBLEND */];
            pTo[12 /* ZFUNC */] = pFrom[12 /* ZFUNC */] || pTo[12 /* ZFUNC */];
            pTo[13 /* ALPHABLENDENABLE */] = pFrom[13 /* ALPHABLENDENABLE */] || pTo[13 /* ALPHABLENDENABLE */];
            pTo[14 /* ALPHATESTENABLE */] = pFrom[14 /* ALPHATESTENABLE */] || pTo[14 /* ALPHATESTENABLE */];
        }
        render.copyRenderStateMap = copyRenderStateMap;

        function mergeRenderStateMap(pFromA, pFromB, pTo) {
            if (akra.isNull(pFromA) || akra.isNull(pFromB)) {
                return;
            }
            pTo[0 /* BLENDENABLE */] = pFromA[0 /* BLENDENABLE */] || pFromB[0 /* BLENDENABLE */];
            pTo[1 /* CULLFACEENABLE */] = pFromA[1 /* CULLFACEENABLE */] || pFromB[1 /* CULLFACEENABLE */];
            pTo[2 /* ZENABLE */] = pFromA[2 /* ZENABLE */] || pFromB[2 /* ZENABLE */];
            pTo[3 /* ZWRITEENABLE */] = pFromA[3 /* ZWRITEENABLE */] || pFromB[3 /* ZWRITEENABLE */];
            pTo[4 /* DITHERENABLE */] = pFromA[4 /* DITHERENABLE */] || pFromB[4 /* DITHERENABLE */];
            pTo[5 /* SCISSORTESTENABLE */] = pFromA[5 /* SCISSORTESTENABLE */] || pFromB[5 /* SCISSORTESTENABLE */];
            pTo[6 /* STENCILTESTENABLE */] = pFromA[6 /* STENCILTESTENABLE */] || pFromB[6 /* STENCILTESTENABLE */];
            pTo[7 /* POLYGONOFFSETFILLENABLE */] = pFromA[7 /* POLYGONOFFSETFILLENABLE */] || pFromB[7 /* POLYGONOFFSETFILLENABLE */];
            pTo[8 /* CULLFACE */] = pFromA[8 /* CULLFACE */] || pFromB[8 /* CULLFACE */];
            pTo[9 /* FRONTFACE */] = pFromA[9 /* FRONTFACE */] || pFromB[9 /* FRONTFACE */];
            pTo[10 /* SRCBLEND */] = pFromA[10 /* SRCBLEND */] || pFromB[10 /* SRCBLEND */];
            pTo[11 /* DESTBLEND */] = pFromA[11 /* DESTBLEND */] || pFromB[11 /* DESTBLEND */];
            pTo[12 /* ZFUNC */] = pFromA[12 /* ZFUNC */] || pFromB[12 /* ZFUNC */];
            pTo[13 /* ALPHABLENDENABLE */] = pFromA[13 /* ALPHABLENDENABLE */] || pFromB[13 /* ALPHABLENDENABLE */];
            pTo[14 /* ALPHATESTENABLE */] = pFromA[14 /* ALPHATESTENABLE */] || pFromB[14 /* ALPHATESTENABLE */];
        }
        render.mergeRenderStateMap = mergeRenderStateMap;

        function clearRenderStateMap(pMap) {
            pMap[0 /* BLENDENABLE */] = 0 /* UNDEF */;
            pMap[1 /* CULLFACEENABLE */] = 0 /* UNDEF */;
            pMap[2 /* ZENABLE */] = 0 /* UNDEF */;
            pMap[3 /* ZWRITEENABLE */] = 0 /* UNDEF */;
            pMap[4 /* DITHERENABLE */] = 0 /* UNDEF */;
            pMap[5 /* SCISSORTESTENABLE */] = 0 /* UNDEF */;
            pMap[6 /* STENCILTESTENABLE */] = 0 /* UNDEF */;
            pMap[7 /* POLYGONOFFSETFILLENABLE */] = 0 /* UNDEF */;
            pMap[8 /* CULLFACE */] = 0 /* UNDEF */;
            pMap[9 /* FRONTFACE */] = 0 /* UNDEF */;
            pMap[10 /* SRCBLEND */] = 0 /* UNDEF */;
            pMap[11 /* DESTBLEND */] = 0 /* UNDEF */;
            pMap[12 /* ZFUNC */] = 0 /* UNDEF */;
            pMap[13 /* ALPHABLENDENABLE */] = 0 /* UNDEF */;
            pMap[14 /* ALPHATESTENABLE */] = 0 /* UNDEF */;
        }
        render.clearRenderStateMap = clearRenderStateMap;

        function createSamplerState() {
            return {
                textureName: "",
                texture: null,
                wrap_s: 0 /* UNDEF */,
                wrap_t: 0 /* UNDEF */,
                mag_filter: 0 /* UNDEF */,
                min_filter: 0 /* UNDEF */
            };
        }
        render.createSamplerState = createSamplerState;
    })(akra.render || (akra.render = {}));
    var render = akra.render;
})(akra || (akra = {}));
//# sourceMappingURL=render.js.map
