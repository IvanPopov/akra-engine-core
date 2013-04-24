#ifndef CONTROLLER_TS
#define CONTROLLER_TS

#include "IAnimationController.ts"
#include "ui/Component.ts"

module akra.ui.animation {
	export class Controller extends Component {
		protected _pController: IAnimationController = null;
		protected _pNameLb: IUILabel;
		protected _pEditBtn: IUIButton;
		protected _pRemoveButton: IUIButton;

		inline set controller(pController: IAnimationController) {
			this._pController = pController;
			this._pNameLb.text = pController.name || "unknown";
		}

		inline get controller(): IAnimationController {
			return this._pController;
		}

		constructor (parent, options?) {
			super(parent, options);

			this.template("animation.Controller.tpl");

			this._pNameLb = <IUILabel>this.findEntity("controller-name");
			this._pEditBtn = <IUIButton>this.findEntity("edit-controller");
			this._pRemoveButton = <IUIButton>this.findEntity("remove-controller");

			this.connect(this._pNameLb, SIGNAL(changed), SLOT(_nameChanged));
			this.connect(this._pEditBtn, SIGNAL(click), SLOT(edit));
			this.connect(this._pRemoveButton, SIGNAL(click), SLOT(remove));

			if (options && options.controller) {
				this.controller = options.controller;
			}
		}

		_nameChanged(pLb: IUILabel, sName: string): void {
			this._pController.name = sName;
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-animationcontroller");
		}

		BROADCAST(edit, VOID);
		BROADCAST(remove, VOID);
	}

	register("animation.Controller", Controller);
}

#endif
