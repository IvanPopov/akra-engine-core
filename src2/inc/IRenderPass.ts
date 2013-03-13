#ifndef IRENDERPASS_TS
#define IRENDERPASS_TS

#include "IUnique.ts"

module akra {
	IFACE (IAFXPassBlend);
	IFACE (IRenderTarget);

	export interface IRenderPass extends IUnique {
		data: IAFXPassBlend;

		getRenderTarget(): IRenderTarget;
	}	
}

#endif
