/// <reference path="Material.ts" />           
/// <reference path="../data/VertexDeclaration.ts" /> 
/// <reference path="../data/Usage.ts" /> 

module akra.material {
	import VE = data.VertexElement;
	import VertexDeclaration = data.VertexDeclaration;
	import Usage = data.Usages;

	/** @const */
	export var VERTEX_DECL: IVertexDeclaration = VertexDeclaration.normalize(
		[
			VE.custom(Usage.MATERIAL, EDataTypes.FLOAT, 17),
			VE.custom(Usage.DIFFUSE, EDataTypes.FLOAT, 4, 0),
			VE.custom(Usage.AMBIENT, EDataTypes.FLOAT, 4, 16),
			VE.custom(Usage.SPECULAR, EDataTypes.FLOAT, 4, 32),
			VE.custom(Usage.EMISSIVE, EDataTypes.FLOAT, 4, 48),
			VE.custom(Usage.SHININESS, EDataTypes.FLOAT, 1, 64)
		]);


	export function create(sName: string = null, pMat: IMaterialBase = null): IMaterial {
		return new Material(sName, pMat);
	}
}
