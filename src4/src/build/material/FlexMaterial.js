var akra;
(function (akra) {
    /// <reference path="../idl/IMaterial.ts" />
    /// <reference path="../color/Color.ts" />
    /// <reference path="../config/config.ts" />
    /// <reference path="../data/Usage.ts" />
    (function (material) {
        var Color = color.Color;
        var Usage = data.Usages;

        var FlexMaterial = (function () {
            function FlexMaterial(sName, pData) {
                this.name = null;
                this._pData = pData;
                this.name = sName;
            }
            Object.defineProperty(FlexMaterial.prototype, "diffuse", {
                get: function () {
                    return new Color(this._pData.getTypedData(Usage.DIFFUSE, 0, 1));
                },
                set: function (pValue) {
                    this._pData.setData(Color.toFloat32Array(pValue), Usage.DIFFUSE);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexMaterial.prototype, "ambient", {
                get: function () {
                    return new Color(this._pData.getTypedData(Usage.AMBIENT, 0, 1));
                },
                set: function (pValue) {
                    this._pData.setData(Color.toFloat32Array(pValue), Usage.AMBIENT);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexMaterial.prototype, "specular", {
                get: function () {
                    return new Color(this._pData.getTypedData(Usage.SPECULAR, 0, 1));
                },
                set: function (pValue) {
                    this._pData.setData(Color.toFloat32Array(pValue), Usage.SPECULAR);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexMaterial.prototype, "emissive", {
                get: function () {
                    return new Color(this._pData.getTypedData(Usage.EMISSIVE, 0, 1));
                },
                set: function (pValue) {
                    this._pData.setData(Color.toFloat32Array(pValue), Usage.EMISSIVE);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexMaterial.prototype, "shininess", {
                get: function () {
                    return this._pData.getTypedData(Usage.SHININESS, 0, 1)[0];
                },
                set: function (pValue) {
                    this._pData.setData(new Float32Array([pValue]), Usage.SHININESS);
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(FlexMaterial.prototype, "data", {
                get: function () {
                    return this._pData;
                },
                enumerable: true,
                configurable: true
            });

            FlexMaterial.prototype.set = function (pMat) {
                this.diffuse = pMat.diffuse;
                this.ambient = pMat.ambient;
                this.specular = pMat.specular;
                this.emissive = pMat.emissive;
                this.shininess = pMat.shininess;

                return this;
            };

            FlexMaterial.prototype.isEqual = function (pMat) {
                return Color.isEqual(this.diffuse, pMat.diffuse) && Color.isEqual(this.ambient, pMat.ambient) && Color.isEqual(this.specular, pMat.specular) && Color.isEqual(this.emissive, pMat.emissive) && this.shininess === pMat.shininess;
            };

            FlexMaterial.prototype.toString = function () {
                if (akra.config.DEBUG) {
                    var s = "\nFLEX MATERIAL - " + this.name + "\n";
                    s += "------------------------------------\n";
                    s += "diffuse:   " + this.diffuse.toString() + "\n";
                    s += "ambient:   " + this.ambient.toString() + "\n";
                    s += "specular:  " + this.ambient.toString() + "\n";
                    s += "emissive:  " + this.emissive.toString() + "\n";
                    s += "shininess: " + this.shininess + "\n";

                    return s;
                }
                return null;
            };
            return FlexMaterial;
        })();
        material.FlexMaterial = FlexMaterial;
    })(akra.material || (akra.material = {}));
    var material = akra.material;
})(akra || (akra = {}));
//# sourceMappingURL=FlexMaterial.js.map
