/// <reference path="../../idl/IUILabel.ts" />
/// <reference path="../../idl/IUISwitch.ts" />
/// <reference path="../../idl/ISceneModel.ts" />

/// <reference path="../Component.ts" />

module akra.ui.scene {
	export class Model extends Component {
		protected _pModel: ISceneModel = null;
		protected _pVisible: IUISwitch;

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			this.template("scene.Model.tpl");

			this._pVisible = <IUISwitch>this.findEntity("visible");

			//this.connect(this._pVisible, SIGNAL(changed), SLOT(_changeVisibility));
			this._pVisible.changed.connect(this, this._changeVisibility);
		}

		_changeVisibility(pSwc: IUISwitch, bValue: boolean): void {
			this._pModel.setVisible(bValue);
		}

		setModel(pModel: ISceneModel): void {
			this._pModel = pModel;
			this.updateProperties();
		}

		protected updateProperties(): void {
			var pModel: ISceneModel = this._pModel;

			this._pVisible._setValue(pModel.isVisible());
		}

		protected finalizeRender(): void {
			super.finalizeRender();
			this.getElement().addClass("component-scenemodel");
		}
	}

	register("scene.Model", Model);
}



