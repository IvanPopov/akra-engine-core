#ifndef IAFXCOMPOSER_TS
#define IAFXCOMPOSER_TS

module akra{
	export interface IAFXComposer {
		loadEffect(sFileName: string): void;
		getImportTechnique(sModuleName: string): void;
	}
}

#endif