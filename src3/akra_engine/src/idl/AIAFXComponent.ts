// AIAFXComponent interface
// [write description here...]

/// <reference path="AIResourcePoolItem.ts" />
/// <reference path="AIAFXInstruction.ts" />


interface AIAFXComponentMap {
	[index: uint]: AIAFXComponent;
	[index: string]: AIAFXComponent;
}

interface AIAFXComponent extends AIResourcePoolItem {
	create(): void;

	getTechnique(): AIAFXTechniqueInstruction;
	setTechnique(pTechnique: AIAFXTechniqueInstruction): void;

	isPostEffect(): boolean;

	getName(): string;
	getTotalPasses(): uint;
	getHash(iShift: int, iPass: uint): string;

}


