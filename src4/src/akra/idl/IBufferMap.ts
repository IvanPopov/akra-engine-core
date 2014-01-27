/// <reference path="EPrimitiveTypes.ts" />
/// <reference path="IReferenceCounter.ts" />
/// <reference path="IEventProvider.ts" />
/// <reference path="IVertexData.ts" />
/// <reference path="IIndexData.ts" />

module akra {
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
	
	export interface IBufferMap extends IReferenceCounter, IEventProvider {
		getPrimType(): EPrimitiveTypes;
		setPrimType(eType: EPrimitiveTypes): void;

		getIndex(): IIndexData;
		setIndex(pIndex: IIndexData): void;

		getLength(): uint;
		setLength(iLength: uint): void;
		//FIXME: hack for terraing, for force limiting length of drawinf index.
		_setLengthForce(iLength: uint): void;

		getTotalUpdates(): uint;
		/** Number of primitives. */
		getPrimCount(): uint;
		/** Maximum flow available in buffer map. */
		getLimit(): uint;
		/** Start index for drawning. */
		getStartIndex(): uint;
		/** Number of completed flows. */
		getSize(): uint;
		/** Completed flows. */
		getFlows(): IDataFlow[];
		/** 
		 * Mappers. 
		 * @private
		 */
		getMappers(): IDataMapper[];
		/** 
		 * Offset in bytes for drawing with global idnex. 
		 * @deprecated
		 */
		getOffset(): uint;

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
		modified: ISignal<{ (pMap: IBufferMap): void; }>;
	}
	
}
