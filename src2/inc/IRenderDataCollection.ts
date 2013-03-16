#ifndef IRENDERDATACOLLECTION_TS
#define IRENDERDATACOLLECTION_TS

#include "IRenderData.ts"
#include "IBuffer.ts"

module akra {
    IFACE(IVertexBuffer);
    IFACE(IVertexDeclaration);
    IFACE(IRenderDataType);
    IFACE(IBuffer);
    IFACE(IReferenceCounter);
    
	export enum ERenderDataBufferOptions {
        VB_READABLE       = FLAG(EHardwareBufferFlags.BACKUP_COPY),
        RD_ADVANCED_INDEX = <int>ERenderDataOptions.ADVANCED_INDEX,
        RD_SINGLE_INDEX   = <int>ERenderDataOptions.SINGLE_INDEX,
        RD_RENDERABLE     = <int>ERenderDataOptions.RENDERABLE
    };

    // export interface IRenderDataType {
    //     new (): IRenderData;
    // }

	export interface IRenderDataCollection extends /*IHardwareBuffer*/IBuffer, IReferenceCounter {
		readonly buffer: IVertexBuffer;
        readonly byteLength: uint;
        readonly length: uint;

        getEngine(): IEngine;
        getOptions(): int;

        getData(sUsage: string): IVertexData;
        getData(iOffset: uint): IVertexData;
        getRenderData(iSubset: uint): IRenderData;
        getEmptyRenderData(ePrimType: EPrimitiveTypes, eOptions: ERenderDataBufferOptions): IRenderData;
        getDataLocation(sSemantics: string): int;
        
        allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBufferView, isCommon?: bool): int;
        allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBuffer, isCommon?: bool): int;
        allocateData(pDeclData: IVertexElementInterface[], pData: ArrayBufferView, isCommon?: bool): int;
        allocateData(pDeclData: IVertexElementInterface[], pData: ArrayBuffer, isCommon?: bool): int;
        
        destroy(): void;
        
        _draw(): void;
        _draw(iSubset: uint): void;

        // _setup(eOptions?: int): void;
        
        _allocateData(pVertexDecl: IVertexDeclaration, iSize: uint): IVertexData;
        _allocateData(pVertexDecl: IVertexDeclaration, pData: ArrayBufferView): IVertexData;
        _allocateData(pVertexDecl: IVertexDeclaration, pData: ArrayBuffer): IVertexData;
        _allocateData(pDeclData: IVertexElementInterface[], iSize: uint): IVertexData;
        _allocateData(pDeclData: IVertexElementInterface[], pData: ArrayBufferView): IVertexData;
        _allocateData(pDeclData: IVertexElementInterface[], pData: ArrayBuffer): IVertexData;
	}
}

#endif
