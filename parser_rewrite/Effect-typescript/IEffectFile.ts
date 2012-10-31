module akra.fx {
    
    //Temp
    export interface IParseNode {
        name: string;
        value: string;
        line: uint;
        start: uint;
        end: uint;
    }

    export interface IParseTree {
        root: IParseNode;
    }
    //End temp


    export interface StringMap {
        [s: string]: string;
    }

    export var NodeNameMap: StringMap = { };

    export interface IEffectVariable {
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

    export interface IEffectUsages {
    }

    export interface IEffectType {
        hash: string;
        name: string;

        isBase(): bool;
    }

    export interface IComplexType extends IEffectType{
        usages: IEffectUsages;

    }

    export interface IEffectFunction {

    }

    export interface IEffecStrunct {
    
    }

    export interface IEffectStructField {
        padding: uint;
    }
    
    export interface IEffectPass {
    
    }

    export interface IEffectTechnique {
    
    }


    export interface IInstuction {
        isValid(): bool;
    }

    export interface IEffectFile {
        analyze(pTree: IParseTree): bool;
        clear(): void;
    }
}