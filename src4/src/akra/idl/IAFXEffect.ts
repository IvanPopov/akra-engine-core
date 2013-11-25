
/// <reference path="IParser.ts" />
/// <reference path="IAFXInstruction.ts" />


module akra {
	interface IAFXObject {
		getName(): string;
		getId(): IAFXIdInstruction;
	}
	
	interface IAFXVariable extends IAFXObject {
		setName(sName: string): void;
		setType(pType: IAFXVariableTypeInstruction): void;
		getType(): IAFXVariableTypeInstruction;
		
		initializeFromInstruction(pInstruction: IAFXVariableDeclInstruction): void;
	
	}
	
	interface IAFXType extends IAFXObject {
		isBase(): boolean;
		initializeFromInstruction(pInstruction: IAFXTypeDeclInstruction): boolean;
	}
	
	interface IAFXFunction extends IAFXObject {
		getHash(): string;
	}
	
	interface IAFXPass extends IAFXObject {
	
	}
	
	interface IAFXTechnique extends IAFXObject {
	
	}
	
	interface IAFXEffectStats {
		time: uint;
	}
	
	interface IAFXEffect {
		analyze(pTree: IParseTree): boolean;
		setAnalyzedFileName(sFileName: string): void;
		getStats(): IAFXEffectStats;
	
		clear(): void;
	
		getTechniqueList(): IAFXTechniqueInstruction[];
	}
	
}
