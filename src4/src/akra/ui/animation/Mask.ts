/// <reference path="../../idl/IUISlider.ts" />
/// <reference path="../../idl/IUIButton.ts" />
/// <reference path="../../idl/IUIAnimationMask.ts" />
/// <reference path="../../idl/IUIGraphRoute.ts" />
/// <reference path="../../idl/IUIIDE.ts" />

/// <reference path="Node.ts" />

module akra.ui.animation {
	export class Mask extends Node implements IUIAnimationMask {
		private _pAnimation: IAnimationBase = null;
		private _pMask: IMap<float> = null;
		private _pSliders: IUISlider[] = [];
		private _pEditBtn: IUIButton = null;
		private _pEditPanel: IUIPanel = null;

		 get animation(): IAnimationBase {
			return this._pAnimation;
		}

		 set animation(pAnim: IAnimationBase) {
			this._pAnimation = pAnim;
			this._pMask = this._pMask || pAnim.createAnimationMask();
			this.selected.emit(true);
		}

		constructor (pGraph: IUIGraph, pMask: IMap<float> = null) {
			super(pGraph, {init: false}, EUIGraphNodes.ANIMATION_MASK);

			this.template("animation.Mask.tpl");
			this.linkAreas();

			this._pEditBtn = <IUIButton>this.findEntity("edit");
			this._pMask = pMask;
		}


		protected finalizeRender(): void {
			super.finalizeRender();
			this.el.addClass("component-animationmask");
		}


		 getMask(): IMap<float> {
			return this._pMask;
		}
	}

	export  function isMaskNode(pNode: IUIAnimationNode): boolean {
		return pNode.graphNodeType === EUIGraphNodes.ANIMATION_MASK;
	}

	register("animation.Mask", Mask);
}

