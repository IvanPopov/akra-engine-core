// AISequenceRenderTarget interface
// [write description here...]

/// <reference path="AIRenderTarget.ts" />

module akra {
interface AISequenceRenderTarget extends AIRenderTarget {
	bindTarget(pTarget: AIRenderTarget): boolean;
	unbindTarget(iIndex: uint): boolean;
	unbindTarget(pTarget: AIRenderTarget): boolean;

	getBoundTarget(iIndex: uint): AIRenderTarget;
}
}
