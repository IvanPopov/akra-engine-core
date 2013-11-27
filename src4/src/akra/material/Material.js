var akra;
(function (akra) {
    /// <reference path="../idl/IMaterial.ts" />
    /// <reference path="../color/Color.ts" />
    /// <reference path="../config/config.ts" />
    (function (material) {
        var Color = color.Color;

        var def = akra.config.material.default;

        var Material = (function () {
            function Material(sName, pMat) {
                if (typeof sName === "undefined") { sName = null; }
                this.name = null;
                this.diffuse = new Color(def.diffuse);
                this.ambient = new Color(def.ambient);
                this.specular = new Color(def.specular);
                this.emissive = new Color(def.emissive);
                this.shininess = def.shininess;
                this.name = sName;

                if (akra.isDefAndNotNull(pMat)) {
                    this.set(pMat);
                }
            }
            Material.prototype.set = function (pMat) {
                //this.name = pMat.name;
                this.diffuse.set(pMat.diffuse);
                this.ambient.set(pMat.ambient);
                this.specular.set(pMat.specular);
                this.emissive.set(pMat.emissive);
                this.shininess = pMat.shininess;

                return this;
            };

            Material.prototype.isEqual = function (pMat) {
                return Color.isEqual(this.diffuse, pMat.diffuse) && Color.isEqual(this.ambient, pMat.ambient) && Color.isEqual(this.specular, pMat.specular) && Color.isEqual(this.emissive, pMat.emissive) && this.shininess === pMat.shininess;
            };

            Material.prototype.toString = function () {
                if (akra.config.DEBUG) {
                    var s = "\nMATERIAL - " + this.name + "\n";
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
            return Material;
        })();
        material.Material = Material;
    })(akra.material || (akra.material = {}));
    var material = akra.material;
})(akra || (akra = {}));
