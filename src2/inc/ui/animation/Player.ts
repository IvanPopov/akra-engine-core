#ifndef UIANIMATIONPLAYER_TS
#define UIANIMATIONPLAYER_TS

#include "IAnimation.ts"
#include "IAnimationContainer.ts"
#include "IUIAnimationGraph.ts"
#include "IUIAnimationPlayer.ts"
#include "Node.ts"
#include "animation/Container.ts"

module akra.ui.animation {
	export class Player extends graph.Node implements IUIAnimationPlayer {
		private _pSpeedLabel: IUILabel;
		private _pSlider: IUISlider;
		private _pPlayBtn: IUICheckbox;
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
			super(pGraph, {init: false}, EUIGraphNodes.ANIMATION_PLAYER);

			graph.template(this, "ui/templates/AnimationPlayer.tpl");

			this.init();

			this._pSpeedLabel 	= <IUILabel>this.findEntity("speed");
			this._pSlider 		= <IUISlider>this.findEntity("state");
			this._pPlayBtn 		= <IUICheckbox>this.findEntity("play");
			this._pLoopBtn 		= <IUICheckbox>this.findEntity("loop");
			this._pReverseBtn 	= <IUICheckbox>this.findEntity("reverse");
			this._pNameLabel 	= <IUILabel>this.findEntity("name");

			this._pAnimation = pContainer = pContainer || akra.animation.createContainer();
			this.graph.addAnimation(pContainer);
			this.connect(pContainer, SIGNAL(enterFrame), SLOT(_enterFrame));

			this.connect(this._pPlayBtn, SIGNAL(changed), SLOT(_play));
			this.connect(this._pSpeedLabel, SIGNAL(changed), SLOT(_setSpeed));
			this.connect(this._pNameLabel, SIGNAL(changed), SLOT(_setName));

			this.setup();
		}

		protected setup(): void {
			var pAnimation = this._pAnimation;

			this._pSlider.range = pAnimation.duration;
			this._pPlayBtn.checked = !pAnimation.isPaused();

			this._pLoopBtn.checked = pAnimation.inLoop();
			this._pReverseBtn.checked = pAnimation.isReversed();

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

		protected init(): void {
			var pInput: graph.ConnectionArea = new graph.ConnectionArea(this, {show: false, maxConnections: 1});
			
			pInput.setMode(EUIGraphDirections.IN);
			pInput.setLayout(EUILayouts.HORIZONTAL);
			pInput.render(this.el);

			this.addConnectionArea("in", pInput);

			var pOutput: graph.ConnectionArea = new graph.ConnectionArea(this, {show: false, maxConnections: 1});
			
			pOutput.setMode(EUIGraphDirections.OUT);
			pOutput.setLayout(EUILayouts.HORIZONTAL);
			pOutput.render(this.el);

			this.addConnectionArea("out", pOutput);
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

	register("AnimationPlayer", Player);
}

#endif
