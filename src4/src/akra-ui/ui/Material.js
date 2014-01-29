/// <reference path="../idl/IUIVector.ts" />
/// <reference path="../idl/IUILabel.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="Component.ts" />
    (function (ui) {
        var Material = (function (_super) {
            __extends(Material, _super);
            function Material(parent, options) {
                _super.call(this, parent, options, 0 /* UNKNOWN */);
                this._pMat = null;

                this.template("Material.tpl");
                this._pName = this.findEntity("name");

                this._pDiffuse = this.findEntity("diffuse");
                this._pAmbient = this.findEntity("ambient");
                this._pSpecular = this.findEntity("specular");
                this._pEmissive = this.findEntity("emissive");

                this._pShininess = this.findEntity("shininess");

                this._pDiffuse.changed.connect(this, this._diffuseUpdated);
                this._pAmbient.changed.connect(this, this._ambientUpdated);
                this._pSpecular.changed.connect(this, this._specularUpdated);
                this._pEmissive.changed.connect(this, this._emissiveUpdated);

                this._pShininess.changed.connect(this, this._shininessUpdated);
            }
            Material.prototype.set = function (pMaterial) {
                this._pMat = pMaterial;
                this.updateProperties();
            };

            Material.prototype._diffuseUpdated = function (pVec, pValue) {
                this._pMat.diffuse.r = pValue.x;
                this._pMat.diffuse.g = pValue.y;
                this._pMat.diffuse.b = pValue.z;
                this._pMat.diffuse.a = pValue.w;
            };

            Material.prototype._ambientUpdated = function (pVec, pValue) {
                this._pMat.ambient.r = pValue.x;
                this._pMat.ambient.g = pValue.y;
                this._pMat.ambient.b = pValue.z;
                this._pMat.ambient.a = pValue.w;
            };

            Material.prototype._specularUpdated = function (pVec, pValue) {
                this._pMat.specular.r = pValue.x;
                this._pMat.specular.g = pValue.y;
                this._pMat.specular.b = pValue.z;
                this._pMat.specular.a = pValue.w;
            };

            Material.prototype._emissiveUpdated = function (pVec, pValue) {
                this._pMat.emissive.r = pValue.x;
                this._pMat.emissive.g = pValue.y;
                this._pMat.emissive.b = pValue.z;
                this._pMat.emissive.a = pValue.w;
            };

            Material.prototype._shininessUpdated = function (pVec, sValue) {
                this._pMat.shininess = parseFloat(sValue) || 0.;
            };

            Material.prototype.updateProperties = function () {
                this._pName.setText(this._pMat.name);
                this._pDiffuse.setColor(this._pMat.diffuse);
                this._pAmbient.setColor(this._pMat.ambient);
                this._pSpecular.setColor(this._pMat.specular);
                this._pEmissive.setColor(this._pMat.emissive);
                this._pShininess.setText(this._pMat.shininess.toFixed(2));
            };

            Material.prototype.finalizeRender = function () {
                _super.prototype.finalizeRender.call(this);
                this.getElement().addClass("component-material");
            };
            return Material;
        })(akra.ui.Component);
        ui.Material = Material;

        akra.ui.register("Material", Material);
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
//# sourceMappingURL=Material.js.map
