
/// <reference path="IResourcePoolItem.ts" />
/// <reference path="IAFXInstruction.ts" />


module akra {
	interface IAFXComponentMap {
		[index: uint]: IAFXComponent;
		[index: string]: IAFXComponent;
	}
	
	interface IAFXComponent extends IResourcePoolItem {
		create(): void;
	
		getTechnique(): IAFXTechniqueInstruction;
		setTechnique(pTechnique: IAFXTechniqueInstruction): void;
	
		isPostEffect(): boolean;
	
		getName(): string;
		getTotalPasses(): uint;
		getHash(iShift: int, iPass: uint): string;
	
	}
	
	
	
}
