// IUIRenderTargetStats export interface
// [write description here...]

/// <reference path="IUIComponent.ts" />
/// <reference path="IRenderTarget.ts" />

module akra {
	export interface IUIRenderTargetStats extends IUIComponent {
		getTarget(): IRenderTarget;
		setTarget(pTarget: IRenderTarget): void;
	}
}

