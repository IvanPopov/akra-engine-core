#ifndef UIANIMATIONCONTROLLERPROPERTIES_TS
#define UIANIMATIONCONTROLLERPROPERTIES_TS

#include "../Component.ts"
#include "IUILabel.ts"
#include "IResourcePoolItem.ts"
#include "IAnimationController.ts"

module akra.ui.animation {
	export class ControllerProperties extends Component {
		protected _pController: IAnimationController = null;
		
		protected _pTotalAnimLabel: IUILabel;
		protected _pActiveAnimation: IUILabel;
		protected _pEditBtn: IUIButton;

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			this.template("animation.ControllerProperties.tpl");

			this._pTotalAnimLabel = <IUILabel>this.findEntity("total");
			this._pActiveAnimation = <IUILabel>this.findEntity("active");

			this._pEditBtn = <IUIButton>this.findEntity("edit");

			this.connect(this._pEditBtn, SIGNAL(click), SLOT(_editController));
		}

		_editController(pButton: IUIButton): void {
			ide.cmd(ECMD.EDIT_ANIMATION_CONTROLLER, this._pController);
		}	

		setController(pController: IAnimationController): void {
			if (!isNull(this._pController)) {
				this.disconnect(this._pController, SIGNAL(animationAdded), SLOT(updateProperties));
			}

			this.connect(pController, SIGNAL(animationAdded), SLOT(updateProperties));
			this.connect(pController, SIGNAL(play), SLOT(updateProperties));

			this._pController = pController;
			this.updateProperties();
		}

		private updateProperties(): void {
			var pController: IAnimationController = this._pController;
			this._pTotalAnimLabel.text = <string><any>pController.totalAnimations;
			this._pActiveAnimation.text = pController.active? pController.active.name: "[not selected]";
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-animationcontrollerproperties");
		}
	}

	register("AnimationControllerProperties", ControllerProperties);
}

#endif

