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
		index: IIndexData;
		length: uint;

		//FIXME: hack for terraing, for force limiting length of drawinf index.
		/** writeonly */ _length: uint;
		
		/** Number of primitives. */
		readonly primCount: uint;
		/** Maximum flow available in buffer map. */
		readonly limit: uint;
		/** Start index for drawning. */
		readonly startIndex: uint;
		/** Number of completed flows. */
		readonly size: uint;
		/** Completed flows. */
		readonly flows: IDataFlow[];
		/** 
		 * Mappers. 
		 * @private
		 */
		readonly mappers: IDataMapper[];
		/** 
		 * Offset in bytes for drawing with global idnex. 
		 * @deprecated
		 */
		readonly offset: uint;

		/**
		 * Find flow by semantics in.
		 * @param sSemantics VertexElement usage or semantics.
		 * @param {bool=} bComplete Find only in completed flows. Default is TRUE.
		 */
		getFlow(sSemantics: string, bComplete?: bool): IDataFlow;
		getFlow(iFlow: int, bComplete?: bool): IDataFlow;

		findFlow(sSemantics: string): IDataFlow;

		reset(): void;

		/**
		 * Add data to flow.
		 */
		flow(pVertexData: IVertexData): int;
		flow(iFlow: uint, pVertexData: IVertexData): int;
		/**
		 * Add index for flow.
		 */
		mapping(iFlow: int, pMap: IVertexData, sSemantics: string, iAddition?: int): bool;

		/**
		 * Check, Is pData already used as flow or mapper.
		 */
		checkData(pData: IVertexData): bool;

		/**
		 * Recals all statistics in buffer map.
		 */
		update(): bool;

		clone(bWithMapping?: bool): IBufferMap; 

		/**
		 * Draw buffer map.
		 */
		_draw(): void;
		
		toString(bListAll?: bool): string;
	}
}

#endif
