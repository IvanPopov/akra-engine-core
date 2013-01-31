#ifndef IBUFFERMAP_TS
#define IBUFFERMAP_TS

module akra {
	IFACE(IReferenceCounter);
	IFACE(IVertexData);
	IFACE(IDataMapper);
	IFACE(IIndexData);

	export enum EDataFlowTypes {
        MAPPABLE   = 1, /*!< The data stream can be marked up its index.*/
        UNMAPPABLE = 0  /*!< The data stream cannot be marked up its index.*/
    };

    export interface IDataFlow {
    	flow:   int;
        data:   IVertexData;
        type:   EDataFlowTypes;
        mapper: IDataMapper;
    }

    export interface IDataMapper {
    	data: IVertexData;
    	semantics: string;
    	addition: int;
    }

	export interface IBufferMap extends IReferenceCounter{
		primType: EPrimitiveTypes;
		readonly primCount: uint;
		index: IIndexData;
		readonly limit: uint;
		length: uint;
		readonly startIndex: uint;
		readonly size: uint;
		readonly flows: IDataFlow[];
		readonly mappers: IDataMapper[];
		readonly offset: uint;

		getFlow(iFlow: int, bComplete?: bool): IDataFlow;
		reset(): void;

		flow(pVertexData: IVertexData): int;
		flow(iFlow: uint, pVertexData: IVertexData): int;

		checkData(pData: IVertexData): bool;
		mapping(iFlow: int, pMap: IVertexData, sSemantics: string, iAddition?: int): bool;
		update(): bool;
		clone(bWithMapping?: bool): IBufferMap; 
		toString(): string;


	}
}

#endif
