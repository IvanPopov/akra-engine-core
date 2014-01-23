#ifndef UIANIMATIONBLENDER_TS
#define UIANIMATIONBLENDER_TS

#include "Node.ts"
#include "Mask.ts"
#include "IUIAnimationMask.ts"
#include "IUIAnimationBlender.ts"
#include "animation/Blend.ts"

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

		 get animation(): IAnimationBase {
			return this._pBlend;
		}

		 get totalMasks(): int { return this._pMaskNodes.length; }

		constructor (pGraph: IUIGraph, pBlender: IAnimationBlend = null) {
			super(pGraph, {init: false}, EUIGraphNodes.ANIMATION_BLENDER);

			this.template("animation.Blender.tpl");

			this.linkAreas();

			this._pNameLabel = <IUILabel>this.findEntity("name");
			this.connect(this._pNameLabel, SIGNAL(changed), SLOT(_textChanged));

			this._pBlend = pBlender = pBlender || akra.animation.createBlend();

			this.connect(this._pBlend, SIGNAL(weightUpdated), SLOT(_weightUpdated));
			this.connect(this._pBlend, SIGNAL(durationUpdated), SLOT(_durationUpdated));

			this.graph.addAnimation(pBlender);
			this._pNameLabel.text = pBlender.name;

			this.$time = this.el.find(".time:first");
		}

		protected onConnectionBegin(pGraph: IUIGraph, pRoute: IUIGraphRoute): void {
			if (pRoute.left.node === this) {
				return;
			}

			if (!this.isConnectedWith(pRoute.left.node)) {
				super.onConnectionBegin(pGraph, pRoute);
				return;
			}

			this.el.addClass("blocked");
		}

		_textChanged(pLabel: IUILabel, sValue: string): void {
			this._pBlend.name = sValue;
		}

		destroy(): void {
			(<IUIAnimationGraph>this.graph).removeAnimation(this._pBlend);
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
		    
		    for (var i: int = 0; i < pBlend.totalAnimations; i ++) {
		        for (var j = 0; j < this._pSliders.length; ++ j) {
		            if (this._pSliders[j].animation === pBlend.getAnimation(i)) {
		                this._pSliders[j].slider.value = pBlend.getAnimationWeight(i);
		            }
		        }
		    }

		    this._pNameLabel.text = pBlend.name;
		}

		_weightUpdated(pBlend: IAnimationBlend, iAnim: int, fWeight: float): void {
			var pSlider: IUISlider = this._pSliders[iAnim].slider;
			var pRoute: IUIGraphRoute = this.areas["in"].connectors[iAnim].route;

        	pRoute.enabled = fWeight !== 0;
        	pSlider.text = <any>fWeight.toFixed(2);
		}

		_durationUpdated(pBlend: IAnimationBlend, fDuration: float): void {
			 this.$time.text(pBlend.duration.toFixed(1) + "s");
		}

		protected connected(pArea: IUIGraphConnectionArea, pFrom: IUIGraphConnector, pTo: IUIGraphConnector): void {
			if (pFrom.direction === EUIGraphDirections.IN) {
				var pTarget: IUIAnimationNode = (<IUIAnimationNode>pTo.node);

		        var pAnimation: IAnimationBase = pTarget.animation;
		        var pBlend: IAnimationBlend = this._pBlend;
		        var pSlider: IUISlider = null;
		        
		        var pMask: FloatMap;
		        var iAnim: int = pBlend.getAnimationIndex(pAnimation.name);

		        pSlider = <IUISlider>this.createComponent("Slider", {show: false});
		        pSlider.render(this.el.find("td.graph-node-center > div.controls:first"));
		        pSlider.range = 100;

		        
		        if (iAnim == -1) {
		        	iAnim = pBlend.addAnimation(pAnimation);
		        	this._pSliders[iAnim] = {slider: pSlider, animation: pAnimation};
		        }
		        else {
		        	this._pSliders[iAnim] = {slider: pSlider, animation: pAnimation};
		        	//animation already exists, and all parameters already setuped right
		        	pSlider.value = pBlend.getAnimationWeight(iAnim);
		        	this._weightUpdated(pBlend, iAnim, pBlend.getAnimationWeight(iAnim));
		        }


		        pSlider.bind(SIGNAL(updated), (pSlider: IUISlider, fWeight: int) => {
		        	pBlend.setAnimationWeight(iAnim, fWeight);
		        });

		        pSlider.updated(pSlider.value);

		        if (pTarget.graphNodeType === EUIGraphNodes.ANIMATION_MASK) {
		            pMask = (<IUIAnimationMask>pTarget).getMask();

		            pBlend.setAnimationMask(iAnim, pMask);
		            this.setMaskNode(iAnim, <IUIAnimationMask>pTarget);
		        }
		    }
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-animationblender");
		}
	}


	register("animation.Blender", Blender);
}

#endif
