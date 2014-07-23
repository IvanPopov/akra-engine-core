
/// <reference path="IUnique.ts" />
/// <reference path="IAFXInstruction.ts" />
/// <reference path="IAFXMaker.ts" />
/// <reference path="IAFXPassInputBlend.ts" />
/// <reference path="ISurfaceMaterial.ts" />
/// <reference path="IBufferMap.ts" />


module akra {
	/** @deprecated Use IMap<IAFXPassBlend> instead. */
	export interface IAFXPassBlendMap {
		[index: uint]: IAFXPassBlend;
		//[index: string]: IAFXPassBlend;
	}
	
	export interface IAFXPassBlend extends IUnique {
		initFromPassList(pPassList: IAFXPassInstruction[]): boolean;
		generateFXMaker(pPassInput: IAFXPassInputBlend,
						pSurfaceMaterial: ISurfaceMaterial,
						pBuffer: IBufferMap): IAFXMaker;
		
		_hasUniformWithName(sName: string): boolean;
		_hasUniformWithNameIndex(iNameIndex: uint): boolean;
		_getRenderStates(): IMap<ERenderStateValues>;
	}
	
	
}
