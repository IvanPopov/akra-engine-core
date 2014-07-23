
/// <reference path="IBuffer.ts" />
/// <reference path="IBufferData.ts" />
/// <reference path="IBufferDataModifier.ts" />
/// <reference path="IVertexDeclaration.ts" />
/// <reference path="IVertexBuffer.ts" />
/// <reference path="IEventProvider.ts" />

module akra {
	export interface IVertexData extends IBufferData, IBuffer, IEventProvider {
		getStride(): uint;
		getStartIndex(): uint;
		getID(): int;
	
		getVertexDeclaration(): IVertexDeclaration;
		setVertexDeclaration(pDecl: IVertexDeclaration): boolean;
		
		getVertexElementCount(): uint;
		hasSemantics(sSemantics: string): boolean;
	
		destroy(): void;
	
		extend(pDecl: IVertexDeclaration, pData?: ArrayBufferView): boolean;
		resize(nCount: uint, pDecl?: IVertexDeclaration): boolean;
		resize(nCount: uint, iStride?: uint): boolean;
		applyModifier(sUsage: string, fnModifier: IBufferDataModifier): boolean;
	
		setData(pData: ArrayBufferView, iOffset: int, iSize?: uint, nCountStart?: uint, nCount?: uint): boolean;
		setData(pData: ArrayBufferView, sUsage?: string, iSize?: uint, nCountStart?: uint, nCount?: uint): boolean;
	
		getData(): ArrayBuffer;
		getData(iOffset: int, iSize: uint, iFrom?: uint, iCount?: uint): ArrayBuffer;
		getData(sUsage: string): ArrayBuffer;
		getData(sUsage: string, iFrom: uint, iCount: uint): ArrayBuffer;
	
		getTypedData(sUsage: string, iFrom?: int, iCount?: uint): ArrayBufferView;
		getBufferHandle(): int;
		
		toString(): string;
	
		//when data moved in memory(in parent Hardware Buffer)
		relocated: ISignal<{ (pData: IVertexData, from: uint, to: uint): void; }>;
		//when data size changed
		resized: ISignal<{ (pData: IVertexData, iByteLength: uint): void; }>;
		//when declaration changed
		declarationChanged: ISignal<{ (pData: IVertexData, pDecl: IVertexDeclaration): void; }>;
		//when data has been modified
		updated: ISignal<{ (pData: IVertexData): void; }>;
	}
	
}
