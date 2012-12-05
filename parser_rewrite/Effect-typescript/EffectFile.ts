///<reference path="./IEffectFile.ts" />

module akra.fx {
    
    export class EffectFile implements IEffectFile {
        constuctor() {
        }
        
        analyze(pTree: IParseTree): bool {
            return true;
        }

        clear(): void {
        }
    }
}