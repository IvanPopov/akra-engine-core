#ifndef UIANIMATIONDATA_TS
#define UIANIMATIONDATA_TS

#include "IAnimation.ts"
#include "IUIAnimationData.ts"
#include "IUILabel.ts"
#include "../graph/Node.ts"

module akra.ui.animation {
	export class Data extends graph.Node implements IUIAnimationData {
		private _pAnim: IAnimation;

		inline get animation(): IAnimation {
			return this._pAnim;
		}

		inline set animation(pAnim: IAnimation) {
			this._pAnim = pAnim;
			(<IUILabel>this.child).text = pAnim.name;
		}

		constructor (pGraph: IUIGraph, pAnim: IAnimation = null) {
			super(pGraph, EUIGraphNodes.ANIMATION_DATA);

			if (!isNull(pAnim)) {
				this.animation = pAnim;
			}
		}

		protected getRouteArea(pArea: IUILayout, eDir: EUIGraphDirections = EUIGraphDirections.IN) {
			if (eDir === EUIGraphDirections.OUT) {
				return pArea;
			}

			return null;
		}

		//nobody cant connect to this node
		isSuitable(pTarget: IUIGraphNode): bool {
			return false;
		}

		label(): string {
			return "AnimationData";
		}

		inline enterFrame(fTime: float): void {
			this._pAnim.apply(fTime);
		}
	}

	Component.register("AnimationData", Data);
}

#endif
