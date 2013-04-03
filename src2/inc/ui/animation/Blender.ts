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

		private _pAnimMap: IntMap = <IntMap>{};
		private _iTotalAnim: int = 0;

		inline get animation(): IAnimationBase {
			return this._pBlend;
		}

		constructor (pGraph: IUIGraph, pBlender: IAnimationBlend = null) {
			super(pGraph, {init: false}, EUIGraphNodes.ANIMATION_BLENDER);

			template(this, "ui/templates/AnimationBlender.tpl");

			this.init();

			this._pNameLabel = <IUILabel>this.findEntity("name");
			this.connect(this._pNameLabel, SIGNAL(changed), SLOT(_textChanged));


			this._pBlend = pBlender = pBlender || akra.animation.createBlend();
			this.graph.addAnimation(pBlender);
			this._pNameLabel.text = pBlender.name;
		}

		protected connected(pArea: IUIGraphConnectionArea, pNode: IUIGraphNode, pRoute: IUIGraphRoute): void {
			LOG("CONNECTED", arguments);
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
			LOG("new blend name > " + sValue);
			this._pBlend.name = sValue;
		}

		destroy(): void {
			(<IUIAnimationGraph>this.graph).removeAnimation(this._pBlend);
			super.destroy();
		}

		protected init(): void {
			var pInput: graph.ConnectionArea = new graph.ConnectionArea(this, {show: false});
			
			pInput.setMode(EUIGraphDirections.IN);
			pInput.setLayout(EUILayouts.HORIZONTAL);
			pInput.render(this.el.find("td.graph-node-left"));

			this.addConnectionArea("in", pInput);

			var pOutput: graph.ConnectionArea = new graph.ConnectionArea(this, {show: false, maxConnections: 1});
			
			pOutput.setMode(EUIGraphDirections.OUT);
			pOutput.setLayout(EUILayouts.HORIZONTAL);
			pOutput.render(this.el); /*.find("td.graph-node-right")*/

			this.addConnectionArea("out", pOutput);
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

		route(eDirection: EUIGraphDirections, pTarget: IUIAnimationNode = null): int {
			/*if (eDirection === EUIGraphDirections.IN) {
				ASSERT(!isNull(pTarget), "target is null!");

		        var iConn: int = super.route(eDirection, pTarget);
		        var pAnimation: IAnimationBase = pTarget.animation;
		        var pBlend: IAnimationBlend = null;
		        var pSlider: IUISlider = null;
		        
		        var pMask: FloatMap;
		        var iAnim: int = this._pAnimMap[iConn];
		        
		        if (!isDef(iAnim)) {
		            this._pAnimMap[iConn] = iAnim = this._iTotalAnim ++;
		        }

		        pSlider = new Slider(this);

				this.$element.find('.graph-node-center-left').append(pSlider.$element);
		        
		        pSlider.range = 100;
		        
		        pSlider.bind(SIGNAL(updated), (pSlider: IUISlider, iValue: int) => {
		        	pBlend.setAnimationWeight(iAnim, iValue);
		        });

		        pBlend = this._pBlend;
		        pBlend.setAnimation(iAnim, pAnimation);

		        if (pTarget instanceof ui.animation.Mask) {
		            pMask = (<IUIAnimationMask>pTarget).getMask();

		            if (isDefAndNotNull(pMask)) {
		                pBlend.setAnimationMask(iAnim, pMask);
		                this.setMaskNode(iAnim, <IUIAnimationMask>pTarget);
		            }
		        }

		        
		        this._pSliders[iConn] = {slider: pSlider, animation: pAnimation};

		        return iConn;
		    }
		    else {
		        return this._iLastConnection;
		    }*/
		   	return 0;
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-animationblender");
		}
	}


	register("AnimationBlender", Blender);
}

#endif
