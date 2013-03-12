#ifndef MATERIAL_TS
#define MATERIAL_TS

#include "IMaterial.ts"
#include "data/VertexDeclaration.ts"
#include "util/Color.ts"

module akra.material {
	export class Material implements IMaterial {
		name: string = null;

		diffuse: IColor = new Color(.5);
		ambient: IColor = new Color(.5);
		specular: IColor = new Color(.5);
		emissive: IColor = new Color(.5);
		shininess: float = 50.;

		constructor (sName: string = null, pMat?: IMaterial) {
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

			return this;
		}

		isEqual(pMat: IMaterialBase): bool {
			return Color.isEqual(this.diffuse, pMat.diffuse) && 
			Color.isEqual(this.ambient, pMat.ambient) && 
			Color.isEqual(this.specular, pMat.specular) && 
			Color.isEqual(this.emissive, pMat.emissive) && 
				this.shininess === pMat.shininess;
		}
	}

	class FlexMaterial implements IFlexMaterial {
		name: string = null;

		protected _pData: IVertexData;

		inline get diffuse(): IColorValue { return new Color(this._pData.getTypedData(DeclUsages.DIFFUSE, 0, 1)); }
		inline get ambient(): IColorValue { return new Color(this._pData.getTypedData(DeclUsages.AMBIENT, 0, 1)); }
		inline get specular(): IColorValue { return new Color(this._pData.getTypedData(DeclUsages.SPECULAR, 0, 1)); }
		inline get emissive(): IColorValue { return new Color(this._pData.getTypedData(DeclUsages.EMISSIVE, 0, 1)); }
		inline get shininess(): float { return this._pData.getTypedData(DeclUsages.SHININESS, 0, 1)[0]; }

		inline set diffuse(pValue: IColorValue) { this._pData.setData(Color.toFloat32Array(pValue), DeclUsages.DIFFUSE); }
		inline set ambient(pValue: IColorValue) { this._pData.setData(Color.toFloat32Array(pValue), DeclUsages.AMBIENT); }
		inline set specular(pValue: IColorValue) { this._pData.setData(Color.toFloat32Array(pValue), DeclUsages.SPECULAR); }
		inline set emissive(pValue: IColorValue) { this._pData.setData(Color.toFloat32Array(pValue), DeclUsages.EMISSIVE); }
		inline set shininess(pValue: float) { this._pData.setData(new Float32Array([pValue]), DeclUsages.SHININESS); }

		inline get data(): IVertexData { return this._pData; }

		constructor (sName: string, pData: IVertexData) {
			this._pData = pData;
			this.name = sName;
		}

		set(pMat: IMaterial): IMaterial {
			//this.name = 
			
			this.diffuse = pMat.diffuse;
			this.ambient = pMat.ambient;
			this.specular = pMat.specular;
			this.emissive = pMat.emissive;
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

	export const VERTEX_DECL: IVertexDeclaration = createVertexDeclaration(
		[
            {count: 17, type: EDataTypes.FLOAT, usage: DeclUsages.MATERIAL 	},
            {count: 4, 	type: EDataTypes.FLOAT, usage: DeclUsages.DIFFUSE, offset: 0},
            {count: 4, 	type: EDataTypes.FLOAT, usage: DeclUsages.AMBIENT 	},
            {count: 4, 	type: EDataTypes.FLOAT, usage: DeclUsages.SPECULAR 	},
            {count: 4, 	type: EDataTypes.FLOAT, usage: DeclUsages.EMISSIVE	},
            {count: 1, 	type: EDataTypes.FLOAT, usage: DeclUsages.SHININESS }
        ]);

	export const DEFAULT: IMaterial = new Material;

	export function create(sName: string = null, pMat: IMaterial = null): IMaterial {
		return new Material(sName, pMat);
	}

	export function _createFlex(sName: string, pData: IVertexData): IMaterial {
		return new FlexMaterial(sName, pData);
	}
}

module akra {
	export var Material = material.Material;
}

#endif
