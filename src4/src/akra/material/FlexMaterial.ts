/// <reference path="../idl/AIMaterial.ts" />

import Color = require("color/Color");
import Usage = require("data/Usage");

class FlexMaterial implements AIFlexMaterial {
    name: string = null;

    protected _pData: AIVertexData;

    get diffuse(): AIColorValue { return new Color(this._pData.getTypedData(Usage.DIFFUSE, 0, 1)); }
    get ambient(): AIColorValue { return new Color(this._pData.getTypedData(Usage.AMBIENT, 0, 1)); }
    get specular(): AIColorValue { return new Color(this._pData.getTypedData(Usage.SPECULAR, 0, 1)); }
    get emissive(): AIColorValue { return new Color(this._pData.getTypedData(Usage.EMISSIVE, 0, 1)); }
    get shininess(): float { return this._pData.getTypedData(Usage.SHININESS, 0, 1)[0]; }

    set diffuse(pValue: AIColorValue) { this._pData.setData(Color.toFloat32Array(pValue), Usage.DIFFUSE); }
    set ambient(pValue: AIColorValue) { this._pData.setData(Color.toFloat32Array(pValue), Usage.AMBIENT); }
    set specular(pValue: AIColorValue) { this._pData.setData(Color.toFloat32Array(pValue), Usage.SPECULAR); }
    set emissive(pValue: AIColorValue) { this._pData.setData(Color.toFloat32Array(pValue), Usage.EMISSIVE); }
    set shininess(pValue: float) { this._pData.setData(new Float32Array([pValue]), Usage.SHININESS); }

    get data(): AIVertexData { return this._pData; }

    constructor(sName: string, pData: AIVertexData) {
        this._pData = pData;
        this.name = sName;
    }

    set(pMat: AIMaterial): AIMaterial {

        this.diffuse = pMat.diffuse;
        this.ambient = pMat.ambient;
        this.specular = pMat.specular;
        this.emissive = pMat.emissive;
        this.shininess = pMat.shininess;

        return this;

    }

    isEqual(pMat: AIMaterial): boolean {
        return Color.isEqual(this.diffuse, pMat.diffuse) &&
            Color.isEqual(this.ambient, pMat.ambient) &&
            Color.isEqual(this.specular, pMat.specular) &&
            Color.isEqual(this.emissive, pMat.emissive) &&
            this.shininess === pMat.shininess;
    }



    toString(): string {
        if (has("DEBUG")) {
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
    }
}

export = FlexMaterial;