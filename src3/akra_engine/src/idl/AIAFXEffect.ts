// AIAFXEffect interface
// [write description here...]

/// <reference path="AIParser.ts" />
/// <reference path="AIAFXInstruction.ts" />


interface AIAFXObject {
	getName(): string;
	getId(): AIAFXIdInstruction;
}

interface AIAFXVariable extends AIAFXObject {
	setName(sName: string): void;
	setType(pType: AIAFXVariableTypeInstruction): void;
	getType(): AIAFXVariableTypeInstruction;
	
	initializeFromInstruction(pInstruction: AIAFXVariableDeclInstruction): void;

}

interface AIAFXType extends AIAFXObject {
	isBase(): boolean;
	initializeFromInstruction(pInstruction: AIAFXTypeDeclInstruction): boolean;
}

interface AIAFXFunction extends AIAFXObject {
	getHash(): string;
}

interface AIAFXPass extends AIAFXObject {

}

interface AIAFXTechnique extends AIAFXObject {

}

interface AIAFXEffectStats {
	time: uint;
}

interface AIAFXEffect {
	analyze(pTree: AIParseTree): boolean;
	setAnalyzedFileName(sFileName: string): void;
	getStats(): AIAFXEffectStats;

	clear(): void;

	getTechniqueList(): AIAFXTechniqueInstruction[];
}
