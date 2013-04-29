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
		private _pLoopBtn: IUICheckbox;
		private _pReverseBtn: IUICheckbox;
		private _pEnableBtn: IUISwitch;
		
		private _pLeftInf: IUICheckbox;
		private _pRightInf: IUICheckbox;

		private _pNameLabel: IUILabel;

		private _pAnimation: IAnimationContainer = null;

		protected $time: JQuery;

		inline get animation(): IAnimationBase {
			return this._pAnimation;
		}

		set animation(pAnim: IAnimationBase) {
			//ASSERT(isNull(this.animation), "animation container already setuped in player");
			if (this._pAnimation.getAnimation() === pAnim) {
				return;
			}
			
			this._pAnimation.setAnimation(pAnim);
			this.setup();
		}

		constructor (pGraph: IUIGraph, pContainer: IAnimationContainer = null) {
			super(pGraph, {init: false}, EUIGraphNodes.ANIMATION_PLAYER);

			this.template("animation.Player.tpl");
			this.linkAreas();

			this._pSpeedLabel 	= <IUILabel>this.findEntity("speed");
			this._pSlider 		= <IUISlider>this.findEntity("state");
			this._pPlayBtn 		= <IUICheckbox>this.findEntity("play");
			this._pLoopBtn 		= <IUICheckbox>this.findEntity("loop");
			this._pReverseBtn 	= <IUICheckbox>this.findEntity("reverse");
			this._pLeftInf 		= <IUICheckbox>this.findEntity("left-inf");
			this._pRightInf 	= <IUICheckbox>this.findEntity("right-inf");
			this._pNameLabel 	= <IUILabel>this.findEntity("name");
			this._pEnableBtn	= <IUISwitch>this.findEntity("enabled");

			this._pAnimation = pContainer = pContainer || akra.animation.createContainer();
			this.graph.addAnimation(pContainer);

			this.connect(pContainer, SIGNAL(enterFrame), SLOT(_enterFrame));
			this.connect(pContainer, SIGNAL(durationUpdated), SLOT(_durationUpdated));

			this.connect(this._pEnableBtn, SIGNAL(changed), SLOT(_enabled));
			this.connect(this._pLoopBtn, SIGNAL(changed), SLOT(_useLoop));
			this.connect(this._pReverseBtn, SIGNAL(changed), SLOT(_reverse));
			this.connect(this._pPlayBtn, SIGNAL(changed), SLOT(_play));
			this.connect(this._pSpeedLabel, SIGNAL(changed), SLOT(_setSpeed));
			this.connect(this._pNameLabel, SIGNAL(changed), SLOT(_setName));
			this.connect(this._pLeftInf, SIGNAL(changed), SLOT(_setLeftInf));
			this.connect(this._pRightInf, SIGNAL(changed), SLOT(_setRightInf));
			


			this.$time = this.el.find(".time:first");

			this.setup();
		}

		protected connected(pArea: IUIGraphConnectionArea, pFrom: IUIGraphConnector, pTo: IUIGraphConnector): void {
			super.connected(pArea, pFrom, pTo);
			this.notifyDisabled(!this._pEnableBtn.value);
		}

		protected onConnectionBegin(pGraph: IUIGraph, pRoute: IUIGraphRoute): void {

			if (!isNull(this._pAnimation.getAnimation())) {
				this.el.addClass("blocked");
			}
			else {
				super.onConnectionBegin(pGraph, pRoute);
			}
		}

		protected setup(): void {
			var pAnimation = this._pAnimation;

			this._pSlider.range = pAnimation.duration;
			this._pPlayBtn.checked = !pAnimation.isPaused();

			this._pLoopBtn.checked = pAnimation.inLoop();
			this._pReverseBtn.checked = pAnimation.isReversed();

			this._pNameLabel.text = pAnimation.name;
			this._pSpeedLabel.text = pAnimation.speed.toString();

			this._pLeftInf.checked = pAnimation.inLeftInfinity();
			this._pRightInf.checked = pAnimation.inRightInfinity();

			this._pEnableBtn.value = pAnimation.isEnabled();
		}

		_enabled(pSwc: IUISwitch, bValue: bool): void {
			this.notifyDisabled(!bValue);
		}

		private notifyDisabled(bValue: bool): void {
			!bValue? this._pAnimation.enable(): this._pAnimation.disable();

			if (!bValue) {
				this.el.removeClass("disabled");
			}
			else {
				this.el.addClass("disabled");
			}

			for (var i in this._pAreas) {
				var pConnectors: IUIGraphConnector[] = this._pAreas[i].connectors;
				
				for (var j = 0; j < pConnectors.length; ++ j) {
					pConnectors[j].route.enabled = !bValue;
				}
			}
		}

		_setLeftInf(pCheckbox: IUICheckbox, bValue: bool): void {
			this._pAnimation.leftInfinity(bValue);
		}

		_setRightInf(pCheckbox: IUICheckbox, bValue: bool): void {
			this._pAnimation.rightInfinity(bValue);
		}

		_reverse(pCheckbox: IUICheckbox, bValue: bool): void {
			this._pAnimation.reverse(bValue);
		}

		_useLoop(pCheckbox: IUICheckbox, bValue: bool): void {
			LOG(this._pAnimation.isEnabled())
			this._pAnimation.useLoop(bValue);
		}

		_pause(pCheckbox: IUICheckbox, bValue: bool): void {
			this._pAnimation.pause(bValue);
		}

		_play(pCheckbox: IUICheckbox, bValue: bool): void {
			this._pAnimation.pause(!bValue);

			if (!bValue) {
				this.connect(this._pSlider, SIGNAL(updated), SLOT(_setTime));
				this.disconnect(this._pAnimation, SIGNAL(enterFrame), SLOT(_enterFrame));
			}
			else {
				this.disconnect(this._pSlider, SIGNAL(updated), SLOT(_setTime));
				this.connect(this._pAnimation, SIGNAL(enterFrame), SLOT(_enterFrame));
			}
		}

		_setTime(pSlider: IUISlider, fValue: float): void {
			this._pAnimation.pause(false);
			this._pAnimation.play(0);	
			this._pAnimation.apply(fValue);
			this._pAnimation.pause(true);
		}

		_setName(pLabel: IUILabel, sName): void {
			this._pAnimation.name = sName;
		}

		_setSpeed(pLabel: IUILabel, x): void {
			this._pAnimation.setSpeed(parseFloat(x));
		}


		_durationUpdated(pContainer: IAnimationContainer, fDuration: float): void {
			this._pSlider.range = fDuration;
		}

		_enterFrame(pContainer: IAnimationContainer, fRealTime: float, fTime: float): void {
			if (this._pAnimation.isPaused()) {
				//this._pAnimation.rewind(this._pSlider.value);
			}
			else {
				if (this._pAnimation.inLoop()) {
			        this._pSlider.value = 
			            math.mod((fRealTime - this._pAnimation.getStartTime()), this._pAnimation.duration);
			    }
			    else if (fRealTime >= this._pAnimation.getStartTime()) {
			        this._pSlider.value = math.min(fTime, this._pAnimation.duration);
			    }

			    this.$time.text(fTime.toFixed(1) + "/" + this._pAnimation.duration.toFixed(1) + "s");
		    }
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-animationplayer");
		}
	}

	register("animation.Player", Player);
}

#endif
