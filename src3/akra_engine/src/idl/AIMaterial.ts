// AIMaterial interface
// [write description here...]

/// <reference path="AIVertexData.ts" />
/// <reference path="AIColorValue.ts" />

interface AIMaterialBase {
	diffuse: AIColorValue;
	ambient: AIColorValue;
	specular: AIColorValue;
	emissive: AIColorValue;
	shininess: float;
}

interface AIMaterial extends AIMaterialBase {
	name: string;

	set(pMat: AIMaterialBase): AIMaterial;
	isEqual(pMat: AIMaterialBase): boolean;
}

/** @deprecated */
interface AIFlexMaterial extends AIMaterial {
	data: AIVertexData;
}

