#ifndef UIANIMATIONMASKPROPERTIES_TS
#define UIANIMATIONMASKPROPERTIES_TS

#include "ui/Component.ts"
#include "IUIAnimationMask.ts"

module akra.ui.animation {
	export class MaskProperties extends Component {
		protected _pNode: IUIAnimationMask = null;
		protected _pMask: FloatMap = null;

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			//this.template("ui/templates/animation.MaskProperties.tpl");
		}

		setMask(pNode: IUIAnimationMask): void {
			var pMask: FloatMap = pNode.getMask();
			var pBones: string[] = Object.keys(pMask);
			var nTotal: int = pBones.length;
			var nSliders: int = this.childCount();

			this._pNode = pNode;
			this._pMask = pMask;

			if (nTotal > nSliders) {
				//create new sliders
				
				for (var i: int = nSliders; i < nTotal; ++ i) {
					this.fromStringTemplate("<div class=\"row\">\
									<span>bone:</span>\
									<component type=\"Slider\" range=\"100\" />;\
								</div>", 
								{bone: "bone"});
				}
			}

			var pSliders: IUISlider[] = <IUISlider[]>this.children();

			if (nTotal > nSliders) {
				for (var i: int = nSliders; i < nTotal; ++ i) {
					this.connect(pSliders[i], SIGNAL(updated), SLOT(_changed));
				}
			}

			if (nSliders > 0) {
				pSliders[nSliders - 1].el.removeClass("last");
			}

			if (nTotal < nSliders) {

				for (var i = nTotal; i < nSliders; ++ i) {
					pSliders[i].hide();
				}
			}

			this.el.find(".row > span").each((i, el) => {
				if (i === nTotal) {
					return false;
				}

				pSliders[i].name = pBones[i];
				pSliders[i].value = pMask[pBones[i]];

				$(el).html(pBones[i] + ":");
			})

			pSliders[0].el.parent().addClass("first");
			pSliders[nTotal - 1].el.parent().addClass("last");
		}

		_changed(pSlider: IUISlider, fValue: float): void {
			pSlider.text = fValue.toFixed(1);
			this._pMask[pSlider.name] = fValue;
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-animationmaskproperties");
		}
	}

	register("animation.MaskProperties", MaskProperties);
}

#endif
