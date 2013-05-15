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
		protected _pBoundingBox: IUISwitch;
		protected _pBoundingSphere: IUISwitch;

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			this.template("model.MeshSubsetProperties.tpl");
			this._pName = <IUILabel>this.findEntity("name");
			this._pMaterial = <ui.Material>this.findEntity("material");

			this._pBoundingBox = <IUISwitch>this.findEntity("sub-bounding-box");
			this._pBoundingSphere = <IUISwitch>this.findEntity("sub-bounding-sphere");

			this.connect(this._pBoundingBox, SIGNAL(changed), SLOT(_useBoundingBox));
			this.connect(this._pBoundingSphere, SIGNAL(changed), SLOT(_useBoundingSphere));

			this.setCollapsible();
			this.collapse(true);
		}

		_useBoundingBox(pSwc: IUISwitch, bValue: bool): void {
			if (bValue) {
				this._pSubset.showBoundingBox();
			}
			else {
				this._pSubset.hideBoundingBox();
			}

			this.updateProperties();
		}

		_useBoundingSphere(pSwc: IUISwitch, bValue: bool): void {
			bValue? this._pSubset.showBoundingSphere(): this._pSubset.hideBoundingSphere();
			this.updateProperties();
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

