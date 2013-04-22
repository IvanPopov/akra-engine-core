#ifndef UILIGHTPROPERTIES_TS
#define UILIGHTPROPERTIES_TS

#include "../Component.ts"
#include "IUILabel.ts"
#include "IUISwitch.ts"
#include "ILightPoint.ts"

module akra.ui.light {
	export class Properties extends Component {
		protected _pLight: ILightPoint = null;
		protected _pEnabled: IUISwitch;
		protected _pShadows: IUISwitch;

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			this.template("light.Properties.tpl");

			this._pEnabled = <IUISwitch>this.findEntity("enabled");
			this._pShadows = <IUISwitch>this.findEntity("shadows");

			this.connect(this._pEnabled, SIGNAL(changed), SLOT(_enableLight));
			this.connect(this._pShadows, SIGNAL(changed), SLOT(_useShadows));
		}

		_useShadows(pSwc: IUISwitch, bValue: bool): void {
			this._pLight.isShadowCaster = bValue;
		}

		_enableLight(pSwc: IUISwitch, bValue: bool): void {
			this._pLight.enabled = bValue;
		}

		setLight(pLight: ILightPoint): void {
			this._pLight = pLight;
			this.updateProperties();
		}

		protected updateProperties(): void {
			var pLight: ILightPoint = this._pLight;

			this._pShadows._setValue(pLight.isShadowCaster);
			this._pEnabled._setValue(pLight.enabled);
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-lightproperties");
		}
	}

	register("light.Properties", Properties);
}

#endif

