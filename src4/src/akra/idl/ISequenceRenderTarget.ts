/// <reference path="IRenderTarget.ts" />

module akra {
	interface ISequenceRenderTarget extends IRenderTarget {
		bindTarget(pTarget: IRenderTarget): boolean;
		unbindTarget(iIndex: uint): boolean;
		unbindTarget(pTarget: IRenderTarget): boolean;

		getBoundTarget(iIndex: uint): IRenderTarget;
	}
}

