#ifndef UIANIMATIONPLAYER_TS
#define UIANIMATIONPLAYER_TS

#include "IAnimation.ts"
#include "IAnimationContainer.ts"
#include "IUIAnimationGraph.ts"
#include "IUIAnimationPlayer.ts"
#include "Node.ts"
#include "animation/Container.ts"

module akra.ui.animation {
	export class Player extends Node implements IUIAnimationPlayer {
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

		inline get animation(): IAnimationBase {
			return this._pAnimation;
		}

		set animation(pAnim: IAnimationBase) {
			//ASSERT(isNull(this.animation), "animation container already setuped in player");

			this._pAnimation.setAnimation(pAnim);
			this.setup();
		}

		constructor (pGraph: IUIGraph, pContainer: IAnimationContainer = null) {
			super(pGraph, EUIGraphNodes.ANIMATION_PLAYER);

			var pChildren: IEntity[] = this.children();

			this._pSpeedLabel 	= <IUILabel>pChildren[4];
			this._pSlider 		= <IUISlider>pChildren[5];
			this._pPlayBtn 		= <IUICheckbox>(<IUICheckboxList>pChildren[1]).childAt(0);
			this._pPauseBtn 	= <IUICheckbox>(<IUICheckboxList>pChildren[1]).childAt(1);
			this._pLoopBtn 		= <IUICheckbox>pChildren[2];
			this._pReverseBtn 	= <IUICheckbox>pChildren[3];
			this._pNameLabel 	= <IUILabel>pChildren[0];

			this._pAnimation = pContainer || (new akra.animation.Container);
			this.graph.addAnimation(pContainer);
			this.connect(pContainer, SIGNAL(enterFrame), SLOT(_enterFrame));

			// if (isNull(pContainer)) {
			// 	this.disconnect(this._pPauseBtn, SIGNAL(changed), SLOT(_pause));
			// 	this.disconnect(this._pPlayBtn, SIGNAL(changed), SLOT(_play));
			// 	this.disconnect(this._pSpeedLabel, SIGNAL(changed), SLOT(_setSpeed));
			// 	this.disconnect(this._pNameLabel, SIGNAL(changed), SLOT(_setName));
			// }

			this._pPlayBtn.checked = !pContainer.isPaused();
			this._pReverseBtn.checked = pContainer.isReversed();
			this._pLoopBtn.checked = pContainer.inLoop();

			this.connect(this._pPauseBtn, SIGNAL(changed), SLOT(_pause));
			this.connect(this._pPlayBtn, SIGNAL(changed), SLOT(_play));
			this.connect(this._pSpeedLabel, SIGNAL(changed), SLOT(_setSpeed));
			this.connect(this._pNameLabel, SIGNAL(changed), SLOT(_setName));

		}

		protected setup(): void {
			var pAnimation = this._pAnimation;

			this._pSlider.range = pAnimation.duration;

			if (pAnimation.isPaused()) {
				this._pPauseBtn.checked = true;
			}

			if (pAnimation.inLoop()) {
				this._pLoopBtn.checked = true;
			}

			if (pAnimation.isReversed()) {
				this._pReverseBtn.checked = true;
			}

			this._pNameLabel.text = pAnimation.name;
			this._pSpeedLabel.text = pAnimation.speed.toString();
		}

		_reverse(pCheckbox: IUICheckbox, bValue: bool): void {
			this._pAnimation.reverse(bValue);
		}

		_useLoop(pCheckbox: IUICheckbox, bValue: bool): void {
			this._pAnimation.useLoop(bValue);
		}

		_pause(pCheckbox: IUICheckbox, bValue: bool): void {
			this._pAnimation.pause(bValue);
		}

		_play(pCheckbox: IUICheckbox, bValue: bool): void {
			this._pAnimation.pause(!bValue);
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

		protected init(): void {
			var pChildren: IUINode[] = <IUINode[]>this.children();
			var n: int = pChildren.length;

			this.setRouteAreas([<IUINode>pChildren[n - 1]], [<IUINode>pChildren[n - 2]]);
		}

		protected getRouteArea(pNode: IUINode, eDirection: EUIGraphDirections = EUIGraphDirections.IN): IUINode {
			var pChildren: IUINode[] = <IUINode[]>this.children();
			var n: int = pChildren.length;

			if (eDirection === EUIGraphDirections.OUT) {
				return <IUINode>pChildren[n - 1];
			}

			return <IUINode>pChildren[n - 2];
		}

		isSuitable(pTarget: IUIAnimationNode): bool {
			if (this.connectors.length === 0 || isNull(this.connectors[0])) {
				this.animation = pTarget.animation;
				return true;
			}

			return false;
		}

		label(): string {
			return "AnimationPlayer";
		}

		_enterFrame(fTime: float): void {
			if (this._pAnimation.isPaused()) {
				//this._pAnimation.rewind(this._pSlider.value);
			}
			else {
				if (this._pAnimation.inLoop()) {
			        this._pSlider.value = 
			            math.mod((fTime - this._pAnimation.getStartTime()), this._pAnimation.duration);
			    }
			    else if (fTime >= this._pAnimation.getStartTime()) {
			        this._pSlider.value = 
			        	(math.min(fTime, this._pAnimation.duration) - this._pAnimation.getStartTime());
			    }
		    }
		}
	}

	Component.register("AnimationPlayer", Player);
}

#endif
