#ifndef IDEPTHBUFFER_TS
#define IDEPTHBUFFER_TS

module akra {
	export interface IDepthBuffer extends IRenderResource {
		bitDepth: uint;
		width: uint;
		height: uint;

		isManual(): bool;
		isCompatible(pTarget: IRenderTarget): bool;

		_notifyRenderTargetAttached(pTarget: IRenderTarget): void;
		_notifyRenderTargetDetached(pTarget: IRenderTarget): void;
	}
}

#endif