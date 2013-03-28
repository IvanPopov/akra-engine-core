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
			super(pGraph, EUIGraphNodes.ANIMATION_DATA, $(graph.template("ui/templates/AnimationData.tpl")));

			if (!isNull(pAnim)) {
				this.animation = pAnim;
			}
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-animationdata");
		}

		protected init(): void {
			var pArea: graph.ConnectionArea = new graph.ConnectionArea(this, {show: false, maxConnections: 1});
			pArea.setMode(EUIGraphDirections.OUT);
			pArea.setLayout(EUILayouts.HORIZONTAL);
			pArea.render(this.el);

			this.addConnectionArea("out", pArea);
		}
	}

	register("AnimationData", Data);
}

#endif
