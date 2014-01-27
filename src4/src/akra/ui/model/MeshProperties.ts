/// <reference path="../../idl/IUILabel.ts" />
/// <reference path="../../idl/IUISwitch.ts" />
/// <reference path="../../idl/IMesh.ts" />

/// <reference path="../Component.ts" />
/// <reference path="MeshSubsetProperties.ts" />

module akra.ui.model {
	export class MeshProperties extends Component {
		protected _pMesh: IMesh = null;
		protected _pName: IUILabel;
		protected _pShadows: IUISwitch;
		protected _pBoundingBox: IUISwitch;
		protected _pBoundingSphere: IUISwitch;
		protected _pSubsets: MeshSubsetProperties[] = [];

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			this.template("model.MeshProperties.tpl");

			this._pName = <IUILabel>this.findEntity("name");
			this._pShadows = <IUISwitch>this.findEntity("shadows");
			this._pBoundingBox = <IUISwitch>this.findEntity("bounding-box");
			this._pBoundingSphere = <IUISwitch>this.findEntity("bounding-sphere");

			//this.connect(this._pShadows, SIGNAL(changed), SLOT(_useShadows));
			//this.connect(this._pBoundingBox, SIGNAL(changed), SLOT(_useBoundingBox));
			//this.connect(this._pBoundingSphere, SIGNAL(changed), SLOT(_useBoundingSphere));

			this._pShadows.changed.connect(this, this._useShadows);
			this._pBoundingBox.changed.connect(this, this._useBoundingBox);
			this._pBoundingSphere.changed.connect(this, this._useBoundingSphere);
		}

		_useShadows(pSwc: IUISwitch, bValue: boolean): void {
			this._pMesh.setShadow(bValue);
		}

		_useBoundingBox(pSwc: IUISwitch, bValue: boolean): void {
			if (bValue) {
				this._pMesh.showBoundingBox();
			}
			else {
				this._pMesh.hideBoundingBox();
			}

			this.updateProperties();
		}

		_useBoundingSphere(pSwc: IUISwitch, bValue: boolean): void {
			bValue? this._pMesh.showBoundingSphere(): this._pMesh.hideBoundingSphere();
			this.updateProperties();
		}

		setMesh(pMesh: IMesh): void {
			this._pMesh = pMesh;
			this.updateProperties();
		}

		protected updateProperties(): void {
			var pMesh: IMesh = this._pMesh;

			this._pName.setText(pMesh.getName());
			this._pShadows._setValue(pMesh.getShadow());
			this._pBoundingBox._setValue(pMesh.isBoundingBoxVisible());
			this._pBoundingSphere._setValue(pMesh.isBoundingSphereVisible());

			for (var i = 0; i < pMesh.getLength(); ++ i) {
				var pSubsetProperties: MeshSubsetProperties = null;

				if (this._pSubsets.length > i) {
					pSubsetProperties = this._pSubsets[i];
				}
				else {
					pSubsetProperties = <MeshSubsetProperties>this.createComponent("model.MeshSubsetProperties");
					this._pSubsets.push(pSubsetProperties);
				}

				pSubsetProperties.show();
				pSubsetProperties.setSubset(pMesh.getSubset(i));
			}

			for (var i = pMesh.getLength(); i < this._pSubsets.length; ++ i) {
				this._pSubsets[i].hide();
			}
		}

		protected finalizeRender(): void {
			super.finalizeRender();
			this.getElement().addClass("component-meshproperties");
		}
	}

	register("model.MeshProperties", MeshProperties);
}


