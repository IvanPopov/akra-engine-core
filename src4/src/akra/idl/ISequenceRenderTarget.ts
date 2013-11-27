// ISequenceRenderTarget export interface
// [write description here...]

/// <reference path="IRenderTarget.ts" />

module akra {
export interface ISequenceRenderTarget extends IRenderTarget {
	bindTarget(pTarget: IRenderTarget): boolean;
	unbindTarget(iIndex: uint): boolean;
	unbindTarget(pTarget: IRenderTarget): boolean;

	getBoundTarget(iIndex: uint): IRenderTarget;
}
}
