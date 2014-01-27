/// <reference path="../../idl/IMeshSubset.ts" />

/// <reference path="../Panel.ts" />
/// <reference path="../Material.ts" />

module akra.ui.model {
	export class MeshSubsetProperties extends Panel {
		protected _pSubset: IMeshSubset = null;
		protected _pName: IUILabel;
		protected _pMaterial: ui.Material;
		protected _pVisible: IUISwitch;
		protected _pShadows: IUISwitch;
		protected _pBoundingBox: IUISwitch;
		protected _pBoundingSphere: IUISwitch;
		protected _pGuid: IUILabel;

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			this.template("model.MeshSubsetProperties.tpl");
			this._pName = <IUILabel>this.findEntity("name");
			this._pMaterial = <ui.Material>this.findEntity("material");

			this._pVisible = <IUISwitch>this.findEntity("sub-visible");
			this._pShadows = <IUISwitch>this.findEntity("sub-shadows");
			this._pBoundingBox = <IUISwitch>this.findEntity("sub-bounding-box");
			this._pBoundingSphere = <IUISwitch>this.findEntity("sub-bounding-sphere");
			this._pGuid = <IUILabel>this.findEntity("sub-guid");

			//this.connect(this._pVisible, SIGNAL(changed), SLOT(_setVisible));
			//this.connect(this._pShadows, SIGNAL(changed), SLOT(_useShadows));
			//this.connect(this._pBoundingBox, SIGNAL(changed), SLOT(_useBoundingBox));
			//this.connect(this._pBoundingSphere, SIGNAL(changed), SLOT(_useBoundingSphere));
			this._pVisible.changed.connect(this, this._setVisible);
			this._pShadows.changed.connect(this, this._useShadows);
			this._pBoundingBox.changed.connect(this, this._useBoundingBox);
			this._pBoundingSphere.changed.connect(this, this._useBoundingSphere);

			this.setCollapsible();
			this.collapse(true);
		}

		_setVisible(pSwc: IUISwitch, bValue: boolean): void {
			this._pSubset.setVisible(bValue);
		}

		_useShadows(pSwc: IUISwitch, bValue: boolean): void {
			this._pSubset.setShadow(bValue);
		}

		_useBoundingBox(pSwc: IUISwitch, bValue: boolean): void {
			bValue? this._pSubset.showBoundingBox(): this._pSubset.hideBoundingBox();

			this.updateProperties();
		}

		_useBoundingSphere(pSwc: IUISwitch, bValue: boolean): void {
			bValue? this._pSubset.showBoundingSphere(): this._pSubset.hideBoundingSphere();
			this.updateProperties();
		}

		setSubset(pSubset: IMeshSubset): void {
			this._pSubset = pSubset;
			this.updateProperties();
		}

		private updateProperties(): void {
			this._pName.setText(this._pSubset.getName());
			this._pSubset.switchRenderMethod(null);
			this._pMaterial.set(this._pSubset.getMaterial());
			this.setTitle(this._pSubset.getName());
			this._pShadows._setValue(this._pSubset.getShadow());
			this._pBoundingBox._setValue(this._pSubset.isBoundingBoxVisible());
			this._pBoundingSphere._setValue(this._pSubset.isBoundingSphereVisible());
			this._pVisible._setValue(this._pSubset.isVisible());
			this._pGuid.setText(<any>this._pSubset.guid);
		}

		protected finalizeRender(): void {
			super.finalizeRender();
			this.getElement().addClass("component-meshsubsetproperties");
		}
	}

	register("model.MeshSubsetProperties", MeshSubsetProperties);
}


