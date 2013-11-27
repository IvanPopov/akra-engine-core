
/// <reference path="IResourcePoolItem.ts" />
/// <reference path="IAFXInstruction.ts" />


module akra {
	export interface IAFXComponentMap {
		[index: uint]: IAFXComponent;
		[index: string]: IAFXComponent;
	}
	
	export interface IAFXComponent extends IResourcePoolItem {
		create(): void;
	
		getTechnique(): IAFXTechniqueInstruction;
		setTechnique(pTechnique: IAFXTechniqueInstruction): void;
	
		isPostEffect(): boolean;
	
		getName(): string;
		getTotalPasses(): uint;
		getHash(iShift: int, iPass: uint): string;
	
	}
	
	
	
}
