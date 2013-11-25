
/// <reference path="AIUnique.ts" />
/// <reference path="IAFXInstruction.ts" />
/// <reference path="IAFXMaker.ts" />
/// <reference path="IAFXPassInputBlend.ts" />
/// <reference path="ISurfaceMaterial.ts" />
/// <reference path="IBufferMap.ts" />


module akra {
	interface IAFXPassBlendMap {
		[index: uint]: IAFXPassBlend;
		[index: string]: IAFXPassBlend;
	}
	
	interface IAFXPassBlend extends AIUnique {
		initFromPassList(pPassList: IAFXPassInstruction[]): boolean;
		generateFXMaker(pPassInput: IAFXPassInputBlend,
						pSurfaceMaterial: ISurfaceMaterial,
						pBuffer: IBufferMap): IAFXMaker;
		
		_hasUniformWithName(sName: string): boolean;
		_hasUniformWithNameIndex(iNameIndex: uint): boolean;
		_getRenderStates(): IMap<ERenderStateValues>;
	}
	
	
}
