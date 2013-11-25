/// <reference path="idl/AIRenderer.ts" />

export function createRenderStateMap(): AIMap<AERenderStateValues> {
    var pMap: AIMap<AERenderStateValues> = <AIMap<AERenderStateValues>>{};

    pMap[AERenderStates.BLENDENABLE] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.CULLFACEENABLE] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.ZENABLE] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.ZWRITEENABLE] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.DITHERENABLE] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.SCISSORTESTENABLE] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.STENCILTESTENABLE] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.POLYGONOFFSETFILLENABLE] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.CULLFACE] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.FRONTFACE] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.SRCBLEND] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.DESTBLEND] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.ZFUNC] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.ALPHABLENDENABLE] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.ALPHATESTENABLE] = AERenderStateValues.UNDEF;

    return pMap;
}

export function copyRenderStateMap(pFrom: AIMap<AERenderStateValues>, pTo: AIMap<AERenderStateValues>): void {
    if (isNull(pFrom)) {
        return;
    }

    pTo[AERenderStates.BLENDENABLE] = pFrom[AERenderStates.BLENDENABLE] || pTo[AERenderStates.BLENDENABLE];
    pTo[AERenderStates.CULLFACEENABLE] = pFrom[AERenderStates.CULLFACEENABLE] || pTo[AERenderStates.CULLFACEENABLE];
    pTo[AERenderStates.ZENABLE] = pFrom[AERenderStates.ZENABLE] || pTo[AERenderStates.ZENABLE];
    pTo[AERenderStates.ZWRITEENABLE] = pFrom[AERenderStates.ZWRITEENABLE] || pTo[AERenderStates.ZWRITEENABLE];
    pTo[AERenderStates.DITHERENABLE] = pFrom[AERenderStates.DITHERENABLE] || pTo[AERenderStates.DITHERENABLE];
    pTo[AERenderStates.SCISSORTESTENABLE] = pFrom[AERenderStates.SCISSORTESTENABLE] || pTo[AERenderStates.SCISSORTESTENABLE];
    pTo[AERenderStates.STENCILTESTENABLE] = pFrom[AERenderStates.STENCILTESTENABLE] || pTo[AERenderStates.STENCILTESTENABLE];
    pTo[AERenderStates.POLYGONOFFSETFILLENABLE] = pFrom[AERenderStates.POLYGONOFFSETFILLENABLE] || pTo[AERenderStates.POLYGONOFFSETFILLENABLE];
    pTo[AERenderStates.CULLFACE] = pFrom[AERenderStates.CULLFACE] || pTo[AERenderStates.CULLFACE];
    pTo[AERenderStates.FRONTFACE] = pFrom[AERenderStates.FRONTFACE] || pTo[AERenderStates.FRONTFACE];
    pTo[AERenderStates.SRCBLEND] = pFrom[AERenderStates.SRCBLEND] || pTo[AERenderStates.SRCBLEND];
    pTo[AERenderStates.DESTBLEND] = pFrom[AERenderStates.DESTBLEND] || pTo[AERenderStates.DESTBLEND];
    pTo[AERenderStates.ZFUNC] = pFrom[AERenderStates.ZFUNC] || pTo[AERenderStates.ZFUNC];
    pTo[AERenderStates.ALPHABLENDENABLE] = pFrom[AERenderStates.ALPHABLENDENABLE] || pTo[AERenderStates.ALPHABLENDENABLE];
    pTo[AERenderStates.ALPHATESTENABLE] = pFrom[AERenderStates.ALPHATESTENABLE] || pTo[AERenderStates.ALPHATESTENABLE];
}

