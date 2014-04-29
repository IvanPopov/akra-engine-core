/// <reference path="../idl/IMaterial.ts" />
/// <reference path="../color/Color.ts" />
/// <reference path="../config/config.ts" />

module akra.material {
	import Color = color.Color;

	var def = config.material.default;

	export class Material implements IMaterial {
		name: string = null;

		diffuse: IColor = new Color(def.diffuse);
		ambient: IColor = new Color(def.ambient);
		specular: IColor = new Color(def.specular);
		emissive: IColor = new Color(def.emissive);
		shininess: float = def.shininess;
		isTransparent: boolean = def.isTransparent;

		constructor(sName: string = null, pMat?: IMaterialBase) {
			this.name = sName;

			if (isDefAndNotNull(pMat)) {
				this.set(pMat);
			}
		}

		set(pMat: IMaterialBase): IMaterial {
			//this.name = pMat.name;

			this.diffuse.set(pMat.diffuse);
			this.ambient.set(pMat.ambient);
			this.specular.set(pMat.specular);
			this.emissive.set(pMat.emissive);
			this.shininess = pMat.shininess;
			this.isTransparent = pMat.isTransparent || def.isTransparent;

			return this;
		}

		isEqual(pMat: IMaterialBase): boolean {
			return Color.isEqual(this.diffuse, pMat.diffuse) &&
				Color.isEqual(this.ambient, pMat.ambient) &&
				Color.isEqual(this.specular, pMat.specular) &&
				Color.isEqual(this.emissive, pMat.emissive) &&
				this.shininess === pMat.shininess &&
				this.isTransparent === pMat.isTransparent;
		}


		toString(): string {
			if (config.DEBUG) {
				var s = "\nMATERIAL - " + this.name + "\n";
				s += "------------------------------------\n";
				s += "diffuse:   " + this.diffuse.toString() + "\n";
				s += "ambient:   " + this.ambient.toString() + "\n";
				s += "specular:  " + this.ambient.toString() + "\n";
				s += "emissive:  " + this.emissive.toString() + "\n";
				s += "shininess: " + this.shininess + "\n";
				s += "transparent: " + this.isTransparent + "\n";

				return s;
			}

			return null;
		}
	}

}