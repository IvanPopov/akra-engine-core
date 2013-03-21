#ifndef ISHADERPROGRAM_TS
#define ISHADERPROGRAM_TS

module akra {
    
    IFACE(ISampler2d);
    IFACE(IVertexData);
    IFACE(ITexture);
    IFACE(IMat2);
    IFACE(IMat3);
    IFACE(IMat4);
    IFACE(IVec2);
    IFACE(IVec3);
    IFACE(IVec4);
    IFACE(IQuat4);
    IFACE(IBufferMap);

    export interface IShaderProgram extends IRenderResource {
    	create(csVertex?: string, csPixel?: string): bool;
    	compile(csVertex?: string, csPixel?: string): bool;
    	isLinked(): bool;
    	isValid(): bool;
    	isActive(): bool;

    	setFloat(sName: string, fValue: float): void;
    	setInt(sName: string, iValue: int): void;
    	
    	setVec2(sName: string, v2fValue: IVec2): void;
    	setVec2(sName: string, x: float, y: float): void;
    	
    	setVec2i(sName: string, v2iValue: IVec2): void;
    	setVec2i(sName: string, x: int, y: int): void;

    	setVec3(sName: string, v3fValue: IVec3): void;
    	setVec3(sName: string, x: float, y: float, z: float): void;
    	
    	setVec3i(sName: string, v3iValue: IVec3): void;
    	setVec3i(sName: string, x: int, y: int, z: int): void;

    	setVec4(sName: string, v4fValue: IVec4): void;
    	setVec4(sName: string, x: float, y: float, z: float, w: float): void;

    	setVec4i(sName: string, v4iValue: IVec4): void;
    	setVec4i(sName: string, x: int, y: int, z: int, w: int): void;
#ifdef MAT2_TS    	
    	setMat2(sName: string, m2fValue: IMat2): void;
#endif
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
#ifdef MAT2_TS      
    	setMat2Array(sName: string, pValue: IMat2[]): void;
#endif
    	setMat3Array(sName: string, pValue: IMat3[]): void;
    	setMat4Array(sName: string, pValue: IMat4[]): void;

    	setStruct(sName: string, pData: Object): void;
    	setSampler2D(sName: string, pData: ISampler2d): void;
    	setSampler2DToStruct(sName: string, pData: ISampler2d): void;

    	setTexture(sName: string, pData: ITexture): void;

    	//applyVertexBuffer(sName: string, pBuffer: IVertexBuffer);
    	applyVertexData(sName: string, pData: IVertexData): void;

        applyBufferMap(pMap: IBufferMap): void;

        _getActiveUniformNames(): string[];
        _getActiveAttributeNames(): string[];
    }
}

#endif