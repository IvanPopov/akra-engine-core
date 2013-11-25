
/// <reference path="IBuffer.ts" />
/// <reference path="IBufferData.ts" />
/// <reference path="IBufferDataModifier.ts" />
/// <reference path="IVertexDeclaration.ts" />
/// <reference path="IVertexBuffer.ts" />
/// <reference path="IEventProvider.ts" />

module akra {
	interface IVertexData extends IBufferData, IBuffer, IEventProvider {
		/** readonly */ stride: uint;
		/** readonly */ startIndex: uint;
		/** readonly */ id: int;
	
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
		signal relocated(from: uint, to: uint): void;
		//when data size changed
		signal resized(byteLength: uint): void;
		//when declaration changed
		declarationChanged(decl: IVertexDeclaration): void;
		//when data has been modified
		signal updated(): void;
	}
	
}
