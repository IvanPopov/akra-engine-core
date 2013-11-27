/// <reference path="../idl/IRenderer.ts" />
/// <reference path="../idl/ERenderStateValues.ts" />
/// <reference path="../common.ts" />

module akra.render {

    export function createRenderStateMap(): IMap<ERenderStateValues> {
        var pMap: IMap<ERenderStateValues> = <IMap<ERenderStateValues>>{};

        pMap[ERenderStates.BLENDENABLE] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.CULLFACEENABLE] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.ZENABLE] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.ZWRITEENABLE] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.DITHERENABLE] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.SCISSORTESTENABLE] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.STENCILTESTENABLE] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.POLYGONOFFSETFILLENABLE] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.CULLFACE] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.FRONTFACE] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.SRCBLEND] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.DESTBLEND] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.ZFUNC] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.ALPHABLENDENABLE] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.ALPHATESTENABLE] = ERenderStateValues.UNDEF;

        return pMap;
    }

    export function copyRenderStateMap(pFrom: IMap<ERenderStateValues>, pTo: IMap<ERenderStateValues>): void {
        if (isNull(pFrom)) {
            return;
        }

        pTo[ERenderStates.BLENDENABLE] = pFrom[ERenderStates.BLENDENABLE] || pTo[ERenderStates.BLENDENABLE];
        pTo[ERenderStates.CULLFACEENABLE] = pFrom[ERenderStates.CULLFACEENABLE] || pTo[ERenderStates.CULLFACEENABLE];
        pTo[ERenderStates.ZENABLE] = pFrom[ERenderStates.ZENABLE] || pTo[ERenderStates.ZENABLE];
        pTo[ERenderStates.ZWRITEENABLE] = pFrom[ERenderStates.ZWRITEENABLE] || pTo[ERenderStates.ZWRITEENABLE];
        pTo[ERenderStates.DITHERENABLE] = pFrom[ERenderStates.DITHERENABLE] || pTo[ERenderStates.DITHERENABLE];
        pTo[ERenderStates.SCISSORTESTENABLE] = pFrom[ERenderStates.SCISSORTESTENABLE] || pTo[ERenderStates.SCISSORTESTENABLE];
        pTo[ERenderStates.STENCILTESTENABLE] = pFrom[ERenderStates.STENCILTESTENABLE] || pTo[ERenderStates.STENCILTESTENABLE];
        pTo[ERenderStates.POLYGONOFFSETFILLENABLE] = pFrom[ERenderStates.POLYGONOFFSETFILLENABLE] || pTo[ERenderStates.POLYGONOFFSETFILLENABLE];
        pTo[ERenderStates.CULLFACE] = pFrom[ERenderStates.CULLFACE] || pTo[ERenderStates.CULLFACE];
        pTo[ERenderStates.FRONTFACE] = pFrom[ERenderStates.FRONTFACE] || pTo[ERenderStates.FRONTFACE];
        pTo[ERenderStates.SRCBLEND] = pFrom[ERenderStates.SRCBLEND] || pTo[ERenderStates.SRCBLEND];
        pTo[ERenderStates.DESTBLEND] = pFrom[ERenderStates.DESTBLEND] || pTo[ERenderStates.DESTBLEND];
        pTo[ERenderStates.ZFUNC] = pFrom[ERenderStates.ZFUNC] || pTo[ERenderStates.ZFUNC];
        pTo[ERenderStates.ALPHABLENDENABLE] = pFrom[ERenderStates.ALPHABLENDENABLE] || pTo[ERenderStates.ALPHABLENDENABLE];
        pTo[ERenderStates.ALPHATESTENABLE] = pFrom[ERenderStates.ALPHATESTENABLE] || pTo[ERenderStates.ALPHATESTENABLE];
    }

    export function mergeRenderStateMap(pFromA: IMap<ERenderStateValues>, pFromB: IMap<ERenderStateValues>, pTo: IMap<ERenderStateValues>): void {
        if (isNull(pFromA) || isNull(pFromB)) {
            return;
        }
        pTo[ERenderStates.BLENDENABLE] = pFromA[ERenderStates.BLENDENABLE] || pFromB[ERenderStates.BLENDENABLE];
        pTo[ERenderStates.CULLFACEENABLE] = pFromA[ERenderStates.CULLFACEENABLE] || pFromB[ERenderStates.CULLFACEENABLE];
        pTo[ERenderStates.ZENABLE] = pFromA[ERenderStates.ZENABLE] || pFromB[ERenderStates.ZENABLE];
        pTo[ERenderStates.ZWRITEENABLE] = pFromA[ERenderStates.ZWRITEENABLE] || pFromB[ERenderStates.ZWRITEENABLE];
        pTo[ERenderStates.DITHERENABLE] = pFromA[ERenderStates.DITHERENABLE] || pFromB[ERenderStates.DITHERENABLE];
        pTo[ERenderStates.SCISSORTESTENABLE] = pFromA[ERenderStates.SCISSORTESTENABLE] || pFromB[ERenderStates.SCISSORTESTENABLE];
        pTo[ERenderStates.STENCILTESTENABLE] = pFromA[ERenderStates.STENCILTESTENABLE] || pFromB[ERenderStates.STENCILTESTENABLE];
        pTo[ERenderStates.POLYGONOFFSETFILLENABLE] = pFromA[ERenderStates.POLYGONOFFSETFILLENABLE] || pFromB[ERenderStates.POLYGONOFFSETFILLENABLE];
        pTo[ERenderStates.CULLFACE] = pFromA[ERenderStates.CULLFACE] || pFromB[ERenderStates.CULLFACE];
        pTo[ERenderStates.FRONTFACE] = pFromA[ERenderStates.FRONTFACE] || pFromB[ERenderStates.FRONTFACE];
        pTo[ERenderStates.SRCBLEND] = pFromA[ERenderStates.SRCBLEND] || pFromB[ERenderStates.SRCBLEND];
        pTo[ERenderStates.DESTBLEND] = pFromA[ERenderStates.DESTBLEND] || pFromB[ERenderStates.DESTBLEND];
        pTo[ERenderStates.ZFUNC] = pFromA[ERenderStates.ZFUNC] || pFromB[ERenderStates.ZFUNC];
        pTo[ERenderStates.ALPHABLENDENABLE] = pFromA[ERenderStates.ALPHABLENDENABLE] || pFromB[ERenderStates.ALPHABLENDENABLE];
        pTo[ERenderStates.ALPHATESTENABLE] = pFromA[ERenderStates.ALPHATESTENABLE] || pFromB[ERenderStates.ALPHATESTENABLE];
    }

    export function clearRenderStateMap(pMap: IMap<ERenderStateValues>): void {
        pMap[ERenderStates.BLENDENABLE] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.CULLFACEENABLE] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.ZENABLE] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.ZWRITEENABLE] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.DITHERENABLE] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.SCISSORTESTENABLE] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.STENCILTESTENABLE] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.POLYGONOFFSETFILLENABLE] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.CULLFACE] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.FRONTFACE] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.SRCBLEND] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.DESTBLEND] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.ZFUNC] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.ALPHABLENDENABLE] = ERenderStateValues.UNDEF;
        pMap[ERenderStates.ALPHATESTENABLE] = ERenderStateValues.UNDEF;
    }


    export function createSamplerState(): IAFXSamplerState {
        return <IAFXSamplerState>{
            textureName: "",
            texture: null,
            wrap_s: ETextureWrapModes.UNDEF,
            wrap_t: ETextureWrapModes.UNDEF,
            mag_filter: ETextureFilters.UNDEF,
            min_filter: ETextureFilters.UNDEF
            /*wrap_s: ETextureWrapModes.CLAMP_TO_EDGE,
            wrap_t: ETextureWrapModes.CLAMP_TO_EDGE,
            mag_filter: ETextureFilters.LINEAR,
            min_filter: ETextureFilters.LINEAR*/
        };
    }

}