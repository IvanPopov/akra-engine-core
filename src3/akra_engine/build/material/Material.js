/// <reference path="../idl/AIMaterial.ts" />
define(["require", "exports", "color/Color", "config"], function(require, exports, __Color__, __config__) {
    var Color = __Color__;
    var config = __config__;

    var def = config.material.default;

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

            if (isDefAndNotNull(pMat)) {
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
            if (has("DEBUG")) {
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

    
    return Material;
});
//# sourceMappingURL=Material.js.map
