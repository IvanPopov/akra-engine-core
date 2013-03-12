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

		addDataFromPass(pPass: IAFXPassInstruction): void;
		generateKeys(): void;
	}

	export interface IAFXComponentBlend {
		isReadyToUse(): bool;

		getComponentCount(): uint;
		getTotalValidPasses(): uint;
		getHash(): string;

		containComponentWithShift(pComponent: IAFXComponent, iShift: int);
		containComponentHash(sComponentHash: string): bool;

		addComponent(pComponent: IAFXComponent, iShift: int): void;
		removeComponent(pComponent: IAFXComponent, iShift: int): void;

		finalizeBlend(): bool;

		clone(): IAFXComponentBlend;
		_setDataForClone(pComponentList: IAFXComponent[],
						 pComponentShiftList: int[],
						 pComponentCountMap: IntMap,
						 nShiftMin: int, nShiftMax: int): void;
	}
}

#endif