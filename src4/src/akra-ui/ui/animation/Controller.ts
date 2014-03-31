/// <reference path="../Component.ts" />

module akra.ui.animation {
	export class Controller extends Component {
		edit: ISignal<{ (pController: IUIComponent): void; }>;
		remove: ISignal<{ (pController: IUIComponent): void; }>;

		protected _pController: IAnimationController = null;
		protected _pNameLb: IUILabel;
		protected _pEditBtn: IUIButton;
		protected _pRemoveBtn: IUIButton;

		setController(pController: IAnimationController) {
			this._pController = pController;
			this._pNameLb.setText(pController.name || "unknown");
		}

		getController(): IAnimationController {
			return this._pController;
		}

		constructor(parent, options?) {
			super(parent, options);

			this.template("animation.Controller.tpl");

			this._pNameLb = <IUILabel>this.findEntity("controller-name");
			this._pEditBtn = <IUIButton>this.findEntity("edit-controller");
			this._pRemoveBtn = <IUIButton>this.findEntity("remove-controller");

			//this.connect(this._pNameLb, SIGNAL(changed), SLOT(_nameChanged));
			//this.connect(this._pEditBtn, SIGNAL(click), SLOT(edit));
			//this.connect(this._pRemoveBtn, SIGNAL(click), SLOT(remove));
			this._pNameLb.changed.connect(this, this._nameChanged);
			this._pEditBtn.click.connect(this.edit);
			this._pRemoveBtn.click.connect(this.remove);

			if (options && options.controller) {
				this.setController(options.controller);
			}
		}

		protected setupSignals(): void {
			this.edit = this.edit || new Signal(this);
			this.remove = this.remove || new Signal(this);
			super.setupSignals();
		}

		_nameChanged(pLb: IUILabel, sName: string): void {
			this._pController.name = sName;
		}

		protected finalizeRender(): void {
			super.finalizeRender();
			this.getElement().addClass("component-animationcontroller");
		}
	}

	register("animation.Controller", Controller);
}
