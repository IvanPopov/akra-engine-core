#ifndef IAFXCOMPONENTBLEND_TS
#define IAFXCOMPONENTBLEND_TS

#include "IAFXComponent.ts"
#include "IAFXInstruction.ts"

module akra {
	export interface IAFXShaderInputBlend {
		uniformNameToReal: StringMap;
		uniformByRealName: IAFXVariableDeclMap;
		uniformDefaultValue: any;

		textureNameToReal: StringMap;
		textureByRealName: any;

		foreignByName: IAFXVariableDeclMap;

		uniformNameList: string[];
		uniformRealNameList: string[];

		textureNameList: string[];
		textureRealNameList: string[];

		foreignNameList: string[];

		addDataFromPass(pPass: IAFXPassInstruction): void;
		generateKeys(): void;
	}

	export interface IAFXComponentBlend {
		isReadyToUse(): bool;

		getComponentCount(): uint;
		getTotalPasses(): uint;
		getHash(): string;

		containComponentWithShift(pComponent: IAFXComponent, iShift: int, iPass: uint);
		containComponentHash(sComponentHash: string): bool;

		addComponent(pComponent: IAFXComponent, iShift: int, iPass: int): void;
		removeComponent(pComponent: IAFXComponent, iShift: int, iPass: int): void;

		finalizeBlend(): bool;

		clone(): IAFXComponentBlend;
		_setDataForClone(pComponentList: IAFXComponent[],
						 pComponentShiftList: int[],
						 pComponentPassNumnerList: int[],
						 pComponentCountMap: IntMap,
						 nShiftMin: int, nShiftMax: int): void;
	}
}

#endif