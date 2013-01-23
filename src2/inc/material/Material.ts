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
			//this.name = pMat.name;

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

	export class FlexMaterial implements IMaterial {
		name: string = null;

		protected _pData: IVertexData;

		inline get diffuse(): IColor { return new Color(this._pData.getTypedData(DeclUsages.DIFFUSE, 0, 1)); }
		inline get ambient(): IColor { return new Color(tthis._pData.getTypedData(DeclUsages.AMBIENT, 0, 1)); }
		inline get specular(): IColor { return new Color(tthis._pData.getTypedData(DeclUsages.SPECULAR, 0, 1)); }
		inline get emissive(): IColor { return new Color(tthis._pData.getTypedData(DeclUsages.EMISSIVE, 0, 1)); }
		inline get shininess(): IColor { return new Color(tthis._pData.getTypedData(DeclUsages.SHININESS, 0, 1)); }

		inline set diffuse(pValue: IColor) { this._pData.setData(pValue.toFloat32Array(), DeclUsages.DIFFUSE); }
		inline set ambient(pValue: IColor) { this._pData.setData(pValue.toFloat32Array(), DeclUsages.AMBIENT); }
		inline set specular(pValue: IColor) { this._pData.setData(pValue.toFloat32Array(), DeclUsages.SPECULAR); }
		inline set emissive(pValue: IColor) { this._pData.setData(pValue.toFloat32Array(), DeclUsages.EMISSIVE); }
		inline set shininess(pValue: IColor) { this._pData.setData(pValue.toFloat32Array(), DeclUsages.SHININESS); }

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
	}

	export const VERTEX_DECL: IVertexDeclaration = new VertexDeclaration(
		[
            {nCount: 17, 	eType: EDataTypes.FLOAT, eUsage: DeclUsages.MATERIAL 	},
            {nCount: 4, 	eType: EDataTypes.FLOAT, eUsage: DeclUsages.DIFFUSE, iOffset: 0},
            {nCount: 4, 	eType: EDataTypes.FLOAT, eUsage: DeclUsages.AMBIENT 	},
            {nCount: 4, 	eType: EDataTypes.FLOAT, eUsage: DeclUsages.SPECULAR 	},
            {nCount: 4, 	eType: EDataTypes.FLOAT, eUsage: DeclUsages.MISSIVE		},
            {nCount: 1, 	eType: EDataTypes.FLOAT, eUsage: DeclUsages.SHININESS 	}
        ]);

	export const DEFAULT: IMaterial = new Material;
}

module akra {
	export var Material = material.Material;
}

#endif
