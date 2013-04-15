#ifndef UIMODELMESHPROPERTIES_TS
#define UIMODELMESHPROPERTIES_TS

#include "../Component.ts"
#include "IUILabel.ts"
#include "IUISwitch.ts"
#include "IMesh.ts"

module akra.ui.model {
	export class MeshProperties extends Component {
		protected _pMesh: IMesh = null;
		protected _pName: IUILabel;
		protected _pShadows: IUISwitch;

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			this.template("ui/templates/MeshProperties.tpl");

			this._pName = <IUILabel>this.findEntity("name");
			this._pShadows = <IUISwitch>this.findEntity("shadows");

			this.connect(this._pShadows, SIGNAL(changed), SLOT(_useShadows));
		}

		_useShadows(pSwc: IUISwitch, bValue: bool): void {
			this._pMesh.hasShadow = bValue;
		}

		setMesh(pMesh: IMesh): void {
			this._pMesh = pMesh;
			this.updateProperties();
		}

		protected updateProperties(): void {
			var pMesh: IMesh = this._pMesh;

			this._pName.text = pMesh.name;
			this._pShadows._setValue(pMesh.hasShadow);
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-meshproperties");
		}
	}

	register("MeshProperties", MeshProperties);
}

#endif

