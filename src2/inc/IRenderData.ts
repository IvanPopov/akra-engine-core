#ifndef IRENDERDATA_TS
#define IRENDERDATA_TS

#include "IReferenceCounter.ts"
#include "IEventProvider.ts"

module akra {
    IFACE(IRenderDataCollection);
    IFACE(IDataFlow);
    IFACE(IVertexDeclaration);
    IFACE(IVertexData);

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
		readonly buffer: IRenderDataCollection;

        /**
         * Allocate data for rendering.
         */
        allocateData(pDataDecl: IVertexElementInterface[], pData: ArrayBuffer, hasIndex?: bool): int;
        allocateData(pDataDecl: IVertexElementInterface[], pData: ArrayBufferView, hasIndex?: bool): int;
        allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBuffer, hasIndex?: bool): int;
        allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBufferView, hasIndex?: bool): int;

        /**
         * Remove data from this render data.
         */
        releaseData(iDataLocation: int): void;
        
        allocateAttribute(pAttrDecl: IVertexDeclaration, pData: ArrayBuffer): bool;
        allocateAttribute(pAttrDecl: IVertexDeclaration, pData: ArrayBufferView): bool;
        
        allocateIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBuffer): bool;
        allocateIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBufferView): bool;
        allocateIndex(pAttrDecl: IVertexElementInterface[], pData: ArrayBuffer): bool;
        allocateIndex(pAttrDecl: IVertexElementInterface[], pData: ArrayBufferView): bool;
        
        addIndexSet(usePreviousDataSet?: bool, ePrimType?: EPrimitiveTypes, sName?: string): int;
        getNumIndexSet(): int;
        getIndexSetName(iSet: int): string;
        selectIndexSet(iSet: int): bool;
        selectIndexSet(sName: string): bool;
        getIndexSet(): int;

        /**
         * Specifies uses advanced index.
         */
        hasAttributes(): bool;
        useAdvancedIndex(): bool;
        useSingleIndex(): bool;
        useMultiIndex(): bool;
        
        /** mark index set as renderable */
        setRenderable(iIndexSet: int, bValue: bool): void;
        isRenderable(iIndexSet: int): bool;
        
        /** Mark this RenderData as renderable. */
        isRenderable(): bool;
        setRenderable(bValue: bool): void;

        hasSemantics(sSemantics: string, bSearchComplete?: bool): bool;
        
        getDataLocation(iDataLocation: int): int;
        getDataLocation(sSemantics: string): int;
        getIndices(): IBufferData;
        getPrimitiveCount(): uint;
        getAdvancedIndexData(sSemantics: string): IVertexData;
        
        index(sData: string, sSemantics: string, useSame?: bool, iBeginWith?: int): bool;
        index(iData: int, sSemantics: string, useSame?: bool, iBeginWith?: int): bool;

        
        toString(): string;

        //applyMe(): bool;

        _draw(): void;
        
        _getFlow(iDataLocation: int): IDataFlow;
        _getFlow(sSemantics: string, bSearchComplete?: bool): IDataFlow;

        _getData(iDataLocation: int, bSearchOnlyInCurrentMap?: bool): IVertexData;
        _getData(sSemanticsn: string, bSearchOnlyInCurrentMap?: bool): IVertexData;

        _addData(pVertexData: IVertexData, iFlow?: int, eType?: ERenderDataTypes): int;

        _setup(pCollection: IRenderDataCollection, iId: int, ePrimType?: EPrimitiveTypes, eOptions?: int): bool;

        //FIXME: hack for terrain, for force limitin drawing index length
        _setIndexLength(iLength: uint);
	}
}

#endif
