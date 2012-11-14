module akra.fx {

    export interface IAFXVariable {
        type: IComplexType;
        
        name: string;
        semantic: string;

        length: uint;
        size: uint;

        isArray(): bool;
        
        isGlobal(): bool;
        isUniform(): bool;
        isForeign(): bool;
        isShared(): bool;
        isConst(): bool;
    }

    export interface IAFXUsages {
    }

    export interface IAFXType {
        hash: string;
        name: string;

        isBase(): bool;
    }

    export interface IAFXComplexType extends IAFXType {
        usages: IEffectUsages;
    }

    export interface IAFXFunction {
    }

    export interface IAFXStrunct {
    
    }

    export interface IAFXStructField {
        padding: uint;
    }
    
    export interface IAFXPass {
    
    }

    export interface IAFXTechnique {
    
    }


    export interface IAFXInstuction {
        isValid(): bool;
    }

    export interface IAFXEffect {
        analyze(pTree: IParseTree): bool;
        clear(): void;
    }
}