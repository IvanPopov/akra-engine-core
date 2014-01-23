#ifndef UIANIMATIONDATA_TS
#define UIANIMATIONDATA_TS

#include "IAnimation.ts"
#include "IUIAnimationData.ts"
#include "IUILabel.ts"
#include "Node.ts"

module akra.ui.animation {
	export class Data extends Node implements IUIAnimationData {
		private _pAnimation: IAnimation = null;

		 get animation(): IAnimationBase {
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

		rendered(): void {
			super.rendered();
			this.el.addClass("component-animationdata");
		}

	}

	register("animation.Data", Data);
}

#endif
