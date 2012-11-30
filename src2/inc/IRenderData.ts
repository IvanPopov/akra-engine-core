#ifndef IRENDERDATA_TS
#define IRENDERDATA_TS

module akra {
    IFACE(IVertexBuffer);
	export enum ERenderDataTypes {
        ISOLATED = 0, /*<! положить данные в текстуру, и больше ничего не делать.*/
        INDEXED,      /*<! обычные даннае из текстуры, доступные по индексу.*/
        I2I,          /*<! данные по 2йному индексу.*/
        DIRECT        /*<! непосредственно данные для атрибута.*/
    };

    export enum ERenderDataOptions {
        ADVANCED_INDEX = FLAG(0x10), /*<! использовать индекс на индекс упаковку данных*/
        SINGLE_INDEX   = FLAG(0x11),
        /*<! создать RenderData как классические данные, с данными только в аттрибутах, без использования видео буфферов.*/
        RENDERABLE     = FLAG(0x12)         /*<! определяет, будет ли объект редерится*/
    }

    export interface IRenderDataType {
        new (): IRenderData;
    }

	export interface IRenderData extends IReferenceCounter {
		readonly buffer: IVertexBuffer;

        renderable(bValue: bool): void;
        isRenderable(): bool;
        allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBuffer, hasIndex: bool): int;
        allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBufferView, hasIndex: bool): int;
        useAdvancedIndex(): bool;
        useSingleIndex(): bool;
        useMultiIndex(): bool;
        releaseData(iDataLocation: int): void;
        allocateAttribute(pAttrDecl: IVertexDeclaration, pData: ArrayBuffer): bool;
        allocateAttribute(pAttrDecl: IVertexDeclaration, pData: ArrayBufferView): bool;
        allocateIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBuffer): bool;
        allocateIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBufferView): bool;
        addIndexSet(usePreviousDataSet: bool, ePrimType:EPrimitiveTypes, sName: string): int;
        addIndexSet(ePrimType:EPrimitiveTypes, sName: string): int;
        getNumIndexSet(): int;
        getIndexSetName(iSet: int): string;
        selectIndexSet(iSet: int): bool;
        getIndexSet(): int;
        setRenderable(): bool;
        setRenderable(iIndexSet: int, bValue: bool): bool;
        isRenderable(iIndexSet?: int): bool;
        hasSemantics(sSemantics: string, bSearchComplete: bool): bool;
        getDataLocation(sSemantics: string): int;
        getIndices(): IBufferData;
        getFlow(): IDataFlow;
        getData(): IVertexData;
        getPrimitiveCount(): uint;
        index(iData: int, sSemantics: string, useSame?: bool, iBeginWith?: int): bool;
        draw(): bool;
        //applyMe(): bool;
        toString(): string;



        "string"


	}
}

#endif
