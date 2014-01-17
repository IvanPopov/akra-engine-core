#ifndef RENDERUTIL_TS
#define RENDERUTIL_TS

#include "IRenderer.ts"
#include "render/renderUtil.ts"

module akra.render {
	export function createRenderStateMap(): IRenderStateMap {
		var pMap: IRenderStateMap = <IRenderStateMap>{};
		
		pMap[EPassState.BLENDENABLE] = EPassStateValue.UNDEF;
		pMap[EPassState.CULLFACEENABLE] = EPassStateValue.UNDEF;
		pMap[EPassState.ZENABLE] = EPassStateValue.UNDEF;
		pMap[EPassState.ZWRITEENABLE] = EPassStateValue.UNDEF;
		pMap[EPassState.DITHERENABLE] = EPassStateValue.UNDEF;
		pMap[EPassState.SCISSORTESTENABLE] = EPassStateValue.UNDEF;
		pMap[EPassState.STENCILTESTENABLE] = EPassStateValue.UNDEF;
		pMap[EPassState.POLYGONOFFSETFILLENABLE] = EPassStateValue.UNDEF;
		pMap[EPassState.CULLFACE] = EPassStateValue.UNDEF;
		pMap[EPassState.FRONTFACE] = EPassStateValue.UNDEF;
		pMap[EPassState.SRCBLEND] = EPassStateValue.UNDEF;
		pMap[EPassState.DESTBLEND] = EPassStateValue.UNDEF;
		pMap[EPassState.ZFUNC] = EPassStateValue.UNDEF;
		pMap[EPassState.ALPHABLENDENABLE] = EPassStateValue.UNDEF;
		pMap[EPassState.ALPHATESTENABLE] = EPassStateValue.UNDEF;

		return pMap;
	}

	export function copyRenderStateMap(pFrom: IRenderStateMap, pTo: IRenderStateMap): void {
		if(isNull(pFrom)){
			return;
		}
		pTo[EPassState.BLENDENABLE] = pFrom[EPassState.BLENDENABLE] || pTo[EPassState.BLENDENABLE];
		pTo[EPassState.CULLFACEENABLE] = pFrom[EPassState.CULLFACEENABLE] || pTo[EPassState.CULLFACEENABLE];
		pTo[EPassState.ZENABLE] = pFrom[EPassState.ZENABLE] || pTo[EPassState.ZENABLE];
		pTo[EPassState.ZWRITEENABLE] = pFrom[EPassState.ZWRITEENABLE] || pTo[EPassState.ZWRITEENABLE];
		pTo[EPassState.DITHERENABLE] = pFrom[EPassState.DITHERENABLE] || pTo[EPassState.DITHERENABLE];
		pTo[EPassState.SCISSORTESTENABLE] = pFrom[EPassState.SCISSORTESTENABLE] || pTo[EPassState.SCISSORTESTENABLE];
		pTo[EPassState.STENCILTESTENABLE] = pFrom[EPassState.STENCILTESTENABLE] || pTo[EPassState.STENCILTESTENABLE];
		pTo[EPassState.POLYGONOFFSETFILLENABLE] = pFrom[EPassState.POLYGONOFFSETFILLENABLE] || pTo[EPassState.POLYGONOFFSETFILLENABLE];
		pTo[EPassState.CULLFACE] = pFrom[EPassState.CULLFACE] || pTo[EPassState.CULLFACE];
		pTo[EPassState.FRONTFACE] = pFrom[EPassState.FRONTFACE] || pTo[EPassState.FRONTFACE];
		pTo[EPassState.SRCBLEND] = pFrom[EPassState.SRCBLEND] || pTo[EPassState.SRCBLEND];
		pTo[EPassState.DESTBLEND] = pFrom[EPassState.DESTBLEND] || pTo[EPassState.DESTBLEND];
		pTo[EPassState.ZFUNC] = pFrom[EPassState.ZFUNC] || pTo[EPassState.ZFUNC];
		pTo[EPassState.ALPHABLENDENABLE] = pFrom[EPassState.ALPHABLENDENABLE] || pTo[EPassState.ALPHABLENDENABLE];
		pTo[EPassState.ALPHATESTENABLE] = pFrom[EPassState.ALPHATESTENABLE] || pTo[EPassState.ALPHATESTENABLE];
	}

