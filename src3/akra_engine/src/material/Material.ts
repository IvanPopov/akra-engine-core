/// <reference path="../idl/AIMaterial.ts" />

import Color = require("color/Color");
import config = require("config");

var def = config.material.default;

class Material implements AIMaterial {
    name: string = null;

    diffuse: AIColor = new Color(def.diffuse);
    ambient: AIColor = new Color(def.ambient);
    specular: AIColor = new Color(def.specular);
    emissive: AIColor = new Color(def.emissive);
    shininess: float = def.shininess;

    constructor(sName: string = null, pMat?: AIMaterial) {
        this.name = sName;

        if (isDefAndNotNull(pMat)) {
            this.set(pMat);
        }
    }

    set(pMat: AIMaterialBase): AIMaterial {
        //this.name = pMat.name;

        this.diffuse.set(pMat.diffuse);
        this.ambient.set(pMat.ambient);
        this.specular.set(pMat.specular);
        this.emissive.set(pMat.emissive);
        this.shininess = pMat.shininess;

        return this;
    }

    isEqual(pMat: AIMaterialBase): boolean {
        return Color.isEqual(this.diffuse, pMat.diffuse) &&
            Color.isEqual(this.ambient, pMat.ambient) &&
            Color.isEqual(this.specular, pMat.specular) &&
            Color.isEqual(this.emissive, pMat.emissive) &&
            this.shininess === pMat.shininess;
    }


    toString(): string {
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
    }
}

export = Material;