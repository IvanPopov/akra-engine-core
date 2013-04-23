#ifndef IDEPTHBUFFER_TS
#define IDEPTHBUFFER_TS

#include "IRenderResource.ts"

module akra {

	export interface IDepthBuffer extends IRenderResource {
		bitDepth: uint;
		width: uint;
		height: uint;

		create(iBitDepth: uint, iWidth: uint, iHeight: uint, bManual: bool): void;

		isManual(): bool;
		isCompatible(pTarget: IRenderTarget): bool;

		_notifyRenderTargetAttached(pTarget: IRenderTarget): void;
		_notifyRenderTargetDetached(pTarget: IRenderTarget): void;
	}
}

#endif