export function mergeRenderStateMap(pFromA: AIMap<AERenderStateValues>, pFromB: AIMap<AERenderStateValues>, pTo: AIMap<AERenderStateValues>): void {
    if (isNull(pFromA) || isNull(pFromB)) {
        return;
    }
    pTo[AERenderStates.BLENDENABLE] = pFromA[AERenderStates.BLENDENABLE] || pFromB[AERenderStates.BLENDENABLE];
    pTo[AERenderStates.CULLFACEENABLE] = pFromA[AERenderStates.CULLFACEENABLE] || pFromB[AERenderStates.CULLFACEENABLE];
    pTo[AERenderStates.ZENABLE] = pFromA[AERenderStates.ZENABLE] || pFromB[AERenderStates.ZENABLE];
    pTo[AERenderStates.ZWRITEENABLE] = pFromA[AERenderStates.ZWRITEENABLE] || pFromB[AERenderStates.ZWRITEENABLE];
    pTo[AERenderStates.DITHERENABLE] = pFromA[AERenderStates.DITHERENABLE] || pFromB[AERenderStates.DITHERENABLE];
    pTo[AERenderStates.SCISSORTESTENABLE] = pFromA[AERenderStates.SCISSORTESTENABLE] || pFromB[AERenderStates.SCISSORTESTENABLE];
    pTo[AERenderStates.STENCILTESTENABLE] = pFromA[AERenderStates.STENCILTESTENABLE] || pFromB[AERenderStates.STENCILTESTENABLE];
    pTo[AERenderStates.POLYGONOFFSETFILLENABLE] = pFromA[AERenderStates.POLYGONOFFSETFILLENABLE] || pFromB[AERenderStates.POLYGONOFFSETFILLENABLE];
    pTo[AERenderStates.CULLFACE] = pFromA[AERenderStates.CULLFACE] || pFromB[AERenderStates.CULLFACE];
    pTo[AERenderStates.FRONTFACE] = pFromA[AERenderStates.FRONTFACE] || pFromB[AERenderStates.FRONTFACE];
    pTo[AERenderStates.SRCBLEND] = pFromA[AERenderStates.SRCBLEND] || pFromB[AERenderStates.SRCBLEND];
    pTo[AERenderStates.DESTBLEND] = pFromA[AERenderStates.DESTBLEND] || pFromB[AERenderStates.DESTBLEND];
    pTo[AERenderStates.ZFUNC] = pFromA[AERenderStates.ZFUNC] || pFromB[AERenderStates.ZFUNC];
    pTo[AERenderStates.ALPHABLENDENABLE] = pFromA[AERenderStates.ALPHABLENDENABLE] || pFromB[AERenderStates.ALPHABLENDENABLE];
    pTo[AERenderStates.ALPHATESTENABLE] = pFromA[AERenderStates.ALPHATESTENABLE] || pFromB[AERenderStates.ALPHATESTENABLE];
}

export function clearRenderStateMap(pMap: AIMap<AERenderStateValues>): void {
    pMap[AERenderStates.BLENDENABLE] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.CULLFACEENABLE] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.ZENABLE] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.ZWRITEENABLE] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.DITHERENABLE] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.SCISSORTESTENABLE] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.STENCILTESTENABLE] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.POLYGONOFFSETFILLENABLE] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.CULLFACE] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.FRONTFACE] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.SRCBLEND] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.DESTBLEND] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.ZFUNC] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.ALPHABLENDENABLE] = AERenderStateValues.UNDEF;
    pMap[AERenderStates.ALPHATESTENABLE] = AERenderStateValues.UNDEF;
}


export function createSamplerState(): AIAFXSamplerState {
    return <AIAFXSamplerState>{
        textureName: "",
        texture: null,
        wrap_s: AETextureWrapModes.UNDEF,
        wrap_t: AETextureWrapModes.UNDEF,
        mag_filter: AETextureFilters.UNDEF,
        min_filter: AETextureFilters.UNDEF
        /*wrap_s: AETextureWrapModes.CLAMP_TO_EDGE,
        wrap_t: AETextureWrapModes.CLAMP_TO_EDGE,
        mag_filter: AETextureFilters.LINEAR,
        min_filter: AETextureFilters.LINEAR*/
    };
}
