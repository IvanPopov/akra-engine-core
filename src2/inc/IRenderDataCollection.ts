#ifndef IRENDERDATACOLLECTION_TS
#define IRENDERDATACOLLECTION_TS

#include "IRenderData.ts"

module akra {
    IFACE(IVertexBuffer);
    IFACE(IVertexDeclaration);
    IFACE(IRenderDataType);
    
	export enum ERenderDataBufferOptions {
        VB_READABLE       = FLAG(EHardwareBufferFlags.BACKUP_COPY),
        RD_ADVANCED_INDEX = <int>ERenderDataOptions.ADVANCED_INDEX,
        RD_SINGLE_INDEX   = <int>ERenderDataOptions.SINGLE_INDEX,
        RD_RENDERABLE     = <int>ERenderDataOptions.RENDERABLE
    };

    // export interface IRenderDataType {
    //     new (): IRenderData;
    // }

	export interface IRenderDataCollection extends IHardwareBuffer, IResourcePoolItem{
		readonly buffer: IVertexBuffer;
        dataType: IRenderDataType;

        getEngine(): IEngine;
        getOptions(): int;
        getData(): IVertexData;
        allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBufferView, isCommon?: bool): int;
        getDataLocation(sSemantics: string): int;
        getRenderData(iSubset: uint): IRenderData;
        getEmptyRenderData(ePrimType: EPrimitiveTypes, iOptions: int): IRenderData;
        draw(iSubset: uint): bool;
        destroy(): void;

        _setup(eOptions: int): void;
        _allocateData(pVertexDecl: IVertexDeclaration, pData: ArrayBufferView): IVertexData;
	}
}

#endif
