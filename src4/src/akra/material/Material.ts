/// <reference path="../idl/IMaterial.ts" />
/// <reference path="../color/Color.ts" />
/// <reference path="../config/config.ts" />

module akra.material {
	import Color = color.Color;

	export class Material implements IMaterial {
		
		name: string = null;

		diffuse: IColor = new Color;
		ambient: IColor = new Color;
		specular: IColor = new Color;
		emissive: IColor = new Color;
		transparency: float = 1.;
		shininess: float = 1.;

		constructor(
			sName: string = null,
			pMat: IMaterialBase = null) {

			this.name = sName;
			this.set(pMat);
		}

		set(pMat: IMaterialBase): IMaterial {
			if (!isNull(pMat)) {
				this.diffuse.set(pMat.diffuse);
				this.ambient.set(pMat.ambient);
				this.specular.set(pMat.specular);
				this.emissive.set(pMat.emissive);
				this.shininess = pMat.shininess;
				this.transparency = pMat.transparency;
			}

			return this;
		}

		isEqual(pMat: IMaterialBase): boolean {
			return Color.isEqual(this.diffuse, pMat.diffuse) &&
				Color.isEqual(this.ambient, pMat.ambient) &&
				Color.isEqual(this.specular, pMat.specular) &&
				Color.isEqual(this.emissive, pMat.emissive) &&
				this.shininess === pMat.shininess &&
				this.transparency === pMat.transparency;
		}

		isTransparent(): boolean {
			return this.transparency < 1.;
		}

		toString(): string {
			if (config.DEBUG) {
				var s = "\nMATERIAL - " + this.name + "\n";

				s += "------------------------------------\n";
				s += "diffuse:      " + this.diffuse.toString() + "\n";
				s += "ambient:      " + this.ambient.toString() + "\n";
				s += "specular:     " + this.ambient.toString() + "\n";
				s += "emissive:     " + this.emissive.toString() + "\n";
				s += "shininess:    " + this.shininess + "\n";
				s += "transparency: " + this.transparency + "\n";

				return s;
			}

			return null;
		}
	}

}