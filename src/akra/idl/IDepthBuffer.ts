
/// <reference path="IRenderResource.ts" />

module akra {
	export interface IDepthBuffer extends IRenderResource {
		getBitDepth(): uint;
		getWidth(): uint;
		getHeight(): uint;
	
		create(iBitDepth: uint, iWidth: uint, iHeight: uint, bManual: boolean): void;
	
		isManual(): boolean;
		isCompatible(pTarget: IRenderTarget): boolean;
	
		_notifyRenderTargetAttached(pTarget: IRenderTarget): void;
		_notifyRenderTargetDetached(pTarget: IRenderTarget): void;
	}
	
	
	
}
