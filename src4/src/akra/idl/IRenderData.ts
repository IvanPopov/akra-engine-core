
/// <reference path="IReferenceCounter.ts" />
/// <reference path="IEventProvider.ts" />


/// <reference path="IRenderDataCollection.ts" />
/// <reference path="IBufferMap.ts" />
/// <reference path="IVertexDeclaration.ts" />
/// <reference path="IVertexData.ts" />

module akra {
	export enum ERenderDataAttributeTypes {
		STATIC = 0,
		DYNAMIC
	};

	export enum ERenderDataTypes {
		ISOLATED = 0, /*<! положить данные в текстуру, и больше ничего не делать.*/
		INDEXED,	  /*<! обычные даннае из текстуры, доступные по индексу.*/
		I2I,		  /*<! данные по 2йному индексу.*/
		DIRECT		/*<! непосредственно данные для атрибута.*/
	};
	
	export enum ERenderDataOptions {
	    ADVANCED_INDEX = 65536/*1 << 0x10*/, /*<! использовать индекс на индекс упаковку данных*/
	    SINGLE_INDEX   = 131072/*1 << 0x11*/,
		/*<! создать RenderData как классические данные, с данными только в аттрибутах, без использования видео буфферов.*/
	    RENDERABLE	 = 262144/*1 << 0x12*/		 /*<! определяет, будет ли объект редерится*/
	}
	
	export interface IRenderDataType {
		new (): IRenderData;
	}
	
	export interface IRenderData extends IReferenceCounter {
		getBuffer(): IRenderDataCollection;

		/**
		 * Allocate data for rendering.
		 */
		allocateData(pDataDecl: IVertexElementInterface[], pData: ArrayBuffer, hasIndex?: boolean): int;
		allocateData(pDataDecl: IVertexElementInterface[], pData: ArrayBufferView, hasIndex?: boolean): int;
		allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBuffer, hasIndex?: boolean): int;
		allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBufferView, hasIndex?: boolean): int;

		/**
		 * Remove data from this render data.
		 */
		releaseData(iDataLocation: int): void;

		allocateAttribute(pAttrDecl: IVertexElementInterface[], pData: ArrayBuffer, eType?: ERenderDataAttributeTypes): boolean;
		allocateAttribute(pAttrDecl: IVertexDeclaration, pData: ArrayBuffer, eType?: ERenderDataAttributeTypes): boolean;
		allocateAttribute(pAttrDecl: IVertexElementInterface[], pData: ArrayBufferView, eType?: ERenderDataAttributeTypes): boolean;
		allocateAttribute(pAttrDecl: IVertexDeclaration, pData: ArrayBufferView, eType?: ERenderDataAttributeTypes): boolean;

		allocateIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBuffer): boolean;
		allocateIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBufferView): boolean;
		allocateIndex(pAttrDecl: IVertexElementInterface[], pData: ArrayBuffer): boolean;
		allocateIndex(pAttrDecl: IVertexElementInterface[], pData: ArrayBufferView): boolean;

		addIndexSet(usePreviousDataSet?: boolean, ePrimType?: EPrimitiveTypes, sName?: string): int;
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
		getIndices(): IBufferData;
		getPrimitiveCount(): uint;
		getPrimitiveType(): EPrimitiveTypes;
		getAdvancedIndexData(sSemantics: string): IVertexData;

		index(sData: string, sSemantics: string, useSame?: boolean, iBeginWith?: int, bForceUsage?: boolean): boolean;
		index(iData: int, sSemantics: string, useSame?: boolean, iBeginWith?: int, bForceUsage?: boolean): boolean;


		toString(): string;

		//applyMe(): boolean;

		_draw(pTechnique: IRenderTechnique, pViewport: IViewport,
			pRenderable: IRenderableObject, pSceneObject: ISceneObject): void;

		_getFlow(iDataLocation: int): IDataFlow;
		_getFlow(sSemantics: string, bSearchComplete?: boolean): IDataFlow;

		_getData(iDataLocation: int, bSearchOnlyInCurrentMap?: boolean): IVertexData;
		_getData(sSemanticsn: string, bSearchOnlyInCurrentMap?: boolean): IVertexData;

		_addData(pVertexData: IVertexData, iFlow?: int, eType?: ERenderDataTypes): int;

		_setup(pCollection: IRenderDataCollection, iId: int, ePrimType?: EPrimitiveTypes, eOptions?: int): boolean;

		//FIXME: hack for terrain, for force limitin drawing index length
		_setIndexLength(iLength: uint);

		_getComposer(): IAFXComposer;
	}
	
}
