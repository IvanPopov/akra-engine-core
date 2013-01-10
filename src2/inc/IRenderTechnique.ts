#ifndef IRENDERTECHNIQUE_TS
#define IRENDERTECHNIQUE_TS

#include "IEventProvider.ts"

module akra {
	IFACE(IRenderPass);
	IFACE(IRenderMethod);

	export interface IRenderTechnique extends IEventProvider {
		readonly totalPasses: uint;
		readonly modified: uint;

		destroy(): void;

		getPass(n: uint): IRenderPass;
		getMethod(): IRenderMethod;

		setMethod(pMethod: IRenderMethod);
		isReady(): bool;

		setState(sName: string, pValue: any): void;
		setForeign(sName: string, pValue: any): void;
		setStruct(sName: string, pValue: any): void;

		setTextureBySemantics(sName: string, pValue: any): void;
		setShadowSamplerArray(sName: string, pValue: any): void;
		setVec2BySemantic(sName: string, pValue: any): void;

		signal render(): void;
	}
}

#endif