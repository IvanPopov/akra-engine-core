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

		getAnimation(): IAnimationBase {
			return this._pAnimation;
		}

		setAnimation(pAnim: IAnimationBase) {
			this._pAnimation = pAnim;
			this._pMask = this._pMask || pAnim.createAnimationMask();
			this.selected.emit(true);
		}

		constructor(pGraph: IUIGraph, pMask: IMap<float> = null) {
			super(pGraph, { init: false }, EUIGraphNodes.ANIMATION_MASK);

			this.template("animation.Mask.tpl");
			this.linkAreas();

			this._pEditBtn = <IUIButton>this.findEntity("edit");
			this._pMask = pMask;
		}


		protected finalizeRender(): void {
			super.finalizeRender();
			this.getElement().addClass("component-animationmask");
		}


		getMask(): IMap<float> {
			return this._pMask;
		}

		static isMaskNode(pNode: IUIAnimationNode): boolean {
			return pNode.getGraphNodeType() === EUIGraphNodes.ANIMATION_MASK;
		}
	}


	register("animation.Mask", <any>Mask);
}

