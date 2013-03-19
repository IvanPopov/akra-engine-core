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

		constructor (pGraph: IUIGraph, pBlender: IAnimationBlend = null) {
			super(pGraph, EUIGraphNodes.ANIMATION_BLENDER);

			this._pNameLabel = <IUILabel>this.children()[0];
			this.connect(this._pNameLabel, SIGNAL(changed), SLOT(_textChanged));


			this._pBlend = pBlender || akra.animation.createBlend();
			(<IUIAnimationGraph>this.graph).addAnimation(pBlender);
		}

		_textChanged(pLabel: IUILabel, sValue: string): void {
			LOG("new blend name > " + sValue);
			this._pBlend.name = sValue;
		}

		routeBreaked(pRoute: IUIGraphRoute, iConn: int, eDir: EUIGraphDirections): void {
			 if (eDir ===EUIGraphDirections.IN) {
	            this._pBlend.setAnimation(this._pAnimMap[iConn], null);
	            this._pSliders[iConn].slider.destroy();
	            this._pSliders[iConn] = null;
	            this._pMaskNodes[this._pAnimMap[iConn]] = null;
	        }

	        super.routeBreaked(pRoute, iConn, eDir);
		}

		destroy(): void {
			(<IUIAnimationGraph>this.graph).removeAnimation(this._pBlend);
			super.destroy();
		}

		protected init(): void {
			var pChildren: IUINode[] = <IUINode[]>this.children();
			var n: int = pChildren.length;
			LOG([<IUINode>pChildren[n - 1]], [<IUINode>pChildren[n - 2]], this.toString(true));
			this.setRouteAreas([<IUINode>pChildren[n - 1]], [<IUINode>pChildren[n - 2]]);
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

		protected getRouteArea(pZone: IUINode, eDirection?: EUIGraphDirections): IUINode {
			var pChildren: IUINode[] = <IUINode[]>this.children();
			var n: int = pChildren.length;
			LOG(this.toString(true));
			if (eDirection === EUIGraphDirections.OUT) {
				//right layout
				return pChildren[2];
			}

			//left layout
			return pChildren[1]; 
		}

		isSuitable(pTarget: IUIAnimationNode): bool {
			if (pTarget instanceof ui.animation.Node) {
		        if (this.findRoute(pTarget) >= 0) {
		            return false;
		        }
		        
		        if (isNull(pTarget.animation)) {
		            return false;
		        }

		        return true;
		    }

		    return false;
		}

		route(eDirection: EUIGraphDirections, pTarget: IUIAnimationNode = null): int {
			if (eDirection === EUIGraphDirections.IN) {
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
		        
		        pSlider.bind(SIGNAL(updated), (iValue) => {
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
		    }
		}

		label(): string {
			return "AnimationBlender";
		}
	}


	Component.register("AnimationBlender", Blender);
}

#endif
