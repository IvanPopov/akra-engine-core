
/// <reference path="IRenderResource.ts" />

module akra {
	export interface IDepthBuffer extends IRenderResource {
		bitDepth: uint;
		width: uint;
		height: uint;
	
		create(iBitDepth: uint, iWidth: uint, iHeight: uint, bManual: boolean): void;
	
		isManual(): boolean;
		isCompatible(pTarget: IRenderTarget): boolean;
	
		_notifyRenderTargetAttached(pTarget: IRenderTarget): void;
		_notifyRenderTargetDetached(pTarget: IRenderTarget): void;
	}
	
	
	
}
