#ifndef IAFXCOMPONENTBLEND_TS
#define IAFXCOMPONENTBLEND_TS

#include "IAFXComponent.ts"
#include "IAFXInstruction.ts"
#include "IUnique.ts"
#include "IAFXPassInputBlend.ts"

#define EMPTY_BLEND "EMPTY_BLEND"

module akra {
	
	export interface IAFXComponentBlendMap {
		[index: uint]: IAFXComponentBlend;
		[index: string]: IAFXComponentBlend; 
	}

	export interface IAFXComponentPassInputBlend {
		uniformNameToReal: StringMap;
		uniformByRealName: IAFXVariableDeclMap;
		uniformDefaultValue: any;

		textureNameToReal: StringMap;
		textureByRealName: IAFXVariableDeclMap;

		foreignByName: IAFXVariableDeclMap;

		uniformNameList: string[];
		uniformRealNameList: string[];

		textureNameList: string[];
		textureRealNameList: string[];

		foreignNameList: string[];

		addDataFromPass(pPass: IAFXPassInstruction): void;
		finalizeInput(): void;

		getPassInput(): IAFXPassInputBlend;
		releasePassInput(pPassInput: IAFXPassInputBlend): void;
	}

	export interface IAFXComponentBlend extends IUnique {
		isReadyToUse(): bool;
		isEmpty(): bool;

		getComponentCount(): uint;
		getTotalPasses(): uint;
		getHash(): string;

		containComponent(pComponent: IAFXComponent, iShift: int, iPass: uint);
		containComponentHash(sComponentHash: string): bool;

		addComponent(pComponent: IAFXComponent, iShift: int, iPass: int): void;
		removeComponent(pComponent: IAFXComponent, iShift: int, iPass: int): void;

		finalizeBlend(): bool;

		getPassInputForPass(iPass: uint): IAFXPassInputBlend;
		getPassListAtPass(iPass: uint): IAFXPassInstruction[];

		clone(): IAFXComponentBlend;
		
		_getComponentList(): IAFXComponent[];
		_getComponentShiftList(): int[];
		_getComponentPassIdList(): uint[];

		_setDataForClone(pComponentList: IAFXComponent[],
						 pComponentShiftList: int[],
						 pComponentPassNumnerList: int[],
						 pComponentHashMap: BoolMap,
						 nShiftMin: int, nShiftMax: int): void;
	}
}

#endif