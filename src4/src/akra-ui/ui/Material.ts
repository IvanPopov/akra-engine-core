/// <reference path="../idl/IUIVector.ts" />
/// <reference path="../idl/IUILabel.ts" />

/// <reference path="Component.ts" />

module akra.ui {
	export class Material extends Component {
		protected _pMat: IMaterial = null;
		protected _pName: IUILabel;
		protected _pDiffuse: IUIVector;
		protected _pAmbient: IUIVector;
		protected _pSpecular: IUIVector;
		protected _pEmissive: IUIVector;
		protected _pShininess: IUILabel;

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			this.template("Material.tpl");
			this._pName = <IUILabel>this.findEntity("name");

			this._pDiffuse = <IUIVector>this.findEntity("diffuse");
			this._pAmbient = <IUIVector>this.findEntity("ambient");
			this._pSpecular = <IUIVector>this.findEntity("specular");
			this._pEmissive = <IUIVector>this.findEntity("emissive");

			this._pShininess = <IUILabel>this.findEntity("shininess");

			this._pDiffuse.changed.connect(this, this._diffuseUpdated);
			this._pAmbient.changed.connect(this, this._ambientUpdated);
			this._pSpecular.changed.connect(this, this._specularUpdated);
			this._pEmissive.changed.connect(this, this._emissiveUpdated);

			this._pShininess.changed.connect(this, this._shininessUpdated);
		}

		set(pMaterial: IMaterial): void {
			this._pMat = pMaterial;
			this.updateProperties();
		}

		_diffuseUpdated(pVec: IUIVector, pValue: IVec4): void {
			this._pMat.diffuse.r = pValue.x;
			this._pMat.diffuse.g = pValue.y;
			this._pMat.diffuse.b = pValue.z;
			this._pMat.diffuse.a = pValue.w;
		}

		_ambientUpdated(pVec: IUIVector, pValue: IVec4): void {
			this._pMat.ambient.r = pValue.x;
			this._pMat.ambient.g = pValue.y;
			this._pMat.ambient.b = pValue.z;
			this._pMat.ambient.a = pValue.w;
		}

		_specularUpdated(pVec: IUIVector, pValue: IVec4): void {
			this._pMat.specular.r = pValue.x;
			this._pMat.specular.g = pValue.y;
			this._pMat.specular.b = pValue.z;
			this._pMat.specular.a = pValue.w;
		}

		_emissiveUpdated(pVec: IUIVector, pValue: IVec4): void {
			this._pMat.emissive.r = pValue.x;
			this._pMat.emissive.g = pValue.y;
			this._pMat.emissive.b = pValue.z;
			this._pMat.emissive.a = pValue.w;
		}

		_shininessUpdated(pVec: IUILabel, sValue: string): void {
			this._pMat.shininess = parseFloat(sValue) || 0.;
		}

		private updateProperties(): void {
			this._pName.setText(this._pMat.name);
			this._pDiffuse.setColor(this._pMat.diffuse);
			this._pAmbient.setColor(this._pMat.ambient);
			this._pSpecular.setColor(this._pMat.specular);
			this._pEmissive.setColor(this._pMat.emissive);
			this._pShininess.setText(this._pMat.shininess.toFixed(2));
			
		}

		protected finalizeRender(): void {
			super.finalizeRender();
			this.getElement().addClass("component-material");
		}
	}

	register("Material", Material);
}


