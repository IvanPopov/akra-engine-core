/// <reference path="../../idl/IUIAnimationMask.ts" />
/// <reference path="../../idl/IUIAnimationBlender.ts" />
/// <reference path="../../idl/IUISlider.ts" />
/// <reference path="../../idl/IUILabel.ts" />

/// <reference path="Node.ts" />
/// <reference path="Mask.ts" />

module akra.ui.animation {
	export interface IBlenderSliderContainer {
		slider: IUISlider;
		animation: IAnimationBase;
	}

	export class Blender extends Node implements IUIAnimationBlender {
		private _pBlend: IAnimationBlend = null;
		private _pSliders: IBlenderSliderContainer[] = [];

		private _pNameLabel: IUILabel;
		private _pMaskNodes: IUIAnimationMask[] = [];

		protected $time: JQuery;

		getAnimation(): IAnimationBase {
			return this._pBlend;
		}

		getTotalMasks(): int { return this._pMaskNodes.length; }

		constructor(pGraph: IUIGraph, pBlender: IAnimationBlend = null) {
			super(pGraph, { init: false }, EUIGraphNodes.ANIMATION_BLENDER);

			this.template("animation.Blender.tpl");

			this.linkAreas();

			this._pNameLabel = <IUILabel>this.findEntity("name");
			//this.connect(this._pNameLabel, SIGNAL(changed), SLOT(_textChanged));
			this._pNameLabel.changed.connect(this, this._textChanged);

			this._pBlend = pBlender = pBlender || akra.animation.createBlend();

			//this.connect(this._pBlend, SIGNAL(weightUpdated), SLOT(_weightUpdated));
			//this.connect(this._pBlend, SIGNAL(durationUpdated), SLOT(_durationUpdated));
			this._pBlend.weightUpdated.connect(this, this._weightUpdated);
			this._pBlend.durationUpdated.connect(this, this._durationUpdated);

			this.getGraph().addAnimation(pBlender);
			this._pNameLabel.setText(pBlender.getName());

			this.$time = this.getElement().find(".time:first");
		}

		protected onConnectionBegin(pGraph: IUIGraph, pRoute: IUIGraphRoute): void {
			if (pRoute.getLeft().getNode() === this) {
				return;
			}

			if (!this.isConnectedWith(pRoute.getLeft().getNode())) {
				super.onConnectionBegin(pGraph, pRoute);
				return;
			}

			this.getElement().addClass("blocked");
		}

		_textChanged(pLabel: IUILabel, sValue: string): void {
			this._pBlend.setName(sValue);
		}

		destroy(): void {
			(<IUIAnimationGraph>this.getGraph()).removeAnimation(this._pBlend);
			super.destroy();
		}

		getMaskNode(iAnimation: int): IUIAnimationMask {
			return this._pMaskNodes[iAnimation] || null;
		}

		setMaskNode(iAnimation: int, pNode: IUIAnimationMask): void {
			this._pMaskNodes[iAnimation] = pNode;
		}

		setup(): void {
			var pBlend: IAnimationBlend = this._pBlend;

			for (var i: int = 0; i < pBlend.getTotalAnimations(); i++) {
				for (var j = 0; j < this._pSliders.length; ++j) {
					if (this._pSliders[j].animation === pBlend.getAnimation(i)) {
						this._pSliders[j].slider.setValue(pBlend.getAnimationWeight(i));
					}
				}
			}

			this._pNameLabel.setText(pBlend.getName());
		}

		_weightUpdated(pBlend: IAnimationBlend, iAnim: int, fWeight: float): void {
			var pSlider: IUISlider = this._pSliders[iAnim].slider;
			var pRoute: IUIGraphRoute = this.getAreas()["in"].getConnectors()[iAnim].getRoute();

			pRoute.setEnabled(fWeight !== 0);
			pSlider.setText(<any>fWeight.toFixed(2));
		}

		_durationUpdated(pBlend: IAnimationBlend, fDuration: float): void {
			this.$time.text(pBlend.getDuration().toFixed(1) + "s");
		}

		protected connected(pArea: IUIGraphConnectionArea, pFrom: IUIGraphConnector, pTo: IUIGraphConnector): void {
			if (pFrom.getDirection() === EUIGraphDirections.IN) {
				var pTarget: IUIAnimationNode = (<IUIAnimationNode>pTo.getNode());

				var pAnimation: IAnimationBase = pTarget.getAnimation();
				var pBlend: IAnimationBlend = this._pBlend;
				var pSlider: IUISlider = null;

				var pMask: IMap<float>;
				var iAnim: int = pBlend.getAnimationIndex(pAnimation.getName());

				pSlider = <IUISlider>this.createComponent("Slider", { show: false });
				pSlider.render(this.getElement().find("td.graph-node-center > div.controls:first"));
				pSlider.setRange(100.0);


				if (iAnim == -1) {
					iAnim = pBlend.addAnimation(pAnimation);
					this._pSliders[iAnim] = { slider: pSlider, animation: pAnimation };
				}
				else {
					this._pSliders[iAnim] = { slider: pSlider, animation: pAnimation };
					//animation already exists, and all parameters already setuped right
					pSlider.setValue(pBlend.getAnimationWeight(iAnim));
					this._weightUpdated(pBlend, iAnim, pBlend.getAnimationWeight(iAnim));
				}


				pSlider.updated.connect((pSlider: IUISlider, fWeight: int) => {
					pBlend.setAnimationWeight(iAnim, fWeight);
				});

				pSlider.updated.emit(pSlider.getValue());

				if (pTarget.getGraphNodeType() === EUIGraphNodes.ANIMATION_MASK) {
					pMask = (<IUIAnimationMask>pTarget).getMask();

					pBlend.setAnimationMask(iAnim, pMask);
					this.setMaskNode(iAnim, <IUIAnimationMask>pTarget);
				}
			}
		}

		protected finalizeRender(): void {
			super.finalizeRender();
			this.getElement().addClass("component-animationblender");
		}
	}


	register("animation.Blender", <any>Blender);
}

