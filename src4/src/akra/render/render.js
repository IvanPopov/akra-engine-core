var akra;
(function (akra) {
    /// <reference path="../idl/IRenderer.ts" />
    /// <reference path="../idl/ERenderStateValues.ts" />
    /// <reference path="../common.ts" />
    (function (render) {
        function createRenderStateMap() {
            var pMap = {};

            pMap[akra.ERenderStates.BLENDENABLE] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.CULLFACEENABLE] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.ZENABLE] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.ZWRITEENABLE] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.DITHERENABLE] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.SCISSORTESTENABLE] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.STENCILTESTENABLE] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.POLYGONOFFSETFILLENABLE] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.CULLFACE] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.FRONTFACE] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.SRCBLEND] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.DESTBLEND] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.ZFUNC] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.ALPHABLENDENABLE] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.ALPHATESTENABLE] = akra.ERenderStateValues.UNDEF;

            return pMap;
        }
        render.createRenderStateMap = createRenderStateMap;

        function copyRenderStateMap(pFrom, pTo) {
            if (isNull(pFrom)) {
                return;
            }

            pTo[akra.ERenderStates.BLENDENABLE] = pFrom[akra.ERenderStates.BLENDENABLE] || pTo[akra.ERenderStates.BLENDENABLE];
            pTo[akra.ERenderStates.CULLFACEENABLE] = pFrom[akra.ERenderStates.CULLFACEENABLE] || pTo[akra.ERenderStates.CULLFACEENABLE];
            pTo[akra.ERenderStates.ZENABLE] = pFrom[akra.ERenderStates.ZENABLE] || pTo[akra.ERenderStates.ZENABLE];
            pTo[akra.ERenderStates.ZWRITEENABLE] = pFrom[akra.ERenderStates.ZWRITEENABLE] || pTo[akra.ERenderStates.ZWRITEENABLE];
            pTo[akra.ERenderStates.DITHERENABLE] = pFrom[akra.ERenderStates.DITHERENABLE] || pTo[akra.ERenderStates.DITHERENABLE];
            pTo[akra.ERenderStates.SCISSORTESTENABLE] = pFrom[akra.ERenderStates.SCISSORTESTENABLE] || pTo[akra.ERenderStates.SCISSORTESTENABLE];
            pTo[akra.ERenderStates.STENCILTESTENABLE] = pFrom[akra.ERenderStates.STENCILTESTENABLE] || pTo[akra.ERenderStates.STENCILTESTENABLE];
            pTo[akra.ERenderStates.POLYGONOFFSETFILLENABLE] = pFrom[akra.ERenderStates.POLYGONOFFSETFILLENABLE] || pTo[akra.ERenderStates.POLYGONOFFSETFILLENABLE];
            pTo[akra.ERenderStates.CULLFACE] = pFrom[akra.ERenderStates.CULLFACE] || pTo[akra.ERenderStates.CULLFACE];
            pTo[akra.ERenderStates.FRONTFACE] = pFrom[akra.ERenderStates.FRONTFACE] || pTo[akra.ERenderStates.FRONTFACE];
            pTo[akra.ERenderStates.SRCBLEND] = pFrom[akra.ERenderStates.SRCBLEND] || pTo[akra.ERenderStates.SRCBLEND];
            pTo[akra.ERenderStates.DESTBLEND] = pFrom[akra.ERenderStates.DESTBLEND] || pTo[akra.ERenderStates.DESTBLEND];
            pTo[akra.ERenderStates.ZFUNC] = pFrom[akra.ERenderStates.ZFUNC] || pTo[akra.ERenderStates.ZFUNC];
            pTo[akra.ERenderStates.ALPHABLENDENABLE] = pFrom[akra.ERenderStates.ALPHABLENDENABLE] || pTo[akra.ERenderStates.ALPHABLENDENABLE];
            pTo[akra.ERenderStates.ALPHATESTENABLE] = pFrom[akra.ERenderStates.ALPHATESTENABLE] || pTo[akra.ERenderStates.ALPHATESTENABLE];
        }
        render.copyRenderStateMap = copyRenderStateMap;

        function mergeRenderStateMap(pFromA, pFromB, pTo) {
            if (isNull(pFromA) || isNull(pFromB)) {
                return;
            }
            pTo[akra.ERenderStates.BLENDENABLE] = pFromA[akra.ERenderStates.BLENDENABLE] || pFromB[akra.ERenderStates.BLENDENABLE];
            pTo[akra.ERenderStates.CULLFACEENABLE] = pFromA[akra.ERenderStates.CULLFACEENABLE] || pFromB[akra.ERenderStates.CULLFACEENABLE];
            pTo[akra.ERenderStates.ZENABLE] = pFromA[akra.ERenderStates.ZENABLE] || pFromB[akra.ERenderStates.ZENABLE];
            pTo[akra.ERenderStates.ZWRITEENABLE] = pFromA[akra.ERenderStates.ZWRITEENABLE] || pFromB[akra.ERenderStates.ZWRITEENABLE];
            pTo[akra.ERenderStates.DITHERENABLE] = pFromA[akra.ERenderStates.DITHERENABLE] || pFromB[akra.ERenderStates.DITHERENABLE];
            pTo[akra.ERenderStates.SCISSORTESTENABLE] = pFromA[akra.ERenderStates.SCISSORTESTENABLE] || pFromB[akra.ERenderStates.SCISSORTESTENABLE];
            pTo[akra.ERenderStates.STENCILTESTENABLE] = pFromA[akra.ERenderStates.STENCILTESTENABLE] || pFromB[akra.ERenderStates.STENCILTESTENABLE];
            pTo[akra.ERenderStates.POLYGONOFFSETFILLENABLE] = pFromA[akra.ERenderStates.POLYGONOFFSETFILLENABLE] || pFromB[akra.ERenderStates.POLYGONOFFSETFILLENABLE];
            pTo[akra.ERenderStates.CULLFACE] = pFromA[akra.ERenderStates.CULLFACE] || pFromB[akra.ERenderStates.CULLFACE];
            pTo[akra.ERenderStates.FRONTFACE] = pFromA[akra.ERenderStates.FRONTFACE] || pFromB[akra.ERenderStates.FRONTFACE];
            pTo[akra.ERenderStates.SRCBLEND] = pFromA[akra.ERenderStates.SRCBLEND] || pFromB[akra.ERenderStates.SRCBLEND];
            pTo[akra.ERenderStates.DESTBLEND] = pFromA[akra.ERenderStates.DESTBLEND] || pFromB[akra.ERenderStates.DESTBLEND];
            pTo[akra.ERenderStates.ZFUNC] = pFromA[akra.ERenderStates.ZFUNC] || pFromB[akra.ERenderStates.ZFUNC];
            pTo[akra.ERenderStates.ALPHABLENDENABLE] = pFromA[akra.ERenderStates.ALPHABLENDENABLE] || pFromB[akra.ERenderStates.ALPHABLENDENABLE];
            pTo[akra.ERenderStates.ALPHATESTENABLE] = pFromA[akra.ERenderStates.ALPHATESTENABLE] || pFromB[akra.ERenderStates.ALPHATESTENABLE];
        }
        render.mergeRenderStateMap = mergeRenderStateMap;

        function clearRenderStateMap(pMap) {
            pMap[akra.ERenderStates.BLENDENABLE] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.CULLFACEENABLE] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.ZENABLE] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.ZWRITEENABLE] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.DITHERENABLE] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.SCISSORTESTENABLE] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.STENCILTESTENABLE] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.POLYGONOFFSETFILLENABLE] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.CULLFACE] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.FRONTFACE] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.SRCBLEND] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.DESTBLEND] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.ZFUNC] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.ALPHABLENDENABLE] = akra.ERenderStateValues.UNDEF;
            pMap[akra.ERenderStates.ALPHATESTENABLE] = akra.ERenderStateValues.UNDEF;
        }
        render.clearRenderStateMap = clearRenderStateMap;

        function createSamplerState() {
            return {
                textureName: "",
                texture: null,
                wrap_s: akra.ETextureWrapModes.UNDEF,
                wrap_t: akra.ETextureWrapModes.UNDEF,
                mag_filter: akra.ETextureFilters.UNDEF,
                min_filter: akra.ETextureFilters.UNDEF
            };
        }
        render.createSamplerState = createSamplerState;
    })(akra.render || (akra.render = {}));
    var render = akra.render;
})(akra || (akra = {}));
