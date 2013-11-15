// AIBufferMap interface
// [write description here...]

/// <reference path="AIReferenceCounter.ts" />
/// <reference path="AIEventProvider.ts" />
/// <reference path="AIVertexData.ts" />
/// <reference path="AIIndexData.ts" />

enum AEDataFlowTypes {
	MAPPABLE   = 1, /*!< The data stream can be marked up its index.*/
	UNMAPPABLE = 0  /*!< The data stream cannot be marked up its index.*/
};

interface AIDataFlow {
	flow:   int;
	data:   AIVertexData;
	type:   AEDataFlowTypes;
	mapper: AIDataMapper;
}

interface AIDataMapper {
	data: AIVertexData;
	semantics: string;
	addition: int;
}

interface AIBufferMap extends AIReferenceCounter, AIEventProvider {
	primType: AEPrimitiveTypes;
	index: AIIndexData;
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
	/** readonly */ flows: AIDataFlow[];
	/** 
	 * Mappers. 
	 * @private
	 */
	/** readonly */ mappers: AIDataMapper[];
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
	getFlow(sSemantics: string, bComplete?: boolean): AIDataFlow;
	getFlow(iFlow: int, bComplete?: boolean): AIDataFlow;

	findFlow(sSemantics: string): AIDataFlow;

	reset(): void;

	/**
	 * Add data to flow.
	 */
	flow(pVertexData: AIVertexData): int;
	flow(iFlow: uint, pVertexData: AIVertexData): int;
	/**
	 * Add index for flow.
	 */
	mapping(iFlow: int, pMap: AIVertexData, sSemantics: string, iAddition?: int): boolean;

	/**
	 * Check, Is pData already used as flow or mapper.
	 */
	checkData(pData: AIVertexData): boolean;

	/**
	 * Recals all statistics in buffer map.
	 */
	update(): boolean;

	clone(bWithMapping?: boolean): AIBufferMap; 

	/**
	 * Draw buffer map.
	 */
	_draw(): void;
	
	toString(bListAll?: boolean): string;

	//some data, such as VertexTexture or VertexBuffer have been modified.
	signal modified(): void;
}
