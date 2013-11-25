

/// <reference path="IAFXSamplerState.ts" />
/// <reference path="IVertexData.ts" />
/// <reference path="ITexture.ts" />
/// <reference path="IMat3.ts" />
/// <reference path="IMat4.ts" />
/// <reference path="IVec2.ts" />
/// <reference path="IVec3.ts" />
/// <reference path="IVec4.ts" />
/// <reference path="IQuat4.ts" />
/// <reference path="IBufferMap.ts" />

module akra {
	interface IShaderProgram extends IRenderResource {
		create(csVertex?: string, csPixel?: string): boolean;
		compile(csVertex?: string, csPixel?: string): boolean;
		isLinked(): boolean;
		isValid(): boolean;
		isActive(): boolean;
	
		setFloat(sName: string, fValue: float): void;
		setInt(sName: string, iValue: int): void;
		
		setVec2(sName: string, v2fValue: IVec2): void;
		// setVec2(sName: string, x: float, y: float): void;
		
		setVec2i(sName: string, v2iValue: IVec2): void;
		// setVec2i(sName: string, x: int, y: int): void;
	
		setVec3(sName: string, v3fValue: IVec3): void;
		// setVec3(sName: string, x: float, y: float, z: float): void;
		
		setVec3i(sName: string, v3iValue: IVec3): void;
		// setVec3i(sName: string, x: int, y: int, z: int): void;
	
		setVec4(sName: string, v4fValue: IVec4): void;
		// setVec4(sName: string, x: float, y: float, z: float, w: float): void;
	
		setVec4i(sName: string, v4iValue: IVec4): void;
		// setVec4i(sName: string, x: int, y: int, z: int, w: int): void;
	
		setMat3(sName: string, m3fValue: IMat3): void;
		setMat4(sName: string, m4fValue: IMat4): void;
	
		setFloat32Array(sName: string, pValue: Float32Array): void;
		setInt32Array(sName: string, pValue: Int32Array): void;
	
		setVec2Array(sName: string, pValue: IVec2[]): void;
		setVec2iArray(sName: string, pValue: IVec2[]): void;
	
		setVec3Array(sName: string, pValue: IVec3[]): void;
		setVec3iArray(sName: string, pValue: IVec3[]): void;
	
		setVec4Array(sName: string, pValue: IVec4[]): void;
		setVec4iArray(sName: string, pValue: IVec4[]): void;
	
		setMat3Array(sName: string, pValue: IMat3[]): void;
		setMat4Array(sName: string, pValue: IMat4[]): void;
	
		setStruct(sName: string, pData: Object): void;
		setSampler(sName: string, pSampler: IAFXSamplerState): void;
		setSamplerArray(sName: string, pSamplerList: IAFXSamplerState[]): void;
	
		setTexture(sName: string, pData: ITexture): void;
	
		//applyVertexBuffer(sName: string, pBuffer: IVertexBuffer);
		applyVertexData(sName: string, pData: IVertexData): void;
	
		applyBufferMap(pMap: IBufferMap): void;
	
		setVertexBuffer(sName: string, pBuffer: IVertexBuffer): void;
	
		_getActiveUniformNames(): string[];
		_getActiveAttributeNames(): string[];
	}
	
}
