// AIDepthBuffer interface
// [write description here...]

/// <reference path="AIRenderResource.ts" />

interface AIDepthBuffer extends AIRenderResource {
	bitDepth: uint;
	width: uint;
	height: uint;

	create(iBitDepth: uint, iWidth: uint, iHeight: uint, bManual: boolean): void;

	isManual(): boolean;
	isCompatible(pTarget: AIRenderTarget): boolean;

	_notifyRenderTargetAttached(pTarget: AIRenderTarget): void;
	_notifyRenderTargetDetached(pTarget: AIRenderTarget): void;
}


