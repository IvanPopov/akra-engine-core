#ifndef UIMODELMESHSUBSETPROPERTIES_TS
#define UIMODELMESHSUBSETPROPERTIES_TS

#include "IMeshSubset.ts"

#include "ui/Panel.ts"
#include "ui/Material.ts"

module akra.ui.model {
	export class MeshSubsetProperties extends Panel {
		protected _pSubset: IMeshSubset = null;
		protected _pName: IUILabel;
		protected _pMaterial: ui.Material;

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			this.template("model.MeshSubsetProperties.tpl");
			this._pName = <IUILabel>this.findEntity("name");
			this._pMaterial = <ui.Material>this.findEntity("material");

			this.setCollapsible();
			this.collapse(true);
		}

		setSubset(pSubset: IMeshSubset): void {
			this._pSubset = pSubset;
			this.updateProperties();
		}

		private updateProperties(): void {
			this._pName.text = this._pSubset.name;
			this._pSubset.switchRenderMethod(null);
			this._pMaterial.set(this._pSubset.material);
			this.title = this._pSubset.name;
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-meshsubsetproperties");
		}
	}

	register("model.MeshSubsetProperties", MeshSubsetProperties);
}

#endif

