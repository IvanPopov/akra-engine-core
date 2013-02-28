#ifndef IRENDERPASS_TS
#define IRENDERPASS_TS

module akra {
	IFACE (IAFXPassBlend);
	IFACE (IRenderTarget);

	export interface IRenderPass {
		data: IAFXPassBlend;

		getRenderTarget(): IRenderTarget;
	}	
}

#endif
