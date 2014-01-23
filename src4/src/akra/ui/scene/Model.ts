#ifndef UISCENEMODEL_TS
#define UISCENEMODEL_TS

#include "../Component.ts"
#include "IUILabel.ts"
#include "IUISwitch.ts"
#include "ISceneModel.ts"

module akra.ui.scene {
	export class Model extends Component {
		protected _pModel: ISceneModel = null;
		protected _pVisible: IUISwitch;

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			this.template("scene.Model.tpl");

			this._pVisible = <IUISwitch>this.findEntity("visible");

			this.connect(this._pVisible, SIGNAL(changed), SLOT(_changeVisibility));
		}

		_changeVisibility(pSwc: IUISwitch, bValue: boolean): void {
			this._pModel.visible = bValue;
		}

		setModel(pModel: ISceneModel): void {
			this._pModel = pModel;
			this.updateProperties();
		}

		protected updateProperties(): void {
			var pModel: ISceneModel = this._pModel;

			this._pVisible._setValue(pModel.visible);
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-scenemodel");
		}
	}

	register("scene.Model", Model);
}

#endif

