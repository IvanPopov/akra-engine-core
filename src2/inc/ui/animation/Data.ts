#ifndef UIANIMATIONDATA_TS
#define UIANIMATIONDATA_TS

#include "IAnimation.ts"
#include "IUIAnimationData.ts"
#include "IUILabel.ts"
#include "Node.ts"

module akra.ui.animation {
	export class Data extends Node implements IUIAnimationData {
		private _pAnimation: IAnimation = null;

		inline get animation(): IAnimationBase {
			return this._pAnimation;
		}

		inline set animation(pAnim: IAnimation) {
			this._pAnimation = pAnim;
			(<IUILabel>this.child).text = pAnim.name;
		}

		constructor (pGraph: IUIGraph, pAnim: IAnimation = null) {
			super(pGraph, {init: false}, EUIGraphNodes.ANIMATION_DATA);

			this.template("ui/templates/AnimationData.tpl");

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

	register("AnimationData", Data);
}

#endif
