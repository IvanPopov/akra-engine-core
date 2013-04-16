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

		inline get animation(): IAnimationBase {
			return this._pAnimation;
		}

		inline set animation(pAnim: IAnimationBase) {
			this._pAnimation = pAnim;
			// this.create();
		}

		constructor (pGraph: IUIGraph) {
			super(pGraph, {init: false}, EUIGraphNodes.ANIMATION_MASK);

			this.template("ui/templates/AnimationMask.tpl");
			this.linkAreas();

			this._pEditBtn = <IUIButton>this.findEntity("edit");
			//this._pEditPanel = <IUIPanel>this.ui.createComponent("Panel", { draggable: true });
			// // this._pEditPanel.attachToParent(<IUIComponent>this.root);
			//this._pEditPanel.hide();
			//this._pEditPanel.render($(document.body));
			//this._pEditPanel.el.addClass("component-animationmaskproperties");

			this.connect(this._pEditBtn, SIGNAL(click), SLOT(_edit))
		}

		_edit(pBtn: IUIButton, e: IUIEvent): void {
			//this._pEditPanel.show();
			//this._pEditPanel.el.offset({top: e.pageY, left: e.pageX});
			ide.cmd(ECMD.EDIT_ANIMATION_MASK_NODE, this);
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-animationmask");
		}

		private create(pMask: FloatMap = null, pAnimation: IAnimationBase = this._pAnimation): void {

			if (isNull(pMask)) {
				pMask = pAnimation.createAnimationMask();
			}

			var $location = this.$element.find(".controls:first");

			var pSliders: IUISlider[] = this._pSliders;
			var pParent: IUIAnimationNode = this;
			var pPanel: IUIPanel = this._pEditPanel;
			var pViewBtn: IUIButton = this._pEditBtn;

			// var fnViewHide = (pBtn: IUIButton, e: IUIEvent) => {
			// 	for (var i = 0; i < pSliders.length; ++ i) {
			// 		var $el = pSliders[i].$element;
			// 		$el.is(":visible")? $el.hide(): $el.show();
			// 	}
			// }

			
			for (var sTarget in pMask) {
				pSliders.push(Mask.createSlider(pPanel, pMask, sTarget));
			}

			this._pMask = pMask;
		}

		getMask(): FloatMap {
			if (isNull(this._pAnimation)) {
				return null;
			}

			// if (isNull(this._pMask)) {
			// 	this.create();
			// }

			return this._pMask;
		}

		static private createSlider(pPanel: IUIPanel, pMask: FloatMap, sName: string): IUISlider {
			var pSlider: IUISlider;

			pSlider = new Slider(pPanel);
			pSlider.range = 10;
			pSlider.value = pMask[sName];

			pSlider.bind(SIGNAL(updated), (pSlider: IUISlider, fValue: float) => {
				pMask[sName] = fValue;
			});
			
			return pSlider;		
		}
	}

	register("AnimationMask", Mask);
}

#endif
