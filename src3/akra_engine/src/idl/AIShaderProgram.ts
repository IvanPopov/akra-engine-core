// AIShaderProgram interface
// [write description here...]


/// <reference path="AIAFXSamplerState.ts" />
/// <reference path="AIVertexData.ts" />
/// <reference path="AITexture.ts" />
/// <reference path="AIMat3.ts" />
/// <reference path="AIMat4.ts" />
/// <reference path="AIVec2.ts" />
/// <reference path="AIVec3.ts" />
/// <reference path="AIVec4.ts" />
/// <reference path="AIQuat4.ts" />
/// <reference path="AIBufferMap.ts" />

interface AIShaderProgram extends AIRenderResource {
	create(csVertex?: string, csPixel?: string): boolean;
	compile(csVertex?: string, csPixel?: string): boolean;
	isLinked(): boolean;
	isValid(): boolean;
	isActive(): boolean;

	setFloat(sName: string, fValue: float): void;
	setInt(sName: string, iValue: int): void;
	
	setVec2(sName: string, v2fValue: AIVec2): void;
	// setVec2(sName: string, x: float, y: float): void;
	
	setVec2i(sName: string, v2iValue: AIVec2): void;
	// setVec2i(sName: string, x: int, y: int): void;

	setVec3(sName: string, v3fValue: AIVec3): void;
	// setVec3(sName: string, x: float, y: float, z: float): void;
	
	setVec3i(sName: string, v3iValue: AIVec3): void;
	// setVec3i(sName: string, x: int, y: int, z: int): void;

	setVec4(sName: string, v4fValue: AIVec4): void;
	// setVec4(sName: string, x: float, y: float, z: float, w: float): void;

	setVec4i(sName: string, v4iValue: AIVec4): void;
	// setVec4i(sName: string, x: int, y: int, z: int, w: int): void;

	setMat3(sName: string, m3fValue: AIMat3): void;
	setMat4(sName: string, m4fValue: AIMat4): void;

	setFloat32Array(sName: string, pValue: Float32Array): void;
	setInt32Array(sName: string, pValue: Int32Array): void;

	setVec2Array(sName: string, pValue: AIVec2[]): void;
	setVec2iArray(sName: string, pValue: AIVec2[]): void;

	setVec3Array(sName: string, pValue: AIVec3[]): void;
	setVec3iArray(sName: string, pValue: AIVec3[]): void;

	setVec4Array(sName: string, pValue: AIVec4[]): void;
	setVec4iArray(sName: string, pValue: AIVec4[]): void;

	setMat3Array(sName: string, pValue: AIMat3[]): void;
	setMat4Array(sName: string, pValue: AIMat4[]): void;

	setStruct(sName: string, pData: Object): void;
	setSampler(sName: string, pSampler: AIAFXSamplerState): void;
	setSamplerArray(sName: string, pSamplerList: AIAFXSamplerState[]): void;

	setTexture(sName: string, pData: AITexture): void;

	//applyVertexBuffer(sName: string, pBuffer: AIVertexBuffer);
	applyVertexData(sName: string, pData: AIVertexData): void;

	applyBufferMap(pMap: AIBufferMap): void;

	setVertexBuffer(sName: string, pBuffer: AIVertexBuffer): void;

	_getActiveUniformNames(): string[];
	_getActiveAttributeNames(): string[];
}
