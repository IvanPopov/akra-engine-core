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

		protected _pAmbient: IUIVector;
		protected _pDiffuse: IUIVector;
		protected _pSpecular: IUIVector;
		protected _pAttenuation: IUIVector;

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			this.template("light.Properties.tpl");

			this._pEnabled = <IUISwitch>this.findEntity("enabled");
			this._pShadows = <IUISwitch>this.findEntity("shadows");

			this._pAmbient = <IUIVector>this.findEntity("ambient");
			this._pDiffuse = <IUIVector>this.findEntity("diffuse");
			this._pSpecular = <IUIVector>this.findEntity("specular");
			this._pAttenuation = <IUIVector>this.findEntity("attenuation");

			this.connect(this._pEnabled, SIGNAL(changed), SLOT(_enableLight));
			this.connect(this._pShadows, SIGNAL(changed), SLOT(_useShadows));

			this.connect(this._pAmbient, SIGNAL(changed), SLOT(_ambientUpdated));
			this.connect(this._pDiffuse, SIGNAL(changed), SLOT(_diffuseUpdated));
			this.connect(this._pSpecular, SIGNAL(changed), SLOT(_specularUpdated));
			this.connect(this._pAttenuation, SIGNAL(changed), SLOT(_attenuationUpdated));

		}

		_ambientUpdated(pVec: IUIVector, pValue: IVec4): void {
			var c4fAmbient: IColorValue = (<IProjectLight>this._pLight).params.ambient;
			c4fAmbient.r = pValue.x;
			c4fAmbient.g = pValue.y;
			c4fAmbient.b = pValue.z;
			c4fAmbient.a = pValue.w;
		}

		_diffuseUpdated(pVec: IUIVector, pValue: IVec4): void {
			var c4fDiffuse: IColorValue = (<IProjectLight>this._pLight).params.diffuse;
			c4fDiffuse.r = pValue.x;
			c4fDiffuse.g = pValue.y;
			c4fDiffuse.b = pValue.z;
			c4fDiffuse.a = pValue.w;
		}

		_specularUpdated(pVec: IUIVector, pValue: IVec4): void {
			var c4fSpecular: IColorValue = (<IProjectLight>this._pLight).params.specular;
			c4fSpecular.r = pValue.x;
			c4fSpecular.g = pValue.y;
			c4fSpecular.b = pValue.z;
			c4fSpecular.a = pValue.w;
		}

		_attenuationUpdated(pVec: IUIVector, pValue: IVec3): void {
			(<IProjectLight>this._pLight).params.attenuation.set(pValue);
		}
		_useShadows(pSwc: IUISwitch, bValue: boolean): void {
			this._pLight.isShadowCaster = bValue;
		}

		_enableLight(pSwc: IUISwitch, bValue: boolean): void {
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

			this._pDiffuse.setColor((<IProjectLight>this._pLight).params.diffuse);
			this._pAmbient.setColor((<IProjectLight>this._pLight).params.ambient);
			this._pSpecular.setColor((<IProjectLight>this._pLight).params.specular);
			this._pAttenuation.setVec3((<IProjectLight>this._pLight).params.attenuation);
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-lightproperties");
		}
	}

	register("light.Properties", Properties);
}

#endif

