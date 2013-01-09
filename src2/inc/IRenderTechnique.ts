#ifndef IRENDERTECHNIQUE_TS
#define IRENDERTECHNIQUE_TS

module akra {
	IFACE(IRenderPass);
	IFACE(IRenderMethod);

	export interface IRenderTechnique {
		readonly totalPasses: uint;

		destroy(): void;

		getPass(n: uint): IRenderPass;
		getMethod(): IRenderMethod;

		setMethod(pMethod: IRenderMethod);
		isReady(): bool;
	}
}

#endif