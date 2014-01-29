/// <reference path="../../idl/IUIAnimationMask.ts" />

/// <reference path="../Component.ts" />

module akra.ui.animation {
	export class MaskProperties extends Component {
		protected _pNode: IUIAnimationMask = null;
		protected _pMask: IMap<float> = null;

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);
		}

		setMask(pNode: IUIAnimationMask): void {
			var pMask: IMap<float> = pNode.getMask();
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
					//this.connect(pSliders[i], SIGNAL(updated), SLOT(_changed));
					pSliders[i].updated.connect(this, this._changed);
				}
			}

			if (nSliders > 0) {
				pSliders[nSliders - 1].getElement().removeClass("last");
			}

			if (nTotal < nSliders) {

				for (var i = nTotal; i < nSliders; ++ i) {
					pSliders[i].hide();
				}
			}

			this.getElement().find(".row > span").each((i, el) => {
				if (i === nTotal) {
					return false;
				}

				pSliders[i].setName(pBones[i]);
				pSliders[i].setValue(pMask[pBones[i]]);

				this._changed(pSliders[i], pMask[pBones[i]]);

				$(el).html(pBones[i] + ":");
			})

			pSliders[0].getElement().parent().addClass("first");
			pSliders[nTotal - 1].getElement().parent().addClass("last");
		}

		_changed(pSlider: IUISlider, fValue: float): void {
			pSlider.setText(fValue.toFixed(1));
			this._pMask[pSlider.getName()] = fValue;
		}

		protected finalizeRender(): void {
			super.finalizeRender();
			this.getElement().addClass("component-animationmaskproperties");
		}
	}

	register("animation.MaskProperties", MaskProperties);
}

