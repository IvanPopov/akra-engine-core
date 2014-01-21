
/// <reference path="parser/IParser.ts" />
/// <reference path="IAFXInstruction.ts" />


module akra {
	export interface IAFXObject {
		getName(): string;
		getId(): IAFXIdInstruction;
	}
	
	export interface IAFXVariable extends IAFXObject {
		setName(sName: string): void;
		setType(pType: IAFXVariableTypeInstruction): void;
		getType(): IAFXVariableTypeInstruction;
		
		initializeFromInstruction(pInstruction: IAFXVariableDeclInstruction): void;
	
	}
	
	export interface IAFXType extends IAFXObject {
		isBase(): boolean;
		initializeFromInstruction(pInstruction: IAFXTypeDeclInstruction): boolean;
	}
	
	export interface IAFXFunction extends IAFXObject {
		getHash(): string;
	}
	
	export interface IAFXPass extends IAFXObject {
	
	}
	
	export interface IAFXTechnique extends IAFXObject {
	
	}
	
	export interface IAFXEffectStats {
		time: uint;
	}
	
	export interface IAFXEffect {
		analyze(pTree: parser.IParseTree): boolean;
		setAnalyzedFileName(sFileName: string): void;
		getStats(): IAFXEffectStats;
	
		clear(): void;
	
		getTechniqueList(): IAFXTechniqueInstruction[];
	}
	
}
