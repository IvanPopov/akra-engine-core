/// <reference path="../../IDL/IAnimation.ts" />
/// <reference path="../../IDL/IAnimationContainer.ts" />
/// <reference path="../../IDL/IUIAnimationGraph.ts" />
/// <reference path="../../IDL/IUIAnimationPlayer.ts" />

/// <reference path="../../animation/Container.ts" />

/// <reference path="Node.ts" />

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

		getAnimation(): IAnimationBase {
			return this._pAnimation;
		}

		setAnimation(pAnim: IAnimationBase) {
			//logger.assert(isNull(this.animation), "animation container already setuped in player");
			if (this._pAnimation.getAnimation() === pAnim) {
				return;
			}

			this._pAnimation.setAnimation(pAnim);
			this.setup();
		}

		constructor(pGraph: IUIGraph, pContainer: IAnimationContainer = null) {
			super(pGraph, { init: false }, EUIGraphNodes.ANIMATION_PLAYER);

			this.template("animation.Player.tpl");
			this.linkAreas();

			this._pSpeedLabel = <IUILabel>this.findEntity("speed");
			this._pSlider = <IUISlider>this.findEntity("state");
			this._pPlayBtn = <IUICheckbox>this.findEntity("play");
			this._pLoopBtn = <IUICheckbox>this.findEntity("loop");
			this._pReverseBtn = <IUICheckbox>this.findEntity("reverse");
			this._pLeftInf = <IUICheckbox>this.findEntity("left-inf");
			this._pRightInf = <IUICheckbox>this.findEntity("right-inf");
			this._pNameLabel = <IUILabel>this.findEntity("name");
			this._pEnableBtn = <IUISwitch>this.findEntity("enabled");

			this._pAnimation = pContainer = pContainer || akra.animation.createContainer();
			this.getGraph().addAnimation(pContainer);

			//this.connect(pContainer, SIGNAL(enterFrame), SLOT(_enterFrame));
			//this.connect(pContainer, SIGNAL(durationUpdated), SLOT(_durationUpdated));
			pContainer.enterFrame.connect(this, this._enterFrame);
			pContainer.durationUpdated.connect(this, this._durationUpdated);

			//this.connect(this._pEnableBtn, SIGNAL(changed), SLOT(_enabled));
			//this.connect(this._pLoopBtn, SIGNAL(changed), SLOT(_useLoop));
			//this.connect(this._pReverseBtn, SIGNAL(changed), SLOT(_reverse));
			//this.connect(this._pPlayBtn, SIGNAL(changed), SLOT(_play));
			//this.connect(this._pSpeedLabel, SIGNAL(changed), SLOT(_setSpeed));
			//this.connect(this._pNameLabel, SIGNAL(changed), SLOT(_setName));
			//this.connect(this._pLeftInf, SIGNAL(changed), SLOT(_setLeftInf));
			//this.connect(this._pRightInf, SIGNAL(changed), SLOT(_setRightInf));
			this._pEnableBtn.changed.connect(this, this._enabled);
			this._pLoopBtn.changed.connect(this, this._useLoop);
			this._pReverseBtn.changed.connect(this, this._reverse);
			this._pPlayBtn.changed.connect(this, this._play);
			this._pSpeedLabel.changed.connect(this, this._setSpeed);
			this._pNameLabel.changed.connect(this, this._setName);
			this._pLeftInf.changed.connect(this, this._setLeftInf);
			this._pRightInf.changed.connect(this, this._setRightInf);



			this.$time = this.getElement().find(".time:first");

			this.setup();
		}

		protected connected(pArea: IUIGraphConnectionArea, pFrom: IUIGraphConnector, pTo: IUIGraphConnector): void {
			super.connected(pArea, pFrom, pTo);
			this.notifyDisabled(!this._pEnableBtn.getValue());
		}

		protected onConnectionBegin(pGraph: IUIGraph, pRoute: IUIGraphRoute): void {

			if (!isNull(this._pAnimation.getAnimation())) {
				this.getElement().addClass("blocked");
			}
			else {
				super.onConnectionBegin(pGraph, pRoute);
			}
		}

		protected setup(): void {
			var pAnimation = this._pAnimation;

			this._pSlider.setRange(pAnimation.getDuration());
			this._pPlayBtn.setChecked(!pAnimation.isPaused());

			this._pLoopBtn.setChecked(pAnimation.inLoop());
			this._pReverseBtn.setChecked(pAnimation.isReversed());

			this._pNameLabel.setText(pAnimation.getName());
			this._pSpeedLabel.setText(pAnimation.getSpeed().toString());

			this._pLeftInf.setChecked(pAnimation.inLeftInfinity());
			this._pRightInf.setChecked(pAnimation.inRightInfinity());

			this._pEnableBtn.setValue(pAnimation.isEnabled());
		}

		_enabled(pSwc: IUISwitch, bValue: boolean): void {
			this.notifyDisabled(!bValue);
		}

		private notifyDisabled(bValue: boolean): void {
			!bValue ? this._pAnimation.enable() : this._pAnimation.disable();

			if (!bValue) {
				this.getElement().removeClass("disabled");
			}
			else {
				this.getElement().addClass("disabled");
			}

			for (var i in this._pAreas) {
				var pConnectors: IUIGraphConnector[] = this._pAreas[i].getConnectors();

				for (var j = 0; j < pConnectors.length; ++j) {
					pConnectors[j].getRoute().enabled = !bValue;
				}
			}
		}

		_setLeftInf(pCheckbox: IUICheckbox, bValue: boolean): void {
			this._pAnimation.leftInfinity(bValue);
		}

		_setRightInf(pCheckbox: IUICheckbox, bValue: boolean): void {
			this._pAnimation.rightInfinity(bValue);
		}

		_reverse(pCheckbox: IUICheckbox, bValue: boolean): void {
			this._pAnimation.reverse(bValue);
		}

		_useLoop(pCheckbox: IUICheckbox, bValue: boolean): void {
			// LOG(this._pAnimation.isEnabled())
			this._pAnimation.useLoop(bValue);
		}

		_pause(pCheckbox: IUICheckbox, bValue: boolean): void {
			this._pAnimation.pause(bValue);
		}

		_play(pCheckbox: IUICheckbox, bValue: boolean): void {
			this._pAnimation.pause(!bValue);

			if (!bValue) {
				//this.connect(this._pSlider, SIGNAL(updated), SLOT(_setTime));
				this._pSlider.updated.connect(this, this._setTime);
				//this.disconnect(this._pAnimation, SIGNAL(enterFrame), SLOT(_enterFrame));
				this._pAnimation.enterFrame.disconnect(this, this._enterFrame);
			}
			else {
				//this.disconnect(this._pSlider, SIGNAL(updated), SLOT(_setTime));
				this._pSlider.updated.disconnect(this, this._setTime);
				//this.connect(this._pAnimation, SIGNAL(enterFrame), SLOT(_enterFrame));
				this._pAnimation.enterFrame.connect(this, this._enterFrame);
			}
		}

		_setTime(pSlider: IUISlider, fValue: float): void {
			this._pAnimation.pause(false);
			this._pAnimation.play(0);
			this._pAnimation.apply(fValue);
			this._pAnimation.pause(true);
		}

		_setName(pLabel: IUILabel, sName): void {
			this._pAnimation.setName(sName);
		}

		_setSpeed(pLabel: IUILabel, x): void {
			this._pAnimation.setSpeed(parseFloat(x));
		}


		_durationUpdated(pContainer: IAnimationContainer, fDuration: float): void {
			this._pSlider.setRange(fDuration);
		}

		_enterFrame(pContainer: IAnimationContainer, fRealTime: float, fTime: float): void {
			if (this._pAnimation.isPaused()) {
				//this._pAnimation.rewind(this._pSlider.value);
			}
			else {
				if (this._pAnimation.inLoop()) {
					this._pSlider.setValue(
					math.mod((fRealTime - this._pAnimation.getStartTime()), this._pAnimation.getDuration()));
				}
				else if (fRealTime >= this._pAnimation.getStartTime()) {
					this._pSlider.setValue(math.min(fTime, this._pAnimation.getDuration()));
				}

				this.$time.text(fTime.toFixed(1) + "/" + this._pAnimation.getDuration().toFixed(1) + "s");
			}
		}

		protected finalizeRender(): void {
			super.finalizeRender();
			this.getElement().addClass("component-animationplayer");
		}
	}

	register("animation.Player", <any>Player);
}

