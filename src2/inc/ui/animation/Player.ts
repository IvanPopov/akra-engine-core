#ifndef UIANIMATIONPLAYER_TS
#define UIANIMATIONPLAYER_TS

#include "IAnimation.ts"
#include "IAnimationContainer.ts"
#include "IUIAnimationGraph.ts"
#include "../graph/Node.ts"

module akra.ui.animation {
	export class Player extends graph.Node {
		private _pSpeedLabel: IUILabel;
		private _pSlider: IUISlider;
		private _pPlayBtn: IUICheckbox;
		private _pPauseBtn: IUICheckbox;
		private _pLoopBtn: IUICheckbox;
		private _pReverseBtn: IUICheckbox;
		private _pNameLabel: IUILabel;


		private _pAnimation: IAnimationContainer = null;

		inline get graph(): IUIAnimationGraph {
			return <IUIAnimationGraph>this.parent;
		}

		set animation(pAnim: IAnimationContainer) {
			if (isNull(pAnim)) {
				this.disconnect(this._pPauseBtn, SIGNAL(changed), SLOT(_pause));
				this.disconnect(this._pPlayBtn, SIGNAL(changed), SLOT(_play));
				this.disconnect(this._pSpeedLabel, SIGNAL(changed), SLOT(_setSpeed));
				this.disconnect(this._pNameLabel, SIGNAL(changed), SLOT(_setName));
			}

			this._pPlayBtn.checked = !pAnim.isPaused();
			this._pReverseBtn.checked = pAnim.isReversed();
			this._pLoopBtn.checked = pAnim.inLoop();

			this.connect(this._pPauseBtn, SIGNAL(changed), SLOT(_pause));
			this.connect(this._pPlayBtn, SIGNAL(changed), SLOT(_play));
			this.connect(this._pSpeedLabel, SIGNAL(changed), SLOT(_setSpeed));
			this.connect(this._pNameLabel, SIGNAL(changed), SLOT(_setName));
		}

		constructor (pGraph: IUIGraph) {
			super(pGraph, EUIGraphNodes.ANIMATION_PLAYER);

			console.log(this.toString(true));

			var pChildren: IEntity[] = this.children();

			this._pSpeedLabel 	= <IUILabel>pChildren[4];
			this._pSlider 		= <IUISlider>pChildren[5];
			this._pPlayBtn 		= <IUICheckbox>(<IUICheckboxList>pChildren[1]).childAt(0);
			this._pPauseBtn 	= <IUICheckbox>(<IUICheckboxList>pChildren[1]).childAt(1);
			this._pLoopBtn 		= <IUICheckbox>pChildren[2];
			this._pReverseBtn 	= <IUICheckbox>pChildren[3];
			this._pNameLabel 	= <IUILabel>pChildren[0];
		}

		_reverse(pCheckbox: IUICheckbox, bValue: bool): void {
			this._pAnimation.reverse(bValue);
		}

		_useLoop(pCheckbox: IUICheckbox, bValue: bool): void {
			this._pAnimation.useLoop(bValue);
		}

		_pause(pCheckbox: IUICheckbox, bValue: bool): void {
			//this._pAnimation.pause(bValue);
		}

		_play(pCheckbox: IUICheckbox, bValue: bool): void {
			//this._pAnimation.pause(!bValue);
		}

		_setName(pLabel: IUILabel, sName): void {
			this._pAnimation.name = sName;
		}

		_setSpeed(pLabel: IUILabel, x): void {
			this._pAnimation.setSpeed(parseFloat(x));
		}

		routeBreaked(pNode: IUIGraphNode, iConn: int, eDir: EUIGraphDirections): void {
			if (eDir === EUIGraphDirections.IN) {
				this.disconnect(this._pAnimation, SIGNAL(enterFrame), SLOT(enterFrame));

				this._pSpeedLabel.text = "unknown";
				this.graph.removeAnimation(this._pAnimation);
				this.animation = null;
			}
		}

		// protected init(): void {
		// 	this.setRouteArea
		// }

		label(): string {
			return "AnimationPlayer";
		}
	}

	Component.register("AnimationPlayer", Player);
}

#endif
