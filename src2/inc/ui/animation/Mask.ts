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
			super(pGraph, EUIGraphNodes.ANIMATION_MASK);
		}

		protected init(): void {
			this.setRouteAreas([this.children().last], [this.children().first]);
		}

		protected getRouteArea(pZone: IUINode, eDir?: EUIGraphDirections): IUINode {
			if (eDir === EUIGraphDirections.OUT) {
				//bottom layout
				return <IUINode>this.children().last;
			}

			//top layout
			return <IUINode>this.child;
		}

		label(): string {
			return "AnimationMask";
		}

		click(e: IUIEvent): void {
			return;
		}

		isSuitable(pTarget: IUIAnimationNode): bool {
			if (!this.hasConnections()) {
				
				if (isNull(pTarget.animation)) {
					return false;
				}

				this.animation = pTarget.animation;
				return true;
			}

			return false;
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

		routeBreaked(pRoute: IUIGraphRoute, iConn: int, eDir: EUIGraphDirections): void {
			// if (eDir !== EUIGraphDirections.IN) {
			// 	return;
			// }
			super.routeBreaked(pRoute, iConn, eDir);
		}

		static private createSlider(pParent: IUIAnimationNode, $location: JQuery, pMask: FloatMap, sName: string): IUISlider {
			var pSlider: IUISlider;

			pSlider = new Slider(pParent);
			
			$location.append(pSlider.$element);

			pSlider.range = 10;
			pSlider.value = pMask[sName];

			pSlider.bind(SIGNAL(updated), (pSlider: IUISlider, fValue: float) => {
				pMask[sName] = fValue;
			});

			//pSlider.text = sName;
			
			return pSlider;		
		}
	}

	Component.register("AnimationMask", Mask);
}

#endif
