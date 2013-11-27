// AIVertexData interface
// [write description here...]

/// <reference path="AIBuffer.ts" />
/// <reference path="AIBufferData.ts" />
/// <reference path="AIBufferDataModifier.ts" />
/// <reference path="AIVertexDeclaration.ts" />
/// <reference path="AIVertexBuffer.ts" />
/// <reference path="AIEventProvider.ts" />

interface AIVertexData extends AIBufferData, AIBuffer, AIEventProvider {
	/** readonly */ stride: uint;
	/** readonly */ startIndex: uint;
	/** readonly */ id: int;

    getVertexDeclaration(): AIVertexDeclaration;
	setVertexDeclaration(pDecl: AIVertexDeclaration): boolean;
	
	getVertexElementCount(): uint;
	hasSemantics(sSemantics: string): boolean;

	destroy(): void;

	extend(pDecl: AIVertexDeclaration, pData?: ArrayBufferView): boolean;
	resize(nCount: uint, pDecl?: AIVertexDeclaration): boolean;
	resize(nCount: uint, iStride?: uint): boolean;
	applyModifier(sUsage: string, fnModifier: AIBufferDataModifier): boolean;

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
	declarationChanged(decl: AIVertexDeclaration): void;
	//when data has been modified
	signal updated(): void;
}
