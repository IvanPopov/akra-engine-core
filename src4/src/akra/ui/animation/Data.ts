/// <reference path="../../idl/IAnimation.ts" />
/// <reference path="../../idl/IUIAnimationData.ts" />
/// <reference path="../../idl/IUILabel.ts" />

/// <reference path="Node.ts" />

module akra.ui.animation {
	export class Data extends Node implements IUIAnimationData {
		private _pAnimation: IAnimation = null;

		get animation(): IAnimation {
			return this._pAnimation;
		}

		 set animation(pAnim: IAnimation) {
			this._pAnimation = pAnim;
			(<IUILabel>this.child).text = pAnim.name;
		}

		constructor (pGraph: IUIGraph, pAnim: IAnimation = null) {
			super(pGraph, {init: false}, EUIGraphNodes.ANIMATION_DATA);

			this.template("animation.Data.tpl");

			if (!isNull(pAnim)) {
				this.animation = pAnim;
			}

			this.linkAreas();
		}

		protected finalizeRender(): void {
			super.finalizeRender();
			this.el.addClass("component-animationdata");
		}

	}

	register("animation.Data", Data);
}


