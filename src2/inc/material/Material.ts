#ifndef MATERIAL_TS
#define MATERIAL_TS

#include "IMaterial.ts"

module akra.material {
	export class Material implements IMaterial {
		name: string = null;

		diffuse: IColor = new Color(.5);
		ambient: IColor = new Color(.5);
		specular: IColor = new Color(.5);
		emissive: IColor = new Color(.5);
		shininess: float = 50.;

		set(pMat: IMaterial): IMaterial {
			this.name = pMat.name;

			this.diffuse.set(pMat.diffuse);
			this.ambient.set(pMat.ambient);
			this.specular.set(pMat.specular);
			this.emissive.set(pMat.emissive);
			this.shininess = pMat.shininess;

			return this;
		}

		isEqual(pMat: IMaterial): bool {
			return Color.isEqual(this.diffuse, pMat.diffuse) && 
			Color.isEqual(this.ambient, pMat.ambient) && 
			Color.isEqual(this.specular, pMat.specular) && 
			Color.isEqual(this.emissive, pMat.emissive) && 
				this.shininess === pMat.shininess;
		}
	}
}

module akra {
	export var Material = material.Material;
}

#endif
