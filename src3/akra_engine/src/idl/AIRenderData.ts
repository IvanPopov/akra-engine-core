// AIRenderData interface
// [write description here...]

/// <reference path="AIReferenceCounter.ts" />
/// <reference path="AIEventProvider.ts" />


/// <reference path="AIRenderDataCollection.ts" />
/// <reference path="AIBufferMap.ts" />
/// <reference path="AIVertexDeclaration.ts" />
/// <reference path="AIVertexData.ts" />

enum AERenderDataTypes {
	ISOLATED = 0, /*<! положить данные в текстуру, и больше ничего не делать.*/
	INDEXED,	  /*<! обычные даннае из текстуры, доступные по индексу.*/
	I2I,		  /*<! данные по 2йному индексу.*/
	DIRECT		/*<! непосредственно данные для атрибута.*/
};

enum AERenderDataOptions {
    ADVANCED_INDEX = 65536/*1 << 0x10*/, /*<! использовать индекс на индекс упаковку данных*/
    SINGLE_INDEX   = 131072/*1 << 0x11*/,
	/*<! создать RenderData как классические данные, с данными только в аттрибутах, без использования видео буфферов.*/
    RENDERABLE	 = 262144/*1 << 0x12*/		 /*<! определяет, будет ли объект редерится*/
}

interface AIRenderDataType {
	new (): AIRenderData;
}

interface AIRenderData extends AIReferenceCounter {
	/** readonly */ buffer: AIRenderDataCollection;

	/**
	 * Allocate data for rendering.
	 */
	allocateData(pDataDecl: AIVertexElementInterface[], pData: ArrayBuffer, hasIndex?: boolean): int;
	allocateData(pDataDecl: AIVertexElementInterface[], pData: ArrayBufferView, hasIndex?: boolean): int;
	allocateData(pDataDecl: AIVertexDeclaration, pData: ArrayBuffer, hasIndex?: boolean): int;
	allocateData(pDataDecl: AIVertexDeclaration, pData: ArrayBufferView, hasIndex?: boolean): int;

	/**
	 * Remove data from this render data.
	 */
	releaseData(iDataLocation: int): void;
	
	allocateAttribute(pAttrDecl: AIVertexElementInterface[], pData: ArrayBuffer): boolean;
	allocateAttribute(pAttrDecl: AIVertexDeclaration, pData: ArrayBuffer): boolean;
	allocateAttribute(pAttrDecl: AIVertexElementInterface[], pData: ArrayBufferView): boolean;
	allocateAttribute(pAttrDecl: AIVertexDeclaration, pData: ArrayBufferView): boolean;
	
	allocateIndex(pAttrDecl: AIVertexDeclaration, pData: ArrayBuffer): boolean;
	allocateIndex(pAttrDecl: AIVertexDeclaration, pData: ArrayBufferView): boolean;
	allocateIndex(pAttrDecl: AIVertexElementInterface[], pData: ArrayBuffer): boolean;
	allocateIndex(pAttrDecl: AIVertexElementInterface[], pData: ArrayBufferView): boolean;
	
	addIndexSet(usePreviousDataSet?: boolean, ePrimType?: AEPrimitiveTypes, sName?: string): int;
	getNumIndexSet(): int;
	getIndexSetName(iSet: int): string;
	selectIndexSet(iSet: int): boolean;
	selectIndexSet(sName: string): boolean;
	getIndexSet(): int;
	findIndexSet(sName: string): int;

	/**
	 * Specifies uses advanced index.
	 */
	hasAttributes(): boolean;
	useAdvancedIndex(): boolean;
	useSingleIndex(): boolean;
	useMultiIndex(): boolean;
	
	/** mark index set as renderable */
	setRenderable(iIndexSet: int, bValue: boolean): void;
	isRenderable(iIndexSet: int): boolean;
	
	/** Mark this RenderData as renderable. */
	isRenderable(): boolean;
	setRenderable(bValue: boolean): void;

	hasSemantics(sSemantics: string, bSearchComplete?: boolean): boolean;
	
	getDataLocation(iDataLocation: int): int;
	getDataLocation(sSemantics: string): int;
	getIndexFor(sSemantics: string): ArrayBufferView;
	getIndexFor(iDataLocation: int): ArrayBufferView;
	getIndices(): AIBufferData;
	getPrimitiveCount(): uint;
	getPrimitiveType(): AEPrimitiveTypes;
	getAdvancedIndexData(sSemantics: string): AIVertexData;
	
	index(sData: string, sSemantics: string, useSame?: boolean, iBeginWith?: int, bForceUsage?: boolean): boolean;
	index(iData: int, sSemantics: string, useSame?: boolean, iBeginWith?: int, bForceUsage?: boolean): boolean;

	
	toString(): string;

	//applyMe(): boolean;

	_draw(pTechnique: AIRenderTechnique, pViewport: AIViewport, 
		  pRenderable: AIRenderableObject, pSceneObject: AISceneObject): void;
	
	_getFlow(iDataLocation: int): AIDataFlow;
	_getFlow(sSemantics: string, bSearchComplete?: boolean): AIDataFlow;

	_getData(iDataLocation: int, bSearchOnlyInCurrentMap?: boolean): AIVertexData;
	_getData(sSemanticsn: string, bSearchOnlyInCurrentMap?: boolean): AIVertexData;

	_addData(pVertexData: AIVertexData, iFlow?: int, eType?: AERenderDataTypes): int;

	_setup(pCollection: AIRenderDataCollection, iId: int, ePrimType?: AEPrimitiveTypes, eOptions?: int): boolean;

	//FIXME: hack for terrain, for force limitin drawing index length
	_setIndexLength(iLength: uint);
}
