#ifndef IUIRENDERTARGETSTATS_TS
#define IUIRENDERTARGETSTATS_TS

#include "IUIComponent.ts"
#include "IRenderTarget.ts"

module akra {
	export interface IUIRenderTargetStats extends IUIComponent {
		target: IRenderTarget;
	}
}

#endif
