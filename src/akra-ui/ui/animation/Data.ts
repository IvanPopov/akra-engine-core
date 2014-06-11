/// <reference path="../../idl/IUIAnimationData.ts" />
/// <reference path="../../idl/IUILabel.ts" />

/// <reference path="Node.ts" />

module akra.ui.animation {
	export class Data extends Node implements IUIAnimationData {
		private _pAnimation: IAnimation = null;

		getAnimation(): IAnimation {
			return this._pAnimation;
		}

		setAnimation(pAnim: IAnimation) {
			this._pAnimation = pAnim;
			(<IUILabel>this.getChild()).setText(pAnim.getName());
		}

		constructor (pGraph: IUIGraph, pAnim: IAnimation = null) {
			super(pGraph, {init: false}, EUIGraphNodes.ANIMATION_DATA);

			this.template("animation.Data.tpl");

			if (!isNull(pAnim)) {
				this.setAnimation(pAnim);
			}

			this.linkAreas();
		}

		protected finalizeRender(): void {
			super.finalizeRender();
			this.getElement().addClass("component-animationdata");
		}

	}

	register("animation.Data", <any>Data);
}


