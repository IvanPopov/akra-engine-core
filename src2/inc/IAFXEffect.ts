#ifndef IAFXEFFECT_TS
#define IAFXEFFECT_TS

#include "IParser.ts"
#include "IAFXInstruction.ts"

module akra {

    export interface IAFXObject{
        getName(): string;
        getId(): IAFXIdInstruction;
    }

    export interface IAFXVariable extends IAFXObject {
        setName(sName: string): void;
        setType(pType: IAFXComplexType): void;
        getType(): IAFXVariableTypeInstruction;
        
        initializeFromInstruction(pInstruction: IAFXVariableDeclInstruction): void;

    }

    export interface IAFXType extends IAFXObject {
        isBase(): bool;
        initializeFromInstruction(pInstruction: IAFXTypeDeclInstruction): bool;
    }

    export interface IAFXComplexType extends IAFXObject {
        getUsages(): IAFXKeywordInstruction[];
        getType(): IAFXType;

        setType(pType: IAFXType): void;
        setUsage(pUsage: IAFXKeywordInstruction): void;
    }

    export interface IAFXFunction extends IAFXObject {
        getHash(): string;
    }
    
    export interface IAFXPass extends IAFXObject {
    
    }

    export interface IAFXTechnique extends IAFXObject {
    
    }

    export interface IAFXEffectStats{
        time: uint;
    }

    export interface IAFXEffect {
        analyze(pTree: IParseTree): bool;
        setAnalyzedFileName(sFileName: string): void;
        getStats(): IAFXEffectStats;

        clear(): void;
    }
}

#endif

// #ifndef IAFXEFFECT_TS
// #define IAFXEFFECT_TS

// #include "IResourcePoolItem.ts"

// module akra {
// 	export interface IAFXEffect extends IResourcePoolItem {

// 	}
// }

// #endif

