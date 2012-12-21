#ifndef IRENDERDATACOLLECTION_TS
#define IRENDERDATACOLLECTION_TS

module akra {
    IFACE(IVertexBuffer);
    IFACE(IVertexDeclaration);
    
	export enum ERenderDataBufferOptions {
        VB_READABLE       = FLAG(EHardwareBufferFlags.BACKUP_COPY),
        RD_ADVANCED_INDEX = ERenderDataOptions.ADVANCED_INDEX,
        RD_SINGLE_INDEX   = ERenderDataOptions.SINGLE_INDEX,
        RD_RENDERABLE     = ERenderDataOptions.RENDERABLE
    };

    export interface IRenderDataType {
        new (): IRenderData;
    }

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
	}
}

#endif