	export function mergeRenderStateMap(pFromA: IRenderStateMap, pFromB: IRenderStateMap, pTo: IRenderStateMap): void {
		if(isNull(pFromA) || isNull(pFromB)){
			return;
		}
		pTo[EPassState.BLENDENABLE] = pFromA[EPassState.BLENDENABLE] || pFromB[EPassState.BLENDENABLE];
		pTo[EPassState.CULLFACEENABLE] = pFromA[EPassState.CULLFACEENABLE] || pFromB[EPassState.CULLFACEENABLE];
		pTo[EPassState.ZENABLE] = pFromA[EPassState.ZENABLE] || pFromB[EPassState.ZENABLE];
		pTo[EPassState.ZWRITEENABLE] = pFromA[EPassState.ZWRITEENABLE] || pFromB[EPassState.ZWRITEENABLE];
		pTo[EPassState.DITHERENABLE] = pFromA[EPassState.DITHERENABLE] || pFromB[EPassState.DITHERENABLE];
		pTo[EPassState.SCISSORTESTENABLE] = pFromA[EPassState.SCISSORTESTENABLE] || pFromB[EPassState.SCISSORTESTENABLE];
		pTo[EPassState.STENCILTESTENABLE] = pFromA[EPassState.STENCILTESTENABLE] || pFromB[EPassState.STENCILTESTENABLE];
		pTo[EPassState.POLYGONOFFSETFILLENABLE] = pFromA[EPassState.POLYGONOFFSETFILLENABLE] || pFromB[EPassState.POLYGONOFFSETFILLENABLE];
		pTo[EPassState.CULLFACE] = pFromA[EPassState.CULLFACE] || pFromB[EPassState.CULLFACE];
		pTo[EPassState.FRONTFACE] = pFromA[EPassState.FRONTFACE] || pFromB[EPassState.FRONTFACE];
		pTo[EPassState.SRCBLEND] = pFromA[EPassState.SRCBLEND] || pFromB[EPassState.SRCBLEND];
		pTo[EPassState.DESTBLEND] = pFromA[EPassState.DESTBLEND] || pFromB[EPassState.DESTBLEND];
		pTo[EPassState.ZFUNC] = pFromA[EPassState.ZFUNC] || pFromB[EPassState.ZFUNC];
		pTo[EPassState.ALPHABLENDENABLE] = pFromA[EPassState.ALPHABLENDENABLE] || pFromB[EPassState.ALPHABLENDENABLE];
		pTo[EPassState.ALPHATESTENABLE] = pFromA[EPassState.ALPHATESTENABLE] || pFromB[EPassState.ALPHATESTENABLE];
	}

	export function clearRenderStateMap(pMap: IRenderStateMap): void {
		pMap[EPassState.BLENDENABLE] = EPassStateValue.UNDEF;
		pMap[EPassState.CULLFACEENABLE] = EPassStateValue.UNDEF;
		pMap[EPassState.ZENABLE] = EPassStateValue.UNDEF;
		pMap[EPassState.ZWRITEENABLE] = EPassStateValue.UNDEF;
		pMap[EPassState.DITHERENABLE] = EPassStateValue.UNDEF;
		pMap[EPassState.SCISSORTESTENABLE] = EPassStateValue.UNDEF;
		pMap[EPassState.STENCILTESTENABLE] = EPassStateValue.UNDEF;
		pMap[EPassState.POLYGONOFFSETFILLENABLE] = EPassStateValue.UNDEF;
		pMap[EPassState.CULLFACE] = EPassStateValue.UNDEF;
		pMap[EPassState.FRONTFACE] = EPassStateValue.UNDEF;
		pMap[EPassState.SRCBLEND] = EPassStateValue.UNDEF;
		pMap[EPassState.DESTBLEND] = EPassStateValue.UNDEF;
		pMap[EPassState.ZFUNC] = EPassStateValue.UNDEF;
		pMap[EPassState.ALPHABLENDENABLE] = EPassStateValue.UNDEF;
		pMap[EPassState.ALPHATESTENABLE] = EPassStateValue.UNDEF;
	}

}

#endif