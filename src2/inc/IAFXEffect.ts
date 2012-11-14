#ifndef IAFXEFFECT_TS
#define IAFXEFFECT_TS

#include "IParser.ts"

module akra {

    export interface IAFXObject{
        name: string;
    }

    export interface IAFXVariable extends IAFXObject {
        // type: IAFXComplexType;
        
        // name: string;
        // semantic: string;

        // length: uint;
        // size: uint;

        // isArray(): bool;
        
        // isGlobal(): bool;
        // isUniform(): bool;
        // isForeign(): bool;
        // isShared(): bool;
        // isConst(): bool;
    }

    export interface IAFXUsages {
    }

    export interface IAFXType extends IAFXObject  {
        // hash: string;
        // name: string;

        // isBase(): bool;
    }

    export interface IAFXComplexType extends IAFXType {
        // usages: IAFXUsages;
    }

    export interface IAFXFunction extends IAFXObject {
        hash: string;
    }

    export interface IAFXStrunct extends IAFXObject {
    
    }

    export interface IAFXStructField extends IAFXObject {
        // padding: uint;
    }
    
    export interface IAFXPass extends IAFXObject {
    
    }

    export interface IAFXTechnique extends IAFXObject {
    
    }

    export interface IAFXEffectStats{
        time: uint;
    }

    export interface IAFXEffect {
        // analyze(pTree: IParseTree): bool;
        // setAnalyzedFileName(sFileName: string): void;
        // getStats(): IAFXEffectStats;

        // clear(): void;
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

