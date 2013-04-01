#ifndef UIANIMATIONMASK_TS
#define UIANIMATIONMASK_TS

#include "IUISlider.ts"
#include "IUIButton.ts"
#include "IUIAnimationMask.ts"
#include "IUIGraphRoute.ts"
#include "Node.ts"

module akra.ui.animation {
	export class Mask extends Node implements IUIAnimationMask {
		private _pAnimation: IAnimationBase = null;
		private _pMask: FloatMap = null;
		private _pSliders: IUISlider[] = [];
		private _pViewBtn: IUIButton = null;

		inline get animation(): IAnimationBase {
			return this._pAnimation;
		}

		inline set animation(pAnim: IAnimationBase) {
			this._pAnimation = pAnim;
		}

		constructor (pGraph: IUIGraph) {
			super(pGraph, {init: false}, EUIGraphNodes.ANIMATION_MASK);

			graph.template(this, "ui/templates/AnimationMask.tpl");
			this.init();
		}

		protected init(): void {
			var pArea: graph.ConnectionArea = new graph.ConnectionArea(this, {
				show: false,
				maxInConnections: 1
			});
			
			pArea.setMode(EUIGraphDirections.OUT|EUIGraphDirections.IN);
			pArea.setLayout(EUILayouts.HORIZONTAL);
			pArea.render(this.el);

			this.addConnectionArea("out", pArea);
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-animationmask");
		}

		private create(pMask: FloatMap = null, pAnimation: IAnimationBase = null): void {
			if (isNull(pAnimation)) {
				pAnimation = this._pAnimation;
			}

			if (isNull(pMask)) {
				pMask = pAnimation.createAnimationMask();
			}

			var $location = this.$element.find(".controls:first");

			var pSliders: IUISlider[] = this._pSliders;
			var pViewBtn: IUIButton = new Button(this, {text: "view mask"});
			var pParent: IUIAnimationNode = this;

			$location.append(pViewBtn.$element);

			var fnViewHide = (pBtn: IUIButton, e: IUIEvent) => {
				for (var i = 0; i < pSliders.length; ++ i) {
					var $el = pSliders[i].$element;
					$el.is(":visible")? $el.hide(): $el.show();
				}
			}

			var fnCreate = (pBtn: IUIButton, e: IUIEvent) => {
				for (var sTarget in pMask) {
					pSliders.push(Mask.createSlider(pParent, $location, pMask, sTarget));
				}

				//pViewBtn.destroy();
				pViewBtn.unbind(SIGNAL(click), fnCreate);
				pViewBtn.bind(SIGNAL(click), fnViewHide);

				pViewBtn.text = "hide/view";
			}

			pViewBtn.bind(SIGNAL(click), fnCreate);

			this._pViewBtn = pViewBtn;
			this._pMask = pMask;
		}

		getMask(): FloatMap {
			if (isNull(this._pAnimation)) {
				return null;
			}

			if (isNull(this._pMask)) {
				this.create();
			}

			return this._pMask;
		}

		static private createSlider(pParent: IUIAnimationNode, $location: JQuery, pMask: FloatMap, sName: string): IUISlider {
			var pSlider: IUISlider;

			pSlider = new Slider(pParent, {show: false});
			pSlider.render($location);
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
