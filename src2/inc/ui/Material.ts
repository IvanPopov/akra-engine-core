#ifndef UIMATERIAL_TS
#define UIMATERIAL_TS

#include "IMaterial.ts"

#include "../Component.ts"

module akra.ui {
	export class Material extends Component {
		protected _pMat: IMaterial = null;
		protected _pName: IUILabel;

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			this.template("Material.tpl");
			this._pName = <IUILabel>this.findEntity("name");
		}

		set(pMaterial: IMaterial): void {
			this._pMat = pMaterial;
			this.updateProperties();
		}

		private updateProperties(): void {
			this._pName.text = this._pMat.name;
			
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-material");
		}
	}

	register("Material", Material);
}

#endif

