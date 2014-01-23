#ifndef UIANIMATIONMASK_TS
#define UIANIMATIONMASK_TS

#include "IUISlider.ts"
#include "IUIButton.ts"
#include "IUIAnimationMask.ts"
#include "IUIGraphRoute.ts"
#include "Node.ts"
#include "IUIIDE.ts"

module akra.ui.animation {
	export class Mask extends Node implements IUIAnimationMask {
		private _pAnimation: IAnimationBase = null;
		private _pMask: FloatMap = null;
		private _pSliders: IUISlider[] = [];
		private _pEditBtn: IUIButton = null;
		private _pEditPanel: IUIPanel = null;

		 get animation(): IAnimationBase {
			return this._pAnimation;
		}

		 set animation(pAnim: IAnimationBase) {
			this._pAnimation = pAnim;
			this._pMask = this._pMask || pAnim.createAnimationMask();
			this.selected(true);
		}

		constructor (pGraph: IUIGraph, pMask: FloatMap = null) {
			super(pGraph, {init: false}, EUIGraphNodes.ANIMATION_MASK);

			this.template("animation.Mask.tpl");
			this.linkAreas();

			this._pEditBtn = <IUIButton>this.findEntity("edit");
			this._pMask = pMask;
		}


		rendered(): void {
			super.rendered();
			this.el.addClass("component-animationmask");
		}


		 getMask(): FloatMap {
			return this._pMask;
		}
	}

	export  function isMaskNode(pNode: IUIAnimationNode): boolean {
		return pNode.graphNodeType === EUIGraphNodes.ANIMATION_MASK;
	}

	register("animation.Mask", Mask);
}

#endif
