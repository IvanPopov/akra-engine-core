
/// <reference path="IReferenceCounter.ts" />
/// <reference path="IEventProvider.ts" />
/// <reference path="IVertexData.ts" />
/// <reference path="IIndexData.ts" />

module akra {
	enum EDataFlowTypes {
		MAPPABLE   = 1, /*!< The data stream can be marked up its index.*/
		UNMAPPABLE = 0  /*!< The data stream cannot be marked up its index.*/
	};
	
	interface IDataFlow {
		flow:   int;
		data:   IVertexData;
		type:   EDataFlowTypes;
		mapper: IDataMapper;
	}
	
	interface IDataMapper {
		data: IVertexData;
		semantics: string;
		addition: int;
	}
	
	interface IBufferMap extends IReferenceCounter, IEventProvider {
		primType: EPrimitiveTypes;
		index: IIndexData;
		length: uint;
	
		//FIXME: hack for terraing, for force limiting length of drawinf index.
		/** writeonly */ _length: uint;
		
		/** readonly */ totalUpdates: uint;
	
		/** Number of primitives. */
		/** readonly */ primCount: uint;
		/** Maximum flow available in buffer map. */
		/** readonly */ limit: uint;
		/** Start index for drawning. */
		/** readonly */ startIndex: uint;
		/** Number of completed flows. */
		/** readonly */ size: uint;
		/** Completed flows. */
		/** readonly */ flows: IDataFlow[];
		/** 
		 * Mappers. 
		 * @private
		 */
		/** readonly */ mappers: IDataMapper[];
		/** 
		 * Offset in bytes for drawing with global idnex. 
		 * @deprecated
		 */
		/** readonly */ offset: uint;
	
		/**
		 * Find flow by semantics in.
		 * @param sSemantics VertexElement usage or semantics.
		 * @param {boolean=} bComplete Find only in completed flows. Default is TRUE.
		 */
		getFlow(sSemantics: string, bComplete?: boolean): IDataFlow;
	    getFlow(iFlow: int, bComplete?: boolean): IDataFlow;
	    getFlowBySemantic(sSemantics: string): IDataFlow;
	
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
		mapping(iFlow: int, pMap: IVertexData, sSemantics: string, iAddition?: int): boolean;
	
		/**
		 * Check, Is pData already used as flow or mapper.
		 */
		checkData(pData: IVertexData): boolean;
	
		/**
		 * Recals all statistics in buffer map.
		 */
		update(): boolean;
	
		clone(bWithMapping?: boolean): IBufferMap; 
	
		/**
		 * Draw buffer map.
		 */
		_draw(): void;
		
		toString(bListAll?: boolean): string;
	
		//some data, such as VertexTexture or VertexBuffer have been modified.
		signal modified(): void;
	}
	
}